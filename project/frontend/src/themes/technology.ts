import type { CrosswordTheme } from '../types/theme';

export const technologyTheme: CrosswordTheme = {
  id: 'technology',
  name: 'Technology',
  background: 'bg-teal-50/50 bg-[url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%230f766e\' stroke-width=\'1\' stroke-opacity=\'0.1\'%3E%3Cpath d=\'M10 10 h20 v20 h-20 z M40 10 h20 v20 h-20 z M10 40 h20 v20 h-20 z\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\' fill=\'%230f766e\' fill-opacity=\'0.1\'/%3E%3Ccircle cx=\'60\' cy=\'30\' r=\'2\' fill=\'%230f766e\' fill-opacity=\'0.1\'/%3E%3Ccircle cx=\'30\' cy=\'60\' r=\'2\' fill=\'%230f766e\' fill-opacity=\'0.1\'/%3E%3Cpath d=\'M30 30 l30 0 M30 30 l0 30\'/%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-teal-900 p-[2px] gap-[2px] border-4 border-teal-950 shadow-lg rounded-md',
  cell: 'bg-white',
  blackCell: 'bg-teal-950',
  selectedCell: 'bg-teal-100 ring-2 ring-teal-500 z-10',
  completedCell: 'bg-cyan-50 text-cyan-900',
  clueNumber: 'text-teal-900/40 font-mono font-bold',
  hover: 'hover:bg-teal-50 transition-colors duration-150',
  typography: 'text-teal-950 font-bold font-mono',
};
