import fetch from 'node-fetch';

const TFL_API_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults/';

const date = 20251007
const from = 'Finsbury Park Station'
const to = 'Bank Station'
const time = '1700'

const TFL_API_KEY = process.env.TFL_API_KEY;



const getStopPoints = async (date, from, to, time) => {
  // Placeholder for TfL API call

};

const getJourney = async (from, to) => {
  // Placeholder for TfL API call
  const URL = `${TFL_API_URL}/${encodeURIComponent(from)}/to/${encodeURIComponent(to)}}`

  const params = new URLSearchParams({
    app_key: TFL_API_KEY
  });

  if (date) params.append('date', date);

  if (time) params.append('time', time);

  if (date && time) params.append('timeIs', 'Departing');

  params.append('mode', 'tube');

  const fullURL = `${URL}?${params.toString()}`

  await fetch (fullURL) {
    
  }

};

export default {
  getStopPoints,
  getJourney,
};