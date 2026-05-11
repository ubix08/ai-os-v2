import React from 'react'
import { registerModule } from '@/modules'
import { ListTodo } from 'lucide-react'

const TasksPage = React.lazy(() => import('./TasksPage'))

registerModule({
  id: 'tasks',
  name: 'Tasks',
  description: 'AI-powered task management',
  icon: 'ListTodo',
  path: '/tasks',
  enabled: true,
  pro: false,
  sidebarOrder: 1,
  component: TasksPage,
  init: async () => {
    console.log('Tasks module initialized')
  },
})
