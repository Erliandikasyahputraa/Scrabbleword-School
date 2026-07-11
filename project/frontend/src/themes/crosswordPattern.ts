import type { CrosswordTheme } from '../types/theme';

export const crosswordPatternTheme: CrosswordTheme = {
  id: 'crossword-pattern',
  name: 'Crossword Labs',
  background: 'bg-blue-50 bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-blue-200 p-[1px] gap-[1px] border border-blue-300 rounded-lg shadow-sm',
  cell: 'bg-white',
  blackCell: 'bg-blue-900',
  selectedCell: 'bg-yellow-200 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-blue-50 text-blue-900',
  clueNumber: 'text-blue-400 font-semibold',
  hover: 'hover:bg-blue-50 transition-colors duration-200',
  typography: 'text-blue-950 font-bold',
};
