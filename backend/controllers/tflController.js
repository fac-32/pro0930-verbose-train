
import tflService from '../services/tflService.js';
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
    console.log('TFL API Response:', JSON.stringify(journeyData, null, 2));

    // Check if journeys exist
    if (!journeyData.journeys || journeyData.journeys.length === 0) {
      console.log('No journeys found from TFL API.');
      return res.status(404).json({ message: 'No journeys found' });
    }

    // 2. Send that information to OpenAI to get a more descriptive or user-friendly travel summary.
    const prompt = `
      Please provide a user-friendly summary for the following TFL journey plan.
      The journey is from ${from} to ${to}.
      The total duration is ${journeyData.journeys[0].duration} minutes.
      The summary should be easy to read and highlight the key steps of the journey.

      Here is the journey data:
      ${JSON.stringify(journeyData.journeys[0], null, 2)}
    `;
    console.log('--- OpenAI Prompt ---');
    console.log(prompt);

    console.log('Sending prompt to OpenAI...');
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    const summary = completion.choices[0].message.content;
    console.log('OpenAI Response:', summary);

    // 3. Return the OpenAI-enhanced summary to the user.
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
