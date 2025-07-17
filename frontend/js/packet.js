/**
 * @typedef {import('./types.js').TCPPacket} TCPPacket
 */

/**
 * @typedef {import('./types.js').PacketType} PacketType
 */

/**
 *  Creates TCP Packet
 *  @param {number} version - version number (1 byte)
 *  @param {number} type - version type (1 byte)
 *  @param {string} payload - packet payload
 *  @returns {ArrayBuffer} Serialized binary packet
 */
export function createPacket(version, type, payload) {
    const payloadBytes = new TextEncoder().encode(payload);
    const length = payloadBytes.length;

    const buffer = new ArrayBuffer(4 + length);
    const view = new DataView(buffer);

    view.setUint8(0, version);
    view.setUint8(1, type);
    view.setUint16(2, length, true);

    new Uint8Array(buffer, 4).set(payloadBytes);

    return buffer;
}

/**
 *  Deserializes a TCP Packet
 *  @param {ArrayBuffer} buffer - binary data recieved
 *  @returns {TCPPacket} TCP Packet
 *  @throws {Error} if the packet is invalid
 */
export function deserializePacket(buffer) {
    const view = new DataView(buffer)

    if (buffer.byteLength < 4) {
        throw new Error('Invalid packet: insufficient data for header')
    }

    const version = view.getUint8(0)
    const type = view.getUint8(1)
    const size = view.getUint16(2, true)

    if (buffer.byteLength < 4 + size) {
        throw new Error('Invalid packet: payload size mismatch')
    }

    const payloadBytes = new Uint8Array(buffer, 4, size)
    const payload = new TextDecoder().decode(payloadBytes)

    /** @type {TCPPacket} */
    return {
        version,
        type: /** @type {PacketType} */ (type),
        size,
        payload
    }
}

/**
 *  Send Packet to backend
 *
 *  @param {WebSocket} socket - WebSocket
 *  @param {number} version - version number (1 byte)
 *  @param {PacketType} type - type number (1 byte)
 *  @param {string} payload - packet data
 *  @returns {void}
 */
export function sendPacket(socket, version, type, payload) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const packet = createPacket(version, type, payload);
        socket.send(packet);
        console.log('Pacote enviado:', { version, type, payload });
    } else {
        console.error('Conexão WebSocket não está aberta');
    }
}
