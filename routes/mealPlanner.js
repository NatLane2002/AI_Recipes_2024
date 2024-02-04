const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const nodemailer = require('nodemailer');

// Set your API key using process.env
const apiKey = process.env.OPENAI_API_KEY;

// Create a new instance of OpenAI with the API key
const openai = new OpenAI({ apiKey });

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'nathaniellane@hotmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

// GET /meal-planner
router.get('/', (req, res) => {
    try {
        res.render('mealPlanner');
    } catch (error) {
        console.error('Error:', error.message);
    }
});

// POST /meal-planner/results
router.post('/results', async (req, res) => {
    try {
        const {
            dietType,
            caloricIntake,
            proteinIntake,
            numMeals,
            allergies,
            dislikedFoods,
            preferredFoods,
        } = req.body;

        // Use the data to generate the meal plan using OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `Generate and then neatly format an exceptionally accurate and precise meal plan for a ${dietType} diet with ${caloricIntake} calories and ${proteinIntake} grams of protein, meticulously distributed across ${numMeals} meals per day. Exercise utmost care to avoid ${allergies} and exclude ${dislikedFoods}, while meticulously incorporating ${preferredFoods} in sensible moderation. I want the total protein and calorie amounts to be displayed after each meal neatly. After the meals, at the bottom, I would like the daily total for calories and protein. If any of the inputs are found to be invalid or the request is deemed infeasible, prioritize accuracy and return a short message stating why you cant complete the meal plan requested. Also its important to NOT include absolutely any text besides that of which makes up the meal plan itself. Thank you and do not forget to be exceptionally accurate with calories, protein and every other aspect of the request!`
                },
            ],
        });

        // Convert line breaks to HTML breaks
        const formattedMealPlan = completion.choices[0].message.content.replace(/\n/g, '<br>');

        res.render('mealPlan', { mealPlan: formattedMealPlan });
        console.log(("Query Total Cost:", completion.usage.prompt_tokens / 1000) * 0.003 + (completion.usage.completion_tokens / 1000) * 0.006);
    } catch (error) {
        console.error('Error in generating meal plan:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST method to handle the email form submission
router.post('/email', async (req, res) => {
    try {
        const { email, mealPlan } = req.body;

        // Define the email options
        const mailOptions = {
            from: 'nathaniellane@hotmail.com',
            to: email,
            subject: 'Your Generated Meal Plan',
            html: `<p>${mealPlan}</p>`
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        // Render the confirmation page
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;