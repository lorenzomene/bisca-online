const socket = new WebSocket('ws://localhost:8080/ws');

socket.onopen = () => {
    document.getElementById('status').textContent = 'Conectado!';
    console.log('Conexão estabelecida');
};

socket.onmessage = (event) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `Servidor: ${event.data}`;
    document.getElementById('messages').appendChild(messageDiv);
};

socket.onerror = (error) => {
    document.getElementById('status').textContent = 'Erro!';
    console.error('Erro na conexão WebSocket:', error);
};

socket.onclose = () => {
    document.getElementById('status').textContent = 'Desconectado';
    console.log('Conexão encerrada');
};


document.getElementById('send-message').addEventListener('click', () => {
    socket.send('Olá, servidor!');
    console.log('Mensagem enviada: Olá, servidor!');
});

function createPacket(version, type, payload) {
    const payloadBytes = new TextEncoder().encode(payload); // Codifica o payload como UTF-8
    const length = payloadBytes.length;

    // Cria um buffer para o pacote
    const buffer = new ArrayBuffer(4 + length);
    const view = new DataView(buffer);

    // Preenche o header
    view.setUint8(0, version); // Version
    view.setUint8(1, type);    // Type
    view.setUint16(2, length, true); // Length (Little-Endian)

    // Adiciona o payload
    new Uint8Array(buffer, 4).set(payloadBytes); // Dados a partir do byte 4

    return buffer;
}

function sendPacket(version, type, payload) {
    if (socket.readyState === WebSocket.OPEN) {
        const packet = createPacket(version, type, payload);
        socket.send(packet);
        console.log('Pacote enviado:', { version, type, payload });
    } else {
        console.error('Conexão WebSocket não está aberta');
    }
}

document.getElementById('send-test').addEventListener('click', () => {
    sendPacket(1, 1, 'Jogador1');
});

