import type { ChatMessage, MemoryEntry } from '@/types'
import { AIClient } from './client'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils'

export interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (args: any) => Promise<string>
}

export class Agent {
  id: string
  name: string
  role: string
  systemPrompt: string
  private client: AIClient
  private tools: Map<string, ToolDefinition> = new Map()

  constructor(config: { id: string; name: string; role: string; systemPrompt: string; client: AIClient }) {
    this.id = config.id
    this.name = config.name
    this.role = config.role
    this.systemPrompt = config.systemPrompt
    this.client = config.client
  }

  registerTool(tool: ToolDefinition) {
    this.tools.set(tool.name, tool)
  }

  async processMessage(
    messages: ChatMessage[],
    onStream?: (chunk: string) => void,
  ): Promise<string> {
    const systemMsg: ChatMessage = {
      id: 'system',
      role: 'system',
      content: this.systemPrompt,
      timestamp: Date.now(),
    }

    const contextMessages = [systemMsg, ...messages]

    const response = await this.client.chat(contextMessages, onStream)

    await this.storeMemory(messages, response)
    return response
  }

  private async storeMemory(messages: ChatMessage[], response: string) {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMsg) return

    const entry: MemoryEntry = {
      id: generateId(),
      type: 'conversation',
      content: `Q: ${lastUserMsg.content}\nA: ${response}`,
      metadata: { agentId: this.id },
      timestamp: Date.now(),
      agentId: this.id,
    }
    await db.memories.add(entry)
  }
}

export class MultiAgentSystem {
  private agents: Map<string, Agent> = new Map()
  private client: AIClient

  constructor(client: AIClient) {
    this.client = client
  }

  registerAgent(agent: Agent) {
    this.agents.set(agent.id, agent)
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id)
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values())
  }

  createDefaultAgents() {
    const orchestrator = new Agent({
      id: 'orchestrator',
      name: 'Orchestrator',
      role: 'coordinator',
      systemPrompt: `You are the Orchestrator Agent. You coordinate specialized agents to solve complex tasks.
      You analyze user requests, break them into subtasks, delegate to the right agent, and synthesize results.
      Always think step by step and explain your reasoning.`,
      client: this.client,
    })

    const writer = new Agent({
      id: 'writer',
      name: 'Writer',
      role: 'content creator',
      systemPrompt: `You are a Writing Agent. You excel at creating, editing, and improving written content.
      You help with notes, documentation, emails, and creative writing.
      Be clear, concise, and adapt to the user's voice.`,
      client: this.client,
    })

    const analyst = new Agent({
      id: 'analyst',
      name: 'Analyst',
      role: 'analytics & data',
      systemPrompt: `You are an Analysis Agent. You help users understand their productivity data.
      You analyze task completion rates, note-taking patterns, and suggest improvements.
      Provide data-driven insights and actionable recommendations.`,
      client: this.client,
    })

    this.registerAgent(orchestrator)
    this.registerAgent(writer)
    this.registerAgent(analyst)
  }
}
