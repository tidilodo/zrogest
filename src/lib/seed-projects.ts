/**
 * Seed de projetos do ecossistema Akasha
 * Todos os projetos pré-configurados com métricas padrão
 */

export interface ProjectSeed {
  name: string
  url: string
  repo_url: string
  description: string
  color: string
  icon: string
  metrics: {
    metric_id: string
    label: string
    table: string
    filter?: Record<string, any>
  }[]
}

export const projectSeeds: ProjectSeed[] = [
  {
    name: 'Cosmos',
    url: 'https://astroresumo.com',
    repo_url: 'https://github.com/tidilodo/astro-resumo',
    description: 'App de previsões astrológicas semanais com FastAPI + Bedrock. Sistema de cupons 50-60% OFF, Admin HD com follow-ups.',
    color: '#c9a84c',
    icon: '🌙',
    metrics: [
      {
        metric_id: 'astro_total_users',
        label: 'Usuários Registrados',
        table: 'astro-users',
      },
      {
        metric_id: 'astro_transactions',
        label: 'Transações com Cupom',
        table: 'astro-transacoes',
        filter: { cupom: { $exists: true } },
      },
      {
        metric_id: 'astro_hd_pedidos',
        label: 'Pedidos Human Design',
        table: 'human-design-pedidos',
      },
      {
        metric_id: 'astro_afiliados',
        label: 'Afiliados Ativos',
        table: 'astro-afiliados',
      },
      {
        metric_id: 'astro_partners',
        label: 'Parceiros Cadastrados',
        table: 'astro-parceiros',
      },
    ],
  },
  {
    name: 'Human Design',
    url: 'https://astroresumo.com/human-design',
    repo_url: 'https://github.com/tidilodo/astro-resumo',
    description: 'Mapa de Design Humano com 3 planos premium (R$97/247/497). PDF 15 páginas + email follow-up. Admin dashboard com clientes.',
    color: '#7c3aed',
    icon: '🧬',
    metrics: [
      {
        metric_id: 'hd_total_pedidos',
        label: 'Total de Pedidos',
        table: 'human-design-pedidos',
      },
      {
        metric_id: 'hd_receita',
        label: 'Receita Total',
        table: 'human-design-pedidos',
      },
      {
        metric_id: 'hd_entregues',
        label: 'Mapas Entregues',
        table: 'human-design-pedidos',
        filter: { status: 'entregue' },
      },
      {
        metric_id: 'hd_pendentes',
        label: 'Pedidos Pendentes',
        table: 'human-design-pedidos',
        filter: { status: 'pendente' },
      },
      {
        metric_id: 'hd_followups_enviados',
        label: 'Follow-ups Enviados',
        table: 'human-design-followups',
      },
    ],
  },
  {
    name: 'Numerologia',
    url: 'https://numerologia.astroresumo.com',
    repo_url: 'https://github.com/tidilodo/numerologia',
    description: 'App web de mapa numerológico Pitagórico com relatório premium e export PDF. Integração Santessência com 5 funnels.',
    color: '#c084fc',
    icon: '🔢',
    metrics: [
      {
        metric_id: 'num_users',
        label: 'Usuários',
        table: 'users',
      },
      {
        metric_id: 'num_reports',
        label: 'Relatórios Gerados',
        table: 'reports',
      },
      {
        metric_id: 'num_leads_palestras',
        label: 'Leads - Palestras',
        table: 'leads',
        filter: { tipo: 'palestra' },
      },
      {
        metric_id: 'num_leads_consultas',
        label: 'Leads - Consultas',
        table: 'leads',
        filter: { tipo: 'consulta' },
      },
      {
        metric_id: 'num_newsletter',
        label: 'Newsletter Inscritos',
        table: 'newsletter_subscribers',
      },
    ],
  },
  {
    name: 'Oraculo',
    url: 'https://oraculo.ai',
    repo_url: 'https://github.com/tidilodo/oraculo-ai',
    description: 'SaaS conteúdo com IA para terapeutas holísticos. Next.js + Supabase + Bedrock. Contexto astral injetado do Cosmos.',
    color: '#06b6d4',
    icon: '✨',
    metrics: [
      {
        metric_id: 'cria_users',
        label: 'Usuários Assinados',
        table: 'users',
      },
      {
        metric_id: 'cria_posts',
        label: 'Posts Criados',
        table: 'posts',
      },
      {
        metric_id: 'cria_images',
        label: 'Imagens Geradas',
        table: 'generated_images',
      },
      {
        metric_id: 'cria_subscriptions_active',
        label: 'Assinaturas Ativas',
        table: 'subscriptions',
        filter: { status: 'active' },
      },
      {
        metric_id: 'cria_revenue_mrr',
        label: 'MRR (Receita Mensal)',
        table: 'subscriptions',
      },
    ],
  },
  {
    name: 'TerapeutAI',
    url: 'https://terapeutai.com',
    repo_url: 'https://github.com/tidilodo/terapeutai',
    description: 'SaaS gestão de pacientes para terapeutas com IA + LGPD. Prontuário holístico com mapas energéticos e padrões.',
    color: '#f59e0b',
    icon: '🧘',
    metrics: [
      {
        metric_id: 'cuida_therapists',
        label: 'Terapeutas',
        table: 'users',
        filter: { role: 'therapist' },
      },
      {
        metric_id: 'cuida_patients',
        label: 'Pacientes Cadastrados',
        table: 'patients',
      },
      {
        metric_id: 'cuida_sessions',
        label: 'Sessões Realizadas',
        table: 'sessions',
      },
      {
        metric_id: 'cuida_subscriptions',
        label: 'Assinaturas Ativas',
        table: 'subscriptions',
        filter: { status: 'active' },
      },
      {
        metric_id: 'cuida_notes',
        label: 'Notas/Prontuários',
        table: 'patient_notes',
      },
    ],
  },
  {
    name: 'Vitrine',
    url: 'https://rifa-digital.vercel.app',
    repo_url: 'https://github.com/tidilodo/rifa-digital',
    description: 'Sistema de rifa digital com PIX + Mercado Pago. Vercel serverless + Supabase. Doações, sorteios, ingressos.',
    color: '#ec4899',
    icon: '🎟️',
    metrics: [
      {
        metric_id: 'vitrine_rifas',
        label: 'Rifas Ativas',
        table: 'rifas',
        filter: { status: 'active' },
      },
      {
        metric_id: 'vitrine_numbers_sold',
        label: 'Números Vendidos',
        table: 'rifa_numbers',
        filter: { status: 'paid' },
      },
      {
        metric_id: 'vitrine_revenue',
        label: 'Receita Total',
        table: 'orders',
      },
      {
        metric_id: 'vitrine_users',
        label: 'Compradores',
        table: 'users',
      },
      {
        metric_id: 'vitrine_average_ticket',
        label: 'Ticket Médio',
        table: 'orders',
      },
    ],
  },
  {
    name: 'ZroGest',
    url: 'https://zrogest.vercel.app',
    repo_url: 'https://github.com/tidilodo/zrogest',
    description: 'Hub de gestão e monitoramento de projetos. Esse dashboard que monitora todo o ecossistema Akasha.',
    color: '#10b981',
    icon: '📊',
    metrics: [
      {
        metric_id: 'zro_projects',
        label: 'Projetos Monitorados',
        table: 'projects',
      },
      {
        metric_id: 'zro_health_checks',
        label: 'Health Checks (últimas 24h)',
        table: 'health_checks',
      },
      {
        metric_id: 'zro_uptime_avg',
        label: 'Uptime Médio',
        table: 'projects',
      },
      {
        metric_id: 'zro_team_members',
        label: 'Membros da Equipe',
        table: 'team_members',
      },
      {
        metric_id: 'zro_alerts',
        label: 'Alertas Ativos',
        table: 'alerts',
        filter: { status: 'active' },
      },
    ],
  },
]

export const projectMetricsMap = {
  astro: {
    color: '#c9a84c',
    stats: [
      { label: 'Usuários', value: '—', icon: '👥' },
      { label: 'Transações', value: '—', icon: '💰' },
      { label: 'Cupons Usados', value: '—', icon: '🎟️' },
      { label: 'Uptime', value: '99.9%', icon: '✅' },
    ],
  },
  humandesign: {
    color: '#7c3aed',
    stats: [
      { label: 'Pedidos', value: '—', icon: '🧬' },
      { label: 'Receita', value: 'R$ —', icon: '💰' },
      { label: 'Entregues', value: '—', icon: '✅' },
      { label: 'Uptime', value: '99.9%', icon: '✅' },
    ],
  },
  numerologia: {
    color: '#c084fc',
    stats: [
      { label: 'Usuários', value: '—', icon: '👥' },
      { label: 'Relatórios', value: '—', icon: '📝' },
      { label: 'Leads', value: '—', icon: '📊' },
      { label: 'Uptime', value: '99.9%', icon: '✅' },
    ],
  },
  oraculo: {
    color: '#06b6d4',
    stats: [
      { label: 'Assinados', value: '—', icon: '👥' },
      { label: 'Posts/Mês', value: '—', icon: '📝' },
      { label: 'MRR', value: '—', icon: '💰' },
      { label: 'Uptime', value: '99.9%', icon: '✅' },
    ],
  },
  terapeutai: {
    color: '#f59e0b',
    stats: [
      { label: 'Terapeutas', value: '—', icon: '🧘' },
      { label: 'Pacientes', value: '—', icon: '👥' },
      { label: 'Sessões', value: '—', icon: '🎯' },
      { label: 'Uptime', value: '99.8%', icon: '✅' },
    ],
  },
  vitrine: {
    color: '#ec4899',
    stats: [
      { label: 'Rifas Ativas', value: '—', icon: '🎟️' },
      { label: 'Números Vendidos', value: '—', icon: '💸' },
      { label: 'Receita', value: '—', icon: '💰' },
      { label: 'Uptime', value: '99.7%', icon: '✅' },
    ],
  },
  zrogest: {
    color: '#10b981',
    stats: [
      { label: 'Projetos', value: '6', icon: '📦' },
      { label: 'Health Checks', value: '—', icon: '🔍' },
      { label: 'Uptime Médio', value: '99.8%', icon: '📊' },
      { label: 'Alertas', value: '0', icon: '🔔' },
    ],
  },
}
