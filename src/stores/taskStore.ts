import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/types'
import { generateId } from '@/lib/utils'
import { db } from '@/lib/db'

interface TaskStore {
  tasks: Task[]
  loading: boolean
  loadTasks: () => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskStatus: (id: string) => Promise<void>
  getTasksByProject: (projectId: string) => Task[]
  getTasksByStatus: (status: Task['status']) => Task[]
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,

      loadTasks: async () => {
        set({ loading: true })
        const tasks = await db.tasks.toArray()
        set({ tasks, loading: false })
      },

      addTask: async (data) => {
        const now = Date.now()
        const task: Task = {
          ...data,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          subtasks: data.subtasks ?? [],
        }
        await db.tasks.add(task)
        set((s) => ({ tasks: [...s.tasks, task] }))
        return task
      },

      updateTask: async (id, updates) => {
        const updated = { ...updates, updatedAt: Date.now() }
        await db.tasks.update(id, updated)
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }))
      },

      deleteTask: async (id) => {
        await db.tasks.delete(id)
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
      },

      toggleTaskStatus: async (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return
        const newStatus = task.status === 'done' ? 'todo' : 'done'
        await get().updateTask(id, {
          status: newStatus,
          completedAt: newStatus === 'done' ? Date.now() : undefined,
        })
      },

      getTasksByProject: (projectId) => get().tasks.filter((t) => t.projectId === projectId),
      getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
    }),
    {
      name: 'ai-os-task-store',
      partialize: () => ({}),
    },
  ),
)
