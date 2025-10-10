// import express from 'express'; // no needed as it is imported on server.js
// const router = express.Router(); // this is CommonJS

// import { getStopPoints, getJourney } from '../controllers/tflController.js'; //changed the functions name

// router.get('/tfl/stoppoints', getStopPoints); //POST is preferred, because you can send the data in the request body and handle more complex input.
// router.get('/tfl/journey', getJourney); // /api/journey is more standard for public/backend APIs.


// Import Router from express
import { Router } from 'express';
// Import controller functions
import { suggestStations, getJourney } from '../controllers/tflController.js';
import { getExampleData } from '../controllers/exampleController.js';
import { getOpenAIResponse } from '../controllers/openAIController.js'; // Corrected import path

// Create a new router instance
const router = Router();

// Route for station suggestions
router.post('/api/suggest-stations', suggestStations);
// Route for journey details
router.post('/api/journey', getJourney);

// Define a sample route
router.get('/hello', getExampleData);

// Route for OpenAI
router.post('/openai', getOpenAIResponse);

// Export the router for use in server.js
export default router;