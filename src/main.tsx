import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { logger } from './services/logger';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Global error handlers
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        try {
            logger.error('Uncaught error', { message: event.message, filename: event.filename, lineno: event.lineno, colno: event.colno });
        } catch (e) {
            // noop
        }
    });

    window.addEventListener('unhandledrejection', (event) => {
        try {
            logger.error('Unhandled promise rejection', { reason: event.reason });
        } catch (e) {
            // noop
        }
    });
}
