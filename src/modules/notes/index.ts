import React from 'react'
import { registerModule } from '@/modules/registry'
import { FileText } from 'lucide-react'

const NotesPage = React.lazy(() => import('./NotesPage'))

registerModule({
  id: 'notes',
  name: 'Notes',
  description: 'Rich text notes with AI summaries',
  icon: 'FileText',
  path: '/notes',
  enabled: true,
  pro: false,
  sidebarOrder: 2,
  component: NotesPage,
  init: async () => {
    console.log('Notes module initialized')
  },
})
