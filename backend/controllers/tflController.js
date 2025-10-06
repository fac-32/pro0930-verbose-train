
import tflService from '../services/tflService.js';

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

const getJourney = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ message: 'From and to are required' });
    }
    const data = await tflService.getJourney(from, to);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }
};

export {
  getStopPoints,
  getJourney,
};
