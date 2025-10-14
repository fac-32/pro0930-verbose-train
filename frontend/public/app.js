document.addEventListener('DOMContentLoaded', () => {
    // --- Journey Planner Elements ---
    const fromInput = document.getElementById('from-input');
    const toInput = document.getElementById('to-input');
    const submitJourneyButton = document.getElementById('submit-journey');
    const journeyResponseContainer = document.getElementById('journey-response-container');
    const journeyLoader = document.getElementById('journey-loader');

    // --- Chatbot Elements ---
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const closeChatbotButton = document.getElementById('close-chatbot-button');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');
    const aiLoader = document.getElementById('loader');

    // --- Map Initialization ---
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

            const startPoint = journeyData[0];
            const endPoint = journeyData[journeyData.length - 1];
            L.marker([startPoint.lat, startPoint.lon]).addTo(journeyLayerGroup)
                .bindPopup(`<b>Start:</b> ${startPoint.commonName}`)
                .openPopup();
            L.marker([endPoint.lat, endPoint.lon]).addTo(journeyLayerGroup)
                .bindPopup(`<b>End:</b> ${endPoint.commonName}`);
        }
    };

    const fetchAndDisplayJourney = async () => {
        const from = fromInput.value;
        const to = toInput.value;

        if (!from || !to) {
            alert('Please enter both a starting point and a destination.');
            return;
        }

        journeyLoader.style.display = 'block';
        journeyResponseContainer.innerHTML = '';
        submitJourneyButton.disabled = true;

        try {
            const response = await fetch(`/api/tfl/journey-with-ai?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
            if (!response.ok) throw new Error('Failed to get response from the server.');

            const data = await response.json();
            journeyResponseContainer.textContent = data.summary;
            if (data.journey) {
                displayJourneyOnMap(data.journey);
            }
        } catch (error) {
            journeyResponseContainer.textContent = error.message;
            journeyResponseContainer.style.color = 'red';
        } finally {
            journeyLoader.style.display = 'none';
            submitJourneyButton.disabled = false;
        }
    };

    // --- Chatbot Logic ---
    const addMessageToChat = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to bottom
    };

    const handleChatMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessageToChat(userMessage, 'user');
        chatInput.value = '';
        aiLoader.style.display = 'block';
        sendChatButton.disabled = true;

        try {
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage }),
            });

            if (!response.ok) throw new Error('The AI is taking a nap. Please try again later.');

            const data = await response.json();
            const botMessage = data.message.content;
            addMessageToChat(botMessage, 'bot');

        } catch (error) {
            addMessageToChat(error.message, 'bot');
        } finally {
            aiLoader.style.display = 'none';
            sendChatButton.disabled = false;
        }
    };

    // --- Event Listeners ---
    submitJourneyButton.addEventListener('click', fetchAndDisplayJourney);
    sendChatButton.addEventListener('click', handleChatMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleChatMessage();
        }
    });

    chatbotToggleButton.addEventListener('click', () => {
        chatbotPopup.classList.toggle('hidden');
    });

    closeChatbotButton.addEventListener('click', () => {
        chatbotPopup.classList.add('hidden');
    });

    // Add a welcome message to the chatbot
    addMessageToChat("Hello! I'm your AI travel assistant. Ask me for ideas, or plan a journey on the left!", 'bot');
});