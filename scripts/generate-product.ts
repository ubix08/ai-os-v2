#!/usr/bin/env node
// Product Generator CLI — run: npx tsx scripts/generate-product.ts <product-id>
// Creates a new product config JSON file from interactive prompts

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configDir = path.resolve(__dirname, '../src/config')

function ask(question: string): Promise<string> {
  process.stdout.write(`${question}: `)
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim())
    })
  })
}

async function main() {
  const productId = process.argv[2] || (await ask('Product ID (e.g., "creator-os")'))

  const name = await ask('Product Name (e.g., "Creator OS")')
  const tagline = await ask('Tagline')
  const description = await ask('Description')
  const companyName = await ask('Company Name')
  const accentColor = await ask('Accent color (hex)') || '#06b6d4'
  const price = await ask('Pro price (number)') || '29'

  const config = {
    productId,
    name,
    tagline,
    description,
    version: '2.0.0',
    theme: {
      accentColor,
      accentHover: accentColor,
      sidebarWidth: 260,
      fontFamily: 'Inter',
    },
    enabledModules: ['dashboard', 'tasks', 'notes', 'search', 'settings'],
    proModules: ['ai-chat'],
    branding: {
      logo: '🚀',
      favicon: '/favicon.svg',
      companyName,
    },
    license: {
      freeModules: ['dashboard', 'tasks', 'notes', 'search', 'settings'],
      proPrice: parseInt(price, 10),
      proFeatures: ['AI Chat', 'Multi-Agent Orchestration', 'Priority Support'],
    },
  }

  const filePath = path.join(configDir, `${productId}.json`)
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2))
  console.log(`\n✅ Product config created: ${filePath}`)
  console.log(`\nTo use this product, update src/config/index.ts to include:\n`)
  console.log(`import ${productId.replace(/-/g, '')} from './${productId}.json'`)
  console.log(`\nAnd add it to the configs object.\n`)

  process.exit(0)
}

main().catch(console.error)
