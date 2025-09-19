// src/utils/api.js

import { personalities } from '../theme/themes';

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// IMPORTANT: Replace "YOUR_GEMINI_API_KEY" with your actual Google Gemini API Key.
// Get your API key from Google AI Studio: https://makersuite.google.com/
// Do NOT expose your API key directly in production applications.
// For production, consider using a backend proxy to secure your API key.
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const GEMINI_API_KEY = "AIzaSyCzx6ReMk8ohPJcCjGwHHzu7SvFccJqAbA"; // Replace with your actual key!

if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY" || !GEMINI_API_KEY || GEMINI_API_KEY === "") {
    console.error("API Key is not set or is the default placeholder. Please replace 'YOUR_GEMINI_API_KEY' in src/utils/api.js with your actual Gemini API key.");
    // You might want to throw an error or handle this more gracefully in a real app
}

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

export const callGeminiAPI = async (chatHistory, personalityName = "Standard") => {
    let response;
    let result;
    let success = false;
    let retryCount = 0;
    const maxRetries = 3;
    let delay = 1000;

    const payload = {
        contents: [...chatHistory], // Create a shallow copy to avoid modifying original
    };

    // Apply personality prompt
    const selectedPersonalityObj = personalities.find(p => p.name === personalityName);
    if (selectedPersonalityObj && selectedPersonalityObj.prompt) {
        // Prepend a system message for personality, or modify the first user message
        // For Gemini, it's often best to include system instructions in the first user message
        // or as a context-setting turn. Here, we'll try prepending to the first user message.
        if (payload.contents && payload.contents.length > 0 && payload.contents[0].role === 'user' && payload.contents[0].parts && payload.contents[0].parts.length > 0 && payload.contents[0].parts[0].text) {
            payload.contents[0].parts[0].text = selectedPersonalityObj.prompt + "\n" + payload.contents[0].parts[0].text;
        } else {
            // Fallback: If no user message yet, create an initial user message for personality
            // This case might be less common if the first actual message is usually user input.
            payload.contents = [{ role: "user", parts: [{ text: selectedPersonalityObj.prompt }] }].concat(payload.contents);
        }
    }


    while (retryCount < maxRetries && !success) {
        try {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429) {
                if (retryCount < maxRetries - 1) {
                    console.warn(`API rate limit exceeded. Retrying in ${delay / 1000}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                    retryCount++;
                } else {
                    throw new Error('API rate limit exceeded. Please try again later.');
                }
            } else if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
            } else {
                result = await response.json();
                success = true;
            }
        } catch (err) {
            if (retryCount < maxRetries - 1) {
                console.warn(`Fetch error: ${err.message}. Retrying in ${delay / 1000}ms...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
                retryCount++;
            } else {
                throw err;
            }
        }
    }

    if (result && result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Failed to get a valid response from the AI. No candidates found or content is empty.');
    }
};