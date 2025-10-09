
// import tflService from '../services/tflService.js';

// const getStopPoints = async (req, res) => {
//   try {
//     const { lat, lon } = req.query;
//     if (!lat || !lon) {
//       return res.status(400).json({ message: 'Latitude and longitude are required' });
//     }
//     const data = await tflService.getStopPoints(lat, lon);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching stop points', error: error.message });
//   }
// };

// const getJourney = async (req, res) => {
//   try {
//     const { from, to } = req.query;
//     if (!from || !to) {
//       return res.status(400).json({ message: 'From and to are required' });
//     }
//     const data = await tflService.getJourney(from, to);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching journey', error: error.message });
//   }
// };

// export {
//   getStopPoints,
//   getJourney,
// };



// // https://api.tfl.gov.uk/Journey/JourneyResults/{from}/to/{to}[?via][&nationalSearch][&date][&time][&timeIs][&journeyPreference][&mode][&accessibilityPreference][&fromName][&toName][&viaName][&maxTransferMinutes][&maxWalkingMinutes][&walkingSpeed][&cyclePreference][&adjustment][&bikeProficiency][&alternativeCycle][&alternativeWalking][&applyHtmlMarkup][&useMultiModalCall][&walkingOptimization][&taxiOnlyTrip][&routeBetweenEntrances][&useRealTimeLiveArrivals][&calcOneDirection][&includeAlternativeRoutes][&overrideMultiModalScenario][&combineTransferLegs]



// Import service functions from tflservice.js
import { getStationSuggestions, getJourneyDetails } from '../services/tflservice.js';

/**
 * Controller for station suggestions.
 * Handles POST requests to /api/suggest-stations.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function suggestStations(req, res) {
  // Get stationName from request body
  const { stationName } = req.body;
  // Set simulate to true for dummy data, false for real API
  const suggestions = await getStationSuggestions(stationName, true);
  // Send suggestions as JSON response
  res.json({ suggestions });
}

/**
 * Controller for journey details.
 * Handles POST requests to /api/journey.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function getJourney(req, res) {
  // Get fromStation and toStation from request body
  const { fromStation, toStation } = req.body;
  // Set simulate to true for dummy data, false for real API
  const journey = await getJourneyDetails(fromStation, toStation, true);
  // Send journey details as JSON response
  res.json(journey);
}