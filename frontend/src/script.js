import { startTrainAnimation } from './train-loader.js';
import { renderCardTemplate, renderJouenryHeaderTemplate } from './render-templates.js';

// Get references to the station input elements
const startInput = document.getElementById('start-station');
const endInput = document.getElementById('end-station');

function renderJourneyData (data) {
    const elWrapper = document.getElementById('journey-result-wrapper');
    data.forEach(stop => {
        const wrapperDiv = document.createElement('div');
        elWrapper.appendChild(renderCardTemplate(wrapperDiv, stop));
    })
}

// dummy data for journey result rendering
const DUMMY = [
    {
        commonName: 'Oxford Circus Underground Station',
        pointsOfInterest: [{ name: 'Oxford Circus 1', description: 'description 1'}, { name: 'Oxford Circus 2', description: 'description 2'}],
        arrivalTime: "15:39",
        line: 'Victoria'
    },
    {
        commonName: 'Green Park Underground Station',
        pointsOfInterest: [{ name: 'Green Park 1', description: 'description 3'}, { name: 'Green Park 2', description: 'description 4'}],
        line: 'Victoria'
    },
    {
        commonName: 'Victoria',
        pointsOfInterest: [{ name: 'Victoria 1', description: 'descriptiption 5'}, { name: 'Victoria 2', description: 'descriptiption 6'}],
        arrivalTime: "16:00",
        line: 'Picadilly'
    },
]

function renderJourneyHeader (data) {
    const elWrapper = document.getElementById('journey-result-wrapper');
    const wrapperDiv = document.createElement('div');
    elWrapper.appendChild(renderJouenryHeaderTemplate(wrapperDiv, data));
}

renderJourneyHeader(DUMMY);

document.getElementById('search-journey').addEventListener('click', async () => {
    // validation: check for input on both fields
    const from = startInput.dataset.searchableName;
    const to = endInput.dataset.searchableName;
    if (from === undefined || to === undefined) {
        alert('Please select both a start and end station from the dropdowns.');
        return;
    }

    // DOM clean up on click
    // 1. clear input field
    startInput.value = '';
    endInput.value = '';
    
    // 2. loader animation
    document.getElementById('train-loader').style.display = 'block';
    startTrainAnimation('train-loader');
    
    // 3. prevent duplicate/historic displays
    const existingResults = document.getElementsByClassName('info-card-wrapper');
    console.log(existingResults.length)
    if (existingResults.length > 0) {
        Array.from(existingResults).forEach(el => { el.remove(); })
    }

    try {
        fetch(`api/tfl/journey/${from}/to/${to}`)
        .then(response => response.json())
        .then(data => {
            renderJourneyData(data);
            document.getElementById('train-loader').style.display = 'none';
        })
    } catch (error) {
        console.log(error)
    }
})

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
    
    fetch(`/api/suggest-stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({searchTerm}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.suggestions.length === 0) {
            createNotiBox(inputElement, 'user-typo', "We couldn't find anything. Did you make a typo?");
            return
        }
        showSuggestions(inputElement, data.suggestions);
    })
}

function trimCommonName(name) {
    const phrase = ' Underground Station';
    if (name.endsWith(phrase)) {
        return name.slice(0, -phrase.length);
    }
    return name;
}

// Function to display suggestion dropdown
function showSuggestions(inputElement, suggestions) {
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
        suggestion.textContent = trimCommonName(station.name);
        // Store searchable name as data attribute
        suggestion.dataset.searchableName = station.icsId;
        
        // Handle click on suggestion
        suggestion.addEventListener('click', () => {
            inputElement.value = trimCommonName(station.name);
            // Store icsId under dataset attribute and used for journey search
            // trimming down display name shouldn't affect the actual search
            inputElement.dataset.searchableName = station.icsId;
            dropdown.remove();
        });

        dropdown.appendChild(suggestion);
    });

    // Add dropdown to DOM
    inputElement.parentElement.appendChild(dropdown);
}

function swapInput () {
    const valueHolder = {
        value: startInput.value,
        searchableName: startInput.dataset.searchableName
    };

    startInput.value = endInput.value;
    startInput.dataset.searchableName = endInput.dataset.searchableName;

    endInput.value = valueHolder.value;
    endInput.dataset.searchableName = valueHolder.searchableName;
}

document.getElementById('swap-btn').addEventListener('click', swapInput);

// Create debounced version of search function
const debouncedSearch = debounce(handleFuzzySearch, 1000); // 1 second delay

function sanitizeInput(input) {
    const validInput = /^[A-Za-z\s-]*$/;
    return validInput.test(input);
}

function createNotiBox(parentEl, selfId, msgText){
    // prevent multiple boxes
    if (document.getElementById(selfId)) return;

    const message = document.createElement('div');
    message.className = 'custom-pop-up-message';
    message.id = selfId;
    message.textContent = msgText;
    parentEl.insertAdjacentElement('afterend', message);

    // auto remove after 1.5 seconds
    setTimeout(() => {
        document.getElementById(selfId).remove();
    }, 1500)
}

// Add input event listeners to both station inputs
[startInput, endInput].forEach(input => {
    input.addEventListener('input', (e) => {
        // input sanitization: allow only letters, spaces, hyphens
        // remove any invalid characters by replacing them with empty string
        if (!sanitizeInput(e.target.value)) {
            e.target.value = e.target.value.replace(/[^A-Za-z\s-]/g, '');
            createNotiBox(e.target, 'invalid-char-notification', 'Please only input characters, space, or dash.');
        }

        const searchTerm = e.target.value.trim();
        debouncedSearch(e.target, searchTerm);
    });
    input.addEventListener('focusout', () => {
        setTimeout(() => {
            const existingDropdown = document.querySelector('.suggestions-dropdown');
            if (existingDropdown) existingDropdown.remove();
        }, 100)
    })
});

