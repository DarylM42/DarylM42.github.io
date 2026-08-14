const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.disable('etag');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

require('./app_api/models/db');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server', 'views'));
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

app.use(express.static(path.join(__dirname, 'public')));

const travelRouter = require('./app_server/routes/travel');
app.use('/travel', travelRouter);

const roomsRouter = require('./app_server/routes/rooms');
app.use('/rooms', roomsRouter);

const mealsRouter = require('./app_server/routes/meals');
app.use('/meals', mealsRouter);

const newsRouter = require('./app_server/routes/news');
app.use('/news', newsRouter);

const contactRouter = require('./app_server/routes/contact');
app.use('/contact', contactRouter);

const apiRoutes = require('./app_api/routes/index');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});