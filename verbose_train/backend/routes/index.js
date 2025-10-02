const express = require('express');
const router = express.Router();
const { getExampleData } = require('../controllers/exampleController');
const { getOpenAIResponse } = require('../controllers/openAIController');

// Define a sample route
router.get('/hello', getExampleData);

// Route for OpenAI
router.post('/openai', getOpenAIResponse);

module.exports = router;

