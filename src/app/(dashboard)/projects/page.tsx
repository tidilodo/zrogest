import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FolderKanban, Plus, ExternalLink, GitBranch } from 'lucide-react'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, health_checks(status, checked_at)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Projetos</h2>
          <p className="text-zinc-500 text-sm mt-1">{projects?.length || 0} projetos cadastrados</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
        >
          <Plus size={16} /> Novo
        </Link>
      </div>

      {!projects?.length ? (
        <div className="border border-zinc-800 rounded-xl p-12 text-center">
          <FolderKanban size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-zinc-400">Nenhum projeto ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const lastHealth = project.health_checks?.[0]
            const statusColor = lastHealth?.status === 'up' ? 'bg-green-500' : lastHealth?.status === 'down' ? 'bg-red-500' : 'bg-zinc-600'

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center gap-4 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: project.color + '20', color: project.color }}>
                  {project.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-zinc-100 font-semibold group-hover:text-blue-400 transition">{project.name}</h3>
                  <p className="text-zinc-500 text-sm truncate">{project.description || project.url || 'Sem descrição'}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {project.url && (
                    <span className="text-zinc-600"><ExternalLink size={16} /></span>
                  )}
                  {project.repo_url && (
                    <span className="text-zinc-600"><GitBranch size={16} /></span>
                  )}
                  <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
