import type { WorkspaceTheme } from './workspaceThemeTypes';

export const workspaceThemes: WorkspaceTheme[] = [
  {
    id: 'sunset-valley',
    nameKey: 'themes.sunsetValley',
    descriptionKey: 'themes.sunsetValleyDesc',
    image: '/assets/themes/sunset-valley.jpeg',
    tokens: {
      primary: '#f97316', // orange-500
      accent: '#fdba74', // orange-300
      hover: '#ea580c', // orange-600
      ring: 'rgba(249, 115, 22, 0.4)', // orange-500/40
      shadow: 'rgba(249, 115, 22, 0.25)',
    }
  },
  {
    id: 'school-adventure',
    nameKey: 'themes.schoolAdventure',
    descriptionKey: 'themes.schoolAdventureDesc',
    image: '/assets/themes/school-adventure.jpeg',
    tokens: {
      primary: '#3b82f6', // blue-500
      accent: '#93c5fd', // blue-300
      hover: '#2563eb', // blue-600
      ring: 'rgba(59, 130, 246, 0.4)', // blue-500/40
      shadow: 'rgba(59, 130, 246, 0.25)',
    }
  },
  {
    id: 'fantasy-portal',
    nameKey: 'themes.fantasyPortal',
    descriptionKey: 'themes.fantasyPortalDesc',
    image: '/assets/themes/fantasy-portal.jpeg',
    tokens: {
      primary: '#8b5cf6', // violet-500
      accent: '#c4b5fd', // violet-300
      hover: '#7c3aed', // violet-600
      ring: 'rgba(139, 92, 246, 0.4)', // violet-500/40
      shadow: 'rgba(139, 92, 246, 0.25)',
    }
  },
  {
    id: 'dreamy-sky',
    nameKey: 'themes.dreamySky',
    descriptionKey: 'themes.dreamySkyDesc',
    image: '/assets/themes/dreamy-sky.jpeg',
    tokens: {
      primary: '#06b6d4', // cyan-500
      accent: '#67e8f9', // cyan-300
      hover: '#0891b2', // cyan-600
      ring: 'rgba(6, 182, 212, 0.4)', // cyan-500/40
      shadow: 'rgba(6, 182, 212, 0.25)',
    }
  },
  {
    id: 'watercolor-hills',
    nameKey: 'themes.watercolorHills',
    descriptionKey: 'themes.watercolorHillsDesc',
    image: '/assets/themes/watercolor-hills.jpeg',
    tokens: {
      primary: '#10b981', // emerald-500
      accent: '#6ee7b7', // emerald-300
      hover: '#059669', // emerald-600
      ring: 'rgba(16, 185, 129, 0.4)', // emerald-500/40
      shadow: 'rgba(16, 185, 129, 0.25)',
    }
  },
  {
    id: 'balloon-valley',
    nameKey: 'themes.balloonValley',
    descriptionKey: 'themes.balloonValleyDesc',
    image: '/assets/themes/balloon-valley.jpeg',
    tokens: {
      primary: '#f43f5e', // rose-500
      accent: '#fda4af', // rose-300
      hover: '#e11d48', // rose-600
      ring: 'rgba(244, 63, 94, 0.4)', // rose-500/40
      shadow: 'rgba(244, 63, 94, 0.25)',
    }
  }
];

export const defaultWorkspaceTheme = workspaceThemes[0];
