import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, GitBranch, Activity, Plug, TrendingUp } from 'lucide-react'
import { DeleteProjectButton } from './delete-button'
import { CollectMetricsButton } from './metrics-button'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) notFound()

  const { data: healthChecks } = await supabase
    .from('health_checks')
    .select('*')
    .eq('project_id', id)
    .order('checked_at', { ascending: false })
    .limit(20)

  const { data: metrics } = await supabase
    .from('metrics')
    .select('*')
    .eq('project_id', id)
    .order('collected_at', { ascending: false })
    .limit(10)

  const lastHealth = healthChecks?.[0]
  const upCount = healthChecks?.filter(h => h.status === 'up').length || 0
  const totalChecks = healthChecks?.length || 0
  const uptimePercent = totalChecks > 0 ? Math.round((upCount / totalChecks) * 100) : 0

  return (
    <div className="max-w-4xl">
      <Link href="/projects" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm mb-6 transition">
        <ArrowLeft size={16} /> Projetos
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: project.color + '20', color: project.color }}>
          {project.icon || '📦'}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-zinc-100">{project.name}</h2>
          {project.description && <p className="text-zinc-500 text-sm mt-1">{project.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {project.url && (
            <a href={project.url} target="_blank" className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition">
              <ExternalLink size={18} />
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition">
              <GitBranch size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${lastHealth?.status === 'up' ? 'bg-green-500' : lastHealth?.status === 'down' ? 'bg-red-500' : 'bg-zinc-600'}`} />
            <span className="text-zinc-100 font-semibold capitalize">{lastHealth?.status || 'Sem dados'}</span>
          </div>
        </div>
        <div className="border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Uptime</p>
          <p className="text-zinc-100 font-semibold text-xl">{uptimePercent}%</p>
        </div>
        <div className="border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Resp. Time</p>
          <p className="text-zinc-100 font-semibold text-xl">{lastHealth?.response_time_ms ? lastHealth.response_time_ms + 'ms' : '--'}</p>
        </div>
      </div>

      {/* Health History */}
      <div className="border border-zinc-800 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Activity size={16} /> Health Check History
        </h3>
        {!healthChecks?.length ? (
          <p className="text-zinc-600 text-sm">Nenhum health check registrado. Configure a URL do projeto para monitoramento automático.</p>
        ) : (
          <div className="flex gap-1 flex-wrap">
            {healthChecks.map(h => (
              <div
                key={h.id}
                className={`w-6 h-6 rounded ${h.status === 'up' ? 'bg-green-500/30' : h.status === 'down' ? 'bg-red-500/30' : 'bg-zinc-700'}`}
                title={`${h.status} — ${new Date(h.checked_at).toLocaleString()}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Integrations link */}
      <div className="border border-zinc-800 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Plug size={16} /> Integrações
          </h3>
          <Link
            href={`/projects/${id}/integrations`}
            className="text-sm text-blue-400 hover:underline"
          >
            Configurar
          </Link>
        </div>
        <p className="text-zinc-600 text-sm mt-2">Conecte Supabase ou Mercado Pago para coletar métricas automaticamente.</p>
      </div>

      {/* Metrics */}
      <div className="border border-zinc-800 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <TrendingUp size={16} /> Métricas
          </h3>
          <CollectMetricsButton />
        </div>
        {metrics && metrics.length > 0 ? (
          <div className="space-y-2">
            {metrics.map(m => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{m.type}</span>
                <span className="text-zinc-100 font-medium">{m.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">Nenhuma métrica coletada. Configure integrações e clique em coletar.</p>
        )}
      </div>

      {/* Danger zone */}
      <div className="border border-red-900/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-red-400 mb-2">Zona de perigo</h3>
        <p className="text-zinc-500 text-sm mb-4">Ação irreversível — o projeto e todos os dados serão deletados.</p>
        <DeleteProjectButton projectId={project.id} />
      </div>
    </div>
  )
}
