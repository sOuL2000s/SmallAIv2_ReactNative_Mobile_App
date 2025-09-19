// src/context/ChatContext.js

import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId, showMessage } from '../utils/helpers';
import { callGeminiAPI } from '../utils/api';
import { useTheme } from './ThemeContext'; // Import useTheme

const ChatContext = createContext();

const CHAT_SESSIONS_KEY = 'smallAI_chat_sessions_rn';
const CURRENT_SESSION_ID_KEY = 'smallAI_current_session_id_rn';

const INITIAL_AI_MESSAGE_TEXT = 'Hello! I am your AI assistant. How can I assist you today? Feel free to ask questions or attach relevant files for analysis related to Dream11 or any other topic!';

export const ChatProvider = ({ children }) => {
  const { selectedPersonality } = useTheme(); // Get selectedPersonality from ThemeContext
  const [allChatSessions, setAllChatSessions] = useState({}); // { sessionId: { id, title, history, timestamp } }
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatAttachments, setChatAttachments] = useState([]); // For current input attachments
  const [isLoading, setIsLoading] = useState(false);
  const chatInputRef = useRef(null); // Reference for auto-scrolling to current input

  const currentChatSession = allChatSessions[currentSessionId];
  const currentChatHistory = currentChatSession ? currentChatSession.history : [];

  // --- Initial Load Effect ---
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const storedSessions = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
        let sessions = {};
        if (storedSessions) {
          sessions = JSON.parse(storedSessions);
          // Ensure all histories have an initial AI message if missing for very old sessions
          Object.keys(sessions).forEach(id => {
            if (sessions[id].history.length === 0) {
              sessions[id].history.push({ role: 'model', parts: [{ text: INITIAL_AI_MESSAGE_TEXT }] });
            }
          });
        }
        setAllChatSessions(sessions);

        const storedCurrentSessionId = await AsyncStorage.getItem(CURRENT_SESSION_ID_KEY);
        if (storedCurrentSessionId && sessions[storedCurrentSessionId]) {
          setCurrentSessionId(storedCurrentSessionId);
        } else if (Object.keys(sessions).length > 0) {
          // Load the most recent session if no specific one is found
          const sorted = Object.values(sessions).sort((a, b) => b.timestamp - a.timestamp);
          setCurrentSessionId(sorted[0].id);
          await AsyncStorage.setItem(CURRENT_SESSION_ID_KEY, sorted[0].id);
        } else {
          createNewChatSession('New Chat'); // Auto-create if no sessions at all
        }
      } catch (error) {
        console.error("Failed to load chat sessions:", error);
        showMessage('Failed to load chat sessions.', 'error');
      }
    };
    loadSessions();
  }, []);

  // --- Save Sessions Effect ---
  useEffect(() => {
    if (Object.keys(allChatSessions).length > 0) {
      AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(allChatSessions)).catch(err => {
        console.error("Failed to save chat sessions:", err);
        showMessage('Failed to save chat sessions.', 'error');
      });
    }
  }, [allChatSessions]);

  // --- Session Management Functions ---

  const createNewChatSession = async (initialTitle = 'New Chat') => {
    const newId = generateUniqueId();
    const newSession = {
      id: newId,
      title: initialTitle,
      history: [{ role: 'model', parts: [{ text: INITIAL_AI_MESSAGE_TEXT }] }],
      timestamp: Date.now(),
    };

    setAllChatSessions(prev => ({
      ...prev,
      [newId]: newSession,
    }));
    setCurrentSessionId(newId);
    await AsyncStorage.setItem(CURRENT_SESSION_ID_KEY, newId);
    setChatAttachments([]); // Clear attachments for new chat
    if (chatInputRef.current) chatInputRef.current.clear(); // Clear text input if ref exists
  };

  const loadChatSession = async (sessionId) => {
    if (currentSessionId === sessionId) return;

    if (!allChatSessions[sessionId]) {
      showMessage('Requested chat session not found.', 'error');
      return;
    }
    setCurrentSessionId(sessionId);
    await AsyncStorage.setItem(CURRENT_SESSION_ID_KEY, sessionId);
    setChatAttachments([]); // Clear attachments for new chat
    if (chatInputRef.current) chatInputRef.current.clear(); // Clear text input if ref exists
  };

  const deleteChatSession = async (sessionIdToDelete) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            setAllChatSessions(prev => {
              const newSessions = { ...prev };
              delete newSessions[sessionIdToDelete];
              return newSessions;
            });

            if (currentSessionId === sessionIdToDelete) {
              setCurrentSessionId(null); // Clear current session if deleted
              await AsyncStorage.removeItem(CURRENT_SESSION_ID_KEY);
              // After deletion, if no sessions left, create a new one
              if (Object.keys(allChatSessions).length <= 1) { // Check if only one session was left or none
                createNewChatSession();
              } else {
                // Load the next most recent session
                const sessionsArray = Object.values(allChatSessions).filter(s => s.id !== sessionIdToDelete);
                if (sessionsArray.length > 0) {
                  const sorted = sessionsArray.sort((a, b) => b.timestamp - a.timestamp);
                  setCurrentSessionId(sorted[0].id);
                  await AsyncStorage.setItem(CURRENT_SESSION_ID_KEY, sorted[0].id);
                } else {
                    createNewChatSession(); // If somehow all sessions are gone, create new.
                }
              }
            }
            showMessage('Chat deleted successfully!', 'success');
          },
          style: 'destructive',
        },
      ]
    );
  };


  const updateSessionTitle = (sessionId, newTitle) => {
    setAllChatSessions(prev => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        title: newTitle,
        timestamp: Date.now(),
      },
    }));
  };

  // --- Send Message Logic ---
  const sendMessage = async (userMessageText) => {
    if (!userMessageText.trim() && chatAttachments.length === 0) {
      return;
    }
    if (isLoading) return; // Prevent multiple sends

    setIsLoading(true);

    const userParts = [];
    if (userMessageText.trim()) {
      userParts.push({ text: userMessageText.trim() });
    }
    for (const attachment of chatAttachments) {
      userParts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data,
        },
      });
    }

    const newUserMessage = { role: 'user', parts: userParts };
    const updatedHistory = [...currentChatHistory, newUserMessage];

    // Update session immediately for UI
    setAllChatSessions(prev => ({
      ...prev,
      [currentSessionId]: {
        ...prev[currentSessionId],
        history: updatedHistory,
        timestamp: Date.now(),
      },
    }));
    setChatAttachments([]); // Clear attachments after sending
    if (chatInputRef.current) chatInputRef.current.clear(); // Clear text input

    try {
      const aiResponseText = await callGeminiAPI(updatedHistory, selectedPersonality); // Pass personality
      const newAIResponse = { role: 'model', parts: [{ text: aiResponseText }] };

      setAllChatSessions(prev => {
        const sessionToUpdate = { ...prev[currentSessionId] };
        sessionToUpdate.history = [...sessionToUpdate.history, newAIResponse];
        sessionToUpdate.timestamp = Date.now(); // Update timestamp again after AI response
        return {
          ...prev,
          [currentSessionId]: sessionToUpdate,
        };
      });

      // Update title if it's still default after the first user message
      if (currentChatSession.title === 'New Chat' && userMessageText.trim()) {
        updateSessionTitle(currentSessionId, userMessageText.trim().substring(0, 50) + (userMessageText.trim().length > 50 ? '...' : ''));
      }

    } catch (error) {
      console.error('Chat API call failed:', error);
      showMessage(`AI error: ${error.message}`, 'error');

      // If API call fails, revert history by removing the last user message
      setAllChatSessions(prev => {
        const sessionToRevert = { ...prev[currentSessionId] };
        sessionToRevert.history = sessionToRevert.history.slice(0, -1); // Remove the last user message
        return {
          ...prev,
          [currentSessionId]: sessionToRevert,
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Attachment Management ---
  const addAttachment = (attachment) => {
    setChatAttachments(prev => [...prev, attachment]);
  };

  const removeAttachment = (index) => {
    setChatAttachments(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <ChatContext.Provider value={{
      allChatSessions,
      currentSessionId,
      currentChatHistory,
      chatAttachments,
      isLoading,
      chatInputRef, // Pass ref
      createNewChatSession,
      loadChatSession,
      deleteChatSession,
      sendMessage,
      addAttachment,
      removeAttachment,
      updateSessionTitle,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);