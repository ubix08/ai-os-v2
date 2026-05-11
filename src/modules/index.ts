import type { ModuleDefinition } from '@/types'

const modules = new Map<string, ModuleDefinition>()

export function registerModule(module: ModuleDefinition) {
  modules.set(module.id, module)
}

export function getModule(id: string): ModuleDefinition | undefined {
  return modules.get(id)
}

export function getAllModules(): ModuleDefinition[] {
  return Array.from(modules.values()).sort((a, b) => (a.sidebarOrder ?? 999) - (b.sidebarOrder ?? 999))
}

export function getEnabledModules(enabledIds: string[]): ModuleDefinition[] {
  return getAllModules().filter((m) => enabledIds.includes(m.id))
}

export async function initModules() {
  const modules = getAllModules()
  const inits = modules.map((m) => m.init?.()).filter((i): i is Promise<void> => i !== undefined)
  const results = await Promise.allSettled(inits)
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error(`Module init failed:`, result.reason)
    }
  }
}
