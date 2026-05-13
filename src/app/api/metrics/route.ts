import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  const { data: integrations } = await adminClient
    .from('integrations')
    .select('*, projects(id, name)')
    .eq('type', 'supabase')
    .eq('enabled', true)

  if (!integrations?.length) {
    return NextResponse.json({ collected: 0 })
  }

  const results = []

  for (const integration of integrations) {
    const { url, service_key, queries } = integration.config as any
    if (!url || !service_key || !queries) continue

    try {
      const extSupabase = createClient(url, service_key)

      for (const query of queries) {
        const { name, table, filter, count_only, sum_field } = query

        let q = extSupabase.from(table).select(count_only ? '*' : sum_field || '*', { count: 'exact', head: count_only })

        if (filter) {
          for (const [key, value] of Object.entries(filter)) {
            q = q.eq(key, value)
          }
        }

        const { count, data } = await q

        let value = count || 0
        if (sum_field && data) {
          value = data.reduce((acc: number, row: any) => acc + (Number(row[sum_field]) || 0), 0)
        }

        await adminClient.from('metrics').insert({
          project_id: integration.projects.id,
          type: name,
          value,
          metadata: { table, filter },
        })

        results.push({ project: integration.projects.name, metric: name, value })
      }
    } catch (err: any) {
      results.push({ project: integration.projects.name, error: err.message })
    }
  }

  return NextResponse.json({ collected: results.length, results })
}

export async function GET() {
  return NextResponse.json({ status: 'ok', hint: 'POST to collect metrics' })
}
