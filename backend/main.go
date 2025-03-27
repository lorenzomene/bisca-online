package main

import (
	"bisca-online/backend/game"
	"bisca-online/backend/pkg/network"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var packetHandler = game.NewHandler()

// Store all active connections
var (
	connections = make(map[*websocket.Conn]bool)
	connMutex   = sync.Mutex{}
)

func addConnection(conn *websocket.Conn) {
	connMutex.Lock()
	defer connMutex.Unlock()
	connections[conn] = true
}

func removeConnection(conn *websocket.Conn) {
	connMutex.Lock()
	defer connMutex.Unlock()
	delete(connections, conn)
}

func broadcastToAll(packet network.TCPPacket) {
	serialized, err := packet.Serialize()
	if err != nil || len(serialized) == 0 {
		log.Println("Serialization failed:", err)
		return
	}

	connMutex.Lock()
	defer connMutex.Unlock()

	log.Printf("Broadcasting packet: Type=%d Payload=%s to %d clients",
		packet.Type, string(packet.Data), len(connections))

	for conn := range connections {
		err := conn.WriteMessage(websocket.BinaryMessage, serialized)
		if err != nil {
			log.Printf("Error sending to client: %v", err)
			// We'll remove this connection in the handleConnection function
			// to avoid modifying the map during iteration
		}
	}
}

func handleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error trying to upgrade to websocket: ", err)
		return
	}

	addConnection(conn)
	defer func() {
		conn.Close()
		removeConnection(conn)
	}()

	log.Println("New connection established")

	// Send current player list to new connections
	sendPlayerListToClient(conn)

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error trying to read message: ", err)
			break
		}

		packet, err := network.Deserialize(msg)
		if err != nil {
			log.Println("Error trying to deserialize packet: ", err)
			continue
		}

		log.Printf("Packet received: Version=%d Type=%d Payload=%s",
			packet.Version, packet.Type, string(packet.Data))

		response, handlerErr := packetHandler.HandlePacket(*packet)

		if handlerErr != nil {
			log.Println("Packet Handling Failed: ", handlerErr)

			// Create error response packet
			response = network.TCPPacket{
				Version: network.PacketVersion1,
				Type:    network.PacketTypeError,
				Size:    uint16(len(handlerErr.Error())),
				Data:    []byte(handlerErr.Error()),
			}

			// Send error only to the client who made the request
			serialized, _ := response.Serialize()
			conn.WriteMessage(websocket.BinaryMessage, serialized)
		} else {
			// Broadcast successful response to all clients
			broadcastToAll(response)
		}
	}
}

// Send the current list of players to a newly connected client
func sendPlayerListToClient(conn *websocket.Conn) {
	players := packetHandler.GetPlayerList()

	if len(players) == 0 {
		return
	}

	for _, playerName := range players {
		packet := network.TCPPacket{
			Version: network.PacketVersion1,
			Type:    network.PacketTypeJoin,
			Size:    uint16(len(playerName)),
			Data:    []byte(playerName),
		}

		serialized, err := packet.Serialize()
		if err != nil {
			log.Println("Error serializing player list:", err)
			continue
		}

		err = conn.WriteMessage(websocket.BinaryMessage, serialized)
		if err != nil {
			log.Println("Error sending player list:", err)
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
