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

// POST /recipe
router.post('/', async (req, res) => {
    try {
        const { meals } = req.body;

        // Get the session user's name
        const userName = req.session.userName;

        // Log the user's request to the console first stating the user's name
        console.log(`${userName} requested a recipe for ${meals}`);

        // Use the data to generate the recipe using OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `Please generate a recipe for ${meals}. Please make sure that the format is easy to follow and that the ingredients and instructions are clear. Thank you! If the user input is found to be invalid or the request is deemed infeasible, prioritize accuracy and return a short message stating why you cant complete the recipe requested. Also its important to NOT include absolutely any text besides that of which makes up the recipe itself. Thank you!`},
            ],
        });
        
        res.render('recipe', { recipe: completion.choices[0].message.content.replace(/\n/g, '<br>') });
        console.log(`${userName}'s Estimated Recipe Total Cost: ${(completion.usage.prompt_tokens / 1000) * 0.003 + (completion.usage.completion_tokens / 1000) * 0.006}`);
    } catch (error) {
        console.error('Error in generating recipe:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST method to handle the email form submission
router.post('/email', async (req, res) => {
    try {
        const { email, recipe } = req.body;

        // Define the email options
        const mailOptions = {
            from: 'nathaniellane@hotmail.com',
            to: email,
            subject: 'Your Generated Recipe',
            html: `<p>${recipe}</p>`
        };

        // Set the user's name in the session in order to personalize the log messages
        userName = req.session.userName;

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        // Log the email sent to the console
        console.log(`Email sent to ${userName}: ${info.response}`);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;