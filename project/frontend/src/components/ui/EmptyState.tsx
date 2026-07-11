import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryHelp?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, secondaryHelp, className = '' }: EmptyStateProps) {
  return (
    <div className={`p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-card border border-border rounded-2xl shadow-sm ${className}`}>
      <div className="mb-6 text-muted-foreground flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 text-sm sm:text-base leading-relaxed">{description}</p>
      {action && <div className="w-full sm:w-auto">{action}</div>}
      {secondaryHelp && <div className="mt-4 text-xs text-muted-foreground">{secondaryHelp}</div>}
    </div>
  );
}
