import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';
import type { CrosswordTheme } from '../../types/theme';
import { Check, Palette } from 'lucide-react';

export function CrosswordThemeSelector() {
  const { activeTheme, setTheme, availableThemes } = useCrosswordTheme();

  return (
    <div className="flex flex-col space-y-3 w-full">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
         <Palette size={16} /> Theme Gallery
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 w-full">
        {availableThemes.map((theme: CrosswordTheme) => (
          <button
            type="button"
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`relative flex flex-col text-left border-2 rounded-xl overflow-hidden transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
              activeTheme.id === theme.id 
                ? 'border-primary ring-1 ring-primary shadow-sm bg-primary/5' 
                : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
            }`}
          >
            <div className={`h-16 w-full ${theme.background} p-2 flex items-center justify-center relative overflow-hidden`}>
              <div className={`w-8 h-8 border-2 ${theme.cell} rounded-sm flex items-center justify-center shadow-sm relative z-10 transform group-hover:scale-110 transition-transform`}>
                 <span className={`text-[12px] font-bold ${theme.typography}`}>A</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
            <div className="px-3 py-2 w-full flex items-center justify-between border-t border-border/50">
              <span className="text-xs font-semibold text-foreground truncate pr-2">{theme.name}</span>
              {activeTheme.id === theme.id && (
                <div className="bg-primary text-primary-foreground rounded-full p-0.5 shrink-0 animate-in zoom-in-50">
                   <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
