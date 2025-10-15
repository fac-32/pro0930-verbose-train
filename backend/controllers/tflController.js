console.log('Loading: controllers/tflController.js');
import * as tflService from '../services/tflservice.js';
import googleMapsService from '../services/googleMapsService.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const stationInfoBundler = (commonName, naptanId, lat, lon) => {
  return {
    commonName: commonName,
    lat: lat,
    lon: lon,
    naptanId: naptanId,
  }
}

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
    console.log('TFL API Response received.');

    if (!journeyData.journeys || journeyData.journeys.length === 0) {
      console.log('No journeys found from TFL API.');
      return res.status(404).json({ message: 'No journeys found for the specified route.' });
    }

    const journey = journeyData.journeys[0];

    // Assemble the journey for the map, ensuring no duplicates.
    const allStopsRaw = [];
    journey.legs.forEach(leg => {
        allStopsRaw.push(leg.departurePoint);
        if (leg.path && leg.path.stopPoints) {
            leg.path.stopPoints.forEach(stop => allStopsRaw.push(stop));
        }
        allStopsRaw.push(leg.arrivalPoint);
    });

    const uniqueStations = new Map();
    allStopsRaw.forEach(station => {
        const naptanId = station.id || station.naptanId;
        if (naptanId && !uniqueStations.has(naptanId)) {
            uniqueStations.set(naptanId, station);
        }
    });

    const assembledJourney = [];
    for (const station of uniqueStations.values()) {
        let commonName = station.commonName || station.name;
        let naptanId = station.id || station.naptanId;
        let lat, lon;

        if (station.lat && station.lon) {
            lat = station.lat;
            lon = station.lon;
        } else {
            const fetchedStationLocation = await tflService.getStationLocation(naptanId);
            lat = fetchedStationLocation.lat;
            lon = fetchedStationLocation.lon;
        }
        assembledJourney.push(stationInfoBundler(commonName, naptanId, lat, lon));
    }

    // 2. For each unique stop in the journey, find nearby places.
    console.log('Fetching nearby places for unique stops in the journey...');
    const placesPromises = assembledJourney.map(stop => 
        googleMapsService.getNearbyPlaces(stop.lat, stop.lon)
    );
    const placesResults = await Promise.all(placesPromises);

    const allNearbyPlaces = assembledJourney.map((stop, index) => ({
        stopName: stop.commonName,
        places: placesResults[index]
    })).filter(stop => stop.places.length > 0);

    console.log('Found nearby places for stops:', allNearbyPlaces.map(s => s.stopName));

    // 3. Create a rich prompt for OpenAI.
    const prompt = `
      You are a helpful travel assistant. Create a fun and user-friendly travel itinerary based on the following data.

      First, provide a simple summary of the travel journey itself.

      Then, for each stop in the journey that has a list of nearby places, suggest one or two interesting things to do. Group the suggestions by the station name.

      JOURNEY DATA:
      - From: ${from}
      - To: ${to}
      - Duration: ${journey.duration} minutes
      - Steps: ${JSON.stringify(journey.legs.map(leg => leg.instruction.summary), null, 2)}

      NEARBY PLACES FOR EACH STOP (from Google Maps):
      ${JSON.stringify(allNearbyPlaces, null, 2)}
    `;

    // 4. Send prompt to OpenAI.
    console.log('Sending rich prompt to OpenAI...');
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    const summary = completion.choices[0].message.content;
    console.log('OpenAI Response received.');

    // 5. Return the final itinerary to the user.
    res.json({ summary, journey: assembledJourney });

  } catch (error) {
    console.error('--- ERROR in getJourneyWithAI ---');
    console.error(error);
    res.status(500).json({ message: 'Error fetching journey with AI summary', error: error.message });
  }
};

export {
  getStations,
  getJourneyWithAI,
};