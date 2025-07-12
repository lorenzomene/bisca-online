package game

type Player struct {
	Id     int
	Name   string
	Hand   []Card
	IsTurn bool
}

type GameState struct {
	Deck            []Card
	Players         []Player
	TableCards      []Card
	Round           int
	TurnIndex       int
	CurrentPlayerId int
	Bisca           Suit
}

func NewGame(playerNames []string) *GameState {
	players := make([]Player, len(playerNames))

	for i, name := range playerNames {
		players[i] = Player{
			Id:   i,
			Name: name,
		}
	}

	deck := NewDeck()
	var bisca Suit
	if len(deck) > 0 {
		bisca = deck[len(deck)-1].Suit
	}

	return &GameState{
		Players:         players,
		Deck:            deck,
		Round:           1,
		TurnIndex:       0,
		CurrentPlayerId: 0,
		Bisca:           bisca,
	}
}
