import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, FileText, ListTodo, MessageSquare, X } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useNoteStore } from '@/stores/noteStore'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { tasks } = useTaskStore()
  const { notes } = useNoteStore()
  const { setActiveModule } = useAppStore()

  useEffect(() => {
    useTaskStore.getState().loadTasks()
    useNoteStore.getState().loadNotes()
  }, [])

  if (!query.trim()) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across tasks, notes, and more..."
              autoFocus
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg"
            />
          </div>
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Start typing to search</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Results from Tasks, Notes, and AI Chat
            </p>
          </div>
        </div>
      </div>
    )
  }

  const q = query.toLowerCase()
  const taskResults = tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
  const noteResults = notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            autoFocus
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-6">
          {taskResults.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <ListTodo className="w-4 h-4" />
                Tasks ({taskResults.length})
              </h3>
              <div className="space-y-1">
                {taskResults.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => { useAppStore.getState().setActiveModule('tasks') }}
                    className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{task.status.replace('_', ' ')}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {noteResults.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes ({noteResults.length})
              </h3>
              <div className="space-y-1">
                {noteResults.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => { useAppStore.getState().setActiveModule('notes') }}
                    className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{note.title || 'Untitled'}</p>
                    <p className="text-xs text-muted-foreground truncate">{note.content?.slice(0, 80)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {taskResults.length === 0 && noteResults.length === 0 && (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">No results for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
