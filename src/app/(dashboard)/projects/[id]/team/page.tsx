'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, Trash2, Crown, Shield, Eye, Mail, Clock } from 'lucide-react'
import { useParams } from 'next/navigation'

type Role = 'owner' | 'manager' | 'viewer'

const ROLE_CONFIG: Record<Role, { label: string; icon: typeof Crown; color: string; desc: string }> = {
  owner:   { label: 'Owner',   icon: Crown,  color: 'text-amber-400',  desc: 'Acesso total' },
  manager: { label: 'Manager', icon: Shield, color: 'text-blue-400',   desc: 'Edita e cria tarefas' },
  viewer:  { label: 'Viewer',  icon: Eye,    color: 'text-zinc-400',   desc: 'Só visualiza' },
}

export default function TeamPage() {
  const { id: projectId } = useParams<{ id: string }>()
  const [members, setMembers] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [project, setProject] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'manager' | 'viewer'>('viewer')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  useEffect(() => { loadAll() }, [projectId])

  async function loadAll() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)

    const { data: proj } = await supabase.from('projects').select('*').eq('id', projectId).single()
    setProject(proj)

    const { data: mems } = await supabase
      .from('project_members')
      .select('*, profiles(name, email)')
      .eq('project_id', projectId)
    setMembers(mems || [])

    const { data: invs } = await supabase
      .from('project_invites')
      .select('*')
      .eq('project_id', projectId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
    setInvites(invs || [])
  }

  const isOwner = project?.user_id === currentUser?.id

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setLoading(true)
    setMsg('')

    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, email: inviteEmail.trim(), role: inviteRole }),
    })
    const data = await res.json()

    if (res.ok) {
      setMsg(`Convite enviado para ${inviteEmail}`)
      setInviteEmail('')
      loadAll()
    } else {
      setMsg(data.error || 'Erro ao enviar convite')
    }
    setLoading(false)
  }

  async function handleRemoveMember(memberId: string) {
    await supabase.from('project_members').delete().eq('id', memberId)
    loadAll()
  }

  async function handleRevokeInvite(inviteId: string) {
    await supabase.from('project_invites').delete().eq('id', inviteId)
    loadAll()
  }

  async function handleChangeRole(memberId: string, role: Role) {
    await supabase.from('project_members').update({ role }).eq('id', memberId)
    loadAll()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-100">Equipe</h2>
        <p className="text-zinc-500 text-sm mt-1">Gerencie quem tem acesso a este projeto</p>
      </div>

      {/* Convidar */}
      {isOwner && (
        <div className="border border-zinc-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <UserPlus size={16} /> Convidar pessoa
          </h3>
          <form onSubmit={handleInvite} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
                className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none text-sm"
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as 'manager' | 'viewer')}
                className="px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-500">
                {inviteRole === 'manager' ? '✏️ Pode editar projeto e criar tarefas no ClickUp' : '👁️ Só visualiza o projeto'}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Convidar'}
              </button>
            </div>
            {msg && (
              <p className={`text-xs ${msg.includes('Erro') ? 'text-red-400' : 'text-green-400'}`}>{msg}</p>
            )}
          </form>
        </div>
      )}

      {/* Membros ativos */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-sm font-semibold text-zinc-300">Membros ({members.length + 1})</h3>
        </div>

        {/* Owner sempre aparece primeiro */}
        {project && (
          <div className="flex items-center gap-4 px-5 py-3.5 border-b border-zinc-800/50">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold">
              {project.owner_name?.[0] || currentUser?.email?.[0]?.toUpperCase() || 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-100 font-medium">Você (owner)</p>
              <p className="text-xs text-zinc-500 truncate">{currentUser?.email}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium">
              <Crown size={12} /> Owner
            </div>
          </div>
        )}

        {members.map(member => {
          const cfg = ROLE_CONFIG[member.role as Role] || ROLE_CONFIG.viewer
          const Icon = cfg.icon
          return (
            <div key={member.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-zinc-800/50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-bold">
                {member.profiles?.name?.[0]?.toUpperCase() || member.profiles?.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-100 font-medium">{member.profiles?.name || member.profiles?.email}</p>
                <p className="text-xs text-zinc-500 truncate">{member.profiles?.email}</p>
              </div>
              {isOwner ? (
                <div className="flex items-center gap-2">
                  <select
                    value={member.role}
                    onChange={e => handleChangeRole(member.id, e.target.value as Role)}
                    className="text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-none"
                  >
                    <option value="manager">Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-xs font-medium ${cfg.color}`}>
                  <Icon size={12} /> {cfg.label}
                </div>
              )}
            </div>
          )
        })}

        {members.length === 0 && (
          <div className="px-5 py-6 text-center text-zinc-600 text-sm">
            Nenhum membro ainda. Convide alguém acima.
          </div>
        )}
      </div>

      {/* Convites pendentes */}
      {isOwner && invites.length > 0 && (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <Clock size={14} /> Convites pendentes ({invites.length})
            </h3>
          </div>
          {invites.map(inv => (
            <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-zinc-800/50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <Mail size={14} className="text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300">{inv.email}</p>
                <p className="text-xs text-zinc-600">
                  Expira {new Date(inv.expires_at).toLocaleDateString('pt-BR')} · {inv.role}
                </p>
              </div>
              <button
                onClick={() => handleRevokeInvite(inv.id)}
                className="p-1.5 text-zinc-600 hover:text-red-400 transition"
                title="Revogar convite"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Legenda de roles */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([role, cfg]) => {
          const Icon = cfg.icon
          return (
            <div key={role} className="border border-zinc-800 rounded-lg p-3 text-center">
              <Icon size={18} className={`mx-auto mb-1 ${cfg.color}`} />
              <p className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{cfg.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
