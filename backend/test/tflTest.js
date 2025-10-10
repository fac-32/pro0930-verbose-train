// Test script to simulate user input and API calls (ES Modules, fully commented).

// Import service functions from tflservice.js
import { getStationSuggestions, getJourneyDetails } from '../services/tflservice.js';

async function test() {
  // Simulate user input for two stations
  const stationInput1 = 'hendo central';
  const stationInput2 = 'finsbury';

  // Get suggestions for both inputs (simulate = true for dummy data)
  const suggestions1 = await getStationSuggestions(stationInput1, true);
  const suggestions2 = await getStationSuggestions(stationInput2, true);

  console.log('Suggestions for input 1:', suggestions1);
  console.log('Suggestions for input 2:', suggestions2);

  // Simulate user selecting the first suggestion from each
  const selectedStation1 = suggestions1[0].name;
  const selectedStation2 = suggestions2[0].name;

  // Get journey details (simulate = true for dummy data)
  const journey = await getJourneyDetails(selectedStation1, selectedStation2, true);
  console.log('Journey (dummy):', journey);

  // To test real API, set simulate to false (requires valid API key in .env)
  // const realSuggestions1 = await getStationSuggestions(stationInput1, false);
  // const realJourney = await getJourneyDetails(selectedStation1, selectedStation2, false);
  // console.log('Real API suggestions:', realSuggestions1);
  // console.log('Real API journey:', realJourney);
}

test();




// Note: Uncomment the real API calls after ensuring your .env has a valid TFL_API_KEY
// and you want to test against the live TfL API.
// Also, handle errors as needed in production code.
// This test script demonstrates the flow of getting station suggestions
// and then fetching journey details based on user selections.
// Run this script with Node.js (ensure ES module support in your environment)
// e.g., node --experimental-modules backend/test/tflTest.js
// End of backend/test/tflTest.js