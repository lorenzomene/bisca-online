import { deserializePacket } from './packet.js';
import { PACKET_TYPES } from './types.js';
import { sendPacket } from './packet.js';
import { addPlayerToUI } from './ui.js';
/**
 * @typedef {import('./types.js').PacketType} PacketType
 */

let socket;

export function initWebSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');
    socket.binaryType = 'arraybuffer'

    socket.onopen = () => {
        document.getElementById('status').textContent = 'Conectado!';
    };

    socket.onmessage = (event) => {
        try {
            const packet = deserializePacket(event.data)
            console.log('Packet recieved', packet)

            switch (packet.type) {
                //NEW GAME
                case PACKET_TYPES.NEW_GAME:
                    console.log('Game started', packet.payload)
                    document.getElementById('messages').textContent = 'Novo jogo iniciado!';
                    break
                // JOIN GAME
                case PACKET_TYPES.PLAYER_JOIN:
                    console.log('Player joined:', packet.payload)
                    addPlayerToUI(packet.payload);
                    document.getElementById('messages').textContent = `${packet.payload} entrou no jogo!`;
                    break
                // PLAY CARD
                case PACKET_TYPES.CARD_PLAY:
                    console.log('Player played:', packet.payload)
                    break
                // UPDATE STATE
                case PACKET_TYPES.UPDATE_STATE:
                    console.log('Game state update:', packet.payload)
                    break
                // ERROR PACKET
                case PACKET_TYPES.ERROR:
                    console.error(packet.payload)
                    document.getElementById('messages').textContent = `Erro: ${packet.payload}`;
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
        document.getElementById('status').textContent = 'Erro de conexão!';
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

