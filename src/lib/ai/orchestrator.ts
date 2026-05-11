import { AIClient } from './client'
import { Agent, MultiAgentSystem, type ToolDefinition } from './agent'
import { db } from '@/lib/db'
import { generateId, truncate } from '@/lib/utils'
import type { ChatMessage, MemoryEntry, AIModelConfig } from '@/types'

export class Orchestrator {
  private client: AIClient
  private system: MultiAgentSystem
  private pipeline: OrchestrationPipeline

  constructor(config: AIModelConfig) {
    this.client = new AIClient(config)
    this.system = new MultiAgentSystem(this.client)
    this.system.createDefaultAgents()
    this.pipeline = new OrchestrationPipeline(this.client, this.system)
  }

  updateConfig(config: AIModelConfig) {
    this.client.updateConfig(config)
  }

  async processRequest(
    userMessage: string,
    onStream?: (chunk: string) => void,
  ): Promise<string> {
    const orchestrator = this.system.getAgent('orchestrator')
    if (!orchestrator) {
      return 'Orchestrator agent not found.'
    }

    const messages: ChatMessage[] = [
      {
        id: generateId(),
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
      },
    ]

    const result = await this.pipeline.execute(messages, onStream)
    return result
  }

  createDefaultTools(): ToolDefinition[] {
    return [
      {
        name: 'search_memory',
        description: 'Search the agent memory store for relevant context',
        parameters: { query: { type: 'string' }, limit: { type: 'number' } },
        execute: async (args: { query: string; limit?: number }) => {
          const limit = args.limit ?? 5
          const results = await db.memories
            .orderBy('timestamp')
            .reverse()
            .limit(limit)
            .toArray()
          return results.map((r) => `[${r.type}] ${truncate(r.content, 200)}`).join('\n')
        },
      },
      {
        name: 'get_tasks',
        description: 'Retrieve tasks from the task database',
        parameters: { status: { type: 'string' }, limit: { type: 'number' } },
        execute: async (args: { status?: string; limit?: number }) => {
          let collection = db.tasks.orderBy('createdAt').reverse()
          if (args.status) collection = collection.filter((t) => t.status === args.status) as any
          const tasks = await collection.limit(args.limit ?? 10).toArray()
          return tasks.map((t) => `[${t.priority}] ${t.title} (${t.status})`).join('\n')
        },
      },
      {
        name: 'get_notes',
        description: 'Retrieve notes from the notes database',
        parameters: { limit: { type: 'number' } },
        execute: async (args: { limit?: number }) => {
          const notes = await db.notes.orderBy('updatedAt').reverse().limit(args.limit ?? 10).toArray()
          return notes.map((n) => `${n.title || 'Untitled'}: ${truncate(n.content || '', 100)}`).join('\n')
        },
      },
    ]
  }
}

class OrchestrationPipeline {
  private client: AIClient
  private system: MultiAgentSystem

  constructor(client: AIClient, system: MultiAgentSystem) {
    this.client = client
    this.system = system
  }

  async execute(
    messages: ChatMessage[],
    onStream?: (chunk: string) => void,
  ): Promise<string> {
    const orchestrator = this.system.getAgent('orchestrator')
    if (!orchestrator) return 'Orchestrator unavailable'

    const analysis = await this.analyzeRequest(messages)
    const plan = this.createExecutionPlan(analysis)

    let result = ''
    for (const step of plan) {
      const agent = this.system.getAgent(step.agentId)
      if (!agent) continue

      const stepMessages: ChatMessage[] = [
        ...messages,
        {
          id: generateId(),
          role: 'system',
          content: `Context from orchestrator: ${analysis}\n\nYour task: ${step.instruction}`,
          timestamp: Date.now(),
        },
      ]

      const stepResult = await agent.processMessage(stepMessages, onStream)
      result += `\n\n**${agent.name} (${agent.role}):**\n${stepResult}`
    }

    const finalMessages: ChatMessage[] = [
      ...messages,
      {
        id: generateId(),
        role: 'assistant',
        content: `Synthesized results:\n${result}`,
        timestamp: Date.now(),
      },
    ]

    return orchestrator.processMessage(finalMessages, onStream)
  }

  private async analyzeRequest(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.client.chat([
        {
          id: 'analysis',
          role: 'system',
          content: 'Analyze this request and determine: 1) Main goal 2) Required expertise areas 3) Complexity level. Respond concisely.',
          timestamp: Date.now(),
        },
        ...messages,
      ])
      return response
    } catch {
      return 'Analysis failed. Proceeding with default plan.'
    }
  }

  private createExecutionPlan(analysis: string): Array<{ agentId: string; instruction: string }> {
    const plan: Array<{ agentId: string; instruction: string }> = []

    if (analysis.toLowerCase().includes('write') || analysis.toLowerCase().includes('note') || analysis.toLowerCase().includes('document')) {
      plan.push({ agentId: 'writer', instruction: 'Handle the writing task based on user request' })
    }

    if (analysis.toLowerCase().includes('analy') || analysis.toLowerCase().includes('data') || analysis.toLowerCase().includes('track') || analysis.toLowerCase().includes('task')) {
      plan.push({ agentId: 'analyst', instruction: 'Analyze the relevant data' })
    }

    if (plan.length === 0) {
      plan.push({ agentId: 'writer', instruction: 'Handle the user request' })
    }

    return plan
  }
}
