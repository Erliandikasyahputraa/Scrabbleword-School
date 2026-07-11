import type { CrosswordTheme } from '../types/theme';

export const classicTheme: CrosswordTheme = {
  id: 'classic',
  name: 'Classic',
  // bg-[#f5f0e8] = warm paper tone
  background: 'bg-[#f5f0e8]',
  board: 'bg-black p-[2px] gap-[2px] border-2 border-slate-900 shadow-[0_4px_16px_rgb(0,0,0,0.12)] rounded-sm',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-400 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
};
