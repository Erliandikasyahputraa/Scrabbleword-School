type LogoProps = {
  className?: string;
  variant?: 'main' | 'monochrome' | 'symbol';
  size?: number;
};

export function Logo({ className = '', variant = 'main', size = 32 }: LogoProps) {
  const isSymbolOnly = variant === 'symbol';
  const isMonochrome = variant === 'monochrome';

  // Crossword grid icon
  const Symbol = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="2" y="2" width="12" height="12" rx="2" className={isMonochrome ? "fill-current" : "fill-primary"} />
      <rect x="18" y="2" width="12" height="12" rx="2" className={isMonochrome ? "fill-current opacity-70" : "fill-accent"} />
      <rect x="2" y="18" width="12" height="12" rx="2" className={isMonochrome ? "fill-current opacity-50" : "fill-primary/60"} />
      <rect x="18" y="18" width="12" height="12" rx="2" className={isMonochrome ? "fill-current opacity-30" : "fill-primary/30"} />
      {/* Decorative center cross */}
      <path d="M14 16H18M16 14V18" stroke={isMonochrome ? "currentColor" : "white"} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  if (isSymbolOnly) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Symbol />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Symbol />
      <div className="flex flex-col justify-center">
        <span className={`text-xl font-black tracking-tight leading-none ${isMonochrome ? 'text-current' : 'text-slate-900 dark:text-white'}`}>
          Crossword<span className={isMonochrome ? '' : 'text-primary'}>Labs</span>
        </span>
      </div>
    </div>
  );
}
