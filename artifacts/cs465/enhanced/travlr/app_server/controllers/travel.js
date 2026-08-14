const axios = require('axios');

const apiOptions = {
    server: process.env.API_BASE_URL || 'http://localhost:3000'
};

/**
 * Render the travel list view with image metadata attached.
 */
const _renderTravelList = (req, res, responseBody) => {
    const tripImages = ['reef1.jpg', 'reef2.jpg', 'reef3.jpg', 'dive-site.png'];
    const tripsWithImages = Array.isArray(responseBody)
        ? responseBody.map((trip, index) => ({
            ...trip,
            image: tripImages[index % tripImages.length]
        }))
        : [];

    res.render('travel', {
        title: 'Travel Getaways',
        trips: tripsWithImages
    });
};

/**
 * Load trips from the API and render the list page.
 */
const travelList = async (req, res) => {
    const path = '/api/trips';
    try {
        const response = await axios.get(apiOptions.server + path);
        _renderTravelList(req, res, response.data);
    } catch (err) {
        res.render('error', { message: 'API lookup error' });
    }
};

/**
 * Load a single trip from the API and render the detail page.
 */
const travelDetail = async (req, res) => {
    const path = `/api/trips/${req.params.tripCode}`;
    try {
        const response = await axios.get(apiOptions.server + path);
        res.render('travel-info', {
            title: response.data.name,
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
