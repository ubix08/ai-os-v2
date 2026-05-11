import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '@/stores/taskStore'
import {
  Plus, Search, Trash2, CheckCircle2, Circle, Flag, Calendar,
  ArrowUpDown, Loader2, Sparkles
} from 'lucide-react'
import type { Task } from '@/types'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'

const priorityColors: Record<Task['priority'], string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
}

const statusFilters: (Task['status'] | 'all')[] = ['all', 'todo', 'in_progress', 'done', 'cancelled']

function TaskInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a task..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task['priority'])}
        className="px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </form>
  )
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/20 transition-all',
        task.status === 'done' && 'opacity-60',
      )}
    >
      <button onClick={onToggle} className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
        {task.status === 'done' ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium text-foreground truncate',
          task.status === 'done' && 'line-through text-muted-foreground',
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className={cn('w-1.5 h-1.5 rounded-full', priorityColors[task.priority])} />
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{formatRelativeTime(task.createdAt)}</span>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default function TasksPage() {
  const { tasks, loadTasks, addTask, toggleTaskStatus, deleteTask, updateTask } = useTaskStore()
  const [filter, setFilter] = useState<'all' | Task['status']>('all')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    loadTasks()
  }, [])

  const handleAdd = useCallback(async (title: string) => {
    await addTask({
      title,
      status: 'todo',
      priority: 'medium',
      tags: [],
      subtasks: [],
    })
  }, [addTask])

  const filtered = tasks
    .filter((t) => filter === 'all' || t.status === filter)
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt)

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {stats.todo} remaining · {stats.done} completed · {stats.total} total
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Suggest
          </motion.button>
        </div>
      </motion.div>

      <TaskInput onAdd={handleAdd} />

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-40"
            />
          </div>
          <button
            onClick={() => setSortOrder((s) => s === 'newest' ? 'oldest' : 'newest')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTaskStatus(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No tasks found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
