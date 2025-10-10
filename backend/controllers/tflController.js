import * as tflService from '../services/tflservice.js'; //corrected import path

//----------------------
//justin's code
//----------------------

const getStopPoints = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    const data = await tflService.getStopPoints(lat, lon);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stop points', error: error.message });
  }
};

const date = 20251007
const from = 1000129
const to = 1000013
const time = '1700'
type = 'stationSelect';

const getJourney = async (req, res) => {
  try {
    const data = await tflService.TFLAPICall(from, to, time, date, type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }

};

export {
  getStopPoints,
  getJourney,
};

//--------------------------------------
// Ivon's code: Station Suggestions (TFL 300 response)
//--------------------------------------

// Import service functions from tflservice.js
import { getStationSuggestions } from '../services/tflservice.js';

/**
 * Controller for station suggestions.
 * Handles POST requests to /api/suggest-stations.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function suggestStations(req, res) {
  // Get stationName from request body
  const { stationName } = req.body;
  // Set simulate to true for dummy data, false for real API
  const suggestions = await getStationSuggestions(stationName, false);
  // Send suggestions as JSON response
  res.json({ suggestions });
}


