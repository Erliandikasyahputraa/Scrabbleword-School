import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../../providers/AuthProvider"
import { ThemeProvider } from "../../providers/ThemeProvider"
import { WorkspaceThemeProvider } from "../../theme/WorkspaceThemeProvider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <WorkspaceThemeProvider>
          <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
          </BrowserRouter>
        </WorkspaceThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
