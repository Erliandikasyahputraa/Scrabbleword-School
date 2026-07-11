import type { CrosswordTheme } from '../types/theme';

export const educationTheme: CrosswordTheme = {
  id: 'education',
  name: 'Education',
  background: 'bg-blue-50/50 bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e3a8a\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M20 20 l10 5 l-10 5 l-10 -5 z M18 26 l2 1 l0 4 l-2 -1 z M22 26 l2 -1 l0 4 l-2 1 z\'/%3E%3Cpath d=\'M70 70 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M65 80 h20 v2 h-20 z M68 83 h14 v2 h-14 z\'/%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-blue-900 p-[2px] gap-[2px] border-2 border-blue-900 shadow-md rounded-xl overflow-hidden',
  cell: 'bg-white',
  blackCell: 'bg-blue-900/90',
  selectedCell: 'bg-blue-100 ring-2 ring-blue-500 z-10',
  completedCell: 'bg-emerald-50 text-emerald-900',
  clueNumber: 'text-blue-900/60 font-bold',
  hover: 'hover:bg-blue-50 transition-colors duration-150',
  typography: 'text-blue-950 font-bold font-sans',
};
