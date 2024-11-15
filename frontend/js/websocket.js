import { createPacket } from './packet.js';

let socket;

export function initWebSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida');
        document.getElementById('status').textContent = 'Conectado!';
    };

    socket.onmessage = (event) => {
        console.log('Mensagem recebida do servidor:', event.data);
        // Processar mensagens recebidas...
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

