import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/be-vietnam-pro/vietnamese-500.css'
import '@fontsource/be-vietnam-pro/vietnamese-600.css'
import '@fontsource/be-vietnam-pro/vietnamese-700.css'
import '@fontsource/be-vietnam-pro/vietnamese-800.css'
import '@fontsource/be-vietnam-pro/vietnamese-900.css'
import '@fontsource/unbounded/latin-600.css'
import '@fontsource/unbounded/latin-800.css'
import '@fontsource/be-vietnam-pro/latin-500.css'
import '@fontsource/be-vietnam-pro/latin-600.css'
import '@fontsource/be-vietnam-pro/latin-700.css'
import '@fontsource/be-vietnam-pro/latin-800.css'
import '@fontsource/be-vietnam-pro/latin-900.css'
import '@fontsource/be-vietnam-pro/latin-ext-700.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
