import { adminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST() {
  const { data: projects } = await adminClient
    .from('projects')
    .select('id, url')
    .eq('status', 'active')
    .not('url', 'is', null)

  if (!projects?.length) {
    return NextResponse.json({ checked: 0 })
  }

  const results = await Promise.all(
    projects.map(async (project) => {
      const start = Date.now()
      let status: 'up' | 'down' | 'degraded' = 'down'
      let responseTime = 0

      try {
        const resp = await fetch(project.url!, { method: 'HEAD', signal: AbortSignal.timeout(10000) })
        responseTime = Date.now() - start

        if (resp.ok) {
          status = responseTime > 3000 ? 'degraded' : 'up'
        }
      } catch {
        responseTime = Date.now() - start
        status = 'down'
      }

      await adminClient.from('health_checks').insert({
        project_id: project.id,
        status,
        response_time_ms: responseTime,
      })

      return { project_id: project.id, status, response_time_ms: responseTime }
    })
  )

  return NextResponse.json({ checked: results.length, results })
}

export async function GET() {
  return NextResponse.json({ status: 'ok', hint: 'POST to run health checks' })
}
