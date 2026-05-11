const STORAGE_KEY = 'ai-os-license-key'

export function getStoredLicenseKey(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredLicenseKey(key: string | null) {
  if (typeof window === 'undefined') return
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

export function validateLicenseKey(key: string): boolean {
  if (!key || key.trim().length === 0) return false
  if (key === 'pro-demo') return true
  const validFormat = /^[A-Z0-9]{4,8}-[A-Z0-9]{4,8}-[A-Z0-9]{4,8}$/i.test(key)
  return validFormat || key.length >= 8
}

export function isModulePro(moduleId: string, proModules: string[]): boolean {
  return proModules.includes(moduleId)
}

export function isModuleEnabled(moduleId: string, enabledModules: string[]): boolean {
  return enabledModules.includes(moduleId)
}
