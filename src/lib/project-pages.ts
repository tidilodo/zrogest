/**
 * Documentação de páginas públicas, admin e de gerenciamento para cada projeto Akasha
 */

export interface PageLink {
  name: string
  path: string
  description: string
  type: 'public' | 'admin' | 'api' | 'settings'
  icon: string
  requiresAuth?: boolean
  external?: boolean
}

export interface ProjectPages {
  projectId: string
  projectName: string
  projectUrl: string
  pages: PageLink[]
}

export const projectPagesMap: Record<string, ProjectPages> = {
  humandesign: {
    projectId: 'human-design',
    projectName: 'Human Design',
    projectUrl: 'https://astroresumo.com/human-design',
    pages: [
      {
        name: 'Landing Page',
        path: 'https://astroresumo.com/human-design',
        description: '3 planos disponíveis (R$97, R$247, R$497)',
        type: 'public',
        icon: '🧬',
      },
      {
        name: 'Status do Pedido',
        path: 'https://astroresumo.com/hd-status',
        description: 'Rastrear geração do BodyGraph e download do PDF',
        type: 'public',
        icon: '📊',
        requiresAuth: true,
      },
      {
        name: 'Admin - Clientes HD',
        path: 'https://astroresumo.com/admin?key=ADMIN_SECRET',
        description: 'Tabela de clientes, follow-ups, estatísticas',
        type: 'admin',
        icon: '👥',
      },
      {
        name: 'API - Calcular HD',
        path: 'https://astroresumo.com/api/hd/calcular',
        description: 'POST endpoint para gerar BodyGraph',
        type: 'api',
        icon: '⚙️',
      },
      {
        name: 'API - Listar por Email',
        path: 'https://astroresumo.com/api/hd/listar-por-email',
        description: 'GET pedidos de um usuário',
        type: 'api',
        icon: '⚙️',
      },
    ],
  },

  cosmos: {
    projectId: 'cosmos',
    projectName: 'Cosmos (Astro Resumo)',
    projectUrl: 'https://astroresumo.com',
    pages: [
      {
        name: 'Landing Page',
        path: 'https://astroresumo.com',
        description: 'Homepage com resumo de previsões por signo',
        type: 'public',
        icon: '🌙',
      },
      {
        name: 'App Dashboard',
        path: 'https://astroresumo.com/app',
        description: 'Plataforma logada com resumos semanais',
        type: 'public',
        icon: '📱',
        requiresAuth: true,
      },
      {
        name: 'Blog',
        path: 'https://astroresumo.com/blog',
        description: 'Artigos sobre astrologia e espiritualidade',
        type: 'public',
        icon: '📝',
      },
      {
        name: 'Glossário',
        path: 'https://astroresumo.com/glossario',
        description: '50+ termos com Schema.org para SEO',
        type: 'public',
        icon: '📚',
      },
      {
        name: 'Parceiros',
        path: 'https://astroresumo.com/parceiros',
        description: 'Listing de tarólogos/astrólogos (3 tiers)',
        type: 'public',
        icon: '🤝',
      },
      {
        name: 'Página Parceiro',
        path: 'https://astroresumo.com/p/[slug]',
        description: 'Perfil individual + serviços + vídeos exclusivos',
        type: 'public',
        icon: '👤',
      },
      {
        name: 'Loja',
        path: 'https://astroresumo.com/loja',
        description: 'Produtos digitais (Guia Guardiões, Box 4 Elementos)',
        type: 'public',
        icon: '🛒',
      },
      {
        name: 'Admin Dashboard',
        path: 'https://astroresumo.com/admin?key=ADMIN_SECRET',
        description: 'Usuários, Transações, Analytics, Afiliados',
        type: 'admin',
        icon: '⚙️',
      },
      {
        name: 'Admin SEO',
        path: 'https://astroresumo.com/admin-seo?key=ADMIN_SECRET',
        description: 'CRUD Blog, Glossário, Parceiros, Vídeos, Serviços',
        type: 'admin',
        icon: '🔧',
      },
      {
        name: 'API - Catálogo Serviços',
        path: 'https://astroresumo.com/api/servicos/catalogo',
        description: 'GET preços e nomes de serviços',
        type: 'api',
        icon: '⚙️',
      },
      {
        name: 'API - Cupons',
        path: 'https://astroresumo.com/api/cupons/validar',
        description: 'Validar e calcular desconto de cupons',
        type: 'api',
        icon: '⚙️',
      },
    ],
  },

  numerologia: {
    projectId: 'numerologia',
    projectName: 'Numerologia (Mapa)',
    projectUrl: 'https://numerologia.astroresumo.com',
    pages: [
      {
        name: 'Home',
        path: 'https://numerologia.astroresumo.com',
        description: 'Landing com formulário de mapa numerológico',
        type: 'public',
        icon: '🔢',
      },
      {
        name: 'Resultado',
        path: 'https://numerologia.astroresumo.com/resultado',
        description: 'Relatório com CTA para Santessência (3 funnels)',
        type: 'public',
        icon: '📊',
      },
      {
        name: 'Santessência Landing',
        path: 'https://astroresumo.com/santessencia',
        description: '1300+ linhas, 10 seções, landing de Aline Paixão',
        type: 'public',
        icon: '✨',
      },
      {
        name: 'Palestras Form',
        path: 'https://astroresumo.com/palestras',
        description: 'Formulário para palestras + Google Sheets',
        type: 'public',
        icon: '🎤',
      },
      {
        name: 'Consultas Form',
        path: 'https://astroresumo.com/consultas',
        description: 'Agendamento de consultas 1:1',
        type: 'public',
        icon: '📅',
      },
      {
        name: 'Experiências Form',
        path: 'https://astroresumo.com/experiencias',
        description: 'Jornadas, Oficinas, Vivências, Retiros',
        type: 'public',
        icon: '🧘',
      },
      {
        name: 'Newsletter Signup',
        path: 'https://astroresumo.com/newsletter',
        description: 'Email signup com lead magnet',
        type: 'public',
        icon: '📧',
      },
      {
        name: 'Admin Dashboard',
        path: 'https://astroresumo.com/santessencia/admin',
        description: '6 stat cards + tabela de últimos 20 leads',
        type: 'admin',
        icon: '📊',
      },
    ],
  },

  oraculo: {
    projectId: 'oraculo',
    projectName: 'OráculoAI (Cria)',
    projectUrl: 'https://oraculo.ai',
    pages: [
      {
        name: 'Home',
        path: 'https://oraculo.ai',
        description: 'Landing com planos de SaaS',
        type: 'public',
        icon: '✨',
      },
      {
        name: 'App Dashboard',
        path: 'https://oraculo.ai/app',
        description: 'Criar posts, gerar imagens, agendar',
        type: 'public',
        icon: '📱',
        requiresAuth: true,
      },
      {
        name: 'Admin Analytics',
        path: 'https://oraculo.ai/admin/analytics',
        description: 'MRR, churn, user growth, engagement',
        type: 'admin',
        icon: '📈',
      },
    ],
  },

  terapeutai: {
    projectId: 'terapeutai',
    projectName: 'TerapeutAI (Cuida)',
    projectUrl: 'https://terapeutai.com',
    pages: [
      {
        name: 'Home',
        path: 'https://terapeutai.com',
        description: 'Landing com planos de SaaS',
        type: 'public',
        icon: '🧘',
      },
      {
        name: 'App Dashboard',
        path: 'https://terapeutai.com/app',
        description: 'Gerenciar pacientes, prontuários, sessões',
        type: 'public',
        icon: '📱',
        requiresAuth: true,
      },
      {
        name: 'Pacientes',
        path: 'https://terapeutai.com/app/patients',
        description: 'Listagem + criar + editar pacientes',
        type: 'public',
        icon: '👥',
        requiresAuth: true,
      },
      {
        name: 'Sessões',
        path: 'https://terapeutai.com/app/sessions',
        description: 'Histórico de sessões com notas',
        type: 'public',
        icon: '🎯',
        requiresAuth: true,
      },
    ],
  },

  vitrine: {
    projectId: 'vitrine',
    projectName: 'Rifa Digital (Vitrine)',
    projectUrl: 'https://rifa-digital.vercel.app',
    pages: [
      {
        name: 'Home',
        path: 'https://rifa-digital.vercel.app',
        description: 'Landing com rifas ativas',
        type: 'public',
        icon: '🎟️',
      },
      {
        name: 'Rifas Ativas',
        path: 'https://rifa-digital.vercel.app/rifas',
        description: 'Listagem de sorteios disponíveis',
        type: 'public',
        icon: '🎰',
      },
      {
        name: 'Checkout',
        path: 'https://rifa-digital.vercel.app/checkout',
        description: 'PIX + Mercado Pago integration',
        type: 'public',
        icon: '💳',
      },
      {
        name: 'Admin Dashboard',
        path: 'https://rifa-digital.vercel.app/admin',
        description: 'Gerenciar rifas, números vendidos, receita',
        type: 'admin',
        icon: '⚙️',
      },
    ],
  },

  zrogest: {
    projectId: 'zrogest',
    projectName: 'ZroGest (Central)',
    projectUrl: 'https://zrogest.vercel.app',
    pages: [
      {
        name: 'Dashboard',
        path: 'https://zrogest.vercel.app',
        description: 'Visão geral dos 7 projetos com stats',
        type: 'public',
        icon: '📊',
        requiresAuth: true,
      },
      {
        name: 'Meus Projetos',
        path: 'https://zrogest.vercel.app/projects',
        description: 'Listagem completa de projetos',
        type: 'public',
        icon: '📦',
        requiresAuth: true,
      },
      {
        name: 'Novo Projeto',
        path: 'https://zrogest.vercel.app/projects/new',
        description: 'Criar novo projeto com seed',
        type: 'public',
        icon: '➕',
        requiresAuth: true,
      },
      {
        name: 'Detalhes do Projeto',
        path: 'https://zrogest.vercel.app/projects/[id]',
        description: 'Health checks, métricas, integrações',
        type: 'public',
        icon: '🔍',
        requiresAuth: true,
      },
      {
        name: 'Integrações',
        path: 'https://zrogest.vercel.app/projects/[id]/integrations',
        description: 'Vercel, Supabase, Mercado Pago, ClickUp',
        type: 'settings',
        icon: '🔌',
        requiresAuth: true,
      },
      {
        name: 'Team',
        path: 'https://zrogest.vercel.app/projects/[id]/team',
        description: 'Membros, convites, permissões',
        type: 'settings',
        icon: '👥',
        requiresAuth: true,
      },
      {
        name: 'Settings',
        path: 'https://zrogest.vercel.app/settings',
        description: 'Perfil, preferências, notificações',
        type: 'settings',
        icon: '⚙️',
        requiresAuth: true,
      },
      {
        name: 'Health Checks',
        path: 'https://zrogest.vercel.app/health',
        description: 'Histórico de uptime por projeto',
        type: 'public',
        icon: '❤️',
        requiresAuth: true,
      },
    ],
  },
}

export function getProjectPages(projectName: string): ProjectPages | undefined {
  const key = projectName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return projectPagesMap[key]
}

export function getCategoryColor(type: PageLink['type']): string {
  const colors: Record<PageLink['type'], string> = {
    public: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    admin: 'bg-red-500/10 text-red-400 border-red-500/30',
    api: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    settings: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  }
  return colors[type] || colors.public
}

export function getCategoryLabel(type: PageLink['type']): string {
  const labels: Record<PageLink['type'], string> = {
    public: '🌐 Pública',
    admin: '🔐 Admin',
    api: '⚙️ API',
    settings: '⚙️ Configurações',
  }
  return labels[type]
}
