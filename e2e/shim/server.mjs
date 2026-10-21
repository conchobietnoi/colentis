// Máy chủ giả lập Supabase (GoTrue + PostgREST + Storage) chạy trên Postgres thường, CHỈ để thử giao diện trong môi trường không có Supabase.
// Không dùng cho sản xuất. Chạy: node e2e/shim/server.mjs  (cần DB colentis_test đã dựng bằng supabase/tests/run.sh)
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import pg from 'pg'
import { SignJWT, jwtVerify } from 'jose'

pg.types.setTypeParser(1082, (v) => v)
const PORT = Number(process.env.PORT ?? 54399)
const SECRET = new TextEncoder().encode('colentis-shim-secret-colentis-shim-secret')
const DIST = path.resolve(process.env.DIST ?? 'dist')
const pool = new pg.Pool({ host: '127.0.0.1', user: 'postgres', password: 'pg', database: process.env.DB ?? 'colentis_test', max: 8 })

const passwords = new Map()   // email → mật khẩu
const refresh = new Map()     // refresh_token → user id
let fakeNow = null            // ISO giả lập cho private.now()
const ident = (s) => { if (!/^[a-z_][a-z0-9_]*$/i.test(s)) throw httpErr(400, 'PGRST100', 'bad identifier ' + s); return '"' + s + '"' }
const httpErr = (status, code, message) => Object.assign(new Error(message), { status, code })
const objects = new Map()     // bucket/path → {buf, type}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
function send(res, status, body, headers = {}) {
  const isBuf = Buffer.isBuffer(body)
  const data = body === undefined ? '' : isBuf ? body : typeof body === 'string' ? body : JSON.stringify(body)
  res.writeHead(status, { 'content-type': isBuf || typeof body === 'string' ? (headers['content-type'] ?? 'text/plain') : 'application/json', ...headers })
  res.end(data)
}
async function readBody(req) { const c = []; for await (const x of req) c.push(x); return Buffer.concat(c) }

async function session(user) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const token = await new SignJWT({ role: 'authenticated', aud: 'authenticated', email: user.email }).setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime(exp).sign(SECRET)
  const rt = crypto.randomUUID()
  refresh.set(rt, user.id)
  return { access_token: token, token_type: 'bearer', expires_in: 3600, expires_at: exp, refresh_token: rt, user: { id: user.id, aud: 'authenticated', role: 'authenticated', email: user.email, user_metadata: user.raw_user_meta_data ?? {}, app_metadata: {}, created_at: user.created_at } }
}
async function uidOf(req) {
  const h = req.headers.authorization ?? ''
  const t = h.replace(/^Bearer /i, '')
  try { const { payload } = await jwtVerify(t, SECRET); return payload.sub ?? null } catch { return null }
}

/** Chạy một khối lệnh trong transaction với vai authenticated/anon giống PostgREST. */
async function asUser(uid, fn) {
  const c = await pool.connect()
  try {
    await c.query('begin')
    await c.query(`set local role ${uid ? 'authenticated' : 'anon'}`)
    await c.query(`select set_config('request.jwt.claim.sub', $1, true), set_config('request.jwt.claim.role', $2, true), set_config('colentis.now', $3, true)`, [uid ?? '', uid ? 'authenticated' : 'anon', fakeNow ?? ''])
    const r = await fn(c)
    await c.query('commit')
    return r
  } catch (e) { await c.query('rollback').catch(() => {}); throw e } finally { c.release() }
}

function pgErr(e) {
  if (e.status) return e
  const code = e.code ?? 'XX000'
  const status = code === '42501' ? 403 : code === '23505' || code === '23503' ? 409 : code === 'P0002' ? 404 : 400
  return Object.assign(new Error(e.message), { status, code, details: e.detail ?? null, hint: e.hint ?? null })
}

// ---------- PostgREST ----------
function parseFilters(sp, params) {
  const where = []
  for (const [k, v] of sp) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'].includes(k)) continue
    const m = /^(eq|neq|gte|lte|gt|lt|is|in)\.(.*)$/.exec(v)
    if (!m) throw httpErr(400, 'PGRST100', 'unsupported filter ' + k + '=' + v)
    const [, op, val] = m
    if (op === 'is') where.push(`${ident(k)} is ${val === 'null' ? 'null' : val}`)
    else if (op === 'in') { params.push(val.replace(/^\(|\)$/g, '').split(',')); where.push(`${ident(k)} = any($${params.length})`) }
    else { params.push(val); where.push(`${ident(k)} ${{ eq: '=', neq: '<>', gte: '>=', lte: '<=', gt: '>', lt: '<' }[op]} $${params.length}`) }
  }
  return where.length ? ' where ' + where.join(' and ') : ''
}
function parseOrder(sp) {
  const o = sp.get('order'); if (!o) return ''
  return ' order by ' + o.split(',').map((p) => { const [c, ...rest] = p.split('.'); return ident(c) + (rest.includes('desc') ? ' desc' : '') + (rest.includes('nullsfirst') ? ' nulls first' : '') }).join(', ')
}
function selectList(sp) {
  const s = sp.get('select'); if (!s || s === '*') return '*'
  return s.split(',').map((c) => ident(c.trim())).join(', ')
}
const fnArgCache = new Map()
async function fnInfo(c, name) {
  if (fnArgCache.has(name)) return fnArgCache.get(name)
  const r = await c.query(`select p.prorettype::regtype::text as ret, coalesce((select jsonb_object_agg(n, t2::regtype::text) from unnest(p.proargnames, string_to_array(p.proargtypes::text,' ')::oid[]) as x(n,t2)), '{}'::jsonb) as args
    from pg_proc p join pg_namespace s on s.oid=p.pronamespace where s.nspname='public' and p.proname=$1 limit 1`, [name])
  if (!r.rowCount) throw httpErr(404, 'PGRST202', `Could not find the function public.${name}`)
  fnArgCache.set(name, r.rows[0]); return r.rows[0]
}

async function rest(req, res, url, uid) {
  const parts = url.pathname.replace(/^\/rest\/v1\//, '').split('/')
  const sp = url.searchParams
  const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? JSON.parse((await readBody(req)).toString() || 'null') : null
  const prefer = req.headers.prefer ?? ''
  const wantRows = /return=representation/.test(prefer)
  const single = /vnd\.pgrst\.object/.test(req.headers.accept ?? '')
  if (parts[0] === 'rpc') {
    const name = parts[1]
    const r = await asUser(uid, async (c) => {
      const info = await fnInfo(c, name)
      const keys = Object.keys(body ?? {})
      const params = keys.map((k) => { const t = info.args[k]; const v = body[k]; return t === 'jsonb' || t === 'json' ? (v === null ? null : JSON.stringify(v)) : v })
      const call = `public.${ident(name)}(${keys.map((k, i) => `${ident(k)} => $${i + 1}${info.args[k] === 'jsonb' ? '::jsonb' : ''}`).join(', ')})`
      const q = info.ret === 'void' ? await c.query(`select ${call}`, params).then(() => ({ rows: [], void: true })) : await c.query(`select to_json(${call}) as v`, params)
      return q
    })
    if (r.void) return send(res, 204)
    return send(res, 200, JSON.stringify(r.rows[0]?.v ?? null), { 'content-type': 'application/json' })
  }
  const table = ident(parts[0])
  const rel = `public.${table}`
  const out = (rows, status = 200) => {
    if (single) { if (rows.length !== 1) return send(res, 406, { code: 'PGRST116', message: 'Cannot coerce the result to a single JSON object', details: `The result contains ${rows.length} rows`, hint: null }); return send(res, status, rows[0]) }
    return send(res, status, rows)
  }
  const rows = await asUser(uid, async (c) => {
    const params = []
    if (req.method === 'GET' || req.method === 'HEAD') {
      let sql = `select ${selectList(sp)} from ${rel}` + parseFilters(sp, params) + parseOrder(sp)
      if (sp.get('limit')) sql += ` limit ${Number(sp.get('limit'))}`
      return (await c.query(`select coalesce(json_agg(t),'[]'::json) as v from (${sql}) t`, params)).rows[0].v
    }
    if (req.method === 'POST') {
      const list = Array.isArray(body) ? body : [body]
      const cols = [...new Set(list.flatMap((o) => Object.keys(o)))]
      const vals = []
      const tuples = list.map((o) => '(' + cols.map((k) => { const v = o[k]; vals.push(v !== null && typeof v === 'object' && !Array.isArray(v) ? JSON.stringify(v) : v); return `$${vals.length}` }).join(',') + ')')
      let sql = `insert into ${rel} (${cols.map(ident).join(',')}) values ${tuples.join(',')}`
      if (/merge-duplicates/.test(prefer) && sp.get('on_conflict')) { const oc = sp.get('on_conflict').split(','); sql += ` on conflict (${oc.map(ident).join(',')}) do update set ${cols.filter((k) => !oc.includes(k)).map((k) => `${ident(k)} = excluded.${ident(k)}`).join(', ')}` }
      sql += ' returning *'
      return (await c.query(`with t as (${sql}) select coalesce(json_agg(t),'[]'::json) as v from t`, vals)).rows[0].v
    }
    if (req.method === 'PATCH') {
      const cols = Object.keys(body); const vals = []
      const set = cols.map((k) => { const v = body[k]; vals.push(v !== null && typeof v === 'object' && !Array.isArray(v) ? JSON.stringify(v) : v); return `${ident(k)} = $${vals.length}` }).join(', ')
      const where = parseFilters(sp, vals)
      return (await c.query(`with t as (update ${rel} set ${set}${where} returning *) select coalesce(json_agg(t),'[]'::json) as v from t`, vals)).rows[0].v
    }
    if (req.method === 'DELETE') {
      const where = parseFilters(sp, params)
      return (await c.query(`with t as (delete from ${rel}${where} returning *) select coalesce(json_agg(t),'[]'::json) as v from t`, params)).rows[0].v
    }
    throw httpErr(405, 'PGRST000', 'method')
  })
  if (req.method === 'GET') return out(rows)
  if (req.method === 'POST') return wantRows ? out(rows, 201) : send(res, 201)
  return wantRows ? out(rows) : send(res, 204)
}

// ---------- GoTrue ----------
async function auth(req, res, url, uid) {
  const route = url.pathname.replace('/auth/v1', '')
  const body = ['POST', 'PUT'].includes(req.method) ? JSON.parse((await readBody(req)).toString() || '{}') : {}
  if (route === '/signup') {
    const email = String(body.email ?? '').toLowerCase()
    if (passwords.has(email)) return send(res, 422, { code: 422, error_code: 'user_already_exists', msg: 'User already registered' })
    let user
    try {
      const r = await pool.query('insert into auth.users(email, raw_user_meta_data) values ($1,$2) returning *', [email, JSON.stringify(body.data ?? {})])
      user = r.rows[0]
    } catch (e) { return send(res, 500, { code: 500, error_code: 'unexpected_failure', msg: 'Database error saving new user', _detail: e.message }) }
    passwords.set(email, body.password)
    return send(res, 200, await session(user))
  }
  if (route === '/token') {
    const gt = url.searchParams.get('grant_type')
    if (gt === 'password') {
      const email = String(body.email ?? '').toLowerCase()
      if (passwords.get(email) !== body.password) return send(res, 400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' })
      const user = (await pool.query('select * from auth.users where email=$1', [email])).rows[0]
      return send(res, 200, await session(user))
    }
    if (gt === 'refresh_token') {
      const id = refresh.get(body.refresh_token)
      if (!id) return send(res, 400, { code: 400, error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token: Refresh Token Not Found' })
      const user = (await pool.query('select * from auth.users where id=$1', [id])).rows[0]
      return send(res, 200, await session(user))
    }
  }
  if (route === '/user') {
    if (!uid) return send(res, 401, { code: 401, error_code: 'no_authorization', msg: 'missing authorization' })
    const user = (await pool.query('select * from auth.users where id=$1', [uid])).rows[0]
    if (req.method === 'PUT') { if (body.password) passwords.set(user.email, body.password) }
    return send(res, 200, { id: user.id, aud: 'authenticated', role: 'authenticated', email: user.email, user_metadata: user.raw_user_meta_data ?? {}, app_metadata: {} })
  }
  if (route === '/logout') return send(res, 204)
  if (route === '/recover') return send(res, 200, {})
  return send(res, 404, { msg: 'not found ' + route })
}

// ---------- Storage ----------
function multipartFile(buf, ctype) {
  const b = /boundary=(.+)$/.exec(ctype ?? '')?.[1]
  if (!b) return { buf, type: ctype }
  const delim = Buffer.from('--' + b)
  let start = 0, found = null
  while (true) {
    const i = buf.indexOf(delim, start); if (i < 0) break
    const hEnd = buf.indexOf('\r\n\r\n', i); if (hEnd < 0) break
    const head = buf.slice(i, hEnd).toString()
    const next = buf.indexOf(delim, hEnd)
    if (/name=""/.test(head) || /filename=/.test(head)) { found = { buf: buf.slice(hEnd + 4, next - 2), type: /content-type: *([^\r\n]+)/i.exec(head)?.[1] ?? 'application/octet-stream' }; break }
    start = next < 0 ? buf.length : next
  }
  return found ?? { buf, type: ctype }
}
async function storage(req, res, url, uid) {
  const multi = /^\/storage\/v1\/object\/sign\/([^/]+)$/.exec(url.pathname)
  if (multi && req.method === 'POST') {
    const b = JSON.parse((await readBody(req)).toString() || '{}')
    const out = []
    for (const p of b.paths ?? []) {
      const r = await asUser(uid, (c) => c.query('select 1 from storage.objects where bucket_id=$1 and name=$2', [multi[1], p]))
      out.push(r.rowCount ? { error: null, path: p, signedURL: `/object/sign/${multi[1]}/${p}?token=shim` } : { error: 'Object not found', path: p, signedURL: null })
    }
    return send(res, 200, out)
  }
  const sg = /^\/storage\/v1\/object\/sign\/([^/]+)\/(.+)$/.exec(url.pathname)
  if (sg && req.method === 'POST') return send(res, 200, { signedURL: `/object/sign/${sg[1]}/${sg[2]}?token=shim` })
  if (sg && req.method === 'GET') {
    const o = objects.get(sg[1] + '/' + decodeURIComponent(sg[2]))
    if (!o) return send(res, 404, { message: 'not found' })
    const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range ?? '')
    if (range) { const a0 = +range[1], b0 = range[2] ? +range[2] : o.buf.length - 1; res.writeHead(206, { 'content-type': o.type, 'accept-ranges': 'bytes', 'content-range': `bytes ${a0}-${b0}/${o.buf.length}`, 'content-length': b0 - a0 + 1 }); return res.end(o.buf.slice(a0, b0 + 1)) }
    res.writeHead(200, { 'content-type': o.type, 'accept-ranges': 'bytes', 'content-length': o.buf.length }); return res.end(o.buf)
  }
  const m = /^\/storage\/v1\/object\/(?:(?:authenticated|public)\/)?([^/]+)\/(.+)$/.exec(url.pathname)
  if (req.method === 'DELETE') {
    const b = JSON.parse((await readBody(req)).toString() || '{}'); const bucket = url.pathname.split('/').pop()
    for (const p of b.prefixes ?? []) { await asUser(uid, (c) => c.query('delete from storage.objects where bucket_id=$1 and name=$2', [bucket, p])); objects.delete(bucket + '/' + p) }
    return send(res, 200, (b.prefixes ?? []).map((name) => ({ name })))
  }
  if (!m) return send(res, 404, { message: 'not found' })
  const [, bucket, name] = m; const p = decodeURIComponent(name)
  if (req.method === 'GET') {
    if (!uid) return send(res, 400, { statusCode: '403', error: 'Unauthorized', message: 'new row violates row-level security policy' })
    const r = await asUser(uid, (c) => c.query('select 1 from storage.objects where bucket_id=$1 and name=$2', [bucket, p]))
    if (!r.rowCount) return send(res, 400, { statusCode: '404', error: 'not_found', message: 'Object not found' })
    const o = objects.get(bucket + '/' + p) ?? { buf: placeholder(p), type: 'image/svg+xml' }
    return send(res, 200, o.buf, { 'content-type': o.type })
  }
  if (req.method === 'POST') {
    const raw = await readBody(req); const f = multipartFile(raw, req.headers['content-type'])
    try { await asUser(uid, (c) => c.query('insert into storage.objects(bucket_id,name,owner) values ($1,$2,$3)', [bucket, p, uid])) } catch (e) { const x = pgErr(e); return send(res, 400, { statusCode: '403', error: 'Unauthorized', message: x.message }) }
    objects.set(bucket + '/' + p, f)
    return send(res, 200, { Key: bucket + '/' + p, Id: crypto.randomUUID() })
  }
  return send(res, 405, {})
}
function placeholder(p) {
  const r = /^(common|rare|legendary|supreme|event)\//.exec(p)?.[1] ?? 'x'
  const col = { common: '#8D94B8', rare: '#2F8CFF', legendary: '#9B5CFF', supreme: '#FF2E88', event: '#FFB02E' }[r] ?? '#888'
  const label = path.basename(p).replace(/\.\w+$/, '')
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="${col}"/><text x="150" y="210" font-size="22" text-anchor="middle" fill="#fff" font-family="sans-serif">${label}</text></svg>`)
}

// ---------- Điều khiển thử nghiệm ----------
async function ctl(req, res, url) {
  const body = JSON.parse((await readBody(req)).toString() || '{}')
  if (url.pathname === '/__ctl/now') { fakeNow = body.iso ?? null; return send(res, 200, { now: fakeNow }) }
  if (url.pathname === '/__ctl/sql') { const r = await pool.query(body.sql, body.params ?? []); return send(res, 200, r.rows) }
  if (url.pathname === '/__ctl/seed-objects') {
    const r = await pool.query(`insert into storage.objects(bucket_id,name) select 'cards', p from (select storage_path p from public.cards union select thumb_path from public.cards where thumb_path is not null) x on conflict do nothing returning 1`)
    return send(res, 200, { n: r.rowCount })
  }
  if (url.pathname === '/__ctl/seed-concept') {
    // Nạp ảnh/video/nhạc thật cho bucket `concept` từ một thư mục trên máy (body.dir); nhạc .mp4 → songs/N.m4a
    const dir = body.dir, mime = { webp: 'image/webp', mp4: 'video/mp4' }; let n = 0
    const put = async (name, file, type) => { objects.set('concept/' + name, { buf: fs.readFileSync(file), type }); await pool.query(`insert into storage.objects(bucket_id,name) values ('concept',$1) on conflict do nothing`, [name]); n++ }
    for (const f of fs.readdirSync(dir)) { const e = f.split('.').pop(); if (mime[e]) await put(f, path.join(dir, f), mime[e]) }
    if (fs.existsSync(path.join(dir, 'songs'))) for (const f of fs.readdirSync(path.join(dir, 'songs'))) await put('songs/' + f.replace(/\.mp4$/, '.m4a'), path.join(dir, 'songs', f), 'audio/mp4')
    return send(res, 200, { n })
  }
  return send(res, 404, {})
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json' }
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers'] ?? '*')
  res.setHeader('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('access-control-expose-headers', '*')
  if (req.method === 'OPTIONS') return send(res, 204)
  try {
    if (process.env.LAG) await sleep(Number(process.env.LAG))
    if (url.pathname.startsWith('/__ctl/')) return await ctl(req, res, url)
    if (url.pathname.startsWith('/rest/v1/')) return await rest(req, res, url, await uidOf(req))
    if (url.pathname.startsWith('/auth/v1/')) return await auth(req, res, url, await uidOf(req))
    if (url.pathname.startsWith('/storage/v1/')) return await storage(req, res, url, await uidOf(req))
    let f = path.join(DIST, decodeURIComponent(url.pathname))
    if (!f.startsWith(DIST)) return send(res, 403, 'no')
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html')
    return send(res, 200, fs.readFileSync(f), { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' })
  } catch (e) {
    const x = pgErr(e)
    if (process.env.DEBUG) console.error(req.method, req.url, x.message)
    return send(res, x.status ?? 500, { code: x.code, message: x.message, details: x.details ?? null, hint: x.hint ?? null })
  }
})
await pool.query('grant insert, update, delete on storage.objects to authenticated') // Supabase thật đã cấp sẵn; bản giả lập tối giản thì chưa
server.listen(PORT, () => console.log('shim ready on', PORT))
