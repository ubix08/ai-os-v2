import React from 'react'
import { registerModule } from '@/modules/registry'
import { MessageSquare } from 'lucide-react'

const AIChatPage = React.lazy(() => import('./AIChatPage'))

registerModule({
  id: 'ai-chat',
  name: 'AI Chat',
  description: 'Chat with AI agents',
  icon: 'MessageSquare',
  path: '/ai-chat',
  enabled: true,
  pro: true,
  sidebarOrder: 3,
  component: AIChatPage,
  init: async () => {
    console.log('AI Chat module initialized')
  },
})
