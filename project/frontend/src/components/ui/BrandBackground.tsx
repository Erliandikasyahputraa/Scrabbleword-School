type BrandBackgroundProps = {
  pattern?: 'dots' | 'crossword';
  opacity?: number;
};

export function BrandBackground({ pattern = 'crossword', opacity = 0.02 }: BrandBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {pattern === 'crossword' && (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="crossword-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none" />
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              {/* Random filled squares for crossword effect */}
              <rect x="0" y="0" width="20" height="20" fill="currentColor" fillOpacity="0.5" />
              <rect x="40" y="20" width="20" height="20" fill="currentColor" fillOpacity="0.3" />
              <rect x="20" y="40" width="20" height="20" fill="currentColor" fillOpacity="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crossword-pattern)" style={{ color: 'var(--color-primary)', opacity }} />
        </svg>
      )}
      
      {pattern === 'dots' && (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" style={{ color: 'var(--color-primary)', opacity }} />
        </svg>
      )}
    </div>
  );
}
