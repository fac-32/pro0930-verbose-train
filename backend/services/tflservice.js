console.log('Loading: services/tflService.js');
import fetch from 'node-fetch';

const TFL_API_URL = 'https://api.tfl.gov.uk';

const getStopPoints = async (lat, lon) => {
  // Placeholder for TfL API call
  return Promise.resolve({ message: "TfL StopPoint API call placeholder" });
};

const getJourney = async (from, to) => {
  let journeyUrl = `${TFL_API_URL}/Journey/JourneyResults/${from}/to/${to}`;

  try {
    let response = await fetch(journeyUrl);
    let data = await response.json();

    // Check if the API returned a disambiguation result
    if (data && data.$type && data.$type.includes('DisambiguationResult')) {
      // --- Handle 'from' location ambiguity ---
      let fromId = from;
      if (data.fromLocationDisambiguation && data.fromLocationDisambiguation.disambiguationOptions) {
        // Find the best match, prioritizing stations
        const fromOption = data.fromLocationDisambiguation.disambiguationOptions.find(o => o.place.placeType === 'StopPoint') || data.fromLocationDisambiguation.disambiguationOptions[0];
        if (fromOption) {
          fromId = fromOption.parameterValue;
        }
      }

      // --- Handle 'to' location ambiguity ---
      let toId = to;
      if (data.toLocationDisambiguation && data.toLocationDisambiguation.disambiguationOptions) {
        // Find the best match, prioritizing stations
        const toOption = data.toLocationDisambiguation.disambiguationOptions.find(o => o.place.placeType === 'StopPoint') || data.toLocationDisambiguation.disambiguationOptions[0];
        if (toOption) {
          toId = toOption.parameterValue;
        }
      }

      // --- Make the second, more specific API call ---
      console.log(`Disambiguation required. New call with From ID: ${fromId}, To ID: ${toId}`);
      journeyUrl = `${TFL_API_URL}/Journey/JourneyResults/${fromId}/to/${toId}`;
      response = await fetch(journeyUrl);
      data = await response.json();
    }

    return data;

  } catch (error) {
    console.error('Error fetching journey from TfL API:', error);
    throw new Error('Failed to fetch journey from TfL API');
  }
};

export default {
  getStopPoints,
  getJourney,
};