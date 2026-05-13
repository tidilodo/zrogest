export interface MetricTemplate {
  id: string
  name: string
  description: string
  category: 'users' | 'revenue' | 'content' | 'engagement' | 'inventory'
  table: string
  filter?: Record<string, string>
  count_only: boolean
  icon: string
}

export const metricsCatalog: MetricTemplate[] = [
  // Users
  { id: 'total_users', name: 'Total de Usuários', description: 'Quantidade total de usuários registrados', category: 'users', table: 'profiles', count_only: true, icon: '👥' },
  { id: 'auth_users', name: 'Usuários Auth', description: 'Usuários na tabela auth.users (requer service_role)', category: 'users', table: 'users', count_only: true, icon: '🔐' },

  // Revenue / Sales
  { id: 'paid_numbers', name: 'Números Pagos', description: 'Números de rifa com status pago', category: 'revenue', table: 'rifa_numbers', filter: { status: 'paid' }, count_only: true, icon: '💰' },
  { id: 'reserved_numbers', name: 'Números Reservados', description: 'Números de rifa reservados aguardando pagamento', category: 'revenue', table: 'rifa_numbers', filter: { status: 'reserved' }, count_only: true, icon: '⏳' },
  { id: 'available_numbers', name: 'Números Disponíveis', description: 'Números de rifa ainda disponíveis', category: 'revenue', table: 'rifa_numbers', filter: { status: 'available' }, count_only: true, icon: '🟢' },
  { id: 'total_orders', name: 'Total de Pedidos', description: 'Pedidos/compras realizadas', category: 'revenue', table: 'orders', count_only: true, icon: '🛒' },
  { id: 'subscriptions', name: 'Assinaturas Ativas', description: 'Planos/assinaturas ativas', category: 'revenue', table: 'subscriptions', filter: { status: 'active' }, count_only: true, icon: '💳' },

  // Content
  { id: 'total_posts', name: 'Total de Posts', description: 'Posts/artigos publicados', category: 'content', table: 'posts', count_only: true, icon: '📝' },
  { id: 'total_products', name: 'Total de Produtos', description: 'Produtos cadastrados', category: 'content', table: 'products', count_only: true, icon: '📦' },
  { id: 'total_pages', name: 'Total de Páginas', description: 'Páginas criadas', category: 'content', table: 'pages', count_only: true, icon: '📄' },

  // Engagement
  { id: 'total_sessions', name: 'Total de Sessões', description: 'Sessões/atendimentos realizados', category: 'engagement', table: 'sessions', count_only: true, icon: '🎯' },
  { id: 'total_messages', name: 'Total de Mensagens', description: 'Mensagens enviadas', category: 'engagement', table: 'messages', count_only: true, icon: '💬' },
  { id: 'total_feedbacks', name: 'Feedbacks', description: 'Feedbacks ou avaliações recebidas', category: 'engagement', table: 'feedbacks', count_only: true, icon: '⭐' },
  { id: 'active_patients', name: 'Pacientes Ativos', description: 'Pacientes com status ativo', category: 'engagement', table: 'patients', filter: { status: 'active' }, count_only: true, icon: '🧑‍⚕️' },

  // Inventory
  { id: 'total_rifas', name: 'Total de Rifas', description: 'Rifas cadastradas no sistema', category: 'inventory', table: 'rifas', count_only: true, icon: '🎟️' },
  { id: 'total_affiliates', name: 'Afiliados', description: 'Links de afiliado ativos', category: 'inventory', table: 'affiliates', count_only: true, icon: '🔗' },
  { id: 'total_referrals', name: 'Indicações', description: 'Indicações/conversões via afiliados', category: 'inventory', table: 'referrals', count_only: true, icon: '📊' },
]

export const categoryLabels: Record<string, string> = {
  users: '👥 Usuários',
  revenue: '💰 Receita & Vendas',
  content: '📝 Conteúdo',
  engagement: '🎯 Engajamento',
  inventory: '📦 Inventário',
}

export function searchMetrics(query: string): MetricTemplate[] {
  const q = query.toLowerCase()
  return metricsCatalog.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q) ||
    m.table.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q)
  )
}
