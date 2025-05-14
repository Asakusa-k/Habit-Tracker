import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  error: string;
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  placeholderText: string;
  border: string;
  white: string;
  black: string;
}

const lightColors: ThemeColors = {
  primary: '#5FBDB0',
  secondary: '#B0A3D4',
  accent: '#F98B7F',
  success: '#7FB069',
  error: '#E07A5F',
  background: '#F9F9F9',
  card: '#FFFFFF',
  text: '#333333',
  secondaryText: '#757575',
  placeholderText: '#A0A0A0',
  border: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
};

const darkColors: ThemeColors = {
  primary: '#5FBDB0',
  secondary: '#B0A3D4',
  accent: '#F98B7F',
  success: '#7FB069',
  error: '#E07A5F',
  background: '#121212',
  card: '#1E1E1E',
  text: '#F0F0F0',
  secondaryText: '#BDBDBD',
  placeholderText: '#808080',
  border: '#2C2C2C',
  white: '#FFFFFF',
  black: '#000000',
};

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [theme, setTheme] = useState<ThemeType>(systemTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme !== null) {
        setTheme(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const saveTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('@theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};