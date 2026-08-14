const mealsData = require('../data/meals.json');

const mealsList = (req, res) => {
    res.render('meals', {
        title: 'Meals',
        meals: mealsData
    });
};

module.exports = {
    mealsList
};
