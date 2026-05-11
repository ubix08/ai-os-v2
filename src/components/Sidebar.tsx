import { useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import { getEnabledModules } from '@/modules'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ListTodo, FileText, MessageSquare, Search, Settings,
  ChevronLeft, ChevronRight, Sparkles, Lock, X
} from 'lucide-react'

const iconMap: Record<string, any> = {
  LayoutDashboard, ListTodo, FileText, MessageSquare, Search, Settings,
}

export function Sidebar() {
  const {
    sidebarOpen, sidebarWidth, toggleSidebar, activeModule, setActiveModule,
    productConfig, isPro, theme, toggleTheme, mobileSidebarOpen, setMobileSidebarOpen,
  } = useAppStore()

  const modules = useMemo(() => {
    if (!productConfig) return []
    return getEnabledModules(productConfig.enabledModules)
  }, [productConfig])

  useEffect(() => {
    setActiveModule('dashboard')
  }, [])

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="font-semibold text-sm text-sidebar-foreground truncate">
            {productConfig?.name ?? 'AI OS'}
          </span>
        </div>
        <button
          onClick={() => { toggleSidebar(); setMobileSidebarOpen(false) }}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors hidden md:block"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors md:hidden"
        >
          <X className="w-4 h-4" />
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
              onClick={() => {
                if (!locked) {
                  setActiveModule(mod.id)
                  setMobileSidebarOpen(false)
                }
              }}
              disabled={locked}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px]',
                activeModule === mod.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                locked && 'opacity-50 cursor-not-allowed',
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left truncate">{mod.name}</span>
              {locked && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
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
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? sidebarWidth : 0 }}
        className={cn(
          'h-screen border-r border-sidebar-border bg-sidebar overflow-hidden flex-shrink-0',
          'hidden md:flex flex-col',
          !sidebarOpen && 'border-r-0',
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-sidebar border-r border-sidebar-border md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop collapsed toggle */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute left-2 top-3 p-1.5 rounded-md bg-sidebar border border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </>
  )
}
