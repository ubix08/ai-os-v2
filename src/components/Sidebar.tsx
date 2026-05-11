import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import { getEnabledModules, getAllModules } from '@/modules'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ListTodo, FileText, MessageSquare, Search, Settings,
  ChevronLeft, ChevronRight, Sparkles, Lock
} from 'lucide-react'

const iconMap: Record<string, any> = {
  LayoutDashboard, ListTodo, FileText, MessageSquare, Search, Settings,
}

export function Sidebar() {
  const {
    sidebarOpen, sidebarWidth, toggleSidebar, setSidebarWidth,
    activeModule, setActiveModule, productConfig, isPro, theme, toggleTheme,
  } = useAppStore()

  const modules = useMemo(() => {
    if (!productConfig) return []
    return getEnabledModules(productConfig.enabledModules)
  }, [productConfig])

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? sidebarWidth : 0 }}
      className={cn(
        'h-screen border-r border-sidebar-border bg-sidebar flex flex-col overflow-hidden flex-shrink-0',
        !sidebarOpen && 'border-r-0',
      )}
    >
      {sidebarOpen && (
        <>
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm text-sidebar-foreground">
                {productConfig?.name ?? 'AI OS'}
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {modules.map((mod) => {
              const Icon = iconMap[mod.icon] || LayoutDashboard
              const isProModule = productConfig?.proModules?.includes(mod.id) ?? false
              const locked = isProModule && !isPro

              return (
                <button
                  key={mod.id}
                  onClick={() => !locked && setActiveModule(mod.id)}
                  disabled={locked}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    activeModule === mod.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                    locked && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{mod.name}</span>
                  {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                </button>
              )
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-sidebar-foreground/50">
                v{productConfig?.version ?? '2.0'}
              </span>
              {!isPro && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Free</span>
              )}
            </div>
          </div>
        </>
      )}

      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute left-2 top-3 p-1.5 rounded-md bg-sidebar border border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </motion.aside>
  )
}
