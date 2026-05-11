import { useAppStore } from '@/stores/appStore'
import { motion } from 'framer-motion'
import { Sun, Moon, Key, Bot, Palette, Info } from 'lucide-react'

export default function SettingsPage() {
  const { theme, toggleTheme, aiConfig, setAiConfig, licenseKey, setLicenseKey, isPro, productConfig } = useAppStore()

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your AI OS experience</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Appearance
        </h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">Switch between dark and light mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-foreground text-sm hover:bg-accent/80 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Provider
        </h2>
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Provider</p>
              <p className="text-xs text-muted-foreground mt-0.5">Select your AI backend</p>
            </div>
            <select
              value={aiConfig?.provider ?? 'openai'}
              onChange={(e) => setAiConfig({ ...aiConfig, provider: e.target.value as any, model: aiConfig?.model ?? 'gpt-4o' })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="groq">Groq</option>
              <option value="webllm">WebLLM (Local)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">API Key</label>
            <input
              type="password"
              value={aiConfig?.apiKey ?? ''}
              onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value, provider: aiConfig?.provider ?? 'openai', model: aiConfig?.model ?? 'gpt-4o' })}
              placeholder="sk-..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground mt-1">Your key stays in your browser. Never stored on servers.</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Model</label>
            <input
              type="text"
              value={aiConfig?.model ?? ''}
              onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value, provider: aiConfig?.provider ?? 'openai', apiKey: aiConfig?.apiKey ?? '' })}
              placeholder="gpt-4o"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          License
        </h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPro ? 'Pro features unlocked' : 'Free tier — upgrade for Pro features'}
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isPro ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
          </div>
          {!isPro && (
            <div className="flex gap-2">
              <input
                type="text"
                value={licenseKey ?? ''}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter license key..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => setLicenseKey('pro-demo')}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                Activate
              </button>
            </div>
          )}
          {isPro && (
            <button
              onClick={() => setLicenseKey(null)}
              className="text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              Deactivate license
            </button>
          )}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          About
        </h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-foreground">
            AI OS v2 — {productConfig?.name ?? 'Productivity OS'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Version {productConfig?.version ?? '2.0.0'} · {productConfig?.productId ?? 'base'}
          </p>
        </div>
      </motion.section>
    </div>
  )
}
