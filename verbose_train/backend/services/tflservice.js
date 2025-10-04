import fetch from 'node-fetch';

const TFL_API_URL = 'https://api.tfl.gov.uk';

const getStopPoints = async (lat, lon) => {
  // Placeholder for TfL API call
  return Promise.resolve({ message: "TfL StopPoint API call placeholder" });
};

const getJourney = async (from, to) => {
  // Placeholder for TfL API call
  return Promise.resolve({ message: "TfL Journey API call placeholder" });
};

export default {
  getStopPoints,
  getJourney,
};