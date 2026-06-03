// 1. Identify which AI character was clicked from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const currentBot = urlParams.get('bot') || 'gamer_gf';

const API_KEY = "// 1. Identify which AI character was clicked from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const currentBot = urlParams.get('bot') || 'gamer_gf';

const API_KEY = "AQ.Ab8RN6LrurYa2tYCXcEH7m17DwCZNHiOhy7vqZfwbx84nrS_5w"; // ⚠️ Replace with your free key from Google AI Studio
const API_URL = curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: AQ.Ab8RN6LrurYa2tYCXcEH7m17DwCZNHiOhy7vqZfwbx84nrS_5w' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'{API_KEY}`;

// 2. Set Up Personas (System prompts to make them act like a partner)
const personas = {
    gamer_gf: {
        name: "Anjali",
        prompt: "You are Aria, a funny, competitive, and loving gamer girlfriend. Use modern gaming slang, occasional gaming emojis, and act deeply interested in talking to the user as your partner."
    },
    sweet_bf: {
        name: "Ankush",
        prompt: "You are Ethan, a thoughtful, sweet, and caring boyfriend. You write in a warm, empathetic tone, love asking how the user's day went, and treat them with pure kindness."
    }
};

document.getElementById('bot-name').innerText = personas[currentBot].name;

// 3. Handle sending and displaying messages
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const inputEl = document.getElementById('user-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user-msg');
    inputEl.value = '';

    // Show a loading/typing indicator
    const loadingDiv = appendMessage("Thinking...", 'bot-msg');

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${personas[currentBot].prompt} User says: ${userText}` }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        loadingDiv.remove(); // Remove typing indicator
        appendMessage(aiResponse, 'bot-msg');
    } catch (error) {
        loadingDiv.innerText = "Connection error... try again!";
        console.error(error);
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom
    return msgDiv;
}"; // ⚠️ Replace with your free key from Google AI Studio
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// 2. Set Up Personas (System prompts to make them act like a partner)
const personas = {
    gamer_gf: {
        name: "Aria 🎮",
        prompt: "You are Aria, a funny, competitive, and loving gamer girlfriend. Use modern gaming slang, occasional gaming emojis, and act deeply interested in talking to the user as your partner."
    },
    sweet_bf: {
        name: "Ethan ✨",
        prompt: "You are Ethan, a thoughtful, sweet, and caring boyfriend. You write in a warm, empathetic tone, love asking how the user's day went, and treat them with pure kindness."
    }
};

document.getElementById('bot-name').innerText = personas[currentBot].name;

// 3. Handle sending and displaying messages
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const inputEl = document.getElementById('user-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user-msg');
    inputEl.value = '';

    // Show a loading/typing indicator
    const loadingDiv = appendMessage("Thinking...", 'bot-msg');

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${personas[currentBot].prompt} User says: ${userText}` }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        loadingDiv.remove(); // Remove typing indicator
        appendMessage(aiResponse, 'bot-msg');
    } catch (error) {
        loadingDiv.innerText = "Connection error... try again!";
        console.error(error);
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom
    return msgDiv;
}
