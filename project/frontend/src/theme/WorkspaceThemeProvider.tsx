import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WorkspaceTheme } from './workspaceThemeTypes';
import { workspaceThemes, defaultWorkspaceTheme } from './workspaceThemeRegistry';

interface WorkspaceThemeContextValue {
  activeTheme: WorkspaceTheme;
  setTheme: (themeId: string) => void;
  availableThemes: WorkspaceTheme[];
  isTransitioning: boolean;
}

const WorkspaceThemeContext = createContext<WorkspaceThemeContextValue | undefined>(undefined);

export function WorkspaceThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<WorkspaceTheme>(defaultWorkspaceTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('workspace-theme');
      if (savedThemeId) {
        const found = workspaceThemes.find(t => t.id === savedThemeId);
        if (found) {
          setActiveTheme(found);
        }
      }
    } catch (e) {
      console.warn("Failed to load workspace theme from localStorage", e);
    }
  }, []);

  // Update CSS Variables on theme change
  useEffect(() => {
    const root = document.documentElement;
    const { tokens } = activeTheme;
    
    root.style.setProperty('--workspace-primary', tokens.primary);
    root.style.setProperty('--workspace-accent', tokens.accent);
    root.style.setProperty('--workspace-hover', tokens.hover);
    root.style.setProperty('--workspace-ring', tokens.ring);
    root.style.setProperty('--workspace-shadow', tokens.shadow);
    
    // To support animation, we might set a data attribute
    root.setAttribute('data-workspace-theme', activeTheme.id);
  }, [activeTheme]);

  const handleSetTheme = (themeId: string) => {
    if (activeTheme.id === themeId) return;

    const found = workspaceThemes.find(t => t.id === themeId);
    if (found) {
      // Trigger fade out
      setIsTransitioning(true);
      
      // Allow fade out to complete before switching
      setTimeout(() => {
        setActiveTheme(found);
        try {
          localStorage.setItem('workspace-theme', themeId);
        } catch (e) {
          console.warn("Failed to save workspace theme to localStorage", e);
        }
        
        // Remove transition state after the new image has a chance to render
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50); // slight delay to ensure DOM update before fading in
      }, 300); // 300ms fade out duration
    }
  };

  return (
    <WorkspaceThemeContext.Provider value={{ 
      activeTheme, 
      setTheme: handleSetTheme, 
      availableThemes: workspaceThemes,
      isTransitioning
    }}>
      {children}
    </WorkspaceThemeContext.Provider>
  );
}

export function useWorkspaceTheme() {
  const context = useContext(WorkspaceThemeContext);
  if (context === undefined) {
    throw new Error('useWorkspaceTheme must be used within a WorkspaceThemeProvider');
  }
  return context;
}
