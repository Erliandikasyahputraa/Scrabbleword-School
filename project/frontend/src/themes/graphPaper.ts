import type { CrosswordTheme } from '../types/theme';

export const graphPaperTheme: CrosswordTheme = {
  id: 'graph-paper',
  name: 'Graph Paper',
  background: 'bg-[#f0fdf4] bg-[linear-gradient(rgba(134,239,172,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(134,239,172,0.5)_1px,transparent_1px)] bg-[size:20px_20px]',
  board: 'bg-green-300 p-[1px] gap-[1px] border-2 border-green-400 shadow-sm rounded-sm',
  cell: 'bg-white',
  blackCell: 'bg-green-800/80',
  selectedCell: 'bg-green-100 ring-2 ring-green-500 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-green-600 font-mono font-bold',
  hover: 'hover:bg-green-50 transition-colors duration-150',
  typography: 'text-green-950 font-bold font-mono',
};
