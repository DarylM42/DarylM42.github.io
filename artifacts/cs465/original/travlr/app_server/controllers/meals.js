const mealsData = require('../data/meals.json');

const mealImages = ['seafoods.jpg', 'buffet.jpg', 'desserts.jpg', 'food.png'];

const mapMealImages = (meals) => meals.map((meal, index) => ({
    ...meal,
    image: mealImages[index % mealImages.length]
}));

const getMealByCode = (code) => {
    const meals = mapMealImages(mealsData);
    return meals.find((meal) => meal.code === code);
};

/**
 * Render the meals listing page.
 */
const mealsList = (req, res) => {
    res.render('meals', {
        title: 'Meals',
        meals: mapMealImages(mealsData)
    });
};

/**
 * Render the details page for a single meal.
 */
const mealsDetail = (req, res) => {
    const meal = getMealByCode(req.params.mealCode);

    if (!meal) {
        return res.status(404).send('Meal not found');
    }

    return res.render('meals-info', {
        title: meal.name,
        meal
    });
};

/**
 * Return a single meal as JSON for API-style access.
 */
const mealsDetailJson = (req, res) => {
    const meal = getMealByCode(req.params.mealCode);

    if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
    }

    return res.status(200).json(meal);
};

module.exports = {
    mealsList,
    mealsDetail,
    mealsDetailJson
};
