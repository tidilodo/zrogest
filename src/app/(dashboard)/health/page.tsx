'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, RefreshCw } from 'lucide-react'

interface HealthEntry {
  id: string
  status: string
  response_time_ms: number
  checked_at: string
  projects: { name: string; color: string; url: string }
}

export default function HealthPage() {
  const [checks, setChecks] = useState<HealthEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const supabase = createClient()

  async function loadChecks() {
    const { data } = await supabase
      .from('health_checks')
      .select('*, projects(name, color, url)')
      .order('checked_at', { ascending: false })
      .limit(50)

    setChecks((data as any) || [])
    setLoading(false)
  }

  async function runChecks() {
    setRunning(true)
    await fetch('/api/health', { method: 'POST' })
    await loadChecks()
    setRunning(false)
  }

  useEffect(() => { loadChecks() }, [])

  const grouped = checks.reduce<Record<string, HealthEntry[]>>((acc, check) => {
    const name = check.projects?.name || 'Unknown'
    if (!acc[name]) acc[name] = []
    acc[name].push(check)
    return acc
  }, {})

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Health Checks</h2>
          <p className="text-zinc-500 text-sm mt-1">Monitore o status dos seus projetos</p>
        </div>
        <button
          onClick={runChecks}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={running ? 'animate-spin' : ''} />
          {running ? 'Verificando...' : 'Verificar agora'}
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500">Carregando...</p>
      ) : !checks.length ? (
        <div className="border border-zinc-800 rounded-xl p-12 text-center">
          <Activity size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-zinc-400 mb-4">Nenhum health check registrado</p>
          <p className="text-zinc-600 text-sm">Adicione projetos com URL e clique em "Verificar agora"</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([name, entries]) => {
            const latest = entries[0]
            const statusColor = latest.status === 'up' ? 'text-green-400' : latest.status === 'down' ? 'text-red-400' : 'text-yellow-400'
            const bgColor = latest.status === 'up' ? 'bg-green-500' : latest.status === 'down' ? 'bg-red-500' : 'bg-yellow-500'

            return (
              <div key={name} className="border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${bgColor}`} />
                    <h3 className="text-zinc-100 font-semibold">{name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={statusColor + ' font-medium capitalize'}>{latest.status}</span>
                    <span className="text-zinc-500">{latest.response_time_ms}ms</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {entries.slice(0, 20).reverse().map(e => (
                    <div
                      key={e.id}
                      className={`flex-1 h-8 rounded ${e.status === 'up' ? 'bg-green-500/30' : e.status === 'down' ? 'bg-red-500/30' : 'bg-yellow-500/30'}`}
                      title={`${e.status} — ${e.response_time_ms}ms — ${new Date(e.checked_at).toLocaleString()}`}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
