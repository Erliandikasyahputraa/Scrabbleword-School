import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { ThemeToggle } from "../ui/ThemeToggle"
import { AppThemeBackgroundLayer } from "../crossword/AppThemeBackgroundLayer"
import { Logo } from "../ui/Logo"
import { Sparkles, Target } from "lucide-react"

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
      
      {/* Theme Toggle (Absolute top right of the whole screen) */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <ThemeToggle />
      </div>
      
      {/* Left Column: Hero Section (45% on Desktop) */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-primary to-indigo-800 text-white relative overflow-hidden z-10 shadow-2xl">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="mb-12">
            <Logo size={40} className="text-white drop-shadow-md" />
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Master English <br /> 
            with engaging puzzles.
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            A premium learning platform that combines interactive PDF reading with challenging crossword exercises to solidify your vocabulary.
          </p>
        </div>

        <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-sm">
              <Sparkles size={20} className="text-blue-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Smart Learning</h3>
              <p className="text-blue-200 text-sm">Adaptive materials tailored for you.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-sm">
              <Target size={20} className="text-blue-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Goal Oriented</h3>
              <p className="text-blue-200 text-sm">Track your progress and build streaks.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column: Form Section (55% on Desktop, 100% on Mobile) */}
      <div className="flex-1 lg:w-[55%] flex items-center justify-center p-6 sm:p-12 z-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
