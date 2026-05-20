'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>()
  const [status, setStatus] = useState<'loading' | 'ready' | 'accepting' | 'done' | 'error'>('loading')
  const [invite, setInvite] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: inv } = await supabase
        .from('project_invites')
        .select('*, projects(name, icon, color)')
        .eq('token', token)
        .is('accepted_at', null)
        .single()

      if (!inv) {
        setError('Convite inválido ou expirado.')
        setStatus('error')
        return
      }

      if (new Date(inv.expires_at) < new Date()) {
        setError('Este convite expirou.')
        setStatus('error')
        return
      }

      setInvite(inv)
      setProject(inv.projects)
      setStatus('ready')
    }
    load()
  }, [token])

  async function handleAccept() {
    setStatus('accepting')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Salva token no localStorage e redireciona para login
      localStorage.setItem('pending_invite', token)
      router.push(`/login?redirect=/invite/${token}`)
      return
    }

    const res = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (res.ok) {
      setStatus('done')
      setTimeout(() => router.push(`/projects/${invite.project_id}`), 2000)
    } else {
      const d = await res.json()
      setError(d.error || 'Erro ao aceitar convite')
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={32} className="text-blue-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-6">
          ZroGest
        </h1>

        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-zinc-300 font-semibold mb-2">Convite inválido</p>
            <p className="text-zinc-500 text-sm">{error}</p>
          </>
        )}

        {status === 'done' && (
          <>
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <p className="text-zinc-100 font-semibold mb-2">Bem-vindo ao projeto!</p>
            <p className="text-zinc-500 text-sm">Redirecionando...</p>
          </>
        )}

        {(status === 'ready' || status === 'accepting') && invite && project && (
          <>
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{ backgroundColor: (project.color || '#3b82f6') + '20', color: project.color || '#3b82f6' }}
            >
              {project.icon || '📦'}
            </div>
            <p className="text-zinc-400 text-sm mb-1">Você foi convidado para</p>
            <h2 className="text-2xl font-bold text-zinc-100 mb-1">{project.name}</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
              {invite.role === 'manager' ? '✏️ Manager' : '👁️ Viewer'}
            </div>
            <p className="text-zinc-500 text-sm mb-6">
              {invite.role === 'manager'
                ? 'Você poderá editar o projeto e criar tarefas.'
                : 'Você poderá visualizar o projeto e suas métricas.'}
            </p>
            <button
              onClick={handleAccept}
              disabled={status === 'accepting'}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'accepting' ? (
                <><Loader2 size={18} className="animate-spin" /> Aceitando...</>
              ) : (
                'Aceitar convite'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
