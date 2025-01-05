import { deserializePacket } from './packet.js';
import { PACKET_TYPES } from './types.js';
import { sendPacket } from './packet.js';
/**
 * @typedef {import('./types.js').PacketType} PacketType
 */

let socket;

export function initWebSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');
    socket.binaryType = 'arraybuffer'

    socket.onmessage = (event) => {
        try {
            const packet = deserializePacket(event.data)
            console.log('Packet recieved', packet)

            switch (packet.type) {
                case PACKET_TYPES.NEW_GAME://new game
                    console.log('Game started', packet.payload)
                    break
                case PACKET_TYPES.PLAYER_JOIN://join
                    console.log('Player joined:', packet.payload)
                    break
                case PACKET_TYPES.CARD_PLAY://play
                    console.log('Player played:', packet.payload)
                    break
                case PACKET_TYPES.UPDATE_STATE://update
                    console.log('Game state update:', packet.payload)
                    break
                case PACKET_TYPES.ERROR://error
                    console.error(packet.payload)
                    break
                default:
                    console.warn('Unknown packet type:', packet.payload)
            }
        } catch (error) {
            console.error('Failed to deserialize packet: ', error.message)
        }
    };

    socket.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
    };

    socket.onclose = () => {
        console.log('Conexão WebSocket encerrada');
        document.getElementById('status').textContent = 'Desconectado!';
    };
}

/**
 *  Calls send packet function with the websocket attached
 *
 *  @param {number} version - version number (1 byte)
 *  @param {PacketType} type - type number (1 byte)
 *  @param {string} payload - packet data
 *  @returns {void}
 */
export function websocketSendPacket(version, type, payload) {
    sendPacket(socket, version, type, payload)
}

