import type { CrosswordTheme } from '../types/theme';

export const spaceTheme: CrosswordTheme = {
  id: 'space',
  name: 'Space',
  background: 'bg-slate-950 bg-[url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg font-size=\'20\' opacity=\'0.04\'%3E%3Ctext x=\'30\' y=\'40\'%3E🪐%3C/text%3E%3Ctext x=\'120\' y=\'50\'%3E🚀%3C/text%3E%3Ctext x=\'60\' y=\'100\'%3E🌙%3C/text%3E%3Ctext x=\'150\' y=\'110\'%3E⭐%3C/text%3E%3Ctext x=\'20\' y=\'160\'%3E☄️%3C/text%3E%3Ctext x=\'100\' y=\'180\'%3E🛰️%3C/text%3E%3Ctext x=\'180\' y=\'160\'%3E⭐%3C/text%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-indigo-400 p-[2px] gap-[2px] border-4 border-slate-800 shadow-[0_0_40px_rgb(99,102,241,0.2)] rounded-xl',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-500 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
};
