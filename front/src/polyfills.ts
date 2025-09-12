// Polyfills for browser compatibility

// Global object polyfill (needed for sockjs-client)
// This is also handled in index.html, but keeping it here as backup
(window as any).global = window;
