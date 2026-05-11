import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNoteStore } from '@/stores/noteStore'
import { Plus, Search, Star, Trash2, FileText, Sparkles } from 'lucide-react'
import { formatRelativeTime, cn } from '@/lib/utils'

function NoteEditor({ noteId }: { noteId: string }) {
  const { notes, updateNote, setActiveNote } = useNoteStore()
  const note = notes.find((n) => n.id === noteId)

  if (!note) return null

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-3 md:p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-2 md:hidden">
          <button
            onClick={() => setActiveNote(null)}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-xs text-muted-foreground">Notes</span>
        </div>
        <input
          type="text"
          value={note.title}
          onChange={(e) => updateNote(note.id, { title: e.target.value })}
          placeholder="Note title..."
          className="w-full text-xl md:text-2xl font-bold bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="flex items-center gap-3 mt-1 md:mt-2 text-xs text-muted-foreground">
          <span>Created {formatRelativeTime(note.createdAt)}</span>
          <span className="hidden md:inline">· Updated {formatRelativeTime(note.updatedAt)}</span>
        </div>
      </div>
      <div className="flex-1 p-3 md:p-6">
        <textarea
          value={note.content}
          onChange={(e) => updateNote(note.id, { content: e.target.value })}
          placeholder="Start writing..."
          className="w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-sm leading-relaxed"
        />
      </div>
    </div>
  )
}

export default function NotesPage() {
  const { notes, loadNotes, addNote, deleteNote, toggleStar, activeNoteId, setActiveNote } = useNoteStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  const handleAdd = useCallback(async () => {
    const note = await addNote({ title: 'Untitled Note' })
    setActiveNote(note.id)
  }, [addNote, setActiveNote])

  const filtered = notes
    .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt)

  const activeNote = notes.find((n) => n.id === activeNoteId)

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Note list - shown on mobile only when no active note */}
      <div className={cn(
        'w-full md:w-80 border-b md:border-b-0 md:border-r border-border flex flex-col',
        activeNote && 'hidden md:flex',
      )}>
        <div className="p-3 md:p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-foreground">Notes</h2>
            <button
              onClick={handleAdd}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <AnimatePresence>
            {filtered.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveNote(note.id)}
                className={cn(
                  'group flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-colors',
                  activeNoteId === note.id ? 'bg-accent' : 'hover:bg-accent/50',
                )}
              >
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{note.title || 'Untitled'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {note.content ? note.content.slice(0, 60) : 'Empty note'}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStar(note.id) }}
                    className={cn('p-1 rounded hover:bg-background transition-colors', note.starred && 'text-yellow-500')}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                    className="p-1 rounded hover:bg-background text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notes yet</p>
            </div>
          )}
        </div>
      </div>

      {activeNote ? (
        <NoteEditor noteId={activeNote.id} />
      ) : (
        <div className={cn('flex-1 items-center justify-center', activeNote ? 'hidden md:flex' : 'flex')}>
          <div className="text-center px-4">
            <FileText className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/20 mx-auto mb-3 md:mb-4" />
            <p className="text-base md:text-lg text-muted-foreground">Select a note or create a new one</p>
            <button
              onClick={handleAdd}
              className="mt-3 md:mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium mx-auto hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
