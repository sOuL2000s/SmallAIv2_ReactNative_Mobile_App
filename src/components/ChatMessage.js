// src/components/ChatMessage.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';
import { getFileIcon, showMessage } from '../utils/helpers';
import CodeBlock from './CodeBlock'; // Import the custom CodeBlock component
import { speak, stopSpeech, isSpeechActive, getCurrentUtteranceText } from '../utils/speech'; // Import speech functions
import { useState } from 'react';

const ChatMessage = ({ message, onCopy, onDictate, isLastMessage }) => {
  const { colors } = useTheme();
  const [isDictating, setIsDictating] = useState(false);

  const isUser = message.role === 'user';
  const messageText = message.parts.map(p => p.text).join('\n').trim();
  const attachments = message.parts.filter(p => p.inlineData);

  const handleCopy = async () => {
    const textToCopy = isUser ? `You: ${messageText}` : `AI: ${messageText}`;
    await Clipboard.setStringAsync(textToCopy);
    showMessage('Copied to clipboard!', 'success');
  };

  const handleDictate = async () => {
    if (isDictating && getCurrentUtteranceText() === messageText) {
      await stopSpeech();
      setIsDictating(false);
    } else {
      // Stop any other ongoing speech
      await stopSpeech();
      // Start this message's speech
      setIsDictating(true);
      await speak(messageText, null, () => {}, () => setIsDictating(false), () => setIsDictating(false));
    }
  };


  const markdownStyles = StyleSheet.create({
    body: {
      color: isUser ? colors.userBubbleText : colors.aiBubbleText,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: { color: colors.accentPrimary, fontSize: 22, fontWeight: '800', marginTop: 20, marginBottom: 10 },
    heading2: { color: colors.accentPrimary, fontSize: 20, fontWeight: '800', marginTop: 18, marginBottom: 8 },
    heading3: { color: colors.accentPrimary, fontSize: 18, fontWeight: '800', marginTop: 16, marginBottom: 6 },
    list_item: {
      color: isUser ? colors.userBubbleText : colors.aiBubbleText,
      fontSize: 16,
      lineHeight: 24,
      marginLeft: 10,
    },
    bullet_list: { marginBottom: 10 },
    ordered_list: { marginBottom: 10 },
    strong: { color: colors.accentPrimary, fontWeight: '700' },
    link: { color: colors.accentPrimary, textDecorationLine: 'underline' },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.accentSecondary,
      paddingLeft: 10,
      marginLeft: 0,
      color: colors.textSecondary,
      opacity: 0.8,
    },
    inlineCode: {
      backgroundColor: colors.accentPrimary + '15', // 15% opacity
      borderRadius: 4,
      paddingHorizontal: 5,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 14,
      color: colors.accentPrimary,
    },
  });

  const markdownRules = {
    code_block: (node, children, parent, styles) => (
      <CodeBlock key={node.key} language={node.attributes.language}>
        {children}
      </CodeBlock>
    ),
  };

  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      {
        backgroundColor: isUser ? colors.userBubbleBg : colors.aiBubbleBg,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        borderBottomLeftRadius: isUser ? 24 : 6,
        borderBottomRightRadius: isUser ? 6 : 24,
      },
      !isLastMessage && {marginBottom: 10} // Add margin bottom only if not last
    ]}>
      {isUser && messageText ? (
        <Text style={[styles.messageText, { color: colors.userBubbleText }]}>
          <Text style={styles.senderName}>You:</Text> {messageText}
        </Text>
      ) : null}

      {!isUser && messageText ? (
        <Markdown style={markdownStyles} rules={markdownRules}>
          {messageText}
        </Markdown>
      ) : null}

      {attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          {attachments.map((attachment, index) => (
            attachment.inlineData.mimeType.startsWith('image/') ? (
              <Image
                key={index}
                source={{ uri: `data:${attachment.inlineData.mimeType};base64,${attachment.inlineData.data}` }}
                style={styles.chatImage}
              />
            ) : (
              <View key={index} style={[styles.fileAttachment, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
                <MaterialCommunityIcons name={getFileIcon(attachment.inlineData.mimeType)} size={18} color={colors.accentSecondary} />
                <Text style={[styles.fileName, { color: colors.textPrimary }]}>File ({attachment.inlineData.mimeType})</Text>
              </View>
            )
          ))}
        </View>
      )}

      <View style={[styles.messageActions, { backgroundColor: colors.headerBg, borderColor: colors.borderColor, right: isUser ? 10 : 'auto', left: isUser ? 'auto' : 10, }]}>
        <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
          <MaterialCommunityIcons name="content-copy" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDictate} style={styles.actionButton}>
          <MaterialCommunityIcons name={isDictating && isSpeechActive() && getCurrentUtteranceText() === messageText ? "pause" : "volume-high"} size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 24,
    maxWidth: '85%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    position: 'relative',
    paddingBottom: 40, // Space for action buttons
  },
  userMessageContainer: {
    marginRight: 10,
  },
  aiMessageContainer: {
    marginLeft: 10,
  },
  senderName: {
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  chatImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  fileName: {
    fontSize: 12,
    marginLeft: 5,
  },
  messageActions: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    borderRadius: 6,
  },
});

export default ChatMessage;