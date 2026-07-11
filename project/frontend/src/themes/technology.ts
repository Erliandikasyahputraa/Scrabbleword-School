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
};
