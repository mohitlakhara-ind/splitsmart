import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  themeMode: 'light',
  isDarkMode: false,
  toggleThemeMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme_mode');
        if (storedTheme) {
          setThemeMode(storedTheme);
        }
      } catch (error) {
        console.error('Failed to load stored theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleThemeMode = async () => {
    try {
      const nextTheme = themeMode === 'light' ? 'dark' : 'light';
      setThemeMode(nextTheme);
      await AsyncStorage.setItem('theme_mode', nextTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const isDarkMode = themeMode === 'dark';

  return (
    <ThemeContext.Provider value={{ themeMode, isDarkMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
