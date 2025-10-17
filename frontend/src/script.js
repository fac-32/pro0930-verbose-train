import { startTrainAnimation } from './train-loader.js';
startTrainAnimation('train-loader');

// Get references to the station input elements
const startInput = document.getElementById('start-station');
const endInput = document.getElementById('end-station');

document.getElementById('search-journey').addEventListener('click', async () => {
    console.log('button clicked');

    // validation: check for input on both fields
    const from = startInput.dataset.searchableName;
    const to = endInput.dataset.searchableName;
    if (from === undefined || to === undefined) {
        alert('Please select both a start and end station from the dropdowns.');
        return;
    }
    
    const tubeFrame = document.getElementById('tube-frame');
    tubeFrame.style.display = 'block';

    const message = {
        type: 'journeySearch',
        from: from,
        to: to
    };

    tubeFrame.contentWindow.postMessage(message, '*');
});

function renderJourneyData(data) {
    // keep for reference
    // return data.map(station => `<p>${station.commonName} (${station.naptanId}) - Lat: ${station.lat}, Lon: ${station.lon}</p>`).join('');
    return data.map(station => station.commonName);
}

function appendDisplayChild (parentId, childId, textContent) {
    const childP = document.createElement('p');
    childP.id = childId;
    childP.textContent = textContent;
    const parentEl = document.getElementById(parentId);
    parentEl.style.display = 'block';
    parentEl.appendChild(childP);
}

document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotContainer = document.querySelector('.tube-chatbot-container');

    const chatIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    chatbotToggleButton.innerHTML = chatIcon;

    chatbotToggleButton.addEventListener('click', () => {
        const isVisible = chatbotContainer.classList.toggle('visible');
        chatbotToggleButton.innerHTML = isVisible ? closeIcon : chatIcon;
    });

    const appendMessage = (sender, text) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerText = text;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return messageElement;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage('user', messageText);
        userInput.value = '';

        const thinkingMessage = appendMessage('bot', '');
        thinkingMessage.classList.add('thinking');
        thinkingMessage.innerHTML = '<span>.</span><span>.</span><span>.</span>';

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: messageText }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from the server.');
            }

            const data = await response.json();
            const botResponse = data.message.content;

            thinkingMessage.classList.remove('thinking');
            thinkingMessage.innerText = botResponse;
            chatWindow.scrollTop = chatWindow.scrollHeight;

        } catch (error) {
            thinkingMessage.classList.remove('thinking');
            thinkingMessage.innerText = 'Sorry, something went wrong. Please try again.';
            thinkingMessage.style.color = 'red';
        }
    });
});


// Debounce function to prevent excessive API calls
// This creates a delay between user typing and API call
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        // Clear previous timeout if it exists
        clearTimeout(timeoutId);
        // Set new timeout
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Main function to handle fuzzy search
async function handleFuzzySearch(inputElement, searchTerm) {
    // Don't search if term is too short
    if (searchTerm.length < 2) {
        const existingDropdown = inputElement.parentElement.querySelector('.suggestions-dropdown');
        if (existingDropdown) existingDropdown.remove();
        return;
    }
    
    try {
        fetch(`/api/suggest-stations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({searchTerm}),

        })
        .then(response => response.json())
        .then(data => {
            // console.log('handle fuzzy search, then block, before data handling')
            // console.log(data.suggestions);
            showSuggestions(inputElement, data.suggestions);
        })
    } catch (error) {
        console.error('Fuzzy search error:', error);
    }
}

// Function to display suggestion dropdown
function showSuggestions(inputElement, suggestions) {
    console.log('show suggestions function');
    // Remove existing dropdown if any
    const existingDropdown = inputElement.parentElement.querySelector('.suggestions-dropdown');
    if (existingDropdown) existingDropdown.remove();

    // Create new dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'suggestions-dropdown';

    // Add each suggestion to the dropdown
    suggestions.forEach(station => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.textContent = station.name;
        // Store searchable name as data attribute
        suggestion.dataset.searchableName = station.icsId;
        
        // Handle click on suggestion
        suggestion.addEventListener('click', () => {
            inputElement.value = station.name;
            // Store searchable name in input's dataset
            inputElement.dataset.searchableName = station.icsId;
            dropdown.remove();
        });

        dropdown.appendChild(suggestion);
    });

    // Add dropdown to DOM
    inputElement.parentElement.appendChild(dropdown);
}

// Create debounced version of search function
const debouncedSearch = debounce(handleFuzzySearch, 1000); // 1 second delay

// Add input event listeners to both station inputs
[startInput, endInput].forEach(input => {
    input.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        debouncedSearch(e.target, searchTerm);
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
