import { createContext } from 'react';
import type { CrosswordTheme } from '../types/theme';

export interface CrosswordThemeContextType {
  activeTheme: CrosswordTheme;
  setTheme: (themeId: string) => void;
  availableThemes: CrosswordTheme[];
}

export const CrosswordThemeContext = createContext<CrosswordThemeContextType | undefined>(undefined);
