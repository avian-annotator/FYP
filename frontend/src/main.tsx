import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Prevent race conditions, so that the mock service worker is started before the app renders
void (async () => {
  if (import.meta.env.MODE === 'frontend') {
    const { worker } = await import('../api_mocks/isolated_frontend/browser.ts')
    // eslint-disable-next-line
    console.log(`Running in ${import.meta.env.MODE} mode`)
    await worker.start()
  } else if (import.meta.env.MODE === 'mock') {
    const { worker } = await import('../api_mocks/local_with_mock/browser.ts')
    await worker.start({ onUnhandledRequest: 'bypass' })
    // eslint-disable-next-line
    console.log(`Running in ${import.meta.env.MODE} mode`)
  }

  // Note that development is the default, which is a VITE term, and for us, it is the same as local mode.
  if (import.meta.env.MODE === 'development') {
    // eslint-disable-next-line
    console.log(`Running in local mode`)
  } else {
    // eslint-disable-next-line
    console.log(`Running in ${import.meta.env.MODE} mode`)
  }

  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
})()
