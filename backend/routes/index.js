console.log('Loading: routes/index.js');
import express from 'express';
const router = express.Router();
import { getExampleData } from '../controllers/exampleController.js';
import { getOpenAIResponse } from '../controllers/openaicontroller.js';
import { getJourney, getStations } from '../controllers/tflController.js';

// Define a sample route
router.get('/hello', getExampleData);

// Route for OpenAI
router.post('/openai', getOpenAIResponse);

// Routes for TfL

// was causing build error, no longer have a function called getStopPoints 
//router.get('/tfl/stoppoints', getStopPoints);
router.get('/tfl/journey-with-ai', getJourneyWithAI);
router.get('/tfl/journey/:from/to/:to', getJourney);
router.get('tfl/stations', getStations)


export default router;