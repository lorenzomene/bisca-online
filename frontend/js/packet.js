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

