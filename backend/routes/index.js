import express from 'express';

const router = express.Router();
import { getExampleData } from '../controllers/exampleController.js';
import { getOpenAIResponse } from '../controllers/openAIController.js'; // Corrected import path 
import { getStopPoints, getJourney, suggestStations } from '../controllers/tflController.js'; // added import for suggestStations 

// Define a sample route
router.get('/hello', getExampleData);

// Route for OpenAI
router.post('/openai', getOpenAIResponse);

// Routes for TfL
router.get('/tfl/stoppoints', getStopPoints);
router.get('/tfl/journey/:from/to/:to', getJourney);
router.post('/api/suggest-stations', suggestStations);

// Routes for TfL
router.get('/tfl/stoppoints', getStopPoints);
router.get('/tfl/journey/:from/to/:to', getJourney);
router.post('/api/suggest-stations', suggestStations);

export default router;