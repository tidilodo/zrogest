'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

interface Integration {
  id: string
  type: string
  config: any
  enabled: boolean
}

export default function IntegrationsPage() {
  const { id } = useParams()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // New integration form
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'supabase' | 'mercadopago'>('supabase')
  const [formConfig, setFormConfig] = useState({
    url: '',
    service_key: '',
    access_token: '',
    queries: [{ name: '', table: '', filter: {}, count_only: true }]
  })

  useEffect(() => {
    loadIntegrations()
  }, [])

  async function loadIntegrations() {
    const { data } = await supabase
      .from('integrations')
      .select('*')
      .eq('project_id', id)
      .order('created_at')

    setIntegrations(data || [])
    setLoading(false)
  }

  async function addIntegration() {
    setSaving(true)

    let config: any = {}
    if (formType === 'supabase') {
      config = {
        url: formConfig.url,
        service_key: formConfig.service_key,
        queries: formConfig.queries.filter(q => q.name && q.table),
      }
    } else {
      config = { access_token: formConfig.access_token }
    }

    await supabase.from('integrations').insert({
      project_id: id,
      type: formType,
      config,
      enabled: true,
    })

    setSaving(false)
    setShowForm(false)
    setFormConfig({ url: '', service_key: '', access_token: '', queries: [{ name: '', table: '', filter: {}, count_only: true }] })
    loadIntegrations()
  }

  async function deleteIntegration(integrationId: string) {
    if (!confirm('Deletar integração?')) return
    await supabase.from('integrations').delete().eq('id', integrationId)
    loadIntegrations()
  }

  function addQuery() {
    setFormConfig(prev => ({
      ...prev,
      queries: [...prev.queries, { name: '', table: '', filter: {}, count_only: true }]
    }))
  }

  function updateQuery(index: number, field: string, value: any) {
    setFormConfig(prev => {
      const queries = [...prev.queries]
      queries[index] = { ...queries[index], [field]: value }
      return { ...prev, queries }
    })
  }

  return (
    <div className="max-w-2xl">
      <Link href={`/projects/${id}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm mb-6 transition">
        <ArrowLeft size={16} /> Voltar ao projeto
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-100">Integrações</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {/* Existing integrations */}
      {loading ? (
        <p className="text-zinc-500">Carregando...</p>
      ) : integrations.length === 0 && !showForm ? (
        <div className="border border-zinc-800 rounded-xl p-8 text-center">
          <p className="text-zinc-400 mb-2">Nenhuma integração configurada</p>
          <p className="text-zinc-600 text-sm">Adicione Supabase ou Mercado Pago para coletar métricas</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {integrations.map(int => (
            <div key={int.id} className="border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300 mr-2">
                  {int.type}
                </span>
                {int.type === 'supabase' && (
                  <span className="text-zinc-500 text-sm">
                    {(int.config as any).queries?.length || 0} queries configuradas
                  </span>
                )}
                {int.type === 'mercadopago' && (
                  <span className="text-zinc-500 text-sm">Token configurado</span>
                )}
              </div>
              <button
                onClick={() => deleteIntegration(int.id)}
                className="p-2 text-zinc-500 hover:text-red-400 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New integration form */}
      {showForm && (
        <div className="border border-zinc-700 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200">Nova Integração</h3>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Tipo</label>
            <select
              value={formType}
              onChange={e => setFormType(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="supabase">Supabase</option>
              <option value="mercadopago">Mercado Pago</option>
            </select>
          </div>

          {formType === 'supabase' && (
            <>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Supabase URL</label>
                <input
                  type="url"
                  value={formConfig.url}
                  onChange={e => setFormConfig(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://xxx.supabase.co"
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Service Role Key</label>
                <input
                  type="password"
                  value={formConfig.service_key}
                  onChange={e => setFormConfig(prev => ({ ...prev, service_key: e.target.value }))}
                  placeholder="eyJ..."
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-zinc-400">Queries (métricas para coletar)</label>
                  <button onClick={addQuery} className="text-xs text-blue-400 hover:underline">+ Adicionar query</button>
                </div>
                {formConfig.queries.map((query, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={query.name}
                      onChange={e => updateQuery(i, 'name', e.target.value)}
                      placeholder="Nome (ex: Números vendidos)"
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={query.table}
                      onChange={e => updateQuery(i, 'table', e.target.value)}
                      placeholder="Tabela (ex: rifa_numbers)"
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
                <p className="text-xs text-zinc-600 mt-1">Cada query conta registros na tabela especificada</p>
              </div>
            </>
          )}

          {formType === 'mercadopago' && (
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Access Token</label>
              <input
                type="password"
                value={formConfig.access_token}
                onChange={e => setFormConfig(prev => ({ ...prev, access_token: e.target.value }))}
                placeholder="APP_USR-..."
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition"
            >
              Cancelar
            </button>
            <button
              onClick={addIntegration}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50"
            >
              <Save size={14} /> {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
