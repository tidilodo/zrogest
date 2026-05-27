'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, FolderKanban, TrendingUp, AlertCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { ProjectCardMetrics } from '@/components/project-card-metrics'
import { SeedInit } from '@/components/seed-init'
import { projectMetricsMap } from '@/lib/seed-projects'

interface Project {
  id: string
  name: string
  description: string
  url: string
  repo_url: string
  icon: string
  color: string
}

export default function DashboardPageNew() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadProjects() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('projects')
        .select('id, name, description, url, repo_url, icon, color')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setProjects(data)
      }
      setLoading(false)
    }

    loadProjects()
  }, [])

  const getMetricsForProject = (projectName: string) => {
    const key = projectName.toLowerCase().split('(')[0].trim().replace(/\s+/g, '')
    const metrics = projectMetricsMap[key as keyof typeof projectMetricsMap]
    return metrics?.stats || []
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.color).length

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 rounded w-40" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-zinc-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-100">Dashboard Akasha</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Monitore todos os projetos do ecossistema em tempo real
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FolderKanban}
          label="Projetos Ativos"
          value={totalProjects}
          color="blue"
        />
        <StatCard
          icon={Activity}
          label="Status Up"
          value={activeProjects}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Uptime Médio"
          value="99.8%"
          color="violet"
        />
        <StatCard
          icon={AlertCircle}
          label="Alertas"
          value="0"
          color="amber"
        />
      </div>

      {/* Projects */}
      {totalProjects === 0 ? (
        <div className="space-y-4">
          <SeedInit />
          <div className="border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-zinc-500 text-sm mb-4">
              Ou adicionar projeto manualmente:
            </p>
            <Link
              href="/projects/new"
              className="inline-block px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition"
            >
              + Novo Projeto
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-200">
              Projetos do Ecossistema
            </h3>
            <Link
              href="/projects/new"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
            >
              + Novo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCardMetrics
                key={project.id}
                projectId={project.id}
                name={project.name}
                description={project.description || project.url || 'Sem descrição'}
                url={project.url}
                repoUrl={project.repo_url}
                icon={project.icon || '📦'}
                color={project.color || '#3b82f6'}
                status="up"
                metrics={getMetricsForProject(project.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: any
  color: string
}) {
  const colors: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  }

  return (
    <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50 hover:bg-zinc-900/80 transition">
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
