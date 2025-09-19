// src/utils/speech.js

import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONVERSATION_VOICE_KEY = 'smallAI_conversation_voice';

let isSpeaking = false;
let currentUtteranceText = null; // Store the text of the current speaking utterance

export const speak = async (text, voiceName = null, onStartCallback, onEndCallback, onErrorCallback) => {
  if (isSpeaking) {
    await Speech.stop();
    isSpeaking = false;
    currentUtteranceText = null;
  }

  currentUtteranceText = text;

  const options = {
    language: 'en-US',
    onStart: () => {
      isSpeaking = true;
      if (onStartCallback) onStartCallback();
    },
    onDone: () => {
      isSpeaking = false;
      currentUtteranceText = null;
      if (onEndCallback) onEndCallback();
    },
    onError: (e) => {
      console.error("Speech synthesis error:", e);
      isSpeaking = false;
      currentUtteranceText = null;
      if (onErrorCallback) onErrorCallback(e);
    },
  };

  if (voiceName) {
    const voices = await Speech.getVoicesAsync();
    const selectedVoice = voices.find(v => v.name === voiceName && v.language.startsWith('en'));
    if (selectedVoice) {
      options.voice = selectedVoice.identifier; // Expo uses 'identifier' for voice selection
    } else {
      console.warn(`Voice "${voiceName}" not found or not English, falling back to default.`);
    }
  }

  try {
    await Speech.speak(text, options);
  } catch (error) {
    console.error("Failed to start speech:", error);
    isSpeaking = false;
    currentUtteranceText = null;
    if (onErrorCallback) onErrorCallback(error);
  }
};

export const stopSpeech = async () => {
  if (isSpeaking) {
    await Speech.stop();
    isSpeaking = false;
    currentUtteranceText = null;
  }
};

export const isSpeechActive = () => {
  return isSpeaking;
};

export const getCurrentUtteranceText = () => {
  return currentUtteranceText;
};

// Function to fetch and update available voices
export const getAvailableVoices = async () => {
  const voices = await Speech.getVoicesAsync();
  return voices.filter(v => v.language.startsWith('en')).map(v => ({ name: v.name, language: v.language, identifier: v.identifier }));
};

export const getSelectedVoiceIdentifier = async () => {
  const storedVoiceName = await AsyncStorage.getItem(CONVERSATION_VOICE_KEY);
  if (storedVoiceName) {
    const voices = await getAvailableVoices();
    const selectedVoice = voices.find(v => v.name === storedVoiceName);
    return selectedVoice ? selectedVoice.identifier : null;
  }
  return null;
};

export const setSelectedVoiceName = async (voiceName) => {
  await AsyncStorage.setItem(CONVERSATION_VOICE_KEY, voiceName);
};
