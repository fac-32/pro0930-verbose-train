console.log('Loading: controllers/tflController.js');
import * as tflservice from '../services/tflservice.js';
import googleMapsService from '../services/googleMapsService.js';
import OpenAI from 'openai';
import { getJourneyRecommendations } from './openAIController.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//justin code
const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const time = new Date().toTimeString().slice(0, 5).replace(':', '');
const type = 'stationSelect';

const stationInfoBundler = (commonName, naptanId, lat, lon, arrivalTime) => {
  return {
    commonName: commonName,
    lat: lat,
    lon: lon,
    naptanId: naptanId,
    arrivalTime: arrivalTime || null
  }
}

const getJourney = async (req, res) => {
    console.log('tfl controller get journey')
    const from = req.params.from;
    const to = req.params.to;
    console.log(`From: ${from}, To: ${to}`);
    
  try {
    let data = await tflservice.TFLAPICall(from, to, time, date, type);
    data = data.data
    console.log('success ftl journey fetch');
    console.log(data);
    

    const allStops = [];
    let numberOfLegs = 0;
    let combinedLegs = {};

    console.log('About to process legs, number of legs:', data.journeys[0].legs.length);
    
    data.journeys[0].legs.forEach( (journeyLeg) => {
      console.log('Processing leg:', numberOfLegs, journeyLeg.departurePoint?.commonName, 'to', journeyLeg.arrivalPoint?.commonName);
      
      if (!combinedLegs.departurePoint) {
        combinedLegs.departurePoint = journeyLeg.departurePoint
      } 

      if (!combinedLegs.path) {
        combinedLegs.path = journeyLeg.path;
      } else if (combinedLegs.path) {
        for (let stopPoint of journeyLeg.path.stopPoints) {
        combinedLegs.path.stopPoints.push(stopPoint)
        }
      }

      if (!combinedLegs.departureTime) {
        combinedLegs.departureTime = journeyLeg.departureTime;
      }

      combinedLegs.arrivalTime = journeyLeg.arrivalTime;

      combinedLegs.arrivalPoint = journeyLeg.arrivalPoint;

      numberOfLegs++;
    }

    )

    const stationIDs = [];

  combinedLegs.path.stopPoints = combinedLegs.path.stopPoints.filter((station) => {
  
  if (stationIDs.includes(station.id)) {
    
    return false;
  } else {
    
    stationIDs.push(station.id);
    return true;
  }
});

    const departurePoint = combinedLegs.departurePoint
    
    departurePoint.timeInfo = combinedLegs.departureTime;
    allStops.push(departurePoint)

    const intermediateStops = combinedLegs.path.stopPoints;
    intermediateStops.pop()
    intermediateStops.forEach((stops) => allStops.push(stops)
    )
    const arrivalPoint = combinedLegs.arrivalPoint;
   
    arrivalPoint.timeInfo = combinedLegs.arrivalTime;
    allStops.push(arrivalPoint);

    const assembledJourney = [];

console.log('Total stops found:', allStops.length);
console.log('All stops:', allStops.map(s => s.commonName || s.name));

for (const station of allStops) {
  let commonName;
  let naptanId;
  let lat;
  let lon;
  let arrivalTime;

  console.log('Processing station:', station.commonName || station.name, 'ID:', station.id || station.naptanId);
  
  if (station.commonName && station.id || station.commonName && station.naptanId || station.name && station.id) {
   
    commonName = station.commonName || station.name;
   
    naptanId = station.id || station.naptanId;

   
    if (station.arrivalDateTime) {
      arrivalTime = station.arrivalDateTime.split('T')[1].slice(0, 5);
    } else if (station.timeInfo) {
      arrivalTime = station.timeInfo.split('T')[1].slice(0, 5);
    }
    
    if (station.lat && station.lon) {
      lat = station.lat;
      lon = station.lon;
    
    } else {
      
      const fetchedStationLocation = await tflservice.getStationLocation(naptanId);
      console.log(fetchedStationLocation);
      lat = fetchedStationLocation.lat;
      lon = fetchedStationLocation.lon;
    }
    
    console.log('Adding station to journey:', commonName);
    assembledJourney.push(stationInfoBundler(commonName, naptanId, lat, lon, arrivalTime));
  } else {
    console.log('Skipped station (missing data):', station.commonName || station.name || 'unnamed');
  }
}  

console.log('Final assembledJourney length before OpenAI:', assembledJourney.length);
console.log('Array being sent to OpenAI:', JSON.stringify(assembledJourney, null, 2));

const openAIResponse = await getJourneyRecommendations(assembledJourney);

console.log('Raw OpenAI response length:', openAIResponse.length);
console.log('Raw OpenAI response:', openAIResponse);
console.log('OpenAI response received, assembledJourney length after:', assembledJourney.length);


try {
  const enhancedJourney = JSON.parse(openAIResponse);
  console.log('Successfully parsed OpenAI response, sending enhanced journey with', enhancedJourney.length, 'stations');
  res.json(enhancedJourney);
} catch (parseError) {
  console.error('Failed to parse OpenAI response as JSON:', parseError);
  console.log('Falling back to original journey data');
  res.json(assembledJourney);
}
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }

};

const getStations = async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await tflservice.TFLAPICall(from, to, time, date, type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }
}
//tania code
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
    const journeyData = await tflservice.getJourney(from, to);
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
}

//--------------------------------------
// Ivon's code: Station Suggestions (TFL 300 response)
//--------------------------------------

const suggestStations = async (req, res) => {
  const { stationName } = req.body; // Reads "user station's name input" from the request body
  try {
    const suggestions = await tflservice.getStationSuggestions(stationName, false); // flag to set to false for real API
    res.json({ suggestions }); // Sends suggestions back to the client
  } catch (error) {
    res.status(500).json({ message: 'Error fetching station suggestions', error: error.message });
  }
};



export {
  getStations,//justin code
  getJourney,//justin code
 getJourneyWithAI,//tania code
 suggestStations, // added export for suggestStations
};

