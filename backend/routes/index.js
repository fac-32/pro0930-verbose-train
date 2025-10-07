console.log('Loading: routes/index.js');
import express from 'express';
const router = express.Router();
import { getExampleData } from '../controllers/exampleController.js';
import { getOpenAIResponse } from '../controllers/openaicontroller.js';
import { getStopPoints, getJourney, getJourneyWithAI } from '../controllers/tflController.js';

// Define a sample route
router.get('/hello', getExampleData);

// Route for OpenAI
router.post('/openai', getOpenAIResponse);

// Routes for TfL
router.get('/tfl/stoppoints', getStopPoints);
router.get('/tfl/journey', getJourney);
router.get('/tfl/journey-with-ai', getJourneyWithAI);

export default router;