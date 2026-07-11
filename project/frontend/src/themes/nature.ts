import type { CrosswordTheme } from '../types/theme';

export const natureTheme: CrosswordTheme = {
  id: 'nature',
  name: 'Nature',
  background: 'bg-green-50/30 bg-[url("data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2315803d\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M30 40 Q 40 20 50 40 Q 40 50 30 40 Z M80 80 Q 90 60 100 80 Q 90 90 80 80 Z\'/%3E%3Cpath d=\'M10 90 Q 15 80 20 90 Q 15 95 10 90 Z M90 20 Q 95 10 100 20 Q 95 25 90 20 Z\'/%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-green-900 p-[2px] gap-[2px] border-4 border-green-950 shadow-md rounded-[20px] overflow-hidden',
  cell: 'bg-white',
  blackCell: 'bg-green-950',
  selectedCell: 'bg-green-100 ring-2 ring-green-500 z-10',
  completedCell: 'bg-lime-50 text-lime-900',
  clueNumber: 'text-green-900/40 font-bold',
  hover: 'hover:bg-green-50 transition-colors duration-150',
  typography: 'text-green-950 font-bold font-sans',
};
