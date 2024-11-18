import { createPacket, deserializePacket } from './packet.js';

let socket;

export function initWebSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida');
        document.getElementById('status').textContent = 'Conectado!';
    };

    socket.onmessage = (event) => {
        try {

            const packet = deserializePacket(event.data)
            console.log('Packet recieved', packet)

            switch (packet.type) {
                case 1://join
                    console.log('Player joined:', packet.payload)
                    break
                case 2://play
                    console.log('Player joined:', packet.payload)
                    break
                case 3://update
                    console.log('Player joined:', packet.payload)
                    break
                case 4://error
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
 *  Send Packet to backend
 *
 *  @param {number} version - version number (1 byte)
 *  @param {number} type - type number (1 byte)
 *  @param {string} payload - packet data
 *  @returns {void}
 */
export function sendPacket(version, type, payload) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const packet = createPacket(version, type, payload);
        socket.send(packet);
        console.log('Pacote enviado:', { version, type, payload });
    } else {
        console.error('Conexão WebSocket não está aberta');
    }
}

