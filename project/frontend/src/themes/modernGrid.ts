import type { CrosswordTheme } from '../types/theme';

export const modernGridTheme: CrosswordTheme = {
  id: 'modern-grid',
  name: 'Modern Grid',
  background: 'bg-slate-900 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]',
  board: 'bg-slate-700 p-[1px] gap-[1px] border border-slate-600 rounded-xl overflow-hidden shadow-2xl',
  cell: 'bg-slate-800/80 backdrop-blur-md',
  blackCell: 'bg-slate-950/80',
  selectedCell: 'bg-indigo-900/50 ring-2 ring-indigo-500 z-10',
  completedCell: 'bg-emerald-900/20 text-emerald-400',
  clueNumber: 'text-slate-500 font-semibold',
  hover: 'hover:bg-slate-700 transition-colors duration-200',
  typography: 'text-slate-100 font-bold',
};
