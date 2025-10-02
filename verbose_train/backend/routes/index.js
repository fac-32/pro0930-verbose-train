const express = require('express');
const router = express.Router();
const { getExampleData } = require('../controllers/exampleController');
const { getOpenAIResponse } = require('../controllers/openAIController');
const { getStopPoints, getJourney } = require('../controllers/tflController');

// Define a sample route
router.get('/hello', getExampleData);

// Route for OpenAI
router.post('/openai', getOpenAIResponse);

// Routes for TfL
router.get('/tfl/stoppoints', getStopPoints);
router.get('/tfl/journey', getJourney);

module.exports = router;

