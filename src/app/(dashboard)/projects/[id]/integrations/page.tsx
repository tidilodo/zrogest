'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Search, Check } from 'lucide-react'
import Link from 'next/link'
import { metricsCatalog, categoryLabels, searchMetrics, type MetricTemplate } from '@/lib/metrics-catalog'

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
  const [tab, setTab] = useState<'integrations' | 'catalog'>('integrations')
  const supabase = createClient()

  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'supabase' | 'mercadopago'>('supabase')
  const [formConfig, setFormConfig] = useState({
    url: '',
    service_key: '',
    access_token: '',
    queries: [] as { name: string; table: string; filter: Record<string, string>; count_only: boolean }[]
  })

  // Catalog search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<MetricTemplate[]>([])

  useEffect(() => { loadIntegrations() }, [])

  async function loadIntegrations() {
    const { data } = await supabase
      .from('integrations')
      .select('*')
      .eq('project_id', id)
      .order('created_at')
    setIntegrations(data || [])
    setLoading(false)
  }

  function toggleMetric(metric: MetricTemplate) {
    setSelectedMetrics(prev => {
      const exists = prev.find(m => m.id === metric.id)
      if (exists) return prev.filter(m => m.id !== metric.id)
      return [...prev, metric]
    })
  }

  function applySelectedMetrics() {
    const queries = selectedMetrics.map(m => ({
      name: m.name,
      table: m.table,
      filter: m.filter || {},
      count_only: m.count_only,
    }))
    setFormConfig(prev => ({ ...prev, queries: [...prev.queries, ...queries] }))
    setSelectedMetrics([])
    setTab('integrations')
    setShowForm(true)
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
    setFormConfig({ url: '', service_key: '', access_token: '', queries: [] })
    loadIntegrations()
  }

  async function deleteIntegration(integrationId: string) {
    if (!confirm('Deletar integração?')) return
    await supabase.from('integrations').delete().eq('id', integrationId)
    loadIntegrations()
  }

  function addManualQuery() {
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

  function removeQuery(index: number) {
    setFormConfig(prev => ({
      ...prev,
      queries: prev.queries.filter((_, i) => i !== index)
    }))
  }

  const filteredMetrics = searchQuery ? searchMetrics(searchQuery) : metricsCatalog
  const groupedMetrics = filteredMetrics.reduce<Record<string, MetricTemplate[]>>((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m)
    return acc
  }, {})

  return (
    <div className="max-w-3xl">
      <Link href={`/projects/${id}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm mb-6 transition">
        <ArrowLeft size={16} /> Voltar ao projeto
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-100">Integrações & Métricas</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('integrations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'integrations' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-100'}`}
        >
          Integrações
        </button>
        <button
          onClick={() => setTab('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'catalog' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-100'}`}
        >
          Catálogo de Métricas
        </button>
      </div>

      {/* Catalog tab */}
      {tab === 'catalog' && (
        <div>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar métricas (ex: usuários, pagos, rifas...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {selectedMetrics.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-blue-600/10 border border-blue-600/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300">{selectedMetrics.length} métrica(s) selecionada(s)</span>
                <button
                  onClick={applySelectedMetrics}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition"
                >
                  Usar selecionadas
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(groupedMetrics).map(([category, metrics]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">{categoryLabels[category] || category}</h3>
                <div className="space-y-2">
                  {metrics.map(metric => {
                    const isSelected = selectedMetrics.some(m => m.id === metric.id)
                    return (
                      <button
                        key={metric.id}
                        onClick={() => toggleMetric(metric)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition ${
                          isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-lg">{metric.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-100 font-medium">{metric.name}</p>
                          <p className="text-xs text-zinc-500">{metric.description}</p>
                          <p className="text-xs text-zinc-600 mt-0.5">tabela: <code className="text-zinc-500">{metric.table}</code>{metric.filter ? ` | filtro: ${JSON.stringify(metric.filter)}` : ''}</p>
                        </div>
                        {isSelected && <Check size={16} className="text-blue-400 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations tab */}
      {tab === 'integrations' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
            >
              <Plus size={16} /> Nova Integração
            </button>
          </div>

          {/* Existing integrations */}
          {loading ? (
            <p className="text-zinc-500">Carregando...</p>
          ) : integrations.length === 0 && !showForm ? (
            <div className="border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-400 mb-2">Nenhuma integração configurada</p>
              <p className="text-zinc-600 text-sm mb-4">Conecte Supabase ou Mercado Pago para coletar métricas</p>
              <button
                onClick={() => setTab('catalog')}
                className="text-sm text-blue-400 hover:underline"
              >
                Ver catálogo de métricas disponíveis →
              </button>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {integrations.map(int => (
                <div key={int.id} className="border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300 mr-2 uppercase">
                        {int.type}
                      </span>
                      {int.type === 'supabase' && (
                        <span className="text-zinc-500 text-sm">
                          {(int.config as any).queries?.length || 0} queries
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteIntegration(int.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {int.type === 'supabase' && (int.config as any).queries?.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {(int.config as any).queries.map((q: any, i: number) => (
                        <div key={i} className="text-xs text-zinc-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          {q.name} <span className="text-zinc-700">({q.table})</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <label className="text-sm text-zinc-400">Métricas para coletar</label>
                      <div className="flex gap-2">
                        <button onClick={() => setTab('catalog')} className="text-xs text-blue-400 hover:underline">Catálogo</button>
                        <button onClick={addManualQuery} className="text-xs text-zinc-400 hover:text-zinc-200">+ Manual</button>
                      </div>
                    </div>

                    {formConfig.queries.length === 0 ? (
                      <p className="text-xs text-zinc-600 p-3 border border-dashed border-zinc-800 rounded-lg text-center">
                        Selecione métricas do catálogo ou adicione manualmente
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {formConfig.queries.map((query, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={query.name}
                              onChange={e => updateQuery(i, 'name', e.target.value)}
                              placeholder="Nome da métrica"
                              className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={query.table}
                              onChange={e => updateQuery(i, 'table', e.target.value)}
                              placeholder="Tabela"
                              className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <button onClick={() => removeQuery(i)} className="p-1 text-zinc-500 hover:text-red-400">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); setFormConfig({ url: '', service_key: '', access_token: '', queries: [] }) }}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={addIntegration}
                  disabled={saving || (formType === 'supabase' && (!formConfig.url || !formConfig.service_key || formConfig.queries.length === 0))}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50"
                >
                  <Save size={14} /> {saving ? 'Salvando...' : 'Salvar Integração'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
