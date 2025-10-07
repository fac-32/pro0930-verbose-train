console.log('Loading: controllers/tflController.js');
import tflService from '../services/tflService.js';
import googleMapsService from '../services/googleMapsService.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const getJourneyWithAI = async (req, res) => {
  console.log('--- Received request for AI journey summary ---');
  try {
    const { from, to } = req.query;
    console.log(`From: ${from}, To: ${to}`);

    if (!from || !to) {
      return res.status(400).json({ message: 'From and to are required' });
    }

    // 1. Get journey information from the TFL API.
    console.log('Fetching journey data from TFL...');
    const journeyData = await tflService.getJourney(from, to);
    console.log('TFL API Response received.');

    if (!journeyData.journeys || journeyData.journeys.length === 0) {
      console.log('No journeys found from TFL API.');
      return res.status(404).json({ message: 'No journeys found for the specified route.' });
    }

    const journey = journeyData.journeys[0];

    // 2. Get destination coordinates and find nearby places.
    const destination = journey.legs[journey.legs.length - 1].arrivalPoint;
    const { lat, lon } = destination;
    console.log(`Fetching nearby places for destination: ${destination.commonName} (${lat}, ${lon})`);
    const nearbyPlaces = await googleMapsService.getNearbyPlaces(lat, lon);
    console.log('Found nearby places:', nearbyPlaces.map(p => p.name));

    // 3. Create a rich prompt for OpenAI.
    const prompt = `
      You are a helpful travel assistant. Create a fun and user-friendly travel itinerary based on the following data.

      First, provide a simple summary of the travel journey itself.

      Then, suggest a mini-itinerary of 2-3 things to do at the destination, using the provided list of nearby places. Be creative and group them logically if possible (e.g., "grab a coffee at... and then visit...").

      JOURNEY DATA:
      - From: ${from}
      - To: ${to}
      - Duration: ${journey.duration} minutes
      - Steps: ${JSON.stringify(journey.legs.map(leg => leg.instruction.summary), null, 2)}

      NEARBY PLACES AT DESTINATION (from Google Maps):
      ${JSON.stringify(nearbyPlaces, null, 2)}
    `;
    console.log('--- OpenAI Prompt (Rich) ---');
    console.log(prompt);

    // 4. Send prompt to OpenAI.
    console.log('Sending rich prompt to OpenAI...');
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    const summary = completion.choices[0].message.content;
    console.log('OpenAI Response:', summary);

    // 5. Return the final itinerary to the user.
    res.json({ summary });

  } catch (error) {
    console.error('--- ERROR in getJourneyWithAI ---');
    console.error(error);
    res.status(500).json({ message: 'Error fetching journey with AI summary', error: error.message });
  }
};

export {
  getStopPoints,
  getJourney,
  getJourneyWithAI,
};
