// Test script to simulate user input and API calls 
// This test script demonstrates the flow of getting station suggestions
// and then fetching journey details based on user selections.
// Run this script with Node.js 

// Import service functions from tflservice.js
// import { getStationSuggestions, getJourneyDetails } from '../services/tflservice.js';
import { getStationSuggestions } from '../services/tflservice.js';


async function test() {
  // Simulate user input for two stations
  const stationInput1 = 'Oxford Circus';
  const stationInput2 = 'Victoria';

  // Get suggestions for both inputs (simulate = true for dummy data)
  const suggestions1 = await getStationSuggestions(stationInput1, false); //To test with the real API, change true to false 
  const suggestions2 = await getStationSuggestions(stationInput2, false); //To test with the real API, change true to false 

  console.log('Suggestions for input 1:', suggestions1);
  console.log('Suggestions for input 2:', suggestions2); 



//------------------------------------------------------
// Uncomment below to test with real API calls - set simulate to false
//------------------------------------------------------------ 

  // const realSuggestions1 = await getStationSuggestions(stationInput1, false);
  // const realJourney = await getJourneyDetails(selectedStation1, selectedStation2, false);
  // console.log('Real API suggestions:', realSuggestions1);
  // console.log('Real API journey:', realJourney);
}

test();






