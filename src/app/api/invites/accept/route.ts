import { createClient } from '@/lib/supabase/server'
import { adminClient as admin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { token } = await request.json()

  const { data: invite } = await admin
    .from('project_invites')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .single()

  if (!invite) return NextResponse.json({ error: 'Convite inválido' }, { status: 404 })
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Convite expirado' }, { status: 400 })
  }

  // Adicionar como membro
  const { error: memberError } = await admin.from('project_members').upsert({
    project_id: invite.project_id,
    user_id: user.id,
    role: invite.role,
    invited_by: invite.invited_by,
  }, { onConflict: 'project_id,user_id' })

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 400 })

  // Marcar convite como aceito
  await admin.from('project_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  return NextResponse.json({ ok: true, project_id: invite.project_id })
}
