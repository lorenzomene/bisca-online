package game

import (
	"fmt"
	"math/rand"
	"time"
)

type Suit rune

const (
	Copas   Suit = 'C'
	Espadas Suit = 'E'
	Ouros   Suit = 'O'
	Paus    Suit = 'P'
)

type Card struct {
	Suit  Suit
	Value int
}

func NewDeck() []Card {
	suits := []Suit{Copas, Espadas, Ouros, Paus}
	deck := []Card{}
	allowedValues := []int{1, 2, 3, 4, 5, 6, 7, 10, 11, 12}

	for _, suit := range suits {
		for _, value := range allowedValues {
			deck = append(deck, Card{Suit: suit, Value: value})
		}
	}

	shuffleCards(deck)
	fmt.Println("Deck created with", len(deck), "cards:")
	for _, card := range deck {
		fmt.Printf("Card: %c%d\n", card.Suit, card.Value)
	}

	return deck
}

func shuffleCards(deck []Card) {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	for i := len(deck) - 1; i > 0; i-- {
		j := rng.Intn(i + 1)
		deck[i], deck[j] = deck[j], deck[i]
	}
}
