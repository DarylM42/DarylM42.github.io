const newsData = require('../data/news.json');

const newsList = (req, res) => {
    res.render('news', {
        title: 'News',
        news: newsData
    });
};

module.exports = {
    newsList
};
