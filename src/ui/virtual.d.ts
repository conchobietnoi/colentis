declare module 'virtual:colentis-ui' {
  export function mountUI(api: unknown): void
}
declare module '*.html?raw' {
  const html: string
  export default html
}
