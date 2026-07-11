import { useState, useRef, useEffect } from 'react';
import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';
import { Palette, Check } from 'lucide-react';

export function CrosswordThemeSelector() {
  const { activeTheme, setTheme, availableThemes } = useCrosswordTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Select Theme"
      >
        <Palette size={16} className="text-primary" />
        <span className="hidden sm:inline">{activeTheme.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Select Theme</h4>
             <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto custom-scrollbar p-1">
              {availableThemes.map(theme => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`relative flex flex-col text-left border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                    activeTheme.id === theme.id 
                      ? 'border-primary shadow-md scale-[1.02]' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-sm'
                  }`}
                >
                  <div className={`h-12 w-full ${theme.background} p-2 flex items-center justify-center`}>
                    <div className={`w-6 h-6 border-2 ${theme.cell} rounded-sm flex items-center justify-center shadow-sm`}>
                       <span className={`text-[10px] font-bold ${theme.typography}`}>A</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1.5 w-full bg-white dark:bg-slate-800 flex items-center justify-between`}>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate pr-1">{theme.name}</span>
                    {activeTheme.id === theme.id && <Check size={14} className="text-primary shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
