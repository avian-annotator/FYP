import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root')!;

// Prevent race conditions, so that the mock service worker is started before the app renders
(async () => {
  if (import.meta.env.MODE === 'mock') {
    const { worker } = await import('../mocks/browser.ts');
    await worker.start();
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
