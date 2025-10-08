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
});


// document.addEventListener('DOMContentLoaded', () => {
//   const stopsInput = document.getElementById('prompt-input');
//   const submitButton = document.getElementById('submit-prompt');
//   const responseContainer = document.getElementById('response-container');
//   const loader = document.getElementById('loader');

//   submitButton.addEventListener('click', async () => {
//     const stopsRaw = stopsInput.value;
//     if (!stopsRaw.trim()) {
//       alert('Please enter one or more stops separated by commas.');
//       return;
//     }

//     // Convert the textarea value to a clean array of stops
//     const stops = stopsRaw.split(',')
//       .map(stop => stop.trim())
//       .filter(Boolean);

//     loader.style.display = 'block';
//     responseContainer.innerHTML = '';

//     try {
//       const response = await fetch('/api/openai', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ stops }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to get response from the server.');
//       }

//       const data = await response.json();
//       responseContainer.innerHTML = `<p>${data.suggestions}</p>`;
//     } catch (error) {
//       responseContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
//     } finally {
//       loader.style.display = 'none';
//     }
//   });
// });
