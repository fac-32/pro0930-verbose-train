import openai from '../lib/OpenAIClient.js';

const getChatbotResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // For now, we'll just send the prompt to OpenAI
    // In the future, this is where we'll add the logic to call the TfL API etc.
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'You are Winston, a helpful and friendly chatbot for the London Underground.' }, { role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    res.json(completion.choices[0]);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ message: 'Failed to get response from OpenAI', error: error.message });
  }
};

export { getChatbotResponse };
