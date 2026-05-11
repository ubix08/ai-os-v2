import React from 'react'
import { registerModule } from '@/modules'
import { Search } from 'lucide-react'

const SearchPage = React.lazy(() => import('./SearchPage'))

registerModule({
  id: 'search',
  name: 'Search',
  description: 'Global search across all modules',
  icon: 'Search',
  path: '/search',
  enabled: true,
  pro: false,
  sidebarOrder: 98,
  component: SearchPage,
})
