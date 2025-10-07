document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  const submitButton = document.getElementById('submit-prompt');
  const responseContainer = document.getElementById('response-container');
  const loader = document.getElementById('loader');

  submitButton.addEventListener('click', async () => {
    const prompt = promptInput.value;
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    loader.style.display = 'block';
    responseContainer.innerHTML = '';

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server.');
      }

      const data = await response.json();
      const message = data.message.content;
      responseContainer.innerHTML = `<p>${message}</p>`;
    } catch (error) {
      responseContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
    } finally {
      loader.style.display = 'none';
    }
  });

  const fromInput = document.getElementById('from-input');
  const toInput = document.getElementById('to-input');
  const submitJourneyButton = document.getElementById('submit-journey');
  const journeyResponseContainer = document.getElementById('journey-response-container');
  const journeyLoader = document.getElementById('journey-loader');

  submitJourneyButton.addEventListener('click', async () => {
    const from = fromInput.value;
    const to = toInput.value;

    if (!from || !to) {
      alert('Please enter both a starting point and a destination.');
      return;
    }

    journeyLoader.style.display = 'block';
    journeyResponseContainer.innerHTML = '';

    try {
      const response = await fetch(`/api/tfl/journey-with-ai?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

      if (!response.ok) {
        throw new Error('Failed to get journey summary from the server.');
      }

      const data = await response.json();
      journeyResponseContainer.innerHTML = `<p>${data.summary}</p>`;
    } catch (error) {
      journeyResponseContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
    } finally {
      journeyLoader.style.display = 'none';
    }
  });
});