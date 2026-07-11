import React, { useContext, useState, useEffect } from 'react';
import type { CrosswordTheme } from '../types/theme';
import { themes, defaultTheme } from '../themes';
import { CrosswordThemeContext } from './CrosswordThemeContext';

/**
 * Injects the active crossword theme's design tokens into :root as CSS variables.
 * This propagates the theme language across cards, buttons, badges, scrollbars, and focus rings.
 */
function applyThemeTokens(theme: CrosswordTheme) {
  const root = document.documentElement;
  const { tokens } = theme;

  // Override semantic CSS variables used by all UI components
  root.style.setProperty('--primary', tokens.primary);
  root.style.setProperty('--ring', tokens.ring);

  // Theme-specific custom properties
  root.style.setProperty('--theme-accent-stripe', tokens.accentStripe);
  root.style.setProperty('--theme-scrollbar', tokens.scrollbar);
  root.style.setProperty('--theme-badge-bg', tokens.badge);
  root.style.setProperty('--theme-badge-text', tokens.badgeText);
  root.style.setProperty('--theme-button-primary', tokens.buttonPrimary);
  root.style.setProperty('--theme-button-primary-text', tokens.buttonPrimaryText);
  root.style.setProperty('--theme-card-shadow', tokens.cardShadow);
  root.style.setProperty('--theme-illustration-color', tokens.illustrationColor);

  // Apply page background only if in a dark-themed crossword theme (Space, Technology)
  const isDarkTheme = theme.id === 'space' || theme.id === 'technology';
  if (isDarkTheme) {
    root.setAttribute('data-crossword-theme-dark', 'true');
  } else {
    root.removeAttribute('data-crossword-theme-dark');
  }
  root.setAttribute('data-crossword-theme', theme.id);
}

export function CrosswordThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<CrosswordTheme>(defaultTheme);

  // Apply tokens immediately on mount and on theme change
  useEffect(() => {
    applyThemeTokens(activeTheme);
  }, [activeTheme]);

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
