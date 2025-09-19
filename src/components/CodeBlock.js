// src/components/CodeBlock.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from '../utils/helpers';

const { width } = Dimensions.get('window');

const CodeBlock = ({ children, language }) => {
  const { colors } = useTheme();
  const codeContent = children[0].props.children; // Markdown library structure

  const copyCode = async () => {
    await Clipboard.setStringAsync(codeContent);
    showMessage('Code copied!', 'success');
  };

  return (
    <View style={[styles.codeBlockContainer, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
      <View style={[styles.codeBlockHeader, { backgroundColor: colors.headerBg, borderBottomColor: colors.borderColor }]}>
        {language ? <Text style={[styles.languageText, { color: colors.textSecondary }]}>{language.toUpperCase()}</Text> : <View />}
        <TouchableOpacity onPress={copyCode} style={styles.copyButton}>
          <MaterialCommunityIcons name="content-copy" size={16} color={colors.textSecondary} />
          <Text style={[styles.copyButtonText, { color: colors.textSecondary }]}>Copy code</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.codeContentWrapper}>
        <Text style={[styles.codeContent, { color: colors.textPrimary }]}>
          {codeContent}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  codeBlockContainer: {
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: width * 0.85, // Adjust for mobile width
  },
  codeBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 12,
    marginLeft: 5,
  },
  codeContentWrapper: {
    padding: 15,
  },
  codeContent: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', // Use monospace font
    fontSize: 13,
    lineHeight: 18,
  },
});

export default CodeBlock;