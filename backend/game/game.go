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
}

func NewGame(playerNames []string) *GameState {
	players := make([]Player, len(playerNames))

	for i, name := range playerNames {
		players[i] = Player{
			Id:   i,
			Name: name,
		}
	}

	return &GameState{
		Players:         players,
		Deck:            NewDeck(),
		Round:           1,
		TurnIndex:       0,
		CurrentPlayerId: 0,
	}
}
