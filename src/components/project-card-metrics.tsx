'use client'

import Link from 'next/link'
import { ExternalLink, GitBranch, TrendingUp } from 'lucide-react'

interface MetricStat {
  label: string
  value: string | number
  icon: string
  color?: string
}

interface ProjectCardMetricsProps {
  projectId: string
  name: string
  description: string
  url?: string
  repoUrl?: string
  icon: string
  color: string
  status: 'up' | 'down' | 'degraded'
  metrics: MetricStat[]
}

export function ProjectCardMetrics({
  projectId,
  name,
  description,
  url,
  repoUrl,
  icon,
  color,
  status,
  metrics,
}: ProjectCardMetricsProps) {
  const statusColor =
    status === 'up'
      ? 'bg-green-500'
      : status === 'down'
        ? 'bg-red-500'
        : 'bg-yellow-500'

  return (
    <Link
      href={`/projects/${projectId}`}
      className="block border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-900/50 transition group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: color + '20', color }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-zinc-100 font-semibold truncate group-hover:text-blue-400 transition">
              {name}
            </h3>
            <p className="text-zinc-500 text-xs truncate">{description}</p>
          </div>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${statusColor} shrink-0 mt-1`} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.slice(0, 4).map((metric, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/50 rounded-lg p-2.5 border border-zinc-800/50"
          >
            <p className="text-xs text-zinc-500 mb-1">{metric.icon} {metric.label}</p>
            <p className="text-sm font-semibold text-zinc-100">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-zinc-400 transition p-1"
              title="Visitar site"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-zinc-400 transition p-1"
              title="Ver repositório"
            >
              <GitBranch size={14} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition">
          <TrendingUp size={14} />
          Ver detalhes
        </div>
      </div>
    </Link>
  )
}
