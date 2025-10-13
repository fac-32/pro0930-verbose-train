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

    const fetchAndDisplay = async (url, options, loaderElement, responseElement, buttonElement, processData) => {
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
            (data) => data.summary
        );
    });
});