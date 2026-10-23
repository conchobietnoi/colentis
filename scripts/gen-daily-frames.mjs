// Vẽ 12 cặp frame danh hiệu "mốc hằng ngày" (tròn 1024 + ngang cao 200) bằng SVG, theo phong cách bộ 24 frame cũ.
// Chạy: node scripts/gen-daily-frames.mjs  → ghi public/assets/frames/titles/{id}-avatar.svg, {id}-title.svg,
// nối vào manifest.json, titleWidths.ts và preview.html. Chạy lại an toàn (ghi đè đúng các id này).
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('public/assets/frames/titles')
const W_ = (s) => `stroke="#fff" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`

// ---------- danh sách ----------
export const DEFS = [
  { id: 'daily-early', name: 'gà chưa gáy tui đã xong', unlock: 'Hoàn thành task 4–6 giờ sáng', rarity: 'rare', motif: 'rooster', c: ['#ffb36b', '#ff5d8f', '#4a2a7a'], line: '#ffe0b0', sort: 24, theme: 'Gà trống đứng trước mặt trời mọc', anim: 'Mào gật gù, tia nắng xoay, sao nhấp nháy' },
  { id: 'daily-lunch', name: 'cơm chưa ăn đã đòi làm', unlock: 'Hoàn thành task 11–13 giờ trưa', rarity: 'common', motif: 'rice', c: ['#7fe0ff', '#4c8bff', '#1f2f7a'], line: '#cfeaff', sort: 25, theme: 'Bát cơm nghi ngút khói với đôi đũa', anim: 'Khói bay lên, hạt cơm lấp lánh' },
  { id: 'daily-late', name: 'ngủ sớm là chuyện người khác', unlock: 'Hoàn thành task lúc 23 giờ', rarity: 'rare', motif: 'noodle', c: ['#6a4fd8', '#2b2186', '#0e0b3a'], line: '#c9bfff', sort: 26, theme: 'Ly mì tôm khuya dưới trăng', anim: 'Khói mì bay, trăng sáng, sao nhấp nháy' },
  { id: 'day-5', name: 'cày như trâu', unlock: '5 task xong trong một ngày', rarity: 'common', motif: 'buffalo', c: ['#9be8b0', '#3aa87a', '#14453f'], line: '#d6ffe3', sort: 27, theme: 'Chú trâu cần cù với giọt mồ hôi', anim: 'Tai vẫy, mồ hôi rơi, cỏ đung đưa' },
  { id: 'day-10', name: 'trâu cũng biết xin nghỉ phép', unlock: '10 task xong trong một ngày', rarity: 'legendary', motif: 'tired', c: ['#ffd36b', '#ff8a3d', '#6b2a1a'], line: '#fff0c0', sort: 28, theme: 'Chú trâu kiệt sức quấn khăn lau mồ hôi', anim: 'Mồ hôi rơi, sao quay quanh đầu, khói thở dài' },
  { id: 'weekend', name: 'thứ bảy chủ nhật ăn được hông', unlock: 'Có task xong cả thứ Bảy và Chủ nhật cùng một cuối tuần', rarity: 'rare', motif: 'cat', c: ['#ffc2e0', '#c06bff', '#34206e'], line: '#ffe6f5', sort: 29, theme: 'Mèo đeo kính râm nằm dài', anim: 'Kính loé sáng, râu mèo rung, tim bay lên' },
  { id: 'photo-1', name: 'sống ảo có tâm', unlock: 'Check in ảnh lần đầu', rarity: 'common', motif: 'camera', c: ['#ff9ac8', '#ff2e88', '#4a1560'], line: '#ffd6ea', sort: 30, theme: 'Máy ảnh nhỏ với đèn flash', anim: 'Đèn flash nháy, tim nhấp nháy' },
  { id: 'photo-10', name: 'tấm này đẹp tấm sau đẹp hơn', unlock: 'Check in ảnh cho 10 việc', rarity: 'rare', motif: 'burst', c: ['#8fd9ff', '#6a6bff', '#241a6b'], line: '#dbe9ff', sort: 31, theme: 'Máy ảnh chụp liên tục, ảnh bay ra', anim: 'Ảnh bay ra, flash nháy' },
  { id: 'photo-50', name: 'paparazzi bất đắc dĩ', unlock: 'Check in ảnh cho 50 việc', rarity: 'legendary', motif: 'tele', c: ['#ffe45e', '#ff9a3d', '#5b2a86'], line: '#fff6c8', sort: 32, theme: 'Máy ảnh ống kính dài giữa chùm sao', anim: 'Ống kính ánh sáng chạy, sao chớp' },
  { id: 'friend-5', name: 'quen rộng mà ví mỏng', unlock: 'Có 5 người bạn', rarity: 'rare', motif: 'friends', c: ['#9bf2c9', '#2fa4a0', '#143a55'], line: '#d9fff0', sort: 33, theme: 'Ba gương mặt cười bên nhau', anim: 'Từng mặt nhún nhảy, tim bay lên' },
  { id: 'dup-5', name: 'gặp thẻ này hoài luôn', unlock: 'Có một thẻ trùng 5 lần', rarity: 'rare', motif: 'cards', c: ['#c7b6ff', '#7b61ff', '#26196b'], line: '#e6deff', sort: 34, theme: 'Chồng thẻ giống hệt nhau', anim: 'Thẻ xáo nhẹ, ánh holo chạy qua' },
  { id: 'photo-streak-7', name: 'ngày nào cũng soi gương', unlock: '7 ngày liên tiếp có ảnh check in', rarity: 'legendary', motif: 'flame', c: ['#ff9a3d', '#ff2e5a', '#4a0f3a'], line: '#ffe0b0', sort: 35, theme: 'Ngọn lửa ôm lấy chiếc máy ảnh', anim: 'Lửa bập bùng, tàn lửa bay, flash nháy' },
]

// ---------- vẽ các hình (tâm 0,0, cỡ khoảng ±55) ----------
const M = {
  rooster: (p) => `<g class="${p}b"><circle cx="0" cy="8" r="38" fill="#fff4d8" ${W_()}/><path d="M-12 -30q-4 -22 6 -20q4 -14 12 -2q10 -8 8 14q-10 6 -26 8z" fill="#ff3b4e" ${W_()}/></g><path d="M-6 6L20 14L-6 26z" fill="#ffb02e" ${W_()}/><circle cx="-14" cy="0" r="5" fill="#2a2380"/><circle cx="-16" cy="-2" r="1.8" fill="#fff"/><path d="M-4 30q6 12 12 0" fill="#ff3b4e" ${W_()}/><path d="M-60 48q60 -36 120 0" fill="#ffd45e" opacity=".9"/>`,
  rice: (p) => `<g class="${p}z"><path d="M-14 -26q-8 -10 0 -18M2 -30q-8 -10 0 -20M18 -26q-8 -10 0 -18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/></g><path d="M-36 -2q36 -34 72 0z" fill="#fff" ${W_()}/><path d="M-44 -2h88q0 40 -44 44q-44 -4 -44 -44z" fill="#ff7a8a" ${W_()}/><path d="M-30 12q30 8 60 0" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M26 -40L52 -8M36 -42L60 -14" stroke="#c98a4a" stroke-width="5" stroke-linecap="round"/>`,
  noodle: (p) => `<g class="${p}z"><path d="M-12 -34q-8 -10 0 -18M8 -38q-8 -10 0 -20" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/></g><path d="M-30 -14q10 -14 20 0q10 -14 20 0q10 -14 20 0" fill="none" stroke="#ffd45e" stroke-width="7" stroke-linecap="round"/><path d="M-38 -10h76l-10 56h-56z" fill="#ff4d4d" ${W_()}/><path d="M-34 8h68" stroke="#ffe45e" stroke-width="8"/><path d="M-30 22h60" stroke="#fff" stroke-width="3" opacity=".7"/><circle cx="46" cy="-34" r="12" fill="#fffdf0"/><circle cx="52" cy="-38" r="10" fill="#1c1760"/>`,
  buffalo: (p) => `<path d="M-40 -18q-26 -4 -22 -30q10 14 28 14zM40 -18q26 -4 22 -30q-10 14 -28 14z" fill="#f4e6c8" ${W_()}/><g class="${p}b"><ellipse cx="-44" cy="-6" rx="12" ry="7" transform="rotate(30 -44 -6)" fill="#8a6a4a" ${W_()}/></g><ellipse cx="44" cy="-6" rx="12" ry="7" transform="rotate(-30 44 -6)" fill="#8a6a4a" ${W_()}/><path d="M-36 -22q36 -20 72 0v34q0 28 -36 34q-36 -6 -36 -34z" fill="#6f553b" ${W_()}/><ellipse cx="0" cy="26" rx="26" ry="18" fill="#d8b98a" ${W_()}/><circle cx="-9" cy="26" r="4" fill="#3a2a1a"/><circle cx="9" cy="26" r="4" fill="#3a2a1a"/><circle cx="-18" cy="-4" r="5" fill="#fff"/><circle cx="18" cy="-4" r="5" fill="#fff"/><circle cx="-17" cy="-3" r="2.6" fill="#2a2380"/><circle cx="19" cy="-3" r="2.6" fill="#2a2380"/><g class="${p}d"><path d="M48 -26q8 12 0 18q-8 -6 0 -18z" fill="#7fe0ff" stroke="#fff" stroke-width="2.5"/></g>`,
  tired: (p) => `<path d="M-40 -18q-26 -4 -22 -30q10 14 28 14zM40 -18q26 -4 22 -30q-10 14 -28 14z" fill="#f4e6c8" ${W_()}/><path d="M-36 -22q36 -20 72 0v34q0 28 -36 34q-36 -6 -36 -34z" fill="#6f553b" ${W_()}/><path d="M-40 -26q40 -16 80 0v14q-40 -14 -80 0z" fill="#fff" ${W_()}/><path d="M-30 -22l8 6M-8 -26l8 6" stroke="#ff4d6a" stroke-width="3"/><ellipse cx="0" cy="26" rx="26" ry="18" fill="#d8b98a" ${W_()}/><circle cx="-9" cy="26" r="4" fill="#3a2a1a"/><circle cx="9" cy="26" r="4" fill="#3a2a1a"/><path d="M-26 -6l14 10M-12 -6l-14 10M12 -6l14 10M26 -6l-14 10" stroke="#fff" stroke-width="4" stroke-linecap="round"/><g class="${p}d"><path d="M52 -10q8 12 0 18q-8 -6 0 -18z" fill="#7fe0ff" stroke="#fff" stroke-width="2.5"/></g><g class="${p}d" style="animation-delay:-1s"><path d="M-54 0q8 12 0 18q-8 -6 0 -18z" fill="#7fe0ff" stroke="#fff" stroke-width="2.5"/></g><g class="${p}s"><polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="#ffe45e" transform="translate(-30 -52)"/><polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="#ffe45e" transform="translate(30 -56)"/></g>`,
  cat: (p) => `<path d="M-38 -22L-34 -54L-12 -34zM38 -22L34 -54L12 -34z" fill="#ffb36b" ${W_()}/><circle cx="0" cy="4" r="42" fill="#ffb36b" ${W_()}/><path d="M-30 -8h24v14q-12 10 -24 0zM6 -8h24v14q-12 10 -24 0z" fill="#1c1760" ${W_()}/><path d="M-6 -2h12" stroke="#1c1760" stroke-width="4"/><g class="${p}g"><path d="M-26 -3l8 -2M10 -3l8 -2" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g><path d="M-6 18l6 5l6 -5z" fill="#ff7a9a" stroke="#fff" stroke-width="2"/><path d="M-12 26q12 8 24 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><g class="${p}w"><path d="M-44 14l-22 -4M-44 22l-22 6M44 14l22 -4M44 22l22 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`,
  camera: (p) => `<path d="M-26 -30l8 -12h36l8 12z" fill="#fff" ${W_()}/><rect x="-48" y="-30" width="96" height="70" rx="14" fill="#ff5da0" ${W_()}/><circle cx="0" cy="6" r="22" fill="#fff" ${W_()}/><circle cx="0" cy="6" r="14" fill="#2a2380"/><circle cx="5" cy="1" r="4" fill="#fff"/><g class="${p}f"><circle cx="30" cy="-18" r="6" fill="#ffe45e"/></g><path d="M-38 -18h16" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  burst: (p) => `<g class="${p}p"><rect x="-4" y="-60" width="34" height="40" rx="4" transform="rotate(14)" fill="#fff" ${W_()}/><rect x="-1" y="-56" width="28" height="26" rx="2" transform="rotate(14)" fill="#8fd9ff"/></g><g class="${p}p" style="animation-delay:-1.1s"><rect x="-38" y="-62" width="34" height="40" rx="4" transform="rotate(-16)" fill="#fff" ${W_()}/><rect x="-35" y="-58" width="28" height="26" rx="2" transform="rotate(-16)" fill="#ffd0e8"/></g><rect x="-46" y="-12" width="92" height="58" rx="13" fill="#6a6bff" ${W_()}/><circle cx="0" cy="18" r="18" fill="#fff" ${W_()}/><circle cx="0" cy="18" r="11" fill="#1c1760"/><g class="${p}f"><circle cx="30" cy="-2" r="5.5" fill="#ffe45e"/></g>`,
  tele: (p) => `<rect x="-52" y="-22" width="70" height="58" rx="12" fill="#2a2380" ${W_()}/><path d="M18 -12h34v38h-34z" fill="#3b2f8f" ${W_()}/><rect x="50" y="-16" width="12" height="46" rx="4" fill="#fff" ${W_()}/><circle cx="-18" cy="8" r="14" fill="#ffe45e" ${W_()}/><g class="${p}f"><circle cx="-34" cy="-14" r="5" fill="#ff5da0"/></g><path d="M18 -4h32M18 6h32M18 16h32" stroke="#8f87ff" stroke-width="3"/><g class="${p}s"><polygon points="0,-8 2.4,-2.4 8,0 2.4,2.4 0,8 -2.4,2.4 -8,0 -2.4,-2.4" fill="#fff6c8" transform="translate(-44 -42)"/><polygon points="0,-8 2.4,-2.4 8,0 2.4,2.4 0,8 -2.4,2.4 -8,0 -2.4,-2.4" fill="#fff6c8" transform="translate(40 -40)"/></g>`,
  friends: (p) => `<g class="${p}j" style="animation-delay:-.2s"><circle cx="-38" cy="6" r="24" fill="#ffd45e" ${W_()}/><circle cx="-46" cy="2" r="3.4" fill="#2a2380"/><circle cx="-30" cy="2" r="3.4" fill="#2a2380"/><path d="M-46 14q8 8 16 0" fill="none" stroke="#2a2380" stroke-width="3" stroke-linecap="round"/></g><g class="${p}j" style="animation-delay:-.8s"><circle cx="0" cy="-8" r="28" fill="#ff8fc4" ${W_()}/><circle cx="-9" cy="-12" r="3.6" fill="#2a2380"/><circle cx="9" cy="-12" r="3.6" fill="#2a2380"/><path d="M-10 -2q10 10 20 0" fill="none" stroke="#2a2380" stroke-width="3.2" stroke-linecap="round"/></g><g class="${p}j" style="animation-delay:-1.4s"><circle cx="38" cy="6" r="24" fill="#8fe3ff" ${W_()}/><circle cx="30" cy="2" r="3.4" fill="#2a2380"/><circle cx="46" cy="2" r="3.4" fill="#2a2380"/><path d="M30 14q8 8 16 0" fill="none" stroke="#2a2380" stroke-width="3" stroke-linecap="round"/></g><g class="${p}z"><path d="M0 -52c-6 -8 -16 -2 -10 6l10 8l10 -8c6 -8 -4 -14 -10 -6z" fill="#ff2e88" stroke="#fff" stroke-width="2.5"/></g>`,
  cards: (p) => `<g class="${p}c1"><rect x="-40" y="-46" width="58" height="82" rx="8" transform="rotate(-16)" fill="#e6deff" ${W_()}/></g><g class="${p}c2"><rect x="-26" y="-46" width="58" height="82" rx="8" transform="rotate(-2)" fill="#c7b6ff" ${W_()}/></g><g class="${p}c3"><rect x="-10" y="-46" width="58" height="82" rx="8" transform="rotate(14)" fill="#fff" ${W_()}/><polygon points="20,-20 25,-8 38,-6 28,3 31,16 20,9 9,16 12,3 2,-6 15,-8" transform="rotate(14)" fill="#7b61ff"/></g><text x="30" y="52" font-family="system-ui,sans-serif" font-size="26" font-weight="900" fill="#fff" stroke="#26196b" stroke-width="5" paint-order="stroke">x5</text>`,
  flame: (p) => `<g class="${p}l"><path d="M0 -58q30 26 34 52q4 30 -34 46q-38 -16 -34 -46q4 -26 34 -52z" fill="#ff9a3d" ${W_()}/><path d="M0 -26q18 18 20 34q2 18 -20 28q-22 -10 -20 -28q2 -16 20 -34z" fill="#ffe45e"/></g><rect x="-22" y="-2" width="44" height="30" rx="7" fill="#ff5da0" ${W_()}/><circle cx="0" cy="13" r="8" fill="#fff"/><circle cx="0" cy="13" r="4.5" fill="#2a2380"/><g class="${p}f"><circle cx="14" cy="4" r="2.6" fill="#ffe45e"/></g>`,
}

const css = (p) => `<style>.${p}b{animation:${p}a 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes ${p}a{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(5deg)}}
.${p}t{animation:${p}u 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes ${p}u{0%,100%{opacity:.25;transform:scale(.6)}50%{opacity:1;transform:scale(1.25)}}
.${p}z{animation:${p}y 3s ease-out infinite}@keyframes ${p}y{0%{transform:translateY(8px);opacity:0}30%{opacity:1}100%{transform:translateY(-16px);opacity:0}}
.${p}d{animation:${p}e 2.2s ease-in infinite}@keyframes ${p}e{0%{transform:translateY(-6px);opacity:0}30%{opacity:1}100%{transform:translateY(16px);opacity:0}}
.${p}f{animation:${p}h 2.8s steps(1) infinite}@keyframes ${p}h{0%,70%{opacity:1}74%,80%{opacity:.1}84%,100%{opacity:1}}
.${p}j{animation:${p}k 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom}@keyframes ${p}k{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.${p}l{animation:${p}m 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom}@keyframes ${p}m{0%,100%{transform:scale(1,1)}50%{transform:scale(1.06,.94) rotate(2deg)}}
.${p}g{animation:${p}q 3.2s ease-in-out infinite}@keyframes ${p}q{0%,60%,100%{opacity:.2}80%{opacity:1}}
.${p}w{animation:${p}r 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes ${p}r{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.08)}}
.${p}p{animation:${p}o 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom}@keyframes ${p}o{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(4deg)}}
.${p}c1,.${p}c2,.${p}c3{animation:${p}x 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom}.${p}c2{animation-delay:-.4s}.${p}c3{animation-delay:-.8s}@keyframes ${p}x{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}
.${p}s{animation:${p}u 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>`

function rng(seed) { let s = seed; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296) }
const spark = (p, x, y, r, d, col) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="${p}t" style="animation-delay:-${d.toFixed(1)}s"><polygon points="0,${-r} ${r * .26},${-r * .26} ${r},0 ${r * .26},${r * .26} 0,${r} ${-r * .26},${r * .26} ${-r},0 ${-r * .26},${-r * .26}" fill="${col}"/></g></g>`
const defsOf = (p, d) => `<defs><linearGradient id="${p}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d.c[0]}"/><stop offset=".6" stop-color="${d.c[1]}"/><stop offset="1" stop-color="${d.c[2]}"/></linearGradient></defs>`

function avatar(d, idx) {
  const p = 'd' + (idx + 1).toString(36) + 'x', R = rng(idx * 97 + 11), cx = 512, cy = 512
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${defsOf(p, d)}${css(p)}`
  s += `<path fill-rule="evenodd" d="M68 512a444 444 0 1 0 888 0a444 444 0 1 0 -888 0zM154 512a358 358 0 1 0 716 0a358 358 0 1 0 -716 0z" fill="url(#${p}g)"/>`
  s += `<path fill-rule="evenodd" d="M148 512a364 364 0 1 0 728 0a364 364 0 1 0 -728 0zM154 512a358 358 0 1 0 716 0a358 358 0 1 0 -716 0z" fill="${d.line}"/>`
  s += `<path fill-rule="evenodd" d="M66 512a446 446 0 1 0 892 0a446 446 0 1 0 -892 0zM72 512a440 440 0 1 0 880 0a440 440 0 1 0 -880 0z" fill="${d.line}" opacity=".85"/>`
  for (let i = 0; i < 16; i++) { const a = R() * Math.PI * 2, rr = 372 + R() * 62; s += spark(p, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 5 + R() * 4, R() * 2.4, '#fff6c8') }
  const place = (ang, sc, mot) => { const a = ang * Math.PI / 180, rad = sc > 1 ? 420 : 401, x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad; return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc})">${mot}</g>` }
  s += place(90, 1.5, M[d.motif](p)) + place(210, 0.5, M[d.motif](p)) + place(330, 0.5, M[d.motif](p))
  return s + '</svg>'
}

function titleFrame(d, idx, W) {
  const p = 'd' + (idx + 1).toString(36) + 'x', R = rng(idx * 53 + 7)
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 200" width="${W}" height="200">${defsOf(p, d)}${css(p)}`
  s += `<path fill-rule="evenodd" d="M64 22H${W - 64}a50 50 0 0 1 50 50v56a50 50 0 0 1 -50 50H64a50 50 0 0 1 -50 -50v-56a50 50 0 0 1 50 -50zM198 50h${W - 396}a18 18 0 0 1 18 18v64a18 18 0 0 1 -18 18h-${W - 396}a18 18 0 0 1 -18 -18v-64a18 18 0 0 1 18 -18z" fill="url(#${p}g)" stroke="${d.line}" stroke-width="4" stroke-linejoin="round"/>`
  for (let i = 0; i < 6; i++) { const top = i % 2 === 0; s += spark(p, 230 + R() * (W - 460), top ? 34 : 166, 6 + R() * 3, R() * 2.4, '#fff6c8') }
  s += `<g transform="translate(70 104) scale(0.85)">${M[d.motif](p)}</g>`
  s += `<g transform="translate(${W - 70} 104) scale(0.62)">${M[d.motif](p)}</g>`
  return s + '</svg>'
}

// ---------- ghi tệp ----------
const manifestPath = path.join(DIR, 'manifest.json')
let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).filter((x) => !DEFS.some((d) => d.id === x.id))
const widths = {}
DEFS.forEach((d, i) => {
  const W = Math.max(760, 360 + Math.round([...d.name].length * 26))
  widths[d.id] = W
  fs.writeFileSync(path.join(DIR, `${d.id}-avatar.svg`), avatar(d, i))
  fs.writeFileSync(path.join(DIR, `${d.id}-title.svg`), titleFrame(d, i, W))
  manifest.push({ id: d.id, displayName: d.name, unlock: d.unlock, rarity: d.rarity, theme: d.theme, animation: d.anim, avatarFrameAsset: `titles/${d.id}-avatar.svg`, titleFrameAsset: `titles/${d.id}-title.svg`,
    avatar: { width: 1024, height: 1024, openingDiameter: 720, center: [512, 512] }, title: { width: W, height: 200, textSafeArea: { x: 180, y: 50, width: W - 360, height: 100 } } })
})
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n')
// titleWidths.ts
const twp = path.resolve('src/ui/titleWidths.ts')
let tw = fs.readFileSync(twp, 'utf8')
const m0 = tw.match(/=\s*\{([\s\S]*)\}/)
const cur = Object.fromEntries([...m0[1].matchAll(/"([^"]+)":\s*(\d+)/g)].map((x) => [x[1], +x[2]]))
Object.assign(cur, widths)
fs.writeFileSync(twp, tw.split('= {')[0] + '= {\n' + Object.entries(cur).map(([k, v]) => ` "${k}": ${v},`).join('\n') + '\n}\n')
// preview.html
const pvp = path.join(DIR, 'preview.html')
let pv = fs.readFileSync(pvp, 'utf8')
pv = pv.replace(/const D=\[.*?\];/s, 'const D=' + JSON.stringify(manifest) + ';').replace(/Colentis · \d+ cặp frame/, `Colentis · ${manifest.length} cặp frame`)
fs.writeFileSync(pvp, pv)
fs.writeFileSync(path.resolve('scripts/daily-frames.json'), JSON.stringify(DEFS.map(({ id, name, unlock, rarity, sort }) => ({ id, name, unlock, rarity, sort })), null, 1))
console.log('đã vẽ', DEFS.length, 'cặp frame')
