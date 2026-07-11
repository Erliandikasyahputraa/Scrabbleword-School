import { Outlet, Link, Navigate, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../../providers/AuthProvider"
import { ThemeToggle } from "../ui/ThemeToggle"
import { AppThemeBackgroundLayer } from "../crossword/AppThemeBackgroundLayer"
import { Logo } from "../ui/Logo"
import { Menu, X, Home, BookOpen, Users, ShieldCheck } from "lucide-react"

export function AuthenticatedLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
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

  const NavLinks = () => (
    <>
      <Link to="/" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
        <span className="w-5 h-5 flex items-center justify-center"><Home size={20} /></span>
        {(!isCollapsed || isMobileMenuOpen) && <span>Dashboard</span>}
      </Link>
      <Link to="/courses" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/courses') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
        <span className="w-5 h-5 flex items-center justify-center"><BookOpen size={20} /></span>
        {(!isCollapsed || isMobileMenuOpen) && <span>Courses</span>}
      </Link>
      {user?.role === 'admin' && (
        <Link to="/users" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/users') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
          <span className="w-5 h-5 flex items-center justify-center"><Users size={20} /></span>
          {(!isCollapsed || isMobileMenuOpen) && <span>Users</span>}
        </Link>
      )}
      {user?.role !== 'student' && (
        <Link to="/approvals" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/approvals') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
          <span className="w-5 h-5 flex items-center justify-center"><ShieldCheck size={20} /></span>
          {(!isCollapsed || isMobileMenuOpen) && <span>Approvals</span>}
        </Link>
      )}
    </>
  )

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground transition-colors">
      <AppThemeBackgroundLayer />
      
      {/* Desktop Sidebar (lg and up) */}
      <aside className={`hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 shadow-sm shrink-0 sticky top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!isCollapsed && <Logo size={24} className="ml-1" />}
          {isCollapsed && <Logo variant="symbol" size={24} className="mx-auto" />}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors mx-auto"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <NavLinks />
        </nav>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-2xl transform transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Logo size={24} />
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          <NavLinks />
        </nav>
      </aside>

      {/* Main content frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="min-h-16 bg-card/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <span className="font-semibold text-lg text-foreground">
              {user.role === 'admin' ? 'Admin Portal' : user.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-auto">
            <ThemeToggle />
            <div className="flex items-center gap-3 sm:gap-4 border-l border-border pl-3 sm:pl-4 relative">
              
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-muted p-1.5 rounded-lg transition-colors text-left"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold truncate max-w-[120px] sm:max-w-[200px] text-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-border sm:hidden mb-1">
                      <span className="text-sm font-semibold block text-foreground truncate">{user.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
