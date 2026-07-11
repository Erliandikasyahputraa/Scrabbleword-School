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
    const savedThemeId = localStorage.getItem('crosswordLabs_theme');
    if (savedThemeId) {
      const found = themes.find(t => t.id === savedThemeId);
      if (found) {
        setActiveTheme(found);
      }
    }
  }, []);

  const setTheme = (themeId: string) => {
    const found = themes.find(t => t.id === themeId);
    if (found) {
      setActiveTheme(found);
      localStorage.setItem('crosswordLabs_theme', themeId);
    }
  };

  return (
    <CrosswordThemeContext.Provider value={{ activeTheme, setTheme, availableThemes: themes }}>
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
