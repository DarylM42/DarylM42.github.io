const roomsData = require('../data/rooms.json');

const roomImages = ['suite.jpg', 'deluxe.jpg', 'first-class.jpg', 'rooms.png'];

const mapRoomImages = (rooms) => rooms.map((room, index) => ({
    ...room,
    image: roomImages[index % roomImages.length]
}));

const getRoomByCode = (code) => {
    const rooms = mapRoomImages(roomsData);
    return rooms.find((room) => room.code === code);
};

/**
 * Render the rooms listing page.
 */
const roomsList = (req, res) => {
    res.render('rooms', {
        title: 'Rooms',
        rooms: mapRoomImages(roomsData)
    });
};

/**
 * Render the details page for a single room.
 */
const roomsDetail = (req, res) => {
    const room = getRoomByCode(req.params.roomCode);

    if (!room) {
        return res.status(404).send('Room not found');
    }

    return res.render('rooms-info', {
        title: room.name,
        room
    });
};

/**
 * Return a single room as JSON for API-style access.
 */
const roomsDetailJson = (req, res) => {
    const room = getRoomByCode(req.params.roomCode);

    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }

    return res.status(200).json(room);
};

module.exports = {
    roomsList,
    roomsDetail,
    roomsDetailJson
};
