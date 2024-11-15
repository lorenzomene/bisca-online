package network

const (
	PacketVersion1 = iota + 1
)

const (
	PacketTypeJoin = iota + 1
	PacketTypeCardPlay
	PacketTypeUpdate
	PacketTypeError
)

type TCPPacket struct {
	Version uint8
	Type    uint8
	Size    uint8
	Data    []byte
}
