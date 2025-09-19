// src/screens/ChatScreen.js

import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import ChatMessage from '../components/ChatMessage';
import Loader from '../components/Loader';
import { pickImage, pickDocument, getFileIcon, showMessage, generateUniqueId } from '../utils/helpers';
import * as Speech from 'expo-speech'; // For general chat TTS
import Voice from '@react-native-voice/voice'; // For general chat STT
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ChatScreen = () => {
  const navigation = useNavigation(); // Hook for navigation
  const { colors, themeName, colorMode, toggleDarkMode, selectTheme, allThemes, personalities } = useTheme();
  const {
    allChatSessions,
    currentSessionId,
    currentChatHistory,
    chatAttachments,
    isLoading,
    chatInputRef, // Get ref from context
    createNewChatSession,
    loadChatSession,
    deleteChatSession,
    sendMessage,
    addAttachment,
    removeAttachment,
  } = useChat();

  const [chatInputText, setChatInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollViewRef = useRef();

  // Voice input state for general chat
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isDictatingMessage, setIsDictatingMessage] = useState(false); // For general chat TTS

  // --- Speech Recognition Setup (for general chat input) ---
  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsVoiceInputActive(true);
      setRecognizedText(''); // Clear previous recognition
      chatInputRef.current?.focus();
    };
    Voice.onSpeechEnd = () => {
      setIsVoiceInputActive(false);
      if (recognizedText.trim()) {
        setChatInputText(prev => prev + ' ' + recognizedText.trim());
      }
      setRecognizedText('');
    };
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setRecognizedText(event.value[0]);
      }
    };
    Voice.onSpeechError = (event) => {
      console.error('Voice input error:', event.error);
      setIsVoiceInputActive(false);
      if (event.error?.message?.includes('not-allowed')) {
        showMessage('Microphone access denied. Please allow microphone access.', 'error');
      } else if (event.error?.message?.includes('no-speech')) {
        showMessage('No speech detected.', 'warning');
      } else {
        showMessage(`Voice input error: ${event.error?.message || 'Unknown error'}`, 'error');
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [recognizedText]);

  const toggleVoiceInput = async () => {
    if (isVoiceInputActive) {
      await Voice.stop();
    } else {
      try {
        await Voice.start('en-US');
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        showMessage('Could not start voice input. Please check microphone permissions.', 'error');
      }
    }
  };

  // --- Auto-scroll chat history ---
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [currentChatHistory, chatAttachments, isLoading]); // Scroll on new messages/attachments/loading

  // --- Theme Change Handler ---
  const handleThemeChange = (newThemeName) => {
    selectTheme(newThemeName);
    AsyncStorage.setItem('smallAI_selected_theme_rn', newThemeName);
  };

  // --- Attachment Handlers ---
  const handleAttachFile = async () => {
    const pickerOptions = [
      { text: "Image", onPress: handlePickImage },
      { text: "Document", onPress: handlePickDocument },
      { text: "Cancel", style: "cancel" }
    ];

    Alert.alert("Attach File", "Choose file type to attach", pickerOptions);
  };

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      addAttachment(result);
    }
  };

  const handlePickDocument = async () => {
    const result = await pickDocument();
    if (result) {
      // For non-image files, we might need to fetch the base64 manually if pickDocument doesn't provide it
      // Expo DocumentPicker's base64 option should provide it, but if not, use fileToBase64
      if (!result.data && result.uri) {
        try {
          const { data, mimeType } = await fileToBase64(result.uri, result.mimeType);
          addAttachment({ ...result, data, mimeType });
        } catch (error) {
          console.error("Failed to read document as Base64:", error);
          showMessage("Failed to process document.", "error");
        }
      } else {
        addAttachment(result);
      }
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.sidebarOverlay}
          onPress={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <View style={[styles.sidebar, { backgroundColor: colors.sidebarBg, borderColor: colors.sidebarBorder, left: isSidebarOpen ? 0 : -width }]}>
        <View style={styles.sidebarHeader}>
          <Text style={[styles.sidebarTitle, { color: colors.textPrimary }]}>
            <MaterialCommunityIcons name="star-four-points" size={24} color={colors.accentPrimary} /> Small AI v2
          </Text>
          <TouchableOpacity onPress={() => setIsSidebarOpen(false)} style={styles.closeSidebarBtn}>
            <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => { createNewChatSession(); setIsSidebarOpen(false); }} style={[styles.newChatButton, { backgroundColor: colors.accentPrimary }]}>
          <MaterialCommunityIcons name="plus" size={20} color={colors.activeSidebarItemText} style={styles.newChatButtonIcon}/>
          <Text style={[styles.newChatButtonText, { color: colors.activeSidebarItemText }]}>New Chat</Text>
        </TouchableOpacity>

        <Text style={[styles.previousChatsTitle, { color: colors.textSecondary }]}>Previous Chats</Text>
        <ScrollView style={styles.chatListContainer}>
          {Object.values(allChatSessions).sort((a, b) => b.timestamp - a.timestamp).map(session => (
            <TouchableOpacity
              key={session.id}
              onPress={() => { loadChatSession(session.id); setIsSidebarOpen(false); }}
              style={[
                styles.sidebarChatItem,
                {
                  backgroundColor: session.id === currentSessionId ? colors.accentPrimary : colors.sidebarBg,
                  borderColor: colors.sidebarBorder,
                },
              ]}
            >
              <MaterialCommunityIcons name="message-square-outline" size={20} color={session.id === currentSessionId ? colors.activeSidebarItemIcon : colors.textSecondary} />
              <Text numberOfLines={1} style={[styles.sidebarChatItemText, { color: session.id === currentSessionId ? colors.activeSidebarItemText : colors.textSecondary }]}>
                {session.title}
              </Text>
              <TouchableOpacity onPress={() => deleteChatSession(session.id)} style={styles.deleteChatBtn}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={session.id === currentSessionId ? colors.activeSidebarItemIcon : colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.themeSelectorContainer}>
          <Text style={[styles.themeSelectorTitle, { color: colors.textSecondary }]}>Themes</Text>
          <View style={[styles.pickerWrapper, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <TextInput
              style={[styles.pickerText, { color: colors.textPrimary }]}
              value={allThemes.find(t => t === themeName)}
              editable={false}
            />
            <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />
            <Picker
              selectedValue={themeName}
              onValueChange={(itemValue) => handleThemeChange(itemValue)}
              style={styles.picker}
              itemStyle={{ color: colors.textPrimary }} // This style won't apply directly to Android/iOS native picker items
            >
              {allThemes.map(theme => (
                <Picker.Item key={theme} label={theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} value={theme} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Main Chat Window */}
      <KeyboardAvoidingView
        style={[styles.mainChatWindow, { backgroundColor: colors.mainChatWindowBg }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.borderColor }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.hamburgerMenuButton}>
              <MaterialCommunityIcons name="menu" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              <MaterialCommunityIcons name="star-four-points" size={24} color={colors.accentPrimary} /> Current Chat
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Conversation')}
              style={[styles.conversationModeButton, { backgroundColor: colors.secondary }]}
            >
              <MaterialCommunityIcons name="message-text-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.darkModeText, { color: colors.textSecondary }]}>Dark Mode</Text>
            <Switch
              trackColor={{ false: colors.textSecondary, true: colors.accentPrimary }}
              thumbColor={colors.cardBg}
              ios_backgroundColor={colors.textSecondary}
              onValueChange={toggleDarkMode}
              value={colorMode === 'dark'}
            />
          </View>
        </View>

        {/* Chat History */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatHistory}
          contentContainerStyle={styles.chatHistoryContent}
        >
          {currentChatHistory.map((message, index) => (
            <ChatMessage
              key={generateUniqueId()} // Use unique ID for key
              message={message}
              isLastMessage={index === currentChatHistory.length - 1 && !isLoading}
            />
          ))}
          {isLoading && <Loader />}
        </ScrollView>

        {/* Chat Input Section */}
        <View style={[styles.chatInputAreaContainer, { backgroundColor: colors.headerBg, borderTopColor: colors.borderColor }]}>
          {chatAttachments.length > 0 && (
            <View style={styles.attachmentsPreviewContainer}>
              {chatAttachments.map((attachment, index) => (
                <View key={index} style={[styles.attachmentPreviewItem, { backgroundColor: colors.accentPrimary + '15', borderColor: colors.borderColor }]}>
                  {attachment.mimeType.startsWith('image/') ? (
                    <Image source={{ uri: attachment.uri }} style={styles.attachmentThumbnail} />
                  ) : (
                    <MaterialCommunityIcons name={getFileIcon(attachment.mimeType)} size={20} color={colors.accentPrimary} />
                  )}
                  <Text numberOfLines={1} style={[styles.attachmentName, { color: colors.accentPrimary }]}>{attachment.name}</Text>
                  <TouchableOpacity onPress={() => removeAttachment(index)} style={styles.removeAttachmentBtn}>
                    <MaterialCommunityIcons name="close" size={16} color={colors.accentPrimary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.inputRow}>
            <TouchableOpacity onPress={toggleVoiceInput} style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
              <MaterialCommunityIcons name={isVoiceInputActive ? "microphone-off" : "microphone"} size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAttachFile} style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
              <MaterialCommunityIcons name="paperclip" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <TextInput
              ref={chatInputRef}
              style={[
                styles.chatInput,
                { backgroundColor: colors.cardBg, borderColor: colors.borderColor, color: colors.textPrimary },
              ]}
              placeholder="Type your message or ask a question..."
              placeholderTextColor={colors.textSecondary}
              multiline
              value={chatInputText + recognizedText}
              onChangeText={(text) => {
                setChatInputText(text);
                setRecognizedText(''); // Clear recognized text if user starts typing
              }}
              onContentSizeChange={(e) => {
                // Adjust height dynamically, but capped
                if (chatInputRef.current) {
                  const newHeight = Math.min(120, Math.max(40, e.nativeEvent.contentSize.height));
                  chatInputRef.current.setNativeProps({
                    style: { height: newHeight },
                  });
                }
              }}
            />

            <TouchableOpacity
              onPress={() => sendMessage(chatInputText)}
              style={[styles.sendButton, { backgroundColor: colors.accentPrimary }]}
              disabled={isLoading || (!chatInputText.trim() && chatAttachments.length === 0)}
            >
              <MaterialCommunityIcons name="send" size={24} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  // Sidebar styles
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 280,
    padding: 15,
    borderRightWidth: 1,
    zIndex: 101, // Above overlay
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeSidebarBtn: {
    padding: 5,
  },
  newChatButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newChatButtonIcon: {
    marginRight: 8,
  },
  newChatButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  previousChatsTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  chatListContainer: {
    flex: 1,
    width: '100%',
  },
  sidebarChatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  sidebarChatItemText: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },
  deleteChatBtn: {
    padding: 5,
    marginLeft: 10,
  },
  themeSelectorContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  themeSelectorTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
    overflow: 'hidden', // Hide actual picker if it floats over
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    textAlignVertical: 'center',
  },
  picker: {
    position: 'absolute', // Position picker over text input
    width: '100%',
    height: '100%',
    opacity: 0, // Make it invisible
  },

  // Main chat window styles
  mainChatWindow: {
    flex: 1,
    borderRadius: 0, // No border radius for full screen
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    height: 60, // Fixed height for header
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerMenuButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  conversationModeButton: {
    padding: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
  },
  darkModeText: {
    fontSize: 12,
  },
  chatHistory: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  chatHistoryContent: {
    paddingBottom: 20,
  },
  chatInputAreaContainer: {
    padding: 15,
    borderTopWidth: 1,
  },
  attachmentsPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 8,
  },
  attachmentPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  attachmentThumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 5,
  },
  attachmentName: {
    fontSize: 12,
    maxWidth: 100,
    marginRight: 5,
  },
  removeAttachmentBtn: {
    padding: 2,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120, // Max height for multiline input
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, // Adjust for vertical alignment
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24, // Ensure line height for multiline
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ChatScreen;