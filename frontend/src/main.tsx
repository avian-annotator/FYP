import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root')!;

// Prevent race conditions, so that the mock service worker is started before the app renders
(async () => {
  if (import.meta.env.MODE === 'frontend') {
    const { worker } = await import('../api_mocks/isolated_frontend/browser.ts');
    await worker.start();
  } else if (import.meta.env.MODE === 'mock') {
    const { worker } = await import('../api_mocks/local_with_mock/browser.ts');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  // Note that development is the same as local mode
  if (import.meta.env.MODE === 'development') {
    console.log(`Running in local mode`);
  } else {
    console.log(`Running in ${import.meta.env.MODE} mode`);


  }
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
})();
