// src/context/ThemeContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appThemes, personalities } from '../theme/themes'; // <--- ADD personalities HERE!

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'smallAI_selected_theme_rn';
const MODE_STORAGE_KEY = 'smallAI_theme_mode_rn'; // 'dark' or 'light'

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' or 'dark'
  const [themeName, setThemeName] = useState('default'); // Default theme
  const [colorMode, setColorMode] = useState(systemColorScheme || 'dark'); // Default to system or dark
  const [currentColors, setCurrentColors] = useState(appThemes[themeName][colorMode]);

  useEffect(() => {
    const loadTheme = async () => {
      const storedThemeName = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const storedMode = await AsyncStorage.getItem(MODE_STORAGE_KEY);

      if (storedThemeName && appThemes[storedThemeName]) {
        setThemeName(storedThemeName);
      }
      if (storedMode && (storedMode === 'light' || storedMode === 'dark')) {
        setColorMode(storedMode);
      } else {
        setColorMode(systemColorScheme || 'dark'); // Fallback to system or dark
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  useEffect(() => {
    const selectedTheme = appThemes[themeName];
    if (selectedTheme) {
      setCurrentColors(selectedTheme[colorMode]);
    } else {
      // Fallback if themeName is invalid (shouldn't happen with dropdown)
      setCurrentColors(appThemes['default'][colorMode]);
    }
    // Persist changes
    AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
    AsyncStorage.setItem(MODE_STORAGE_KEY, colorMode);
  }, [themeName, colorMode]);

  const toggleDarkMode = () => {
    setColorMode(prevMode => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const selectTheme = (newThemeName) => {
    if (appThemes[newThemeName]) {
      setThemeName(newThemeName);
    } else {
      console.warn(`Theme '${newThemeName}' not found, falling back to 'default'.`);
      setThemeName('default');
    }
  };

  return (
    <ThemeContext.Provider value={{
      themeName,
      colorMode,
      colors: currentColors,
      toggleDarkMode,
      selectTheme,
      allThemes: Object.keys(appThemes), // For dropdowns
      personalities: personalities // Export personalities from themes.js
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);