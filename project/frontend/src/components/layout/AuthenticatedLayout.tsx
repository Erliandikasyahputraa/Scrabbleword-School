import { Outlet, Link, Navigate, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../providers/AuthProvider"
import { ThemeToggle } from "../ui/ThemeToggle"

export function AuthenticatedLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* AppSidebar */}
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!isCollapsed && <span className="font-bold text-xl text-primary tracking-tight">TekaTeki</span>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors mx-auto"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            <span className="w-5 h-5 flex items-center justify-center">🏠</span>
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/courses" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            <span className="w-5 h-5 flex items-center justify-center">📚</span>
            {!isCollapsed && <span>Courses</span>}
          </Link>
          {user?.role === 'admin' && (
            <Link to="/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors font-medium">
              <span className="w-5 h-5 flex items-center justify-center">⚙️</span>
              {!isCollapsed && <span>Users</span>}
            </Link>
          )}
          {user?.role !== 'student' && (
            <Link to="/approvals" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors font-medium">
              <span className="w-5 h-5 flex items-center justify-center">👥</span>
              {!isCollapsed && <span>Approvals</span>}
            </Link>
          )}
        </nav>
      </aside>

      {/* Main content frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">
            {user.role === 'admin' ? 'Admin Portal' : user.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
          </span>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-700 pl-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
