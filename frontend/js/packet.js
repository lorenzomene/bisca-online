/**
 * @typedef {Object} TCPPacket
 * @property {number} version - The version of the packet (1 byte).
 * @property {number} type - The type of the packet (1 byte).
 * @property {number} size - The length of the payload (2 bytes).
 * @property {string} payload - The content of the packet.
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
    console.log(view)

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

    return {
        version,
        type,
        size,
        payload
    }
}
