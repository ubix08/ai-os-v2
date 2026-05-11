import type { ProductConfig } from '@/types'
import resumeOS from './resume-os.json'
import freelancerOS from './freelancer-os.json'
import personalOS from './personal-os.json'

const configs: Record<string, ProductConfig> = {
  'resume-os': resumeOS as ProductConfig,
  'freelancer-os': freelancerOS as ProductConfig,
  'personal-os': personalOS as ProductConfig,
}

export function getProductConfig(productId: string): ProductConfig | null {
  return configs[productId] ?? null
}

export function getAllProductConfigs(): ProductConfig[] {
  return Object.values(configs)
}

export function getDefaultProductConfig(): ProductConfig {
  return personalOS as ProductConfig
}
