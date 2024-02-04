const express = require('express');
const methodOverride = require('method-override');
const OpenAI = require('openai');
const app = express();
require('dotenv').config();
const port = 3000;

// Serve static files from the `public` folder
app.use(express.static('public'));

global.DEBUG = true;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set your API key using process.env
const apiKey = process.env.OPENAI_API_KEY;

// Create a new instance of OpenAI with the API key
const openai = new OpenAI({ apiKey });

// Middleware to parse JSON in the request body
app.use(express.json());

// Home page
app.get('/', (req, res) => {
    res.render('home');
});

// Disclaimer page
app.get('/disclaimer', (req, res) => {
    res.render('disclaimer');
});

// Routers

const mealPlannerRouter = require('./routes/mealPlanner');
app.use('/meal-planner', mealPlannerRouter);

const recipeRouter = require('./routes/recipe');
app.use('/recipe', recipeRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
