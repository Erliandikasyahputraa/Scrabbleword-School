import { useWorkspaceTheme } from '../../theme/useWorkspaceTheme';

export function ThemeBoardBackground() {
  const { activeTheme, isTransitioning } = useWorkspaceTheme();

  return (
    <div 
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ease-in-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.68), rgba(255, 255, 255, 0.68)), url(${activeTheme.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Dark mode overlay adjustment if necessary (assumes global dark mode might want a slightly darker overlay) */}
      <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/70" />
    </div>
  );
}
