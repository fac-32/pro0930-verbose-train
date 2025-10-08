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

  console.log('Fetching journey from TFL API...');
fetch('/api/tfl/journey/940gzzluksx/to/940gzzlubnd')
  .then(res => {
    console.log('Response status:', res.status);
    return res.text();
  })
  .then(text => {
    console.log('Full TFL Response:', text);
    try {
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
      
      // If it's a 300, it should have disambiguationOptions
      if (data.disambiguationOptions) {
        console.log('Station choices:', data.disambiguationOptions);
      }
    } catch (e) {
      console.error('Not valid JSON:', text);
    }
  })
  .catch(error => {
    console.error('Error fetching journey:', error);
  });

});


