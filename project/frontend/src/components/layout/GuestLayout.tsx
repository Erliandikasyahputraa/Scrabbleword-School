import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { ThemeToggle } from "../ui/ThemeToggle"
import { AppThemeBackgroundLayer } from "../crossword/AppThemeBackgroundLayer"
import { Logo } from "../ui/Logo"

export function GuestLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      <AppThemeBackgroundLayer />
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 flex items-center gap-4">
        <ThemeToggle />
      </div>
      
      {/* Left Column: Minimalist Hero Section (~38% on Desktop) */}
      <div className="hidden lg:flex lg:w-[38%] xl:w-[35%] flex-col justify-between p-12 xl:p-16 bg-slate-900 dark:bg-slate-950 text-white relative z-10 border-r border-border/10 shadow-2xl">
        {/* Subtle abstract background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-900/20 opacity-50 pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          <Logo size={48} className="text-white drop-shadow-md" />
        </div>

        <div className="relative z-10 mb-12 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
          <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-[1.15] mb-6 text-slate-50">
            Elevate your <br className="hidden xl:block" />
            English mastery.
          </h1>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            The interactive platform where premium reading meets engaging puzzles.
          </p>
        </div>
      </div>
      
      {/* Right Column: Form Section (~62% on Desktop) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 z-10 overflow-y-auto">
        <div className="w-full flex justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
