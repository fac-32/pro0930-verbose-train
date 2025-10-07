console.log('Loading: services/googleMapsService.js');
import fetch from 'node-fetch';

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

const getNearbyPlaces = async (latitude, longitude) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    console.error('Google Maps API key is not configured.');
    // Return an empty array or a specific message if the key is missing
    return [];
  }

  // Search for a few different types of places to get a good mix.
  // We can make this more dynamic later.
  const radius = 1500; // 1.5km radius
  const types = ['tourist_attraction', 'restaurant', 'cafe', 'park'];

  try {
    const searchPromises = types.map(type => {
      const url = `${GOOGLE_MAPS_API_URL}?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;
      return fetch(url).then(res => res.json());
    });

    const results = await Promise.all(searchPromises);

    // Combine and deduplicate results
    const allPlaces = results.flatMap(result => result.results || []);
    const uniquePlaces = Array.from(new Map(allPlaces.map(place => [place.place_id, place])).values());

    // We only need a few key details for the prompt
    return uniquePlaces.map(place => ({
      name: place.name,
      types: place.types,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      vicinity: place.vicinity,
    })).slice(0, 10); // Limit to the top 10 unique places

  } catch (error) {
    console.error('Error fetching data from Google Places API:', error);
    return []; // Return empty array on error
  }
};

export default {
  getNearbyPlaces,
};
