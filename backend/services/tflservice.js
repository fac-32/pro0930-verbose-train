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