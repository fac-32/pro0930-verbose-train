const chatBotTemplate = document.createElement('template');
chatBotTemplate.innerHTML = `
    <style>
        /* Import root variables from the main stylesheet */
        :host {
            --primary-color: #4CAF50;
            --secondary-color: #2E7D32;
            --background-color: #E8F5E9;
            --container-background: #FFFFFF;
            --text-color: #333;
            --light-gray: #bdc3c7;
            --accent-color: #f39cc7; /* Using the new accent color */
        }

        .hidden {
            display: none !important;
        }

        .chatbot-toggle-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--secondary-color);
            color: white;
            font-size: 2rem;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .chatbot-popup {
            position: fixed;
            bottom: 6.5rem;
            right: 2rem;
            width: 400px;
            max-width: 90vw;
            z-index: 999;
        }

        /* The container styles are needed here as well */
        .container {
            background-color: var(--container-background);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
        }

        .container h2 {
            color: var(--secondary-color);
            font-size: 1.8rem;
            margin-top: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .container p {
            color: #555;
        }

        .close-chatbot-button {
            background: none;
            border: none;
            font-size: 2rem;
            font-weight: 300;
            color: var(--light-gray);
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }

        .close-chatbot-button:hover {
            color: var(--text-color);
            transform: none;
        }

        .chat-window {
            height: 200px;
            border: 1px solid var(--light-gray);
            border-radius: 5px;
            padding: 1rem;
            overflow-y: auto;
            margin-bottom: 1rem;
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .chat-input-container {
            display: flex;
            gap: 0.5rem;
        }

        .chat-input {
            width: 100%;
            padding: 0.8rem;
            border-radius: 5px;
            border: 1px solid var(--light-gray);
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
            flex-grow: 1;
        }

        .send-chat-button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 0.8rem 1rem;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
        }

        .chat-message {
            padding: 0.75rem 1rem;
            border-radius: 15px;
            max-width: 80%;
            line-height: 1.4;
            white-space: pre-wrap;
        }

        .user-message {
            background-color: var(--accent-color);
            color: white;
            border-bottom-right-radius: 3px;
            align-self: flex-end;
        }

        .bot-message {
            background-color: #f1f0f0;
            color: var(--text-color);
            border-bottom-left-radius: 3px;
            align-self: flex-start;
        }

        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 1.5rem auto;
            display: none; /* Hidden by default */
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>

    <!-- Chatbot Popup -->
    <div class="chatbot-popup hidden">
        <div class="container ai-container">
            <h2>
                Chat with our AI
                <button class="close-chatbot-button">&times;</button>
            </h2>
            <p>Your AI-powered travel assistant.</p>
            <div class="chat-window">
                <!-- Chat messages will appear here -->
            </div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" placeholder="Ask for travel ideas...">
                <button class="send-chat-button">Send</button>
            </div>
            <div class="loader ai-loader"></div>
        </div>
    </div>

    <!-- Chatbot Toggle Button -->
    <button class="chatbot-toggle-button">🤖</button>
`;

class ChatBot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(chatBotTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this.chatbotPopup = this.shadowRoot.querySelector('.chatbot-popup');
        this.chatbotToggleButton = this.shadowRoot.querySelector('.chatbot-toggle-button');
        this.closeChatbotButton = this.shadowRoot.querySelector('.close-chatbot-button');
        this.chatWindow = this.shadowRoot.querySelector('.chat-window');
        this.chatInput = this.shadowRoot.querySelector('.chat-input');
        this.sendChatButton = this.shadowRoot.querySelector('.send-chat-button');
        this.aiLoader = this.shadowRoot.querySelector('.ai-loader');

        this.chatbotToggleButton.addEventListener('click', () => {
            this.chatbotPopup.classList.toggle('hidden');
        });

        this.closeChatbotButton.addEventListener('click', () => {
            this.chatbotPopup.classList.add('hidden');
        });

        this.sendChatButton.addEventListener('click', () => this.handleChatMessage());
        this.chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleChatMessage();
            }
        });

        this.addMessageToChat("Hello! I'm your AI travel assistant. Ask me for ideas, or plan a journey on the left!", 'bot');
    }

    addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        this.chatWindow.appendChild(messageElement);
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight; // Auto-scroll to bottom
    }

    async handleChatMessage() {
        const userMessage = this.chatInput.value.trim();
        if (!userMessage) return;

        this.addMessageToChat(userMessage, 'user');
        this.chatInput.value = '';
        this.aiLoader.style.display = 'block';
        this.sendChatButton.disabled = true;

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
            this.addMessageToChat(botMessage, 'bot');

        } catch (error) {
            this.addMessageToChat(error.message, 'bot');
        } finally {
            this.aiLoader.style.display = 'none';
            this.sendChatButton.disabled = false;
        }
    }
}

customElements.define('chat-bot', ChatBot);