console.log('Loading: services/tflService.js');
// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import fetch from 'node-fetch';

const TFL_API_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults/';

const TFL_API_KEY = process.env.TFL_API_KEY;

// //tania code
// const getJourney = async (from, to) => {
//   let journeyUrl = `${TFL_API_URL}/Journey/JourneyResults/${from}/to/${to}`;

//   try {
//     let response = await fetch(journeyUrl);
//     let data = await response.json();

//     // Check if the API returned a disambiguation result
//     if (data && data.$type && data.$type.includes('DisambiguationResult')) {
//       // --- Handle 'from' location ambiguity ---
//       let fromId = from;
//       if (data.fromLocationDisambiguation && data.fromLocationDisambiguation.disambiguationOptions) {
//         // Find the best match, prioritizing stations
//         const fromOption = data.fromLocationDisambiguation.disambiguationOptions.find(o => o.place.placeType === 'StopPoint') || data.fromLocationDisambiguation.disambiguationOptions[0];
//         if (fromOption) {
//           fromId = fromOption.parameterValue;
//         }
//       }

//       // --- Handle 'to' location ambiguity ---
//       let toId = to;
//       if (data.toLocationDisambiguation && data.toLocationDisambiguation.disambiguationOptions) {
//         // Find the best match, prioritizing stations
//         const toOption = data.toLocationDisambiguation.disambiguationOptions.find(o => o.place.placeType === 'StopPoint') || data.toLocationDisambiguation.disambiguationOptions[0];
//         if (toOption) {
//           toId = toOption.parameterValue;
//         }
//       }

//       // --- Make the second, more specific API call ---
//       console.log(`Disambiguation required. New call with From ID: ${fromId}, To ID: ${toId}`);
//       journeyUrl = `${TFL_API_URL}/Journey/JourneyResults/${fromId}/to/${toId}`;
//       response = await fetch(journeyUrl);
//       data = await response.json();
//     }

//     return data;

//   } catch (error) {
//     console.error('Error fetching journey from TfL API:', error);
//     throw new Error('Failed to fetch journey from TfL API');
//   }
// };

//justin code
const getStationLocation = async (naptanId) => {
  const url = `https://api.tfl.gov.uk/StopPoint/${naptanId}?app_key=${TFL_API_KEY}`;
  
  console.log(`Fetching station details for: ${naptanId}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Station Request failed!');
    }
    
    const data = await response.json();
    
    return {
      commonName: data.commonName,
      naptanId: data.naptanId,
      lat: data.lat,
      lon: data.lon
    };
    
  } catch (error) {
    console.error('Error fetching station details:', error.message);
    throw error;
  }
};

//justin code
const TFLAPICall = async (from, to, time, date) => {
 
  // implement if statement that separates 300 response and action from 200 response
  // and action
 
  const URL = `${TFL_API_URL}/${encodeURIComponent(from)}/to/${encodeURIComponent(to)}`;

  const params = new URLSearchParams({
    app_key: TFL_API_KEY,
    mode: 'tube'
  });

  if (date) params.append('date', date);
  if (time) params.append('time', time);
  if (date && time) params.append('timeIs', 'Departing');

  const fullURL = `${URL}?${params.toString()}`;
  
  console.log('Fetching from TFL:', fullURL);

  try {
    const response = await fetch(fullURL);
    const responseText = await response.text();

    if (response.status === 200) {
       
      const data = JSON.parse(responseText);

      return {
      status: response.status,
      data: data
    };
    }
    
    console.log('TFL Response Status:', response.status);
    
  } catch (error) {
    console.error('Error fetching journey:', error);
    throw error;
  }
}


// -------------------
// Ivon's code: Station Suggestions (TFL 300 response)
// -------------------

/**
 * Returns a list of suggested stations based on user input.
 * If simulate is true, returns dummy data. Otherwise, calls the TfL API and handles 300 response.
 * @param {string} stationName - The name entered by the user
 * @param {boolean} simulate - If true, use dummy data; if false, call real API
 * @returns {Array} List of station suggestions
 */

export async function getStationSuggestions(stationName, simulate = false) {
  if (simulate) {
    // Dummy data for development/testing
    return [
      { name: 'Oxford Circus Underground Station' },
      { name: 'Victoria Underground Station' }
    ];
  }
  try {
    // Use Justin's variable names and node-fetch
    // const url = `${TFL_API_URL}/${encodeURIComponent(stationName)}?app_key=${TFL_API_KEY}&mode=tube`; // this is not the right API to suggest stations
    const url = `https://api.tfl.gov.uk/StopPoint/Search/${encodeURIComponent(stationName)}?app_key=${TFL_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // lines for debugging:
    console.log('TfL API response status:', response.status);
    console.log('TfL API response data:', data);


    // Filter for tube/underground stations only, placeType StopPoint, and use commonName if available
    if (response.status === 200 && Array.isArray(data.matches)) {
      // Debug: log each match to inspect properties
      data.matches.forEach(match => {
        console.log('name:', match.name);
        console.log('modes:', match.modes);
        console.log('type:', match.type);
        console.log('placeType:', match.placeType);
      });

      return data.matches
        .filter(match =>
          Array.isArray(match.modes) &&
          match.modes.includes('tube')
          // Uncomment below if you confirm placeType or type is present and correct
          // && (match.placeType === 'StopPoint' || match.type === 'StopPoint')
        )
        .map(match => ({
          name: match.commonName || match.name
        }));
    }
    return [];
  } catch (error) {
    // On error, return dummy data for development
    return [
      { name: 'Oxford Circus Underground Station' },
      { name: 'Victoria Underground Station' }
    ];
  }
}


//exports
export { 

getJourney,
TFLAPICall,
getStationLocation

};