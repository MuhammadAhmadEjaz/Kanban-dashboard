import React, { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/theme';
import GlobalStyles from '../styles/GlobalStyles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // On mount, check for theme in localStorage or prefer-color-scheme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeMode(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeMode('dark');
    }
  }, []);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue: ThemeContextType = {
    themeMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 