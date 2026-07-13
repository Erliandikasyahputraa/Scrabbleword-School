import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { ThemeToggle } from "../ui/ThemeToggle"
import { LanguageSwitcher } from "../ui/LanguageSwitcher"

export function GuestLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500 font-sans selection:bg-primary/20">
      
      {/* Ultra subtle background pattern (3-5% opacity) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>
      
      {/* Soft ambient glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none blur-3xl opacity-50 dark:opacity-20" />

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      
      {/* Main Centered Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 z-10 relative">
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Outlet />
        </div>
      </main>

    </div>
  )
}
