const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

async function sendLog(level: LogLevel, message: string, meta?: any) {
    const payload = { level, message, meta };

    // If offline, print to console and skip network
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // eslint-disable-next-line no-console
        console[level](`[offline ${level}]`, message, meta);
        return;
    }

    try {
        await fetch(`${API_URL}/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        // fallback to console
        // eslint-disable-next-line no-console
        console[level]('[log send failed]', message, meta, e);
    }
}

export const logger = {
    info: (msg: string, meta?: any) => sendLog('info', msg, meta),
    warn: (msg: string, meta?: any) => sendLog('warn', msg, meta),
    error: (msg: string, meta?: any) => sendLog('error', msg, meta),
    debug: (msg: string, meta?: any) => sendLog('debug', msg, meta),
};

export default logger;
