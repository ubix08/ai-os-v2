import { Suspense, useEffect, useMemo } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { Sidebar } from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { ProGate } from './ProGate'
import { useAppStore } from '@/stores/appStore'
import { getModule, initModules, getEnabledModules } from '@/modules'
import { Skeleton } from '@/components/ui/skeleton'
import { getDefaultProductConfig } from '@/config'
import { Sparkles, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  LayoutDashboard: Sparkles, ListTodo: Sparkles, FileText: Sparkles,
  MessageSquare: Sparkles, Search: Sparkles, Settings: Sparkles,
}

function ModuleFallback() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl mt-4" />
    </div>
  )
}

function ModuleRenderer({ moduleId }: { moduleId: string }) {
  const mod = getModule(moduleId)

  if (!mod || !mod.component) {
    const fallback = getModule('dashboard')
    if (fallback?.component) {
      const Component = fallback.component
      return (
        <Suspense fallback={<ModuleFallback />}>
          <Component />
        </Suspense>
      )
    }
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-muted-foreground">Module not found</p>
      </div>
    )
  }

  const Component = mod.component

  return (
    <ProGate moduleId={moduleId}>
      <Suspense fallback={<ModuleFallback />}>
        <Component />
      </Suspense>
    </ProGate>
  )
}

function MobileHeader() {
  const { setMobileSidebarOpen, activeModule } = useAppStore()
  const mod = getModule(activeModule)

  return (
    <header className="md:hidden flex items-center gap-3 px-4 h-12 border-b border-border bg-background sticky top-0 z-30">
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="p-1.5 rounded-md hover:bg-accent text-foreground/70"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-sm font-medium truncate text-foreground">
          {mod?.name ?? 'AI OS'}
        </span>
      </div>
    </header>
  )
}

export function AppLayout() {
  const { activeModule, productConfig, setProductConfig, theme } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    if (!productConfig) {
      setProductConfig(getDefaultProductConfig())
    }
    initModules()
  }, [])

  return (
    <ErrorBoundary>
      <div className="flex flex-col md:flex-row h-screen md:h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-0 md:h-screen overflow-hidden">
          <MobileHeader />
          <main className="flex-1 overflow-y-auto">
            <ModuleRenderer moduleId={activeModule} />
          </main>
        </div>
        <CommandPalette />
      </div>
    </ErrorBoundary>
  )
}
