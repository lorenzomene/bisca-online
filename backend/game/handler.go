package game

import (
	"bisca-online/backend/pkg/network"
	"fmt"
)

type Handler struct {
	playerNames []string
}

func NewHandler() *Handler {
	return &Handler{
		playerNames: []string{},
	}
}

func (h *Handler) HandlePacket(packet network.TCPPacket) error {
	switch packet.Type {
	case network.PacketTypeNewGame:
		err := NewGame(h.playerNames)
		if err != nil {
			return fmt.Errorf("Could not start game", err)
		}
	case network.PacketTypeJoin:
		err := h.playerJoin(packet.Data)
		if err != nil {
			return fmt.Errorf("Could not join game", err)
		}
	case network.PacketTypeCardPlay:
		err := h.playCard(packet.Data)
		if err != nil {
			return fmt.Errorf("Could not play card", err)
		}
	case network.PacketTypeUpdate:
		err := h.playCard(packet.Data)
		if err != nil {
			return fmt.Errorf("Could not update game state", err)
		}
	case network.PacketTypeError:
		err := h.playCard(packet.Data)
		if err != nil {
			return fmt.Errorf("Could not process error", err)
		}
	}
	return nil
}

func (h *Handler) playerJoin(data []byte) error {
	h.playerNames = append(h.playerNames, string(data))
	return nil
}

func (h *Handler) playCard(data []byte) error {
	return nil
}
