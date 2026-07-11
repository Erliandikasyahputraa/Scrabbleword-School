import type { CrosswordTheme } from '../types/theme';

export const spaceTheme: CrosswordTheme = {
  id: 'space',
  name: 'Space',
  background: 'bg-slate-950',
  board: 'bg-indigo-500 p-[2px] gap-[2px] border-4 border-indigo-900 shadow-[0_0_40px_rgb(99,102,241,0.25)] rounded-xl',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-400 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
};
