import Dexie, { type Table } from 'dexie'
import type { Task, Note, Project, CalendarEvent, Invoice, AgentSession, MemoryEntry, SemanticChunk } from '@/types'

export class AiosDatabase extends Dexie {
  tasks!: Table<Task, string>
  notes!: Table<Note, string>
  projects!: Table<Project, string>
  calendarEvents!: Table<CalendarEvent, string>
  invoices!: Table<Invoice, string>
  agentSessions!: Table<AgentSession, string>
  memories!: Table<MemoryEntry, string>
  semanticChunks!: Table<SemanticChunk, string>

  constructor() {
    super('ai-os-v2')

    this.version(1).stores({
      tasks: 'id, status, priority, projectId, dueDate, createdAt, updatedAt',
      notes: 'id, title, starred, folderId, createdAt, updatedAt',
      projects: 'id, name, status, createdAt',
      calendarEvents: 'id, startDate, endDate, taskId',
      invoices: 'id, number, clientName, status, dueDate, createdAt',
      agentSessions: 'id, agentId, startedAt',
      memories: 'id, type, timestamp, agentId, moduleId',
      semanticChunks: 'id, source, sourceId, moduleId, createdAt',
    })

    this.version(2).stores({
      tasks: 'id, status, priority, projectId, dueDate, createdAt, updatedAt, [status+priority]',
      notes: 'id, title, starred, folderId, createdAt, updatedAt',
      projects: 'id, name, status, createdAt',
      calendarEvents: 'id, startDate, endDate, taskId',
      invoices: 'id, number, clientName, status, dueDate, createdAt',
      agentSessions: 'id, agentId, startedAt',
      memories: 'id, type, timestamp, agentId, moduleId, [type+timestamp]',
      semanticChunks: 'id, source, sourceId, moduleId, createdAt',
    })
  }
}

export const db = new AiosDatabase()
