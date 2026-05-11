import { motion } from 'framer-motion'
import { useTaskStore } from '@/stores/taskStore'
import { useNoteStore } from '@/stores/noteStore'
import { useEffect } from 'react'
import { CheckCircle2, FileText, TrendingUp, Clock } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { tasks, loadTasks } = useTaskStore()
  const { notes, loadNotes } = useNoteStore()

  useEffect(() => {
    loadTasks()
    loadNotes()
  }, [])

  const todoCount = tasks.filter((t) => t.status !== 'done').length
  const doneToday = tasks.filter(
    (t) => t.status === 'done' && t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString(),
  ).length
  const notesCount = notes.length
  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length

  const recentTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-0.5 md:mt-1">Your productivity overview</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={CheckCircle2} label="Tasks Remaining" value={todoCount} color="bg-blue-500/10 text-blue-500" />
        <StatCard icon={TrendingUp} label="Completed Today" value={doneToday} color="bg-green-500/10 text-green-500" />
        <StatCard icon={FileText} label="Total Notes" value={notesCount} color="bg-purple-500/10 text-purple-500" />
        <StatCard icon={Clock} label="Urgent Tasks" value={urgentCount} color="bg-red-500/10 text-red-500" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending tasks. Enjoy your day!</p>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'urgent' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-orange-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <span className="text-sm text-foreground flex-1">{task.title}</span>
                <span className="text-xs text-muted-foreground capitalize">{task.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
