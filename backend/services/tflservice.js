import fetch from 'node-fetch';

const TFL_API_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults';
const STOPPOINT_URL = 'https://api.tfl.gov.uk/StopPoint';
const TFL_API_KEY = process.env.TFL_API_KEY;

console.log('Loading: services/tflService.js');

/**
 * Simple helper to perform a journey request and handle disambiguation responses.
 */
const getJourney = async (from, to) => {
  // Build initial journey URL (TfL expects encoded path segments)
  let journeyUrl = `${TFL_API_URL}/${encodeURIComponent(from)}/to/${encodeURIComponent(to)}`;

  try {
    let response = await fetch(journeyUrl);
    let data = await response.json();

    // If TfL returns a DisambiguationResult, refine the from/to parameters and call again
    if (data && data.$type && String(data.$type).includes('DisambiguationResult')) {
      // Resolve 'from' ambiguity (prefer StopPoint)
      let fromId = from;
      if (data.fromLocationDisambiguation && data.fromLocationDisambiguation.disambiguationOptions) {
        const fromOption =
          data.fromLocationDisambiguation.disambiguationOptions.find(o => o.place && o.place.placeType === 'StopPoint') ||
          data.fromLocationDisambiguation.disambiguationOptions[0];
        if (fromOption && fromOption.parameterValue) fromId = fromOption.parameterValue;
      }

      // Resolve 'to' ambiguity (prefer StopPoint)
      let toId = to;
      if (data.toLocationDisambiguation && data.toLocationDisambiguation.disambiguationOptions) {
        const toOption =
          data.toLocationDisambiguation.disambiguationOptions.find(o => o.place && o.place.placeType === 'StopPoint') ||
          data.toLocationDisambiguation.disambiguationOptions[0];
        if (toOption && toOption.parameterValue) toId = toOption.parameterValue;
      }

      // Second, more specific API call
      console.log(`Disambiguation required. New call with From ID: ${fromId}, To ID: ${toId}`);
      journeyUrl = `${TFL_API_URL}/${encodeURIComponent(fromId)}/to/${encodeURIComponent(toId)}`;
      response = await fetch(journeyUrl);
      data = await response.json();
    }

    return data;
  } catch (error) {
    console.error('Error fetching journey from TfL API:', error);
    throw new Error('Failed to fetch journey from TfL API');
  }
};

/**
 * Fetch station location for a given naptanId.
 */
const getStationLocation = async (naptanId) => {
  if (!naptanId) throw new Error('naptanId is required');

  const fullURL = `${STOPPOINT_URL}/${encodeURIComponent(naptanId)}?app_key=${encodeURIComponent(TFL_API_KEY || '')}`;

  try {
    const response = await fetch(fullURL);
    if (!response.ok) {
      throw new Error(`Station request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching station location:', error);
    throw error;
  }
};

/**
 * Top-level TFL API call wrapper used elsewhere in your code.
 * Returns an object { status, data } to make response handling explicit.
 */
const TFLAPICall = async (from, to, time, date, mode = 'tube') => {
  // Build base URL and params
  const URL = `${TFL_API_URL}/${encodeURIComponent(from)}/to/${encodeURIComponent(to)}`;

  const params = new URLSearchParams({
    app_key: TFL_API_KEY || '',
    mode,
  });

  if (date) params.append('date', date);
  if (time) params.append('time', time);
  if (date && time) params.append('timeIs', 'Departing');

  const fullURL = `${URL}?${params.toString()}`;

  console.log('Fetching from TFL:', fullURL);

  try {
    const response = await fetch(fullURL);
    const responseText = await response.text();

    let parsed = null;
    try {
      parsed = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      // parsing failed — keep parsed null and continue
      console.warn('Failed to parse TFL response as JSON:', parseError);
    }

    return {
      status: response.status,
      data: parsed,
    };
  } catch (error) {
    console.error('Error fetching journey:', error);
    throw error;
  }
};

export { TFLAPICall, getStationLocation, getJourney };
