
import * as tflService from '../services/tflService.js';

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
