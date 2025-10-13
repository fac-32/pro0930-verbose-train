document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt-input');
    const submitPromptButton = document.getElementById('submit-prompt');
    const responseContainer = document.getElementById('response-container');
    const loader = document.getElementById('loader');

    const fromInput = document.getElementById('from-input');
    const toInput = document.getElementById('to-input');
    const submitJourneyButton = document.getElementById('submit-journey');
    const journeyResponseContainer = document.getElementById('journey-response-container');
    const journeyLoader = document.getElementById('journey-loader');

    // Initialize the map
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    let journeyLayerGroup = L.layerGroup().addTo(map);

    const displayJourneyOnMap = (journeyData) => {
        journeyLayerGroup.clearLayers();

        if (journeyData && journeyData.length > 0) {
            const latLngs = journeyData.map(point => [point.lat, point.lon]);
            const polyline = L.polyline(latLngs, { color: 'var(--primary-color)' }).addTo(journeyLayerGroup);
            map.fitBounds(polyline.getBounds());

            // Add markers for start and end points
            const startPoint = journeyData[0];
            const endPoint = journeyData[journeyData.length - 1];
            L.marker([startPoint.lat, startPoint.lon]).addTo(journeyLayerGroup)
                .bindPopup(`<b>Start:</b> ${startPoint.commonName}`)
                .openPopup();
            L.marker([endPoint.lat, endPoint.lon]).addTo(journeyLayerGroup)
                .bindPopup(`<b>End:</b> ${endPoint.commonName}`);
        }
    };

    const fetchAndDisplay = async (url, options, loaderElement, responseElement, buttonElement, processData, postFetchCallback) => {
        loaderElement.style.display = 'block';
        responseElement.textContent = '';
        buttonElement.disabled = true;

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error('Failed to get response from the server.');
            }

            const data = await response.json();
            const message = processData(data);
            responseElement.textContent = message;

            if (postFetchCallback) {
                postFetchCallback(data);
            }
        } catch (error) {
            responseElement.textContent = error.message;
            responseElement.style.color = 'red';
        } finally {
            loaderElement.style.display = 'none';
            buttonElement.disabled = false;
        }
    };

    submitPromptButton.addEventListener('click', () => {
        const prompt = promptInput.value;
        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        fetchAndDisplay(
            '/api/openai',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            },
            loader,
            responseContainer,
            submitPromptButton,
            (data) => data.message.content
        );
    });

    submitJourneyButton.addEventListener('click', () => {
        const from = fromInput.value;
        const to = toInput.value;

        if (!from || !to) {
            alert('Please enter both a starting point and a destination.');
            return;
        }

        fetchAndDisplay(
            `/api/tfl/journey-with-ai?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            {},
            journeyLoader,
            journeyResponseContainer,
            submitJourneyButton,
            (data) => data.summary,
            (data) => {
                if (data.journey) {
                    displayJourneyOnMap(data.journey);
                }
            }
        );
    });
});