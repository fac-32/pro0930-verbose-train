document.getElementById('submit-journey-search').addEventListener('click', () => {
    console.log('button clicked');

    // this is aligned with the input elements
    // there is no need for a separate validation function given there are only 2 input fields on the frontend
    // and the value used for validtion will be reused below
    // const start = document.getElementById('start-station').dataset.searchableName;
    // const end = document.getElementById('end-station').dataset.searchableName;
    // if (start === undefined || end === undefined) {
    //     alert('Please select both a start and end station from the dropdowns.');
    //     return;
    // }
    
    try {
        // the server should return 1. the whole journey with stops, and 2. the Open ai suggestions
        // presuming the response/data from the server is in an object
        // const response = await fetch(`/some/server/endpoint/${start}/${end}`);
        const response = {
            tflJourney: ['Victoria', 'Green Park', 'Oxford Circus'],
            openAiSuggestions: 'Blah blah blah'
        };
        document.getElementById('intro-placeholder').style.display = 'none';
        appendDisplayChild('tfl-display', 'tfl-p', response.tflJourney);
        appendDisplayChild('open-ai-display', 'open-ai-p', response.openAiSuggestions);
    } catch (error) {
        console.log(error)
    }
})

function appendDisplayChild (parentId, childId, textContent) {
    const childP = document.createElement('p');
    childP.id = childId;
    childP.textContent = textContent;
    const parentEl = document.getElementById(parentId);
    parentEl.style.display = 'block';
    parentEl.appendChild(childP);
}

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
