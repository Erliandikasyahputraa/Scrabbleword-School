import type { CrosswordTheme } from '../types/theme';

export const spaceTheme: CrosswordTheme = {
  id: 'space',
  name: 'Space',
  background: 'bg-slate-950 bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3Ccircle cx=\'80\' cy=\'30\' r=\'1.5\'/%3E%3Ccircle cx=\'40\' cy=\'70\' r=\'1\'/%3E%3Ccircle cx=\'90\' cy=\'85\' r=\'1\'/%3E%3Ccircle cx=\'25\' cy=\'85\' r=\'1\'/%3E%3Ccircle cx=\'55\' cy=\'15\' r=\'1.5\'/%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-indigo-400 p-[2px] gap-[2px] border-4 border-slate-800 shadow-[0_0_40px_rgb(99,102,241,0.2)] rounded-xl',
  cell: 'bg-slate-900',
  blackCell: 'bg-slate-950 shadow-inner',
  selectedCell: 'bg-indigo-900 ring-2 ring-indigo-400 z-10',
  completedCell: 'bg-indigo-950 text-indigo-200',
  clueNumber: 'text-indigo-400/70 font-semibold',
  hover: 'hover:bg-slate-800 transition-colors duration-150',
  typography: 'text-white font-bold font-mono tracking-widest',
};
