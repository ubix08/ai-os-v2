import React from 'react'
import { registerModule } from '@/modules'
import { Settings } from 'lucide-react'

const SettingsPage = React.lazy(() => import('./SettingsPage'))

registerModule({
  id: 'settings',
  name: 'Settings',
  description: 'App settings and configuration',
  icon: 'Settings',
  path: '/settings',
  enabled: true,
  pro: false,
  sidebarOrder: 99,
  component: SettingsPage,
})
