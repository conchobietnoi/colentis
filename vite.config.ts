import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { VitePWA } from 'vite-plugin-pwa'

/** Ghép các tệp src/ui/legacy/_*.js (theo thứ tự tên) thành một module `virtual:colentis-ui` xuất hàm mountUI(API). */
function colentisUi(): Plugin {
  const id = 'virtual:colentis-ui', rid = '\0' + id, dir = join(__dirname, 'src/ui/legacy')
  return {
    name: 'colentis-ui',
    resolveId: (i) => (i === id ? rid : null),
    load(i) {
      if (i !== rid) return null
      const files = readdirSync(dir).filter((f) => f.endsWith('.js')).sort()
      files.forEach((f) => this.addWatchFile(join(dir, f)))
      const body = files.map((f) => `/* ${f} */\n` + readFileSync(join(dir, f), 'utf8')).join('\n')
      return `export function mountUI(RAW){
const API={...RAW,
 async reload(mode){applySnapshot(await RAW.loadReload(mode))},
 async boot(){applySnapshot(await RAW.loadSnapshot())},
 bind(h){RAW.bind({...h,background(){applySnapshot(RAW.current());h.background&&h.background()}})}};
${body}
/* nạp ảnh riêng tư (cần đăng nhập) cho mọi <img data-pi="kho|đường dẫn|dự phòng"> */
{const hyd=(img)=>{const pi=img.dataset.pi;if(!pi||img.dataset.pd===pi)return;img.dataset.pd=pi;
  if(img.getAttribute('src')&&img.getAttribute('src')!==RAW.BLANK)return;
  const [b,p,fb]=pi.split('|');RAW.loadImg(b,p,fb||null).then(u=>{if(img.dataset.pi===pi)img.src=u}).catch(()=>{})};
 const scan=(n)=>{if(n.nodeType!==1)return;if(n.matches&&n.matches('img[data-pi]'))hyd(n);n.querySelectorAll&&n.querySelectorAll('img[data-pi]').forEach(hyd)};
 new MutationObserver(ms=>{for(const m of ms){if(m.type==='attributes')hyd(m.target);else m.addedNodes.forEach(scan)}}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-pi']});
 scan(document.body)}
}`
    },
  }
}

// GitHub Pages phục vụ tại /<tên-repo>/, đặt VITE_BASE=/colentis/ khi build trên GitHub Actions.
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [
    react(),
    colentisUi(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Colentis',
        short_name: 'Colentis',
        description: 'Lịch chung gamified: tick việc, nhận thẻ ảnh.',
        lang: 'vi',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1E1B5E',
        theme_color: '#1E1B5E',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webp}'],
        maximumFileSizeToCacheInBytes: 3_000_000,
        navigateFallback: 'index.html',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Ảnh thẻ lấy từ Supabase Storage (URL ký có hạn): không cache trong precache.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/storage/v1/object/'),
            handler: 'CacheFirst',
            options: { cacheName: 'card-images', expiration: { maxEntries: 220, maxAgeSeconds: 60 * 60 * 24 * 30 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
    }),
  ],
  server: { port: 5173 },
})
