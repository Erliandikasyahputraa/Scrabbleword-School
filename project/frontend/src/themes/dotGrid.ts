import type { CrosswordTheme } from '../types/theme';

export const dotGridTheme: CrosswordTheme = {
  id: 'dot-grid',
  name: 'Dot Grid',
  background: 'bg-[#faf9f6] bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] bg-[size:24px_24px]',
  board: 'bg-slate-300 p-[1px] gap-[1px] border border-slate-300 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
  cell: 'bg-white',
  blackCell: 'bg-slate-100 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9)] bg-[size:8px_8px] bg-[position:0_0,4px_4px]',
  selectedCell: 'bg-blue-50 ring-2 ring-blue-400 z-10',
  completedCell: 'bg-slate-50 text-slate-900',
  clueNumber: 'text-slate-400 font-medium',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-800 font-medium',
};
