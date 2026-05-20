'use client'

import { useState } from 'react'
import { Plus, ExternalLink, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface Task {
  id: string
  name: string
  status: string
  status_color: string
  priority: string | null
  url: string
  assignees: string[]
  due_date: string | null
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-400',
  high: 'text-orange-400',
  normal: 'text-blue-400',
  low: 'text-zinc-500',
}

export function ClickUpWidget({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState('')

  // Create task form
  const [showForm, setShowForm] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState('normal')
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState('')

  async function loadTasks() {
    if (loaded) { setExpanded(!expanded); return }
    setLoading(true)
    setError('')
    const res = await fetch(`/api/clickup?project_id=${projectId}`)
    if (res.ok) {
      const data = await res.json()
      setTasks(data.tasks)
      setLoaded(true)
      setExpanded(true)
    } else {
      const data = await res.json()
      if (data.error?.includes('não configurado')) {
        setError('configure')
      } else {
        setError(data.error)
      }
    }
    setLoading(false)
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!taskName.trim()) return
    setCreating(true)
    setCreateMsg('')

    const res = await fetch('/api/clickup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, name: taskName, description: taskDesc, priority: taskPriority }),
    })
    const data = await res.json()

    if (res.ok) {
      setCreateMsg(`✅ Tarefa "${data.task.name}" criada!`)
      setTaskName('')
      setTaskDesc('')
      setShowForm(false)
      // Refresh tasks
      setLoaded(false)
      loadTasks()
    } else {
      setCreateMsg(`❌ ${data.error}`)
    }
    setCreating(false)
  }

  if (error === 'configure') return null // Não mostra se não configurado

  return (
    <div className="border border-purple-900/40 rounded-xl mb-8">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-900/30 transition rounded-xl"
        onClick={loadTasks}
      >
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          🎯 Tarefas ClickUp
          {tasks.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs">{tasks.length}</span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {!loaded && (
            <span className="text-xs text-zinc-600">Clique para carregar</span>
          )}
          {loading ? <Loader2 size={16} className="animate-spin text-zinc-500" /> : expanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
        </div>
      </div>

      {error && error !== 'configure' && (
        <div className="px-5 pb-4 text-xs text-red-400">{error}</div>
      )}

      {expanded && (
        <div className="border-t border-zinc-800">
          {/* Actions */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-zinc-800/50">
            <span className="text-xs text-zinc-500">{tasks.length} tarefas abertas</span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-500 transition"
            >
              <Plus size={12} /> Nova tarefa
            </button>
          </div>

          {/* Create form */}
          {showForm && (
            <form onSubmit={handleCreateTask} className="px-5 py-4 border-b border-zinc-800/50 space-y-3">
              <input
                type="text"
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                placeholder="Nome da tarefa"
                required
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none text-sm"
              />
              <div className="flex gap-2">
                <textarea
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Descrição (opcional)"
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none text-sm resize-none"
                />
                <select
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value)}
                  className="px-2 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-none text-sm"
                >
                  <option value="urgent">🔴 Urgente</option>
                  <option value="high">🟠 Alta</option>
                  <option value="normal">🔵 Normal</option>
                  <option value="low">⚪ Baixa</option>
                </select>
              </div>
              {createMsg && (
                <p className={`text-xs ${createMsg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{createMsg}</p>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:border-zinc-600 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={creating || !taskName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-500 transition disabled:opacity-50">
                  {creating ? 'Criando...' : 'Criar no ClickUp'}
                </button>
              </div>
            </form>
          )}

          {/* Task list */}
          {tasks.length === 0 ? (
            <div className="px-5 py-6 text-center text-zinc-600 text-sm">Nenhuma tarefa aberta.</div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-900/30 transition">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: task.status_color || '#666' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{task.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-600">{task.status}</span>
                      {task.priority && (
                        <span className={`text-xs ${PRIORITY_COLORS[task.priority] || 'text-zinc-500'}`}>
                          {task.priority}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="text-xs text-zinc-600">📅 {task.due_date}</span>
                      )}
                    </div>
                  </div>
                  <a href={task.url} target="_blank" className="text-zinc-600 hover:text-zinc-300 transition shrink-0">
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
