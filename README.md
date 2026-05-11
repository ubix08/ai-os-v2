# AI OS v2 — Modular Productivity OS Factory

A local-first, modular Productivity OS Factory that powers multiple sellable products from a single codebase.

## Architecture

```
src/
├── core/           Layout, providers, command palette, theme
├── modules/        All modules (auto-registered via import.meta.glob)
├── config/         Product configurations
├── lib/
│   ├── ai/         AI Client, Agent, Orchestrator, Memory
│   ├── db/         Dexie schema + migrations
│   ├── license/    License key validation
│   ├── export/     Export engine (JSON, PDF)
│   └── utils/      Shared utilities
├── stores/         Zustand stores
├── components/     Shared UI components
└── types/          TypeScript type definitions
```

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI + Framer Motion
- **State**: Zustand (+ persist middleware)
- **Data**: Dexie.js (IndexedDB)
- **Rich Text**: Tiptap
- **PWA**: vite-plugin-pwa
- **AI**: Transformers.js (vector embeddings)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Product Configurations

Products are defined as JSON in `src/config/`. Each config specifies enabled modules, theme, branding, and licensing.

### Available Products

| Product       | Config File                  | Focus                |
|---------------|------------------------------|----------------------|
| Personal OS   | `personal-os.json`           | Personal productivity|
| Resume OS     | `resume-os.json`             | Resume building      |
| Freelancer OS | `freelancer-os.json`         | Freelance management |

### Generate a New Product

```bash
npm run generate-product
# or
npx tsx scripts/generate-product.ts <product-id>
```

### Multi-Product Build

```bash
chmod +x scripts/build-all.sh
./scripts/build-all.sh
```

Each product is built into `dist/<product-id>/` — deploy each directory separately.

## Module System

Modules auto-register via `src/modules/index.ts`. Each module exports:

- `id`: unique identifier
- `component`: lazy-loaded React component
- `icon`: Lucide icon name
- `path`: route path
- `pro`: whether it requires Pro license
- `init()`: async initialization hook
- `dependencies`: other modules it requires

## AI Layer

- **AI Client**: Pluggable (OpenAI, Anthropic, Groq, WebLLM)
- **Single Agent**: Module-specific system prompts
- **Multi-Agent System**: Orchestrator + Writer + Analyst agents
- **Shared Memory**: IndexedDB-based with keyword retrieval
- **Vector Store**: Transformers.js (all-MiniLM-L6-v2) for embeddings
- **Tool Calling**: Function calling support with safety layers

## License System

Simple local key system (localStorage). Pro features are gated via `ProGate` component.

## Deployment

Deploy as static site to Cloudflare Pages / Vercel / Netlify.

```bash
npm run build
# deploy dist/ directory
```

For multi-product deployment, use the build script and deploy each variant separately.

## PWA

The app is fully installable as a PWA with offline support. Service worker auto-updates via `vite-plugin-pwa`.

## Development

```bash
npm run dev     # Start dev server
npm run build   # TypeScript check + build
npm run lint    # Lint code
npm run preview # Preview production build
```
