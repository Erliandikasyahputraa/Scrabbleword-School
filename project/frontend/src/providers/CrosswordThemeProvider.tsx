import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CrosswordTheme } from '../types/theme';
import { themes, defaultTheme } from '../themes';

interface CrosswordThemeContextType {
  activeTheme: CrosswordTheme;
  setTheme: (themeId: string) => void;
  availableThemes: CrosswordTheme[];
}

const CrosswordThemeContext = createContext<CrosswordThemeContextType | undefined>(undefined);

export function CrosswordThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<CrosswordTheme>(defaultTheme);

  // Load from local storage
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('crosswordLabs_theme');
      if (savedThemeId) {
        const found = themes.find(t => t.id === savedThemeId);
        if (found) {
          setActiveTheme(found);
        }
      }
    } catch (e) {
      console.warn("Failed to load theme from localStorage", e);
    }
  }, []);

  const handleSetTheme = (themeId: string) => {
    const found = themes.find(t => t.id === themeId);
    if (found) {
      setActiveTheme(found);
      try {
        localStorage.setItem('crosswordLabs_theme', themeId);
      } catch (e) {
        console.warn("Failed to save theme to localStorage", e);
      }
    }
  };

  return (
    <CrosswordThemeContext.Provider value={{ activeTheme, setTheme: handleSetTheme, availableThemes: themes }}>
      {children}
    </CrosswordThemeContext.Provider>
  );
}

export function useCrosswordTheme() {
  const context = useContext(CrosswordThemeContext);
  if (context === undefined) {
    throw new Error('useCrosswordTheme must be used within a CrosswordThemeProvider');
  }
  return context;
}
