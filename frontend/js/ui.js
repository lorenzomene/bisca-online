import { websocketSendPacket } from './websocket.js';
import { PACKET_TYPES } from './types.js';
/**
 * @typedef {import('./types.js').PacketType} PacketType
 */

const addedPlayers = new Set();

/**
 * Add a player to the player list in the UI
 * @param {string} playerName - The name of the player to add
 */
export function addPlayerToUI(playerName) {
    // #### FOR NOW PLAYER NAME IS AUTO GENERATED BY THE SERVER ###
    if (!addedPlayers.has(playerName)) {
        const playersList = document.getElementById('players');
        const playerItem = document.createElement('li');
        playerItem.textContent = playerName;
        playersList.appendChild(playerItem);

        addedPlayers.add(playerName);
    }
}

export function setupUI() {
    // GAME START
    document.getElementById('start-game').addEventListener('click', () => {
        console.log('Starting new game...');
        websocketSendPacket(1, /** @type {PacketType} */(PACKET_TYPES.NEW_GAME), "start");
    });

    // JOIN GAME
    document.getElementById('join-game').addEventListener('click', () => {
        // Send a join packet to the backend, the server will generate the player name
        websocketSendPacket(1, /** @type {PacketType} */(PACKET_TYPES.PLAYER_JOIN), "join");

        document.getElementById('join-game').disabled = true;
    });
}

