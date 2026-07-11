import { Outlet, Navigate, Link } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { ThemeToggle } from "../ui/ThemeToggle"
import { BrandBackground } from "../ui/BrandBackground"
import { Logo } from "../ui/Logo"

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      <BrandBackground pattern="dots" opacity={0.03} />
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
           <Logo size={28} />
        </Link>
        <ThemeToggle />
      </div>

      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-3xl" />
      
      <div className="z-10 w-full max-w-md flex justify-center">
        <Outlet />
      </div>
    </div>
  )
}
