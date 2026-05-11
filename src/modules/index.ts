// Side-effect imports to register modules
import './dashboard'
import './tasks'
import './notes'
import './ai-chat'
import './search'
import './settings'

export { registerModule, getModule, getAllModules, getEnabledModules, initModules } from './registry'
