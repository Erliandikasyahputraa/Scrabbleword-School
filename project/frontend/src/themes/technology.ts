import type { CrosswordTheme } from '../types/theme';

export const technologyTheme: CrosswordTheme = {
  id: 'technology',
  name: 'Technology',
  background: 'bg-slate-900',
  board: 'bg-teal-800 p-[2px] gap-[2px] border-4 border-teal-950 shadow-[0_8px_30px_rgb(13,148,136,0.2)] rounded-md',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-400 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
  tokens: {
    primary: '174 72% 40%',         // teal-600
    ring: '174 72% 40%',
    border: '174 30% 25%',
    accentStripe: '#0d9488',
    scrollbar: '#5eead4',
    badge: '#134e4a',
    badgeText: '#99f6e4',
    buttonPrimary: '#0d9488',
    buttonPrimaryText: '#ffffff',
    cardShadow: 'rgba(13, 148, 136, 0.12)',
    pageBackground: '#0d1117',
    illustrationColor: '#5eead4',
  },
};
