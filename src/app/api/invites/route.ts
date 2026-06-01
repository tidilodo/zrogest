import { createClient } from '@/lib/supabase/server'
import { adminClient as admin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { projectId, email, role } = await request.json()
  if (!projectId || !email || !role) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  // Verificar que o usuário é owner do projeto
  const { data: project } = await supabase
    .from('projects')
    .select('id, name, user_id')
    .eq('id', projectId)
    .single()

  if (!project || project.user_id !== user.id) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }


  // Verificar se usuário já existe
  const { data: existingProfile } = await admin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingProfile) {
    // Já tem conta — adicionar direto como membro
    const { error } = await admin.from('project_members').upsert({
      project_id: projectId,
      user_id: existingProfile.id,
      role,
      invited_by: user.id,
    }, { onConflict: 'project_id,user_id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, type: 'added_directly' })
  }

  // Não tem conta — criar convite pendente (expira em 7 dias)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { data: invite, error } = await admin
    .from('project_invites')
    .upsert({
      project_id: projectId,
      email,
      role,
      invited_by: user.id,
      expires_at: expiresAt.toISOString(),
    }, { onConflict: 'project_id,email' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`

  // Enviar email com Resend
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY não configurada - email não será enviado')
    return NextResponse.json({
      ok: true,
      type: 'invite_created_no_email',
      warning: 'Email não configurado. Convite criado, mas email não foi enviado.',
      invite_url: inviteUrl
    }, { status: 200 })
  }

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'ZroGest <noreply@resend.dev>',
        to: [email],
        subject: `Você foi convidado para ${project.name} no ZroGest`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0a0a0f;color:#f0f0f0;padding:32px;border-radius:12px;">
            <h2 style="color:#3b82f6;">ZroGest</h2>
            <p>Você foi convidado para acessar o projeto <strong>${project.name}</strong> como <strong>${role}</strong>.</p>
            <p style="margin:24px 0;">
              <a href="${inviteUrl}" style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
                Aceitar convite
              </a>
            </p>
            <p style="color:#666;font-size:12px;">Link válido por 7 dias. Se não esperava este convite, ignore.</p>
          </div>
        `,
      }),
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.json()
      console.error('❌ Erro ao enviar email via Resend:', emailError)
      return NextResponse.json({
        ok: false,
        error: `Email não enviado: ${emailError.message || 'Erro desconhecido'}`,
        type: 'email_failed'
      }, { status: 500 })
    }

    console.log('✅ Email enviado com sucesso para', email)
    return NextResponse.json({ ok: true, type: 'invite_sent', invite_url: inviteUrl })

  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('❌ Erro ao enviar email:', errMsg)
    return NextResponse.json({
      ok: false,
      error: `Erro ao enviar email: ${errMsg}`,
      type: 'email_error'
    }, { status: 500 })
  }
}
