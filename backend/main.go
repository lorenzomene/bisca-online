package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleConnection(w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error trying to upgrade to websocket: ", err)
		return
	}
	defer conn.Close()

	log.Println("New connection stablished")

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error trying to read message: ", err)
			break
		}

		log.Printf("New message: %s", msg)

		err = conn.WriteMessage(websocket.TextMessage, []byte("Message recieved"))
		if err != nil {
			log.Println("Error trying to write message: ", err)
			break
		}

	}
}

func main() {
	fs := http.FileServer(http.Dir("../frontend"))
	http.Handle("/", fs)

	http.HandleFunc("/ws", handleConnection)

	fmt.Println("Servidor iniciado em http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
