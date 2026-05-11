import { create } from 'zustand'
import { generateId } from '@/lib/utils'
import { db } from '@/lib/db'
import type { Note } from '@/types'

interface NoteStore {
  notes: Note[]
  loading: boolean
  activeNoteId: string | null
  loadNotes: () => Promise<void>
  addNote: (data: { title: string; content?: string; tags?: string[]; folderId?: string }) => Promise<Note>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  setActiveNote: (id: string | null) => void
  toggleStar: (id: string) => Promise<void>
}

export const useNoteStore = create<NoteStore>()((set, get) => ({
  notes: [],
  loading: false,
  activeNoteId: null,

  loadNotes: async () => {
    set({ loading: true })
    const notes = await db.notes.toArray()
    set({ notes, loading: false })
  },

  addNote: async (data) => {
    const now = Date.now()
    const note: Note = {
      id: generateId(),
      title: data.title,
      content: data.content ?? '',
      tags: data.tags ?? [],
      starred: false,
      folderId: data.folderId,
      createdAt: now,
      updatedAt: now,
    }
    await db.notes.add(note)
    set((s) => ({ notes: [note, ...s.notes] }))
    return note
  },

  updateNote: async (id, updates) => {
    const updated = { ...updates, updatedAt: Date.now() }
    await db.notes.update(id, updated)
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...updated } : n)),
    }))
  },

  deleteNote: async (id) => {
    await db.notes.delete(id)
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      activeNoteId: s.activeNoteId === id ? null : s.activeNoteId,
    }))
  },

  setActiveNote: (id) => set({ activeNoteId: id }),

  toggleStar: async (id) => {
    const note = get().notes.find((n) => n.id === id)
    if (!note) return
    await get().updateNote(id, { starred: !note.starred })
  },
}))
