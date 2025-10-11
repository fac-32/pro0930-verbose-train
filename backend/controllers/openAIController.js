import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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


export { getOpenAIResponse };