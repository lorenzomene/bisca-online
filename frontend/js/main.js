import { initWebSocket } from './websocket.js';
import { setupUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando aplicação...');
    initWebSocket();
    setupUI();
});

