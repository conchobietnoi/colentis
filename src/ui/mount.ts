import shell from './shell.html?raw'
import './mockup.css'
import { mountUI } from 'virtual:colentis-ui'
import { bridge } from './bridge'

let mounted = false
/** Dựng khung giao diện tĩnh rồi khởi động lớp giao diện (chỉ một lần). */
export function mount(host: HTMLElement) {
  if (mounted) return
  mounted = true
  host.innerHTML = shell
  mountUI(bridge)
}
