const roomsData = require('../data/rooms.json');

const roomsList = (req, res) => {
    res.render('rooms', {
        title: 'Rooms',
        rooms: roomsData
    });
};

module.exports = {
    roomsList
};
