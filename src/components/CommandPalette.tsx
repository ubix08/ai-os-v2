import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command } from 'cmdk'
import { useAppStore } from '@/stores/appStore'
import { getAllModules } from '@/modules'
import {
  LayoutDashboard, ListTodo, FileText, MessageSquare, Search, Settings,
  Sun, Moon, Download, Github, Sparkles
} from 'lucide-react'
import { exportAll } from '@/lib/export'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  LayoutDashboard, ListTodo, FileText, MessageSquare, Search, Settings,
  Sun, Moon, Download, Github, Sparkles,
}

export function CommandPalette() {
  const { commandPaletteOpen: open, setCommandPaletteOpen: setOpen, theme, toggleTheme, setActiveModule } = useAppStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  const runCommand = useCallback((action: () => void) => {
    setOpen(false)
    setSearch('')
    action()
  }, [setOpen])

  const modules = getAllModules()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden">
              <div className="flex items-center border-b border-border px-3">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search commands and modules..."
                  className="flex-1 h-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                  autoFocus
                />
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Modules" className="text-xs text-muted-foreground px-2 py-1.5">
                  {modules.map((mod) => {
                    const Icon = iconMap[mod.icon] || LayoutDashboard
                    return (
                      <Command.Item
                        key={mod.id}
                        value={mod.id}
                        onSelect={() => runCommand(() => setActiveModule(mod.id))}
                        className={cn(
                          'flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer',
                          'aria-selected:bg-accent aria-selected:text-accent-foreground',
                          'text-foreground',
                        )}
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span>{mod.name}</span>
                        {mod.pro && (
                          <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Pro</span>
                        )}
                      </Command.Item>
                    )
                  })}
                </Command.Group>

                <Command.Group heading="Actions" className="text-xs text-muted-foreground px-2 py-1.5">
                  <Command.Item
                    onSelect={() => runCommand(toggleTheme)}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-accent text-foreground"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => { exportAll(); setActiveModule('settings') })}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-accent text-foreground"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export All Data</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground flex items-center gap-4">
                <span><kbd className="px-1 py-0.5 rounded bg-muted font-mono">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1 py-0.5 rounded bg-muted font-mono">↵</kbd> Open</span>
                <span><kbd className="px-1 py-0.5 rounded bg-muted font-mono">Esc</kbd> Close</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
