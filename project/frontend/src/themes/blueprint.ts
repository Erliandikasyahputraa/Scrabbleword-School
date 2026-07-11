import type { CrosswordTheme } from '../types/theme';

export const blueprintTheme: CrosswordTheme = {
  id: 'blueprint',
  name: 'Blueprint',
  background: 'bg-blue-900 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]',
  board: 'bg-cyan-500/30 p-[1px] gap-[1px] border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]',
  cell: 'bg-blue-950/80',
  blackCell: 'bg-blue-900/50 backdrop-blur-sm',
  selectedCell: 'bg-cyan-900/80 ring-2 ring-cyan-400 z-10 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
  completedCell: 'bg-cyan-950/50 text-cyan-100',
  clueNumber: 'text-cyan-300 font-mono font-bold opacity-80',
  hover: 'hover:bg-blue-800 transition-colors duration-200',
  typography: 'text-cyan-50 font-mono font-bold drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]',
};
