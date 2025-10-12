// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

//------------------
// Justin code
//------------------

import fetch from 'node-fetch';

const TFL_API_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults/';

const TFL_API_KEY = process.env.TFL_API_KEY;



const getStopPoints = async (date, from, to, time) => {
  // Placeholder for TfL API call

};

const TFLAPICall = async (from, to, time, date) => {
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
    
    console.log('TFL Response Status:', response.status);
    
    const data = JSON.parse(responseText);
    
    if (response.status === 300 && data.disambiguationOptions) {
      console.log('Multiple station matches found:');
      data.disambiguationOptions.forEach(option => {
        console.log('  -', option.description || option.matchValue);
      });
    }
    
    return {
      status: response.status,
      data: data
    };
    
  } catch (error) {
    console.error('Error fetching journey:', error);
    throw error;
  }
}

export { getStopPoints, TFLAPICall };




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
