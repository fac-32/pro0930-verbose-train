document.addEventListener('DOMContentLoaded', () => {
    // --- Chatbot Elements ---
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const closeChatbotButton = document.getElementById('close-chatbot-button');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');
    const aiLoader = document.getElementById('loader');

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