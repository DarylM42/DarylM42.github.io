const axios = require('axios');

const apiOptions = {
    server: 'http://localhost:3000'
};

const _renderTravelList = (req, res, responseBody) => {
    res.render('travel', {
        title: 'Travel Getaways',
        trips: responseBody
    });
};

const travelList = async (req, res) => {
    const path = '/api/trips';
    try {
        const response = await axios.get(apiOptions.server + path);
        _renderTravelList(req, res, response.data);
    } catch (err) {
        res.render('error', { message: 'API lookup error' });
    }
};

const travelDetail = async (req, res) => {
    const path = `/api/trips/${req.params.tridCode}`;
    try {
        const response = await axios.get(apiOptions.server + path);
        res.render('travel-info', {
            trip: response.data
        });
    } catch (err) {
        res.render('error', { message: 'API lookup error' });
    }
};

module.exports = { 
    travelList,
    travelDetail
};
