import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground",
      ghost: "bg-transparent hover:bg-muted text-foreground",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
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
