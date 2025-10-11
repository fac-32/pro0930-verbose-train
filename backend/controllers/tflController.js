
import tflService from '../services/tflService.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
import * as tflService from '../services/tflService.js';

const date = 20251007
const from = 1000129
const to = 1000013
const time = '1700'
const type = 'stationSelect';

const stationInfoBundler = (commonName, naptanId, lat, lon) => {
  return {
    commonName: commonName,
    lat: lat,
    lon: lon,
    naptanId: naptanId,
  }
}

const getJourney = async (req, res) => {
  try {
    let data = await tflService.TFLAPICall(from, to, time, date, type);
    data = data.data

    const allStops = [];

    const leg = data.journeys[0].legs[0];
    const departurePoint = leg.departurePoint;
    allStops.push(departurePoint)

    const intermediateStops = leg.path.stopPoints;
    intermediateStops.pop()
    intermediateStops.forEach((stops) => allStops.push(stops)
    )
    const arrivalPoint = leg.arrivalPoint;
    allStops.push(arrivalPoint);

    const assembledJourney = [];

    allStops.forEach((station) => {
      let commonName;
      let naptanId;
      let lat;
      let lon;

      if (station.commonName && station.id || station.commonName && station.naptanId || station.name && station.id) {
       commonName = station.commonName || station.name
       naptanId = station.id || station.naptanId
        if (station.lat && station.lon) {
          lat = station.lat
        lon = station.lon
        } else {
          const fetchedStationLocation = getStationLocation(naptanId);
          lat = fetchedStationLocation.lat;
          lon = fetchedStationLocation.lon;
        }
       assembledJourney.push(stationInfoBundler(commonName, naptanId, lat, lon));
    })

    res.json(assembledJourney);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }

};

const getStations = async (req, res) => {
  try {
    const data = await tflService.TFLAPICall(from, to, time, date, type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }
}

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
  getStations,
  getJourney,
  getJourneyWithAI,
};

