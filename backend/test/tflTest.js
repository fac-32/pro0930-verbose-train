// Test script to simulate user input and API calls 
// This test script demonstrates the flow of getting station suggestions
// and then fetching journey details based on user selections.
// Run this script with Node.js 

// Import service functions from tflservice.js
// import { getStationSuggestions, getJourneyDetails } from '../services/tflservice.js';
import { getStationSuggestions } from '../services/tflservice.js';

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter first station name: ', async (stationInput1) => {
  rl.question('Enter second station name: ', async (stationInput2) => {
    const suggestions1 = await getStationSuggestions(stationInput1, false);
    const suggestions2 = await getStationSuggestions(stationInput2, false);

    console.log('Suggestions for input 1:', suggestions1);
    console.log('Suggestions for input 2:', suggestions2);

    rl.close();
  });
});









