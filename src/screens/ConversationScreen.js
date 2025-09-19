// src/screens/ConversationScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Easing, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { getAvailableVoices, setSelectedVoiceName, getSelectedVoiceIdentifier } from '../utils/speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const CONVERSATION_VOICE_KEY = 'smallAI_conversation_voice';
const CONVERSATION_PERSONALITY_KEY = 'smallAI_conversation_personality';

const ConversationScreen = () => {
  const navigation = useNavigation();
  const { colors, personalities, selectPersonality, selectedPersonality } = useTheme();
  const { currentChatHistory, sendMessage, isLoading, updateSessionTitle, currentSessionId } = useChat();

  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserListening, setIsUserListening] = useState(false);
  const [conversationStatus, setConversationStatus] = useState('Tap the button to start conversing!');
  const [recognizedText, setRecognizedText] = useState('');
  const [spokenHistory, setSpokenHistory] = useState([]); // Stores last few user/AI utterances
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceNameState] = useState(null); // Local state for voice name

  const soundBlobAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const conversationDisplayScrollRef = useRef();

  // --- Voice Setup ---
  useEffect(() => {
    const loadVoicesAndSettings = async () => {
      const voices = await getAvailableVoices();
      setAvailableVoices(voices);

      const storedVoiceName = await AsyncStorage.getItem(CONVERSATION_VOICE_KEY);
      if (storedVoiceName && voices.some(v => v.name === storedVoiceName)) {
        setSelectedVoiceNameState(storedVoiceName);
      } else if (voices.length > 0) {
        // Default to the first English voice if none selected
        setSelectedVoiceNameState(voices[0].name);
        await setSelectedVoiceName(voices[0].name);
      } else {
        setSelectedVoiceNameState('');
      }
    };
    loadVoicesAndSettings();

    // Event listener for voices changed (e.g., system language change)
    Speech.onVoicesLoaded(() => {
        loadVoicesAndSettings();
    });
  }, []);

  const handleVoiceChange = async (itemValue) => {
    setSelectedVoiceNameState(itemValue);
    await setSelectedVoiceName(itemValue);
  };

  const handlePersonalityChange = async (itemValue) => {
    selectPersonality(itemValue); // Update theme context
    await AsyncStorage.setItem(CONVERSATION_PERSONALITY_KEY, itemValue);
  };

  // --- Animation for Sound Blob ---
  useEffect(() => {
    // Initial idle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(soundBlobAnim, {
          toValue: 1,
          duration: 15000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(soundBlobAnim, {
          toValue: 0,
          duration: 15000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for mic button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      soundBlobAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, []);

  const getBlobStyle = () => {
    let opacity = soundBlobAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.6, 0.8, 0.6],
    });
    let scale = soundBlobAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.95, 1.05, 0.95],
    });
    let rotate = soundBlobAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', '10deg', '0deg'],
    });
    let borderRadius = soundBlobAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        '50% 30% 60% 40% / 40% 60% 30% 50%',
        '30% 50% 40% 60% / 60% 40% 50% 30%',
        '50% 30% 60% 40% / 40% 60% 30% 50%',
      ],
    });

    if (isUserListening) {
      opacity = pulseAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.7, 1, 0.7],
      });
      scale = pulseAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.9, 1.05, 0.9],
      });
      rotate = '0deg'; // Keep more stable during listening
      borderRadius = '50%'; // More circular
    } else if (isAiSpeaking) {
      opacity = pulseAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0.7, 1],
      });
      scale = pulseAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.98, 1.08, 0.98],
      });
      rotate = pulseAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: ['0deg', '3deg', '-3deg', '3deg', '0deg'],
      });
      borderRadius = '60% 40% 50% 50% / 50% 50% 40% 60%'; // More elliptical
    }

    return {
      opacity,
      transform: [{ scale }, { rotate }],
      borderRadius, // RN Animated doesn't directly support borderRadius string interpolation as a style prop
      // For borderRadius animation, you might need a custom component or view that interpolates numbers for each corner.
      // For simplicity, we'll keep it static or rely on the main Animated.View's borderRadius.
    };
  };

  // Helper for scrolling conversation history display
  useEffect(() => {
    if (conversationDisplayScrollRef.current) {
      conversationDisplayScrollRef.current.scrollToEnd({ animated: true });
    }
  }, [spokenHistory]);

  // --- Speech Recognition (User Input) Setup ---
  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsUserListening(true);
      setConversationStatus('Listening...');
      setRecognizedText('');
      setSpokenHistory(prev => [...prev, { role: 'user', text: '' }]);
    };
    Voice.onSpeechEnd = async () => {
      setIsUserListening(false);
      // If recognized text is empty, the user might have stopped speaking prematurely
      if (recognizedText.trim() === '') {
        setConversationStatus('No speech detected. Say something!');
        startListeningTimeout(); // Try listening again after a short delay
      } else {
        await handleUserSpeechEnd(recognizedText.trim());
      }
    };
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setRecognizedText(event.value[0]);
        setSpokenHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'user', text: event.value[0] };
          return newHistory;
        });
      }
    };
    Voice.onSpeechError = (event) => {
      setIsUserListening(false);
      console.error('Conversation mode Voice input error:', event.error);
      if (event.error?.message?.includes('not-allowed')) {
        Alert.alert('Microphone Access Denied', 'Please allow microphone access in your app settings to use Conversation Mode.');
        setConversationStatus('Microphone access denied.', 'error');
      } else if (event.error?.message?.includes('no-speech')) {
        setConversationStatus('No speech detected. Say something!');
        startListeningTimeout();
      } else {
        Alert.alert('Voice Error', `Conversation mode speech recognition error: ${event.error?.message || 'Unknown error'}`);
        setConversationStatus(`Error: ${event.error?.message || 'Unknown error'}`, 'error');
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Speech.stop(); // Stop speech when component unmounts
      clearTimeout(conversationTimeout); // Clear any pending timeouts
    };
  }, [currentChatHistory, recognizedText, selectedVoiceName, selectedPersonality]);


  let conversationTimeout = useRef(null);
  const startListeningTimeout = () => {
    clearTimeout(conversationTimeout.current);
    conversationTimeout.current = setTimeout(() => {
      if (!isUserListening && !isAiSpeaking) {
        startListening();
      }
    }, 2000); // Wait 2 seconds before automatically starting listening again
  };

  // --- Main Conversation Flow Functions ---
  const startListening = async () => {
    if (isAiSpeaking) await Speech.stop(); // Stop AI if speaking
    if (isUserListening) return;

    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Failed to start conversation voice recognition:', error);
      Alert.alert('Microphone Error', 'Could not start microphone. Please check permissions.');
      setConversationStatus('Error starting microphone.', 'error');
    }
  };

  const stopListening = async () => {
    if (isUserListening) {
      await Voice.stop();
    }
  };

  const handleUserSpeechEnd = async (userText) => {
    setConversationStatus('Thinking...');
    setSpokenHistory(prev => {
        const lastEntry = prev[prev.length - 1];
        if (lastEntry && lastEntry.role === 'user') {
            lastEntry.text = userText; // Update the full text
        } else {
            prev.push({ role: 'user', text: userText }); // Should not happen with current flow
        }
        return [...prev];
    });

    try {
      // Send message to backend via ChatContext's sendMessage
      // We pass userText, and it will append to currentChatHistory and get AI response.
      // We need to wait for the AI response to be available in currentChatHistory.
      await sendMessage(userText);

      // After sendMessage updates chat history, find the latest AI message
      const latestAiMessage = currentChatHistory[currentChatHistory.length - 1]; // This is the user's message
      const nextAiMessageIndex = currentChatHistory.length + 1; // Expected index of AI message after user message and AI response
      // This is a bit tricky with async updates; better to explicitly get AI response from sendMessage's internal logic
      // For simplicity here, we assume sendMessage *already* handled updating history and we react to that.
      // A better way would be for `sendMessage` to return the AI response text directly, or to use a callback.

      // For now, let's re-fetch history or wait for context update to propagate
      // For a quick fix, we'll try to find the latest AI message added to the global chat history
      // This implies ChatContext updates `currentChatHistory` *before* `sendMessage` resolves,
      // which isn't ideal. Let's make sendMessage more robust or directly call `callGeminiAPI`.

      // Let's directly call the API here and then update ChatContext to keep the flow synchronous in ConversationScreen
      const historyForAPI = [...currentChatHistory, { role: 'user', parts: [{ text: userText }] }];
      const aiResponseText = await callGeminiAPI(historyForAPI, selectedPersonality);

      // Now, update the global chat history with both user and AI message
      // This needs to be done through the ChatContext's update mechanism.
      // Modifying the `sendMessage` in ChatContext to return the AI response and then calling
      // a different context function to directly append to history would be cleaner.
      // For this example, let's simplify and directly push to history.
      const newUserMessage = { role: 'user', parts: [{ text: userText }] };
      const newAIResponse = { role: 'model', parts: [{ text: aiResponseText }] };
      setSpokenHistory(prev => [...prev, newUserMessage, newAIResponse]); // Update local display history

      // Also update global chat history and title via context
      updateChatHistoryInContext(newUserMessage, newAIResponse);

      await startSpeaking(aiResponseText);

    } catch (error) {
      console.error("Error in conversation mode API call:", error);
      Alert.alert('AI Error', `AI communication error: ${error.message}`);
      setConversationStatus('AI communication error. Please try again.', 'error');
      startListeningTimeout(); // Try to resume listening
    }
  };

  const updateChatHistoryInContext = (userMsg, aiMsg) => {
    // This is a simplified way to ensure the main chat history gets updated
    // In a production app, the `sendMessage` function in `ChatContext` should be used,
    // and this screen would only call `sendMessage` and react to its successful completion.
    // However, since `sendMessage` takes `chatInputText` and `chatAttachments`, it's not
    // directly suitable for just "userText" from voice.
    // For this demonstration, we'll assume `ChatContext` is capable of handling history updates like this.
    // A better refactor would involve `ChatContext` exposing a function like `appendVoiceMessage(userText)`
    // that internally calls the API and updates its state.

    // Let's create a temporary session update function directly here for quick integration.
    // In a real app, this should be done via ChatContext methods.
    const currentSession = currentChatHistory; // This is actually the history array
    const updatedHistory = [...currentSession, userMsg, aiMsg];

    setSpokenHistory(prev => [...prev.filter(entry => entry.role !== 'temp-ai-thinking'), userMsg, aiMsg]);

    // Manually updating the chat sessions state directly (less ideal, but works for demo)
    // The `useChat` hook should have an exposed `updateHistoryDirectly` for this
    // For now, we'll call a simplified sendMessage that internally handles the history update.
    // This implies `sendMessage` should accept just `userParts` and add `aiParts`.
    // Re-evaluating: The existing `sendMessage` in `ChatContext` is designed for text input and attachments.
    // For conversation mode, we need a dedicated function. Let's create one.

    // This is a placeholder for now. The `sendMessage` from `useChat` is still triggered
    // in `handleUserSpeechEnd` to handle the history update and AI call.
    // The `spokenHistory` state here is just for display within the conversation overlay.
  };


  const startSpeaking = async (text) => {
    if (isUserListening) await Voice.stop(); // Stop user recognition if active
    if (isAiSpeaking) await Speech.stop(); // Stop previous AI speech

    setIsAiSpeaking(true);
    setConversationStatus('AI Speaking...');

    const voiceIdentifier = await getSelectedVoiceIdentifier();
    const options = {
      language: 'en-US',
      onStart: () => {
        // console.log('AI started speaking');
      },
      onDone: () => {
        // console.log('AI finished speaking');
        setIsAiSpeaking(false);
        startListeningTimeout(); // Automatically restart listening for user
      },
      onError: (e) => {
        console.error('AI speech error:', e);
        Alert.alert('Speech Error', 'AI could not speak this message.');
        setIsAiSpeaking(false);
        setConversationStatus('AI speech error.', 'error');
        startListeningTimeout(); // Attempt to resume listening despite error
      },
    };

    if (voiceIdentifier) {
      options.voice = voiceIdentifier;
    }

    try {
      await Speech.speak(text, options);
    } catch (error) {
      console.error('Failed to start AI speech:', error);
      Alert.alert('Speech Error', 'Could not start AI speech.');
      setIsAiSpeaking(false);
      setConversationStatus('AI speech error.', 'error');
      startListeningTimeout();
    }
  };

  const handleMicButtonPress = async () => {
    if (isAiSpeaking) {
      await Speech.stop();
      setIsAiSpeaking(false);
      startListeningTimeout(); // Resume listening after interrupting AI
    } else if (isUserListening) {
      await Voice.stop(); // Stop listening
    } else {
      startListening(); // Start listening
    }
  };

  return (
    <View style={[styles.overlayContainer, { backgroundColor: colors.conversationBg }]}>
      <TouchableOpacity
        style={[styles.closeButton, { top: Platform.OS === 'ios' ? 60 : 20 }]}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="close" size={30} color={colors.textSecondary} />
      </TouchableOpacity>

      <View style={[styles.conversationControls, { backgroundColor: colors.conversationBg + '90', borderColor: colors.borderColor }]}>
        <Text style={[styles.controlLabel, { color: colors.textSecondary }]}>Voice:</Text>
        <View style={[styles.pickerWrapper, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <TextInput
            style={[styles.pickerText, { color: colors.textPrimary }]}
            value={selectedVoiceName || 'Default Voice'}
            editable={false}
          />
          <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />
          <Picker
            selectedValue={selectedVoiceName}
            onValueChange={handleVoiceChange}
            style={styles.picker}
            itemStyle={{ color: colors.textPrimary }}
          >
            {availableVoices.length > 0 ? (
              availableVoices.map(voice => (
                <Picker.Item key={voice.identifier} label={`${voice.name} (${voice.language})`} value={voice.name} />
              ))
            ) : (
              <Picker.Item label="Loading voices..." value="" />
            )}
          </Picker>
        </View>

        <Text style={[styles.controlLabel, { color: colors.textSecondary }]}>Personality:</Text>
        <View style={[styles.pickerWrapper, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <TextInput
            style={[styles.pickerText, { color: colors.textPrimary }]}
            value={selectedPersonality || 'Standard'}
            editable={false}
          />
          <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />
          <Picker
            selectedValue={selectedPersonality}
            onValueChange={handlePersonalityChange}
            style={styles.picker}
            itemStyle={{ color: colors.textPrimary }}
          >
            {personalities.map(p => (
              <Picker.Item key={p.name} label={p.name} value={p.name} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.soundBlobWrapper}>
        <Animated.View
          style={[
            styles.soundBlob,
            { backgroundColor: colors.conversationIndicator },
            getBlobStyle(),
          ]}
        />
      </View>

      <Text style={[
        styles.conversationStatusText,
        { color: colors.textPrimary },
        isUserListening && { color: colors.accentSecondary, textShadowColor: colors.accentSecondary + '80' },
        isAiSpeaking && { color: colors.accentPrimary, textShadowColor: colors.accentPrimary + '80' },
      ]}>
        {conversationStatus}
      </Text>

      <ScrollView ref={conversationDisplayScrollRef} style={[styles.conversationHistoryDisplay, { borderColor: colors.borderColor, backgroundColor: colors.cardBg }]}>
        {spokenHistory.map((entry, index) => (
          <Text key={index} style={{
            color: entry.role === 'user' ? colors.userBubbleText : colors.aiBubbleText,
            fontWeight: '600',
            marginBottom: 5,
          }}>
            {entry.role === 'user' ? 'You: ' : 'AI: '}
            {entry.text}
          </Text>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleMicButtonPress}
        style={[
          styles.micButton,
          { backgroundColor: colors.accentPrimary },
          (isUserListening || isAiSpeaking) && {
            shadowColor: colors.accentError,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: pulseAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.7, 0, 0.7],
            }),
            shadowRadius: pulseAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [15, 0, 15],
            }),
            elevation: pulseAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [10, 0, 10],
            }),
          },
        ]}
      >
        <MaterialCommunityIcons name={isUserListening ? "microphone-off" : "microphone"} size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 80 : 20,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  conversationControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 9999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    maxWidth: '90%',
  },
  controlLabel: {
    fontSize: 14,
    marginRight: 5,
    marginLeft: 10,
  },
  pickerWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 120,
    height: 40,
    overflow: 'hidden',
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    height: '100%',
    textAlignVertical: 'center',
  },
  picker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  soundBlobWrapper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100, // Push down due to controls
    marginBottom: 20,
  },
  soundBlob: {
    width: '100%',
    height: '100%',
    borderRadius: 150, // Default to circular, animations handle morphing
    filter: 'blur(8px)', // Not directly supported by RN, emulate with shadow/opacity
    // Shadow properties can somewhat mimic glowing/blur:
    shadowColor: '#000', // Will be overridden by conversationIndicator in getBlobStyle
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
    elevation: 10,
  },
  conversationStatusText: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 15,
    minHeight: 60, // Ensure height for two lines
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  conversationHistoryDisplay: {
    maxWidth: 600,
    width: '90%',
    height: 120,
    borderWidth: 1,
    borderRadius: 24,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    marginTop: 30,
  },
});

export default ConversationScreen;