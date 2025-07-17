import { initWebSocket } from './websocket.js';
import { setupUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initWebSocket();
    setupUI();
});

