import { websocketSendPacket } from './websocket.js';
import { PACKET_TYPES } from './types.js';
/**
 * @typedef {import('./types.js').PacketType} PacketType
 */

export function setupUI() {
    document.getElementById('start-game').addEventListener('click', () => {
        websocketSendPacket(1, /** @type {PacketType} */(PACKET_TYPES.NEW_GAME), 'Jogador1');
    });
}

