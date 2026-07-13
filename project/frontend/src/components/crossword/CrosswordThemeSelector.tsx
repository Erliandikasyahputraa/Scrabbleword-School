import { useTranslation } from 'react-i18next';
import { useWorkspaceTheme } from '../../theme/useWorkspaceTheme';
import type { WorkspaceTheme } from '../../theme/workspaceThemeTypes';
import { Check, Palette } from 'lucide-react';

// A 3x3 mock crossword grid pattern for the mini-preview
const MOCK_GRID = [
  [true,  true,  false],
  [false, true,  true ],
  [true,  true,  false],
];

export function CrosswordThemeSelector() {
  const { t } = useTranslation('courses');
  const { activeTheme, setTheme, availableThemes } = useWorkspaceTheme();

  return (
    <div className="flex flex-col space-y-2 w-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
        <Palette size={13} /> {t('themeGallery', 'Theme Gallery')}
      </h3>
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {availableThemes.map((theme: WorkspaceTheme) => {
          const isActive = activeTheme.id === theme.id;
          return (
            <button
              type="button"
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              title={t(theme.nameKey)}
              className={`relative flex flex-col text-left rounded-lg overflow-hidden transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                isActive
                  ? 'ring-2 shadow-md scale-[1.03]'
                  : 'ring-1 ring-border hover:shadow-sm hover:scale-[1.02]'
              }`}
              style={{
                '--focus-ring': isActive ? theme.tokens.ring : 'var(--workspace-ring)',
                borderColor: isActive ? theme.tokens.primary : 'transparent',
                boxShadow: isActive ? `0 0 0 2px ${theme.tokens.primary}` : undefined,
              } as React.CSSProperties}
              aria-pressed={isActive}
            >
              {/* Mini Theme Preview — JPEG background + crossword grid */}
              <div 
                className={`relative h-11 w-full overflow-hidden transition-colors duration-300`}
                style={{
                  backgroundImage: `url(${theme.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Mini crossword grid — centered in the card */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className={`transition-all duration-300 group-hover:scale-105 bg-slate-200/50 p-0.5 rounded-sm`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gridTemplateRows: 'repeat(3, 1fr)',
                      width: 30,
                      height: 30,
                      gap: '1px'
                    }}
                  >
                    {MOCK_GRID.map((row, rIdx) =>
                      row.map((isWhite, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`w-full h-full ${isWhite ? 'bg-white' : 'bg-slate-800'}`}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
              </div>

              {/* Theme name + active indicator */}
              <div className="px-2 py-1 w-full flex items-center justify-between bg-card border-t border-border/40">
                <span className="text-[9px] font-semibold text-foreground/80 truncate leading-none">
                  {t(theme.nameKey)}
                </span>
                {isActive && (
                  <Check
                    size={9}
                    strokeWidth={3.5}
                    className="shrink-0 animate-in zoom-in-75 duration-150"
                    style={{ color: theme.tokens.primary }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
