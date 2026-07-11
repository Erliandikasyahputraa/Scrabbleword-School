import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 focus:ring-ring",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring",
      outline: "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground focus:ring-ring",
      ghost: "bg-transparent hover:bg-muted text-foreground focus:ring-ring",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
    }

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    }

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`

    return (
      <button ref={ref} className={classes} {...props} />
    )
  }
)

Button.displayName = "Button"
