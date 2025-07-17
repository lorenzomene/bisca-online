export default class GameState {
    constructor() {
        this.deck = [];
        this.players = [];
        this.tableCards = [];
        this.round = 0;
        this.turnIndex = 0;
        this.currentPlayerId = null;
        this.bisca = null;
        this.turnOrder = []
    }

    addPlayer(player) {
        console.log('Adding player:', player);
        if (this.players.length >= 4) {
            alert('Cannot add more than 4 players');
            return;
        }
        this.players.push(player);
    }

    updateDeck(deck) {
        console.log('Updating deck with ' + deck.length + ' cards');
        this.deck = deck;
    }

    playCard(card) {
        this.tableCards.push(card);
        this.turnIndex = (this.turnIndex + 1);
    }

    nextRound() {
        this.round += 1;
        this.turnIndex = 0;
        this.tableCards = [];
    }
}
