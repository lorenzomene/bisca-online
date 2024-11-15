import { sendPacket } from './websocket.js';

export function setupUI() {
    document.getElementById('send-test').addEventListener('click', () => {
        sendPacket(1, 1, 'Jogador1');
    });
}

