import { Suspense, useEffect, useMemo } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { Sidebar } from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { ProGate } from './ProGate'
import { useAppStore } from '@/stores/appStore'
import { getModule, initModules } from '@/modules'
import { Skeleton } from '@/components/ui/skeleton'
import { getDefaultProductConfig } from '@/config'

function ModuleFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-4 gap-4 mt-6">
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
      <div className="flex items-center justify-center h-full">
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

export function AppLayout() {
  const { activeModule, productConfig, setProductConfig, theme } = useAppStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    if (!productConfig) {
      const config = getDefaultProductConfig()
      setProductConfig(config)
    }
    initModules()
  }, [])

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <ModuleRenderer moduleId={activeModule} />
        </main>
        <CommandPalette />
      </div>
    </ErrorBoundary>
  )
}
