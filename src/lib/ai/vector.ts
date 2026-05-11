import { sharedMemory } from './memory'

export class VectorStore {
  private pipeline: any = null
  private initialized = false

  async initialize() {
    if (this.initialized) return
    try {
      const { pipeline } = await import('@xenova/transformers')
      this.pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
      this.initialized = true
    } catch (e) {
      console.warn('Vector store initialization failed (transformers.js not available):', e)
    }
  }

  async embed(text: string): Promise<Float32Array | null> {
    if (!this.initialized || !this.pipeline) return null
    try {
      const result = await this.pipeline(text, { pooling: 'mean', normalize: true })
      return result.data as Float32Array
    } catch {
      return null
    }
  }

  async search(query: string, limit: number = 5): Promise<any[]> {
    const keywordResults = await sharedMemory.search(query, { limit: 20 })
    return keywordResults.slice(0, limit)
  }
}

export const vectorStore = new VectorStore()
