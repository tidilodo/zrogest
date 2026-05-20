import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getClickUpConfig(supabase: any, projectId: string) {
  const { data } = await supabase
    .from('integrations')
    .select('config')
    .eq('project_id', projectId)
    .eq('type', 'clickup')
    .eq('enabled', true)
    .single()
  return data?.config as { api_token: string; list_id: string } | null
}

// GET /api/clickup?project_id=xxx — lista tarefas do ClickUp
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')
  if (!projectId) return NextResponse.json({ error: 'project_id obrigatório' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const config = await getClickUpConfig(supabase, projectId)
  if (!config?.api_token || !config?.list_id) {
    return NextResponse.json({ error: 'ClickUp não configurado neste projeto' }, { status: 400 })
  }

  const res = await fetch(
    `https://api.clickup.com/api/v2/list/${config.list_id}/task?archived=false&order_by=created&reverse=true`,
    { headers: { Authorization: config.api_token } }
  )

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: `ClickUp API: ${err}` }, { status: res.status })
  }

  const data = await res.json()
  const tasks = (data.tasks || []).map((t: any) => ({
    id: t.id,
    name: t.name,
    status: t.status?.status || 'open',
    status_color: t.status?.color || '#gray',
    priority: t.priority?.priority || null,
    url: t.url,
    assignees: t.assignees?.map((a: any) => a.username) || [],
    due_date: t.due_date ? new Date(parseInt(t.due_date)).toLocaleDateString('pt-BR') : null,
    created: new Date(parseInt(t.date_created)).toLocaleDateString('pt-BR'),
  }))

  return NextResponse.json({ tasks })
}

// POST /api/clickup — cria tarefa no ClickUp
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { projectId, name, description, priority } = await request.json()
  if (!projectId || !name) {
    return NextResponse.json({ error: 'projectId e name são obrigatórios' }, { status: 400 })
  }

  // Verificar se user tem acesso (owner ou manager)
  const { data: project } = await supabase.from('projects').select('user_id').eq('id', projectId).single()
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single()

  const isOwner = project?.user_id === user.id
  const isManager = membership?.role === 'manager'
  if (!isOwner && !isManager) {
    return NextResponse.json({ error: 'Sem permissão para criar tarefas' }, { status: 403 })
  }

  const config = await getClickUpConfig(supabase, projectId)
  if (!config?.api_token || !config?.list_id) {
    return NextResponse.json({ error: 'ClickUp não configurado neste projeto' }, { status: 400 })
  }

  const priorityMap: Record<string, number> = { urgent: 1, high: 2, normal: 3, low: 4 }

  const body: any = { name }
  if (description) body.description = description
  if (priority && priorityMap[priority]) body.priority = priorityMap[priority]

  const res = await fetch(`https://api.clickup.com/api/v2/list/${config.list_id}/task`, {
    method: 'POST',
    headers: {
      Authorization: config.api_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: `ClickUp API: ${err}` }, { status: res.status })
  }

  const task = await res.json()
  return NextResponse.json({
    ok: true,
    task: { id: task.id, name: task.name, url: task.url, status: task.status?.status },
  })
}
