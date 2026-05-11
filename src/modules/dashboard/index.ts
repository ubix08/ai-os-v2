import React from 'react'
import { registerModule } from '@/modules'
import { LayoutDashboard } from 'lucide-react'

const DashboardPage = React.lazy(() => import('./DashboardPage'))

registerModule({
  id: 'dashboard',
  name: 'Dashboard',
  description: 'Overview of your productivity',
  icon: 'LayoutDashboard',
  path: '/dashboard',
  enabled: true,
  pro: false,
  sidebarOrder: 0,
  component: DashboardPage,
  init: async () => {
    console.log('Dashboard module initialized')
  },
})
