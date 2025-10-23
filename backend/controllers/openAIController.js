import openai from '../lib/OpenAIClient.js';



const getOpenAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    res.json(completion.choices[0]);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ message: 'Failed to get response from OpenAI', error: error.message });
  }
};


const getJourneyRecommendations = async (assembledJourney) => {
  try {
    const prompt = `You are an expert in London attractions. A user is making a journey on the London Underground
    as per information in the array below. Each element of the array represents a station. Suggest 10 interesting events, activities,
    or places that the user could visit near these stations, making sure that they have enough time to get to the relevant location from the station. Only
    the first and last stations contain arrival times, use this to estimate the user's time of arrival at all other stations.
    Each suggestion should include the name of the event / place, a brief description (no more than 25 words), its location in longitude and latitude, and
    the approximate walking time from the station. Deliver each recommendation as an object in the array of the placeOfInterest property of its
    nearest station, as in the journey array below. If there are multiple recommendations near each station, add a second placeOfInterest object within
    the placeOfInterest value array. placeOfInterest objects should have the following properties: name, description, longitude, latitude, walkTime, startTime.
    The following text is the array of the journey. Do not remove stations from the array, return it with the amendments as requested and no other text: ${JSON.stringify(assembledJourney)}
    If are experiencing an error where you must remove stations due to a token limit, send a response indicating so`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// export const getOpenAIResponse = async (req, res) => {
//   try {
//     const { stops } = req.body;
//     if (!stops || !Array.isArray(stops) || stops.length === 0) {
//       return res.status(400).json({ message: 'An array of stops is required' });
//     }

//     const prompt = `Given these London journey stops: ${stops.join(', ')}, suggest interesting points of interest for a traveler at each stop.`;

//     const completion = await openai.chat.completions.create({
//       messages: [{ role: 'user', content: prompt }],
//       model: 'gpt-3.5-turbo',
//     });

//     res.json({ suggestions: completion.choices[0].message.content.trim() });
//   } catch (error) {
//           console.error('Error calling OpenAI API:', error);
//           res.status(500).json({ message: 'Failed to get response from OpenAI', error: error.message });//   }
// };


export { getOpenAIResponse, getJourneyRecommendations };