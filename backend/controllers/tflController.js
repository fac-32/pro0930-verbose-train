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


//--------------------------------------
// Ivon's code: Station Suggestions (TFL 300 response)
//--------------------------------------

const suggestStations = async (req, res) => {
  const { stationName } = req.body; // Reads "user station's name input" from the request body
  try {
    const suggestions = await tflService.getStationSuggestions(stationName, false); // flag to set to false for real API
    res.json({ suggestions }); // Sends suggestions back to the client
  } catch (error) {
    res.status(500).json({ message: 'Error fetching station suggestions', error: error.message });
  }
};



export {
  getStopPoints,
  getJourney,
  suggestStations, // added export for suggestStations
};


