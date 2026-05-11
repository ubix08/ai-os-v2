import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductConfig, AIModelConfig } from '@/types'
import { db } from '@/lib/db'

interface AppState {
  // Product config
  productConfig: ProductConfig | null
  setProductConfig: (config: ProductConfig) => void

  // Theme
  theme: 'dark' | 'light'
  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void

  // Sidebar
  sidebarOpen: boolean
  sidebarWidth: number
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void

  // Active module
  activeModule: string
  setActiveModule: (moduleId: string) => void

  // AI config
  aiConfig: AIModelConfig | null
  setAiConfig: (config: AIModelConfig) => void

  // Command palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  // License
  licenseKey: string | null
  isPro: boolean
  setLicenseKey: (key: string | null) => void

  // DB instance (for DI)
  db: typeof db
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      productConfig: null,
      setProductConfig: (config) => set({ productConfig: config }),

      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),

      sidebarOpen: true,
      sidebarWidth: 260,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      activeModule: 'dashboard',
      setActiveModule: (moduleId) => set({ activeModule: moduleId }),

      aiConfig: null,
      setAiConfig: (config) => set({ aiConfig: config }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      licenseKey: null,
      isPro: false,
      setLicenseKey: (key) => set({ licenseKey: key, isPro: key !== null && key.length > 0 }),

      db,
    }),
    {
      name: 'ai-os-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarWidth: state.sidebarWidth,
        sidebarOpen: state.sidebarOpen,
        activeModule: state.activeModule,
        aiConfig: state.aiConfig,
        licenseKey: state.licenseKey,
        isPro: state.isPro,
      }),
    },
  ),
)
