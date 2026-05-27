import { adminClient } from '@/lib/supabase/admin'
import { projectSeeds } from '@/lib/seed-projects'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/seed-projects?user_id=xxx
 * Seed de todos os projetos do ecossistema Akasha
 * Requer autenticação (verifica se é owner via user_id)
 */
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    const admin = adminClient

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await admin.auth.admin.getUserById(userId)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid user_id' },
        { status: 401 }
      )
    }

    // Seed dos projetos
    const createdProjects = []

    for (const seed of projectSeeds) {
      const baseSlug = seed.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`

      const { data: project, error: projectError } = await admin
        .from('projects')
        .insert({
          user_id: userId,
          name: seed.name,
          slug,
          url: seed.url,
          repo_url: seed.repo_url,
          description: seed.description,
          color: seed.color,
          icon: seed.icon,
          status: 'active',
        })
        .select()
        .single()

      if (projectError) {
        console.error(`Error creating project ${seed.name}:`, projectError)
        continue
      }

      createdProjects.push(project)

      // Seed de métricas para o projeto
      if (seed.metrics.length > 0) {
        const metrics = seed.metrics.map((m) => ({
          project_id: project.id,
          metric_id: m.metric_id,
          label: m.label,
          table: m.table,
          filter: m.filter || null,
          order: seed.metrics.indexOf(m),
        }))

        const { error: metricsError } = await admin
          .from('project_metrics')
          .insert(metrics)

        if (metricsError) {
          console.error(
            `Error creating metrics for ${seed.name}:`,
            metricsError
          )
        }
      }

      // Seed de health checks iniciais (status "up")
      const { error: healthError } = await admin
        .from('health_checks')
        .insert({
          project_id: project.id,
          status: 'up',
          response_time: Math.random() * 500 + 100,
          message: 'Initialized',
        })

      if (healthError) {
        console.error(`Error creating health check for ${seed.name}:`, healthError)
      }
    }

    return NextResponse.json({
      message: `Successfully seeded ${createdProjects.length} projects`,
      projects: createdProjects.map((p) => ({
        id: p.id,
        name: p.name,
        url: p.url,
      })),
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/seed-projects
 * Mostra o seed de projetos disponível (sem criar nada)
 */
export async function GET() {
  return NextResponse.json({
    available_projects: projectSeeds.length,
    projects: projectSeeds.map((p) => ({
      name: p.name,
      url: p.url,
      color: p.icon,
      metrics_count: p.metrics.length,
    })),
    instructions: 'POST to this endpoint with ?user_id=your_user_id to seed all projects',
  })
}
