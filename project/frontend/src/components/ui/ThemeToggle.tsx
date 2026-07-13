import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../providers/ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-white/50 dark:bg-slate-800/80 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-950 shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
