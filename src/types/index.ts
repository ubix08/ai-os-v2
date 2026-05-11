export interface ModuleDefinition {
  id: string
  name: string
  description: string
  icon: string
  path: string
  enabled: boolean
  pro: boolean
  dependencies?: string[]
  sidebarOrder?: number
  component?: React.LazyExoticComponent<React.ComponentType<any>>
  init?: () => Promise<void>
}

export interface ProductConfig {
  productId: string
  name: string
  tagline: string
  description: string
  version: string
  theme: ThemeConfig
  enabledModules: string[]
  proModules: string[]
  branding: BrandingConfig
  license: LicenseConfig
}

export interface ThemeConfig {
  accentColor: string
  accentHover: string
  sidebarWidth: number
  fontFamily?: string
}

export interface BrandingConfig {
  logo: string
  favicon: string
  companyName: string
  supportUrl?: string
  website?: string
}

export interface LicenseConfig {
  freeModules: string[]
  proPrice: number
  proFeatures: string[]
}

export interface AIModelConfig {
  provider: 'openai' | 'anthropic' | 'groq' | 'webllm' | 'custom'
  apiKey?: string
  baseUrl?: string
  model: string
  maxTokens?: number
  temperature?: number
}

export interface AgentConfig {
  id: string
  name: string
  role: string
  systemPrompt: string
  modelConfig: AIModelConfig
  tools: string[]
  allowedModules: string[]
}

export type MemoryEntryType = 'task' | 'note' | 'conversation' | 'decision' | 'fact' | 'preference'

export interface MemoryEntry {
  id: string
  type: MemoryEntryType
  content: string
  embedding?: Float32Array
  metadata: Record<string, unknown>
  timestamp: number
  agentId?: string
  moduleId?: string
}

export interface AgentSession {
  id: string
  agentId: string
  startedAt: number
  endedAt?: number
  context: string
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  toolCalls?: ToolCall[]
  toolResults?: ToolResult[]
  timestamp: number
}

export interface ToolCall {
  id: string
  name: string
  arguments: string
}

export interface ToolResult {
  toolCallId: string
  output: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  projectId?: string
  tags: string[]
  createdAt: number
  updatedAt: number
  completedAt?: number
  aiGenerated?: boolean
  parentTaskId?: string
  subtasks: string[]
  estimatedMinutes?: number
  actualMinutes?: number
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  starred: boolean
  folderId?: string
  createdAt: number
  updatedAt: number
  aiSummary?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  status: 'active' | 'archived' | 'completed'
  createdAt: number
  updatedAt: number
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  allDay: boolean
  color: string
  taskId?: string
}

export interface Invoice {
  id: string
  number: string
  clientName: string
  clientEmail?: string
  items: InvoiceItem[]
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  tax: number
  total: number
  dueDate: string
  createdAt: number
  paidAt?: number
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface SemanticChunk {
  id: string
  text: string
  embedding: Float32Array
  source: string
  sourceId: string
  moduleId: string
  createdAt: number
}
