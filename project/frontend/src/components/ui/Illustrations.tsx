type IllustrationProps = {
  className?: string;
  size?: number;
};

// Teacher/Educator standing by a board
export const TeacherIllustration = ({ className = '', size = 120 }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="60" cy="60" r="50" className="fill-primary/5" />
    <path d="M40 80C40 68.9543 48.9543 60 60 60C71.0457 60 80 68.9543 80 80V90H40V80Z" className="fill-primary/20" />
    <circle cx="60" cy="45" r="15" className="fill-primary/30" />
    <rect x="25" y="30" width="70" height="40" rx="4" stroke="currentColor" strokeWidth="3" className="text-primary opacity-20" />
    <path d="M40 80C40 68.9543 48.9543 60 60 60C71.0457 60 80 68.9543 80 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="45" r="15" stroke="currentColor" strokeWidth="3" />
    <path d="M30 40H45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent" />
    <path d="M30 50H50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent" />
  </svg>
);

// Empty Crossword
export const EmptyCrosswordIllustration = ({ className = '', size = 120 }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-[pulse_3s_ease-in-out_infinite]`}>
    <circle cx="60" cy="60" r="50" className="fill-slate-100 dark:fill-slate-800" />
    <rect x="30" y="30" width="60" height="60" rx="8" className="fill-primary/10" />
    <rect x="35" y="35" width="15" height="15" rx="2" className="fill-primary/40" />
    <rect x="52.5" y="35" width="15" height="15" rx="2" className="fill-primary/20" />
    <rect x="35" y="52.5" width="15" height="15" rx="2" className="fill-primary/20" />
    <rect x="52.5" y="52.5" width="15" height="15" rx="2" className="fill-accent/60" />
    <rect x="70" y="52.5" width="15" height="15" rx="2" className="fill-primary/20" />
    <rect x="52.5" y="70" width="15" height="15" rx="2" className="fill-primary/20" />
    <path d="M25 25L95 95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-10" />
  </svg>
);

// Empty State / Search
export const SearchIllustration = ({ className = '', size = 120 }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-[pulse_3s_ease-in-out_infinite]`}>
    <circle cx="60" cy="60" r="50" className="fill-accent/10" />
    <circle cx="50" cy="50" r="20" className="fill-primary/20" stroke="currentColor" strokeWidth="4" />
    <path d="M65 65L85 85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="45" cy="45" r="4" className="fill-accent" />
    <circle cx="55" cy="55" r="2" className="fill-accent" />
  </svg>
);

// Achievement / Celebration
export const AchievementIllustration = ({ className = '', size = 120 }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="60" cy="60" r="50" className="fill-success/10" />
    <path d="M60 20L72.3607 45.0393L100 49.0538L80 68.541L84.7214 96.0924L60 83.1077L35.2786 96.0924L40 68.541L20 49.0538L47.6393 45.0393L60 20Z" className="fill-accent" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M30 30L20 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-success" />
    <path d="M90 30L100 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-success" />
    <path d="M20 70L10 75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-success" />
    <path d="M100 70L110 75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-success" />
  </svg>
);

// Document / PDF Reading
export const DocumentIllustration = ({ className = '', size = 120 }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="60" cy="60" r="50" className="fill-primary/10" />
    <rect x="35" y="25" width="50" height="70" rx="4" className="fill-white dark:fill-slate-800" stroke="currentColor" strokeWidth="4" />
    <path d="M45 45H75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary" />
    <path d="M45 60H75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary" />
    <path d="M45 75H65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary" />
    <rect x="50" y="15" width="20" height="10" rx="2" className="fill-accent" stroke="currentColor" strokeWidth="2" />
  </svg>
);
