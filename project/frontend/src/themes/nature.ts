import type { CrosswordTheme } from '../types/theme';

export const natureTheme: CrosswordTheme = {
  id: 'nature',
  name: 'Nature',
  background: 'bg-green-50',
  board: 'bg-green-900 p-[2px] gap-[2px] border-4 border-green-950 shadow-[0_8px_30px_rgb(20,83,45,0.15)] rounded-2xl',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-400 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
  tokens: {
    primary: '142 71% 35%',         // green-700
    ring: '142 71% 35%',
    border: '142 30% 82%',
    accentStripe: '#15803d',
    scrollbar: '#86efac',
    badge: '#dcfce7',
    badgeText: '#14532d',
    buttonPrimary: '#16a34a',
    buttonPrimaryText: '#f0fdf4',
    cardShadow: 'rgba(22, 163, 74, 0.08)',
    pageBackground: '#f0fdf4',
    illustrationColor: '#14532d',
  },
};
