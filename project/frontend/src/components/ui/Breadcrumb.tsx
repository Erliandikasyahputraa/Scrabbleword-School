import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function Breadcrumb({ items, className = '' }: { items: BreadcrumbItem[], className?: string }) {
  return (
    <nav className={`flex text-sm font-medium text-muted-foreground ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground/50" />}
              {isLast ? (
                <span className="text-foreground" aria-current="page">{item.label}</span>
              ) : item.href ? (
                <a href={item.href} className="hover:text-foreground transition-colors">{item.label}</a>
              ) : (
                <button onClick={item.onClick} className="hover:text-foreground transition-colors">{item.label}</button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
