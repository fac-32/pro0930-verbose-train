import fetch from 'node-fetch';

const TFL_API_URL = 'https://api.tfl.gov.uk/Journey/JourneyResults/';

const TFL_API_KEY = process.env.TFL_API_KEY;



const getStopPoints = async (date, from, to, time) => {
  // Placeholder for TfL API call

};

const getStationLocation = async (naptanId) => {
  const url = `https://api.tfl.gov.uk/StopPoint/${naptanId}?app_key=${TFL_API_KEY}`;
  
  console.log(`Fetching station details for: ${naptanId}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Station Request failed!');
    }
    
    const data = await response.json();
    
    return {
      commonName: data.commonName,
      naptanId: data.naptanId,
      lat: data.lat,
      lon: data.lon
    };
    
  } catch (error) {
    console.error('Error fetching station details:', error.message);
    throw error;
  }
};


const TFLAPICall = async (from, to, time, date) => {
 
  // implement if statement that separates 300 response and action from 200 response
  // and action
 
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

    if (response.status === 200) {
       
      const data = JSON.parse(responseText);

      return {
      status: response.status,
      data: data
    };
    }
    
    console.log('TFL Response Status:', response.status);
    
  } catch (error) {
    console.error('Error fetching journey:', error);
    throw error;
  }
}

export { getStopPoints, TFLAPICall, getStationLocation };