import type { AIModelConfig, ChatMessage } from '@/types'

export type AIProvider = 'openai' | 'anthropic' | 'groq' | 'webllm'

interface ProviderConfig {
  baseUrl: string
  defaultModel: string
}

const providerConfigs: Record<AIProvider, ProviderConfig> = {
  openai: { baseUrl: 'https://api.openai.com/v1', defaultModel: 'gpt-4o' },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1', defaultModel: 'claude-sonnet-4-20250514' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', defaultModel: 'llama-3.3-70b-versatile' },
  webllm: { baseUrl: '', defaultModel: 'local-model' },
}

export class AIClient {
  private config: AIModelConfig
  private abortController: AbortController | null = null

  constructor(config: AIModelConfig) {
    this.config = config
  }

  updateConfig(config: AIModelConfig) {
    this.config = config
  }

  private getProviderConfig(): ProviderConfig {
    return providerConfigs[this.config.provider as AIProvider] ?? providerConfigs.openai
  }

  async chat(
    messages: ChatMessage[],
    onStream?: (chunk: string) => void,
  ): Promise<string> {
    if (this.config.provider === 'webllm') {
      return this.localChat(messages)
    }

    this.abortController = new AbortController()
    const providerConf = this.getProviderConfig()

    const response = await fetch(`${providerConf.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
        ...(this.config.provider === 'anthropic' ? { 'anthropic-version': '2023-06-01' } : {}),
      },
      body: JSON.stringify({
        model: this.config.model || providerConf.defaultModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: this.config.maxTokens ?? 4096,
        temperature: this.config.temperature ?? 0.7,
        stream: !!onStream,
      }),
      signal: this.abortController.signal,
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`AI API error: ${response.status} — ${err}`)
    }

    if (onStream && response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content ?? ''
            full += content
            onStream(content)
          } catch {
            // skip parse errors
          }
        }
      }
      return full
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content ?? ''
  }

  async localChat(_messages: ChatMessage[]): Promise<string> {
    return 'WebLLM local inference not yet implemented. Configure an API key for cloud AI.'
  }

  cancel() {
    this.abortController?.abort()
  }
}
