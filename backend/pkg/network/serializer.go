package network

// PACKET STRUCTURE
//+---------+------+------+------+
//| Version | Type | Size | Data |
//+---------+------+------+------+
//|       1 |    1 |    2 | 1P   |
//+---------+------+------+------+
//

import (
	"bytes"
	"encoding/binary"
	"errors"
)

func Deserialize(data []byte) (*TCPPacket, error) {
	if len(data) < 4 {
		return nil, errors.New("Insufficient data for a valid packet")
	}

	buf := bytes.NewReader(data)
	packet := &TCPPacket{}

	if err := binary.Read(buf, binary.LittleEndian, &packet.Version); err != nil {
		return nil, err
	}

	if err := binary.Read(buf, binary.LittleEndian, &packet.Type); err != nil {
		return nil, err
	}

	if err := binary.Read(buf, binary.LittleEndian, &packet.Size); err != nil {
		return nil, err
	}

	packet.Data = make([]byte, packet.Size)
	if _, err := buf.Read(packet.Data); err != nil {
		return nil, err
	}

	return packet, nil
}

func (p *TCPPacket) Serialize() ([]byte, error) {
	buf := new(bytes.Buffer)

	if err := binary.Read(buf, binary.LittleEndian, p.Version); err != nil {
		return nil, err
	}

	if err := binary.Read(buf, binary.LittleEndian, p.Type); err != nil {
		return nil, err
	}

	if err := binary.Read(buf, binary.LittleEndian, p.Size); err != nil {
		return nil, err
	}

	if _, err := buf.Write(p.Data); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil

}
