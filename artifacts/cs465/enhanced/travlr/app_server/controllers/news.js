const newsData = require('../data/news.json');

/**
 * Render the news listing page.
 */
const newsList = (req, res) => {
    res.render('news', {
        title: 'News',
        news: newsData
    });
};

module.exports = {
    newsList
};
