package network

// PACKET STRUCTURE
//+---------+------+------+------+
//| Version | Type | Size | Data |
//+---------+------+------+------+
//|       1 |    1 |    2 | 1P   |
//+---------+------+------+------+
//

const (
	PacketVersion1 = iota + 1
)

const (
	PacketTypeNewGame = iota + 1
	PacketTypeJoin
	PacketTypeCardPlay
	PacketTypeUpdate
	PacketTypeError
)

type TCPPacket struct {
	Version uint8
	Type    uint8
	Size    uint16
	Data    []byte
}
