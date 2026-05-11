import { db } from '@/lib/db'
import { generateId } from '@/lib/utils'
import type { MemoryEntry } from '@/types'

export class SharedMemory {
  async store(entry: Omit<MemoryEntry, 'id'>): Promise<string> {
    const id = generateId()
    await db.memories.add({ ...entry, id })
    return id
  }

  async search(query: string, options?: { type?: string; limit?: number }): Promise<MemoryEntry[]> {
    const limit = options?.limit ?? 10
    const q = query.toLowerCase()

    let collection = db.memories.orderBy('timestamp').reverse()

    if (options?.type) {
      collection = collection.filter((m) => m.type === options.type) as any
    }

    const all = await collection.limit(50).toArray()

    const scored = all
      .map((m) => ({
        entry: m,
        score: this.keywordScore(m.content, q),
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.entry)

    return scored
  }

  private keywordScore(content: string, query: string): number {
    const lower = content.toLowerCase()
    const terms = query.split(/\s+/).filter(Boolean)
    if (terms.length === 0) return 0

    let matches = 0
    for (const term of terms) {
      if (lower.includes(term)) matches++
    }
    return matches / terms.length
  }

  async getRecent(limit: number = 20): Promise<MemoryEntry[]> {
    return db.memories.orderBy('timestamp').reverse().limit(limit).toArray()
  }

  async getByAgent(agentId: string, limit: number = 20): Promise<MemoryEntry[]> {
    return db.memories
      .where('agentId')
      .equals(agentId)
      .reverse()
      .limit(limit)
      .toArray()
  }

  async delete(id: string): Promise<void> {
    await db.memories.delete(id)
  }

  async clear(): Promise<void> {
    await db.memories.clear()
  }
}

export const sharedMemory = new SharedMemory()
