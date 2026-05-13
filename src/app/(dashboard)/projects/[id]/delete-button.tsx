'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) return

    await supabase.from('projects').delete().eq('id', projectId)
    router.push('/projects')
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 text-sm font-medium hover:bg-red-600/30 transition"
    >
      <Trash2 size={14} /> Deletar Projeto
    </button>
  )
}
