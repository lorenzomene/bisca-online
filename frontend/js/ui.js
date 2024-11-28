import { sendPacket } from './websocket.js';
import { PACKET_TYPES } from './types.js';

export function setupUI() {
    document.getElementById('start-game').addEventListener('click', () => {
        sendPacket(1, PACKET_TYPES.NEW_GAME, 'Jogador1');
    });
}

