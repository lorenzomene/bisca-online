package game

import (
	"bisca-online/backend/pkg/network"
	"encoding/json"
	"fmt"
)

type Handler struct {
	playerNames []string
	playerCount int
	gameState   *GameState
}

func NewHandler() *Handler {
	return &Handler{
		playerNames: []string{},
		playerCount: 0,
		gameState:   nil,
	}
}

func (h *Handler) HandlePacket(packet network.TCPPacket) (network.TCPPacket, error) {
	var response network.TCPPacket
	response.Version = packet.Version

	switch packet.Type {
	case network.PacketTypeNewGame:
		if len(h.playerNames) < 2 {
			response.Type = network.PacketTypeError
			errorMsg := "Precisa de pelo menos 2 jogadores para começar"
			response.Data = []byte(errorMsg)
			response.Size = uint16(len(errorMsg))
			return response, nil
		}

		h.gameState = NewGame(h.playerNames)
		response.Type = network.PacketTypeNewGame

		deckJSON, err := json.Marshal(h.gameState.Deck)
		if err != nil {
			response.Type = network.PacketTypeError
			errorMsg := fmt.Sprintf("Erro ao serializar deck: %v", err)
			response.Data = []byte(errorMsg)
			response.Size = uint16(len(errorMsg))
			return response, nil
		}
		response.Data = deckJSON
		response.Size = uint16(len(deckJSON))
		return response, nil

	case network.PacketTypeJoin:
		playerName, err := h.playerJoin()
		if err != nil {
			response.Type = network.PacketTypeError
			errorMsg := fmt.Sprintf("Erro ao entrar: %v", err)
			response.Data = []byte(errorMsg)
			response.Size = uint16(len(errorMsg))
			return response, nil
		}

		response.Type = network.PacketTypeJoin
		response.Data = []byte(playerName)
		response.Size = uint16(len(playerName))
		return response, nil

	case network.PacketTypeCardPlay:
		err := h.playCard(packet.Data)
		if err != nil {
			response.Type = network.PacketTypeError
			errorMsg := fmt.Sprintf("Erro ao jogar a carta: %v", err)
			response.Data = []byte(errorMsg)
			response.Size = uint16(len(errorMsg))
			return response, nil
		}

		response.Type = network.PacketTypeUpdate
		msg := "Estado atualizado"
		response.Data = []byte(msg)
		response.Size = uint16(len(msg))
		return response, nil

	default:
		response.Type = network.PacketTypeError
		errorMsg := "Tipo de pacote desconhecido"
		response.Data = []byte(errorMsg)
		response.Size = uint16(len(errorMsg))
		return response, nil
	}
}

func (h *Handler) playerJoin() (string, error) {
	h.playerCount++
	playerName := fmt.Sprintf("Player%d", h.playerCount)

	h.playerNames = append(h.playerNames, playerName)

	return playerName, nil
}

func (h *Handler) playCard(data []byte) error {
	if h.gameState.TurnIndex == len(h.gameState.Players) {
		h.EvaluateRoundCards()
	} else {
		h.gameState.TurnIndex++
		// h.gameState.TableCards = append(h.gameState.TableCards, data)
	}

	return nil
}

func (h *Handler) GetPlayerList() []string {
	playersCopy := make([]string, len(h.playerNames))
	copy(playersCopy, h.playerNames)
	return playersCopy
}

func (h *Handler) EvaluateRoundCards() error {
	// placeholder
	return nil

}
