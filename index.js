// import OpenAI from 'openai';

// // Set your API key using process.env
// const apiKey = "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";

// // Create a new instance of OpenAI with the API key
// const openai = new OpenAI({ apiKey });

// async function main() {
//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "system", content: "You are a helpful assistant." }],
//         });

//         // console.log(completion.choices[0].message.content);
//         console.log(completion);
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

// main();

const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = 3000; // You can change this port if needed

// Set your API key using process.env
const apiKey = "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";

// Create a new instance of OpenAI with the API key
const openai = new OpenAI({ apiKey });

// Middleware to parse JSON in the request body
app.use(express.json());

// Define a route for chat completion
app.post('/generate-recipe', async (req, res) => {
    try {
        const { criteria } = req.body;

        const completion = await openai.ChatCompletion.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: `You are asking for a recipe with criteria: ${criteria}.` }],
        });

        res.json({ recipe: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error in generating recipe:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
