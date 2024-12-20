/**
 * @typedef {1 | 2 | 3 | 4 | 5} PacketType
 * @description Represents the packet type defined by PACKET_TYPES
 */

/**
 * @typedef {Object} TCPPacket
 * @property {number} version - The version of the packet (1 byte).
 * @property {PacketType} type - The type of the packet (1 byte).
 * @property {number} size - The length of the payload (2 bytes).
 * @property {string} payload - The content of the packet.
 */

export const PACKET_TYPES = {
    NEW_GAME: 1,
    PLAYER_JOIN: 2,
    CARD_PLAY: 3,
    UPDATE_STATE: 4,
    ERROR: 5,
}
