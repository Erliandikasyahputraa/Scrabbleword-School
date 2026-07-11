import type { CrosswordTheme } from '../types/theme';

export const classicTheme: CrosswordTheme = {
  id: 'classic',
  name: 'Classic',
  background: 'bg-[#f5f0e8]',
  board: 'bg-black p-[2px] gap-[2px] border-2 border-slate-900 shadow-[0_4px_16px_rgb(0,0,0,0.12)] rounded-sm',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-400 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
  tokens: {
    primary: '33 60% 35%',          // warm sepia brown
    ring: '33 60% 35%',
    border: '34 30% 82%',
    accentStripe: '#92400e',
    scrollbar: '#d6c4a8',
    badge: '#fef3c7',
    badgeText: '#78350f',
    buttonPrimary: '#92400e',
    buttonPrimaryText: '#fefce8',
    cardShadow: 'rgba(146, 64, 14, 0.08)',
    pageBackground: '#faf7f2',
    illustrationColor: '#92400e',
  },
};
