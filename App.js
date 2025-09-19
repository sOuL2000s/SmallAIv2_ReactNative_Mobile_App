// App.js

import 'react-native-gesture-handler'; // Must be at the top for React Navigation
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { ChatProvider } from './src/context/ChatContext';

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <AppNavigator />
          </View>
        </NavigationContainer>
      </ChatProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});