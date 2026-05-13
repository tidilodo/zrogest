'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CollectMetricsButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function collect() {
    setLoading(true)
    await fetch('/api/metrics', { method: 'POST' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={collect}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition disabled:opacity-50"
    >
      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
      {loading ? 'Coletando...' : 'Coletar agora'}
    </button>
  )
}
