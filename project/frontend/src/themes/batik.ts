import type { CrosswordTheme } from '../types/theme';

export const batikTheme: CrosswordTheme = {
  id: 'batik',
  name: 'Batik',
  background: 'bg-amber-50',
  board: 'bg-amber-900 p-[2px] gap-[2px] border-4 border-amber-950 shadow-[0_8px_30px_rgb(120,53,15,0.18)] rounded-sm',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-400 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
  tokens: {
    primary: '25 78% 42%',          // deep amber/batik brown
    ring: '25 78% 42%',
    border: '35 50% 82%',
    accentStripe: '#b45309',
    scrollbar: '#fcd34d',
    badge: '#fef3c7',
    badgeText: '#92400e',
    buttonPrimary: '#b45309',
    buttonPrimaryText: '#fffbeb',
    cardShadow: 'rgba(180, 83, 9, 0.09)',
    pageBackground: '#fffbeb',
    illustrationColor: '#78350f',
  },
};
