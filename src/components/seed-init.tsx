'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react'

export function SeedInit() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projectCount, setProjectCount] = useState(0)

  const supabase = createClient()

  async function handleSeed() {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Usuário não autenticado')
        setLoading(false)
        return
      }

      const response = await fetch(
        `/api/seed-projects?user_id=${user.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao fazer seed')
      }

      const data = await response.json()
      setProjectCount(data.projects.length)
      setSuccess(true)

      // Refresh page após 2 segundos
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-6 text-center">
        <CheckCircle2 size={32} className="mx-auto text-green-400 mb-3" />
        <h3 className="text-lg font-semibold text-zinc-100 mb-1">
          Sucesso! 🎉
        </h3>
        <p className="text-zinc-400 text-sm mb-3">
          {projectCount} projetos do ecossistema Akasha foram adicionados!
        </p>
        <p className="text-zinc-500 text-xs">
          Redirecionando em 2 segundos...
        </p>
      </div>
    )
  }

  return (
    <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
          <Zap size={20} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">
            Nenhum projeto cadastrado
          </h3>
          <p className="text-zinc-400 text-sm mb-4">
            Quer inicializar com todos os 6 projetos do ecossistema Akasha?
            Astro Resumo, Numerologia, OráculoAI, TerapeutAI, Rifa Digital e
            mais!
          </p>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            onClick={handleSeed}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Inicializando...
              </>
            ) : (
              <>
                <Zap size={16} />
                Seed dos 6 Projetos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
