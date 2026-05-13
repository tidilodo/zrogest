import { createClient } from '@/lib/supabase/server'
import { Activity, FolderKanban, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, health_checks(status, checked_at)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: recentHealth } = await supabase
    .from('health_checks')
    .select('*, projects(name, color)')
    .order('checked_at', { ascending: false })
    .limit(10)

  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0
  const downProjects = projects?.filter(p => {
    const lastCheck = p.health_checks?.[0]
    return lastCheck?.status === 'down'
  }).length || 0

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-100">Dashboard</h2>
        <p className="text-zinc-500 text-sm mt-1">Visão geral dos seus projetos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FolderKanban} label="Projetos" value={totalProjects} color="blue" />
        <StatCard icon={Activity} label="Ativos" value={activeProjects} color="green" />
        <StatCard icon={AlertCircle} label="Down" value={downProjects} color="red" />
        <StatCard icon={TrendingUp} label="Uptime" value="--%" color="violet" />
      </div>

      {/* Projects grid */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-200">Projetos</h3>
        <Link
          href="/projects/new"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
        >
          + Novo Projeto
        </Link>
      </div>

      {!projects?.length ? (
        <div className="border border-zinc-800 rounded-xl p-12 text-center">
          <FolderKanban size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-zinc-400 mb-4">Nenhum projeto cadastrado ainda</p>
          <Link
            href="/projects/new"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:opacity-90 transition"
          >
            Adicionar primeiro projeto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const lastHealth = project.health_checks?.[0]
            const statusColor = lastHealth?.status === 'up' ? 'bg-green-500' : lastHealth?.status === 'down' ? 'bg-red-500' : 'bg-zinc-600'

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: project.color + '20', color: project.color }}>
                    {project.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-zinc-100 font-semibold truncate group-hover:text-blue-400 transition">{project.name}</h4>
                    <p className="text-zinc-500 text-xs truncate">{project.url || 'Sem URL'}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} title={lastHealth?.status || 'unknown'} />
                </div>
                {project.description && (
                  <p className="text-zinc-500 text-sm line-clamp-2">{project.description}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  const colors: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
  }

  return (
    <div className="border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-100">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </div>
    </div>
  )
}
