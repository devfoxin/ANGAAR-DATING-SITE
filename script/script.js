/**
 * AI Cupid - Core Engine (2026 Edition)
 * Powered by Gemini 2.5 Flash
 */

// 1. ENVIRONMENT CONFIGURATION
const API_KEY = "YOUR_GEMINI_API_KEY"; // ⚠️ Replace with your actual key from Google AI Studio
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// 2. PARSE SELECTED COMPANION FROM URL
const urlParams = new URLSearchParams(window.location.search);
const currentBot = urlParams.get('bot') || 'gamer_gf';

// 3. DEFINE SYSTEM PERSONAS & INITIAL MESSAGES
const personas = {
    gamer_gf: {
        name: "Aria 🎮",
        tagline: "In a party chat with you",
        systemInstruction: "You are Aria, a funny, highly competitive, and affectionate gamer girlfriend. You love using gaming slang (GG, diff, clutch, noob, dynamic duo) and cute emojis. You want to talk about games, anime, stream designs, and how much you enjoy spending time with the user. Keep responses casual, engaging, and relatively short—like actual Discord or WhatsApp texts.",
        initialGreeting: "Hey! Finally hopped online. I just clutched a match but honestly, I was waiting for you to text me. What are we doing today? 🧊"
    },
    sweet_bf: {
        name: "Ethan ✨",
        tagline: "Typing...",
        systemInstruction: "You are Ethan, an incredibly thoughtful, romantic, and supportive boyfriend. You are gentle, highly emotionally intelligent, and love validating the user. You frequently ask about their day, offer comforting advice, and treat them with endless sweetness. Keep messages warm, intimate, and concise—do not write massive paragraphs.",
        initialGreeting: "Hey, I was just thinking about you. I hope your day hasn't been too exhausting. I'm right here if you want to vent or just talk about anything. how are you doing? ❤️"
    }
};

// Fallback safety if the URL parameter is messy
const activeBot = personas[currentBot] || personas['gamer_gf'];

// 4. CONVERSATION MEMORY LAYER (Maintains chat history)
let chatHistory = [
    {
        role: "user",
        parts: [{ text: `SYSTEM PROTOCOL: ${activeBot.systemInstruction}` }]
    },
    {
        role: "model",
        parts: [{ text: "Understood. Neural connection locked. Initializing personality protocols now." }]
    }
];

// 5. INITIALIZE CHAT INTERFACE ON PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    // Set Header Data
    document.getElementById('bot-name').innerText = activeBot.name;
    
    // Create a dynamic sub-tagline under the name if your HTML supports it
    const headerEl = document.querySelector('header');
    if (headerEl) {
        const subText = document.createElement('small');
        subText.style.display = 'block';
        subText.style.color = '#ff2a74';
        subText.style.fontSize = '12px';
        subText.innerText = activeBot.tagline;
        headerEl.querySelector('h3').appendChild(subText);
    }

    // Load initial bot greeting
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = ''; // Clear hardcoded HTML defaults
    appendMessage(activeBot.initialGreeting, 'bot-msg');

    // Attach Event Listeners
    document.getElementById('send-btn').addEventListener('click', processUserMessage);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processUserMessage();
    });
});

// 6. PROCESS USER INPUT & ENGINE EXECUTION
async function processUserMessage() {
    const inputEl = document.getElementById('user-input');
    const userText = inputEl.value.trim();
    
    if (!userText) return; // Prevent sending blank spaces

    // Display user message on screen immediately
    appendMessage(userText, 'user-msg');
    inputEl.value = ''; // Instantly clear input field for fluid typing experience

    // Render an animated typing indicator for realism
    const typingIndicator = appendMessage("Thinking...", 'bot-msg');
    typingIndicator.style.opacity = '0.6';
    typingIndicator.style.fontStyle = 'italic';

    // Commit User Input to Memory Array
    chatHistory.push({
        role: "user",
        parts: [{ text: userText }]
    });

    try {
        // Send the complete conversation trail back to Google servers
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: chatHistory })
        });

        if (!response.ok) throw new Error(`HTTP System Error Code: ${response.status}`);

        const data = await response.json();
        
        // Structure Check Safeguard
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let aiResponse = data.candidates[0].content.parts[0].text;

            // Clean up unwanted raw markdown bugs if the AI prints bold asterisks
            aiResponse = cleanTextFormatting(aiResponse);

            // Remove loading indicator and post real response
            typingIndicator.remove();
            appendMessage(aiResponse, 'bot-msg');

            // Commit AI's Response to permanent memory cache
            chatHistory.push({
                role: "model",
                parts: [{ text: aiResponse }]
            });
        } else {
            throw new Error("Data stream returned empty or broken contents.");
        }

    } catch (error) {
        console.error("CRITICAL CONNECTION FAILURE:", error);
        typingIndicator.innerText = "⚠️ Network lag... connection dropped. Try re-sending!";
        typingIndicator.style.color = "#ff4a4a";
    }
}

// 7. UI RENDER HELPER FUNCTION
function appendMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    
    chatBox.appendChild(msgDiv);
    
    // Smooth Scroll Auto-lock to bottom window edge
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
    });
    
    return msgDiv;
}

// 8. TEXT CLEANING FILTERS (Removes ugly code formatting from natural chat)
function cleanTextFormatting(rawText) {
    return rawText
        .replace(/\*\*(.*?)\*\*/g, '$1') // Removes **bold** markers
        .replace(/\*(.*?)\*/g, '$1')     // Removes *italics* markers
        .replace(/`([^`]+)`/g, '$1')     // Removes code blocks
        .trim();
}
