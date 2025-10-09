// import fetch from 'node-fetch';

// const TFL_API_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults/';

// const getStopPoints = async (from, to, time) => {
//   // Placeholder for TfL API call

  
//   return Promise.resolve({ message: "TfL StopPoint API call placeholder" });
// };

// const getJourney = async (from, to) => {
//   // Placeholder for TfL API call
//   return Promise.resolve({ message: "TfL Journey API call placeholder" });
// };

// export default {
//   getStopPoints,
//   getJourney,
// };



// Import axios for HTTP requests
import axios from 'axios';
// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Base URL for TfL Journey Planner API
const BASE_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults';
// TfL API key from environment variables
const TFL_API_KEY = process.env.TFL_API_KEY;

/**
 * Returns a list of suggested stations based on user input.
 * If simulate is true, returns dummy data. Otherwise, calls the TfL API.
 * @param {string} stationName - The name entered by the user
 * @param {boolean} simulate - If true, use dummy data; if false, call real API
 * @returns {Array} List of station suggestions
 */

export async function getStationSuggestions(stationName, simulate = true) {
  if (simulate) {
    // Dummy data for development/testing
    return [
      { name: 'Oxford Circus' },
      { name: 'Oxford Road' },
      { name: 'Oxshott' }
    ];
  }
  try {
    // Build the API URL with the station name and API key
    const url = `${BASE_URL}/${encodeURIComponent(stationName)}?key=${TFL_API_KEY}`;
    // Make GET request to TfL API
    const response = await axios.get(url);
    // If TFL returns a 300, suggestions are in response.data.alternatives
    if (response.status === 300 && response.data.alternatives) {
      return response.data.alternatives.map(station => ({
        name: station.placeName
      }));
    }
    // If exact match, return single station
    if (response.status === 200 && response.data.journeys) {
      return [{ name: stationName }];
    }
    // If no match, return empty array
    return [];
  } catch (error) {
    // On error, return dummy data for development
    return [
      { name: 'Oxford Circus' },
      { name: 'Oxford Road' },
      { name: 'Oxshott' }
    ];
  }
}

/**
 * Returns journey details between two confirmed stations.
 * If simulate is true, returns dummy data. Otherwise, calls the TfL API.
 * @param {string} fromStation - The starting station
 * @param {string} toStation - The destination station
 * @param {boolean} simulate - If true, use dummy data; if false, call real API
 * @returns {Object} Journey details including intermediate stops
 */
export async function getJourneyDetails(fromStation, toStation, simulate = true) {
  if (simulate) {
    // Dummy data for development/testing
    return {
      from: fromStation,
      to: toStation,
      journey: ['Oxford Circus', 'Bond Street', 'Baker Street', toStation]
    };
  }
  try {
    // Build the API URL with the station names and API key
    const url = `${BASE_URL}/${encodeURIComponent(fromStation)}/to/${encodeURIComponent(toStation)}?key=${TFL_API_KEY}`;
    // Make GET request to TfL API
    const response = await axios.get(url);
    // If successful, extract journey details
    if (response.status === 200 && response.data.journeys) {
      const journey = response.data.journeys[0];
      // Flatten all stop points from all legs of the journey
      const stops = journey.legs.flatMap(leg => leg.path.stopPoints.map(stop => stop.name));
      return {
        from: fromStation,
        to: toStation,
        journey: stops
      };
    }
    // If no journey found, return empty journey
    return { from: fromStation, to: toStation, journey: [] };
  } catch (error) {
    // On error, return dummy data for development
    return {
      from: fromStation,
      to: toStation,
      journey: ['Oxford Circus', 'Bond Street', 'Baker Street', toStation]
    };
  }
}