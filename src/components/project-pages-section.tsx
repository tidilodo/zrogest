'use client'

import { getProjectPages, getCategoryColor, getCategoryLabel } from '@/lib/project-pages'
import { ExternalLink, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ProjectPagesSectionProps {
  projectName: string
}

export function ProjectPagesSection({ projectName }: ProjectPagesSectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const projectPages = getProjectPages(projectName)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  if (!mounted || !projectPages) {
    return null
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  // Group pages by type
  const pagesByType = projectPages.pages.reduce(
    (acc, page) => {
      if (!acc[page.type]) acc[page.type] = []
      acc[page.type].push(page)
      return acc
    },
    {} as Record<string, typeof projectPages.pages>
  )

  const pageTypes: Array<'public' | 'admin' | 'api' | 'settings'> = ['public', 'admin', 'api', 'settings']

  return (
    <div className="space-y-6 mt-8 pt-6 border-t border-zinc-800">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          📄 Páginas & Documentação
        </h3>
        <p className="text-zinc-400 text-sm mb-4">
          Acesse todas as páginas públicas, admin e APIs disponíveis neste projeto
        </p>
      </div>

      {/* Pages by category */}
      {pageTypes.map(type => {
        const pages = pagesByType[type]
        if (!pages || pages.length === 0) return null

        return (
          <div key={type} className="space-y-3">
            <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              {getCategoryLabel(type)}
            </h4>

            <div className="space-y-2">
              {pages.map((page, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-3 transition hover:border-opacity-100 ${getCategoryColor(type)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{page.icon}</span>
                        <h5 className="text-sm font-medium text-zinc-100">{page.name}</h5>
                        {page.requiresAuth && (
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                            Autenticado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">{page.description}</p>

                      {/* Truncated URL for display */}
                      <div className="mt-2 flex items-center gap-2">
                        <code className="text-xs bg-zinc-900/50 px-2 py-1 rounded border border-zinc-700/50 text-zinc-300 truncate flex-1">
                          {page.path.length > 50 ? page.path.substring(0, 50) + '...' : page.path}
                        </code>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyUrl(page.path)}
                        className="p-2 rounded-lg hover:bg-zinc-700/50 transition opacity-0 group-hover:opacity-100 lg:opacity-100"
                        title="Copiar URL"
                      >
                        {copiedUrl === page.path ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} className="text-zinc-500 hover:text-zinc-300" />
                        )}
                      </button>

                      {page.external !== false && (
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-zinc-700/50 transition"
                          title="Abrir em nova aba"
                        >
                          <ExternalLink size={16} className="text-zinc-500 hover:text-zinc-300" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Full URL tooltip on hover */}
                  <div className="mt-2 hidden lg:block">
                    <div className="text-xs text-zinc-500 break-all font-mono">{page.path}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold text-zinc-100">{pagesByType['public']?.length || 0}</div>
            <div className="text-zinc-500">Públicas</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-zinc-100">{pagesByType['admin']?.length || 0}</div>
            <div className="text-zinc-500">Admin</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-zinc-100">{pagesByType['api']?.length || 0}</div>
            <div className="text-zinc-500">APIs</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-zinc-100">{pagesByType['settings']?.length || 0}</div>
            <div className="text-zinc-500">Configurações</div>
          </div>
        </div>
      </div>
    </div>
  )
}
