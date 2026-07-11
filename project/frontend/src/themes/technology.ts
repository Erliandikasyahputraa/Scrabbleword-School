import type { CrosswordTheme } from '../types/theme';

export const technologyTheme: CrosswordTheme = {
  id: 'technology',
  name: 'Technology',
  background: 'bg-teal-50/50 bg-[url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg font-size=\'20\' opacity=\'0.04\'%3E%3Ctext x=\'20\' y=\'30\'%3E🤖%3C/text%3E%3Ctext x=\'100\' y=\'50\'%3E💻%3C/text%3E%3Ctext x=\'160\' y=\'90\'%3E⚙️%3C/text%3E%3Ctext x=\'40\' y=\'110\'%3E🧠%3C/text%3E%3Ctext x=\'120\' y=\'150\'%3E📡%3C/text%3E%3Ctext x=\'50\' y=\'180\'%3E🔌%3C/text%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-teal-900 p-[2px] gap-[2px] border-4 border-teal-950 shadow-lg rounded-md',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-500 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
};
