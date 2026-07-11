import type { CrosswordTheme } from '../types/theme';

export const educationTheme: CrosswordTheme = {
  id: 'education',
  name: 'Education',
  background: 'bg-blue-50',
  board: 'bg-blue-900 p-[2px] gap-[2px] border-4 border-blue-900 shadow-[0_8px_30px_rgb(30,58,138,0.18)] rounded-xl',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-400 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
  tokens: {
    primary: '221 83% 53%',         // blue-600
    ring: '221 83% 53%',
    border: '214 32% 88%',
    accentStripe: '#1d4ed8',
    scrollbar: '#93c5fd',
    badge: '#dbeafe',
    badgeText: '#1e3a8a',
    buttonPrimary: '#1d4ed8',
    buttonPrimaryText: '#ffffff',
    cardShadow: 'rgba(29, 78, 216, 0.08)',
    pageBackground: '#f0f6ff',
    illustrationColor: '#1e3a8a',
  },
};
