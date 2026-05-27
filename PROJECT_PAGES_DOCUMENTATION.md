# 📄 Project Pages Documentation — ZroGest

**Versão:** 1.0  
**Data:** 2026-05-27  
**Status:** Live em https://zrogest.vercel.app

---

## O Que É

Seção integrada ao dashboard de cada projeto no ZroGest que documenta e organiza **todas as páginas públicas, admin e APIs** disponíveis naquele projeto.

Com um clique, você acessa:
- Landing pages públicas
- Dashboards de admin
- Endpoints de API
- Páginas de configuração
- Status pages

---

## Por Que Existir

**Problema anterior:**
- Admin precisa lembrar URLs de cada página
- Difícil manter registro de quais endpoints existem
- Sem uma fonte única de verdade para documentação de páginas
- Novo membro da equipe não sabe por onde começar

**Solução:**
- Documentação visual integrada ao ZroGest
- URLs organizadas por tipo (público/admin/API)
- Botão para copiar e abrir cada página
- Um único lugar para todos os links

---

## Como Funciona

### 1. Estrutura de Dados

Arquivo: `src/lib/project-pages.ts`

```typescript
export const projectPagesMap: Record<string, ProjectPages> = {
  humandesign: {
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
      // ... mais páginas
    ]
  },
  // ... mais projetos
}
```

**Campos:**
- `name` — Nome amigável da página
- `path` — URL completa (suporta `[id]` para dinâmicas)
- `description` — O que a página faz
- `type` — Categoria: `public`, `admin`, `api`, `settings`
- `icon` — Emoji para visual
- `requiresAuth` — Se requer login
- `external` — Se abre em nova aba

### 2. Componente Visual

Arquivo: `src/components/project-pages-section.tsx`

```jsx
<ProjectPagesSection projectName="Human Design" />
```

**O que mostra:**
- Todas as páginas agrupadas por tipo
- Cores diferentes por categoria
- Badge de "Autenticado" se necessário
- Botão para copiar URL
- Botão para abrir em nova aba
- Resumo de contagem por tipo

---

## Visual

```
📄 Páginas & Documentação
Acesse todas as páginas públicas, admin e APIs disponíveis neste projeto

🌐 PÚBLICA (4)
  ┌─ 🧬 Landing Page ────────────────────┐
  │ 3 planos disponíveis (R$97, R$247..  │
  │ https://astroresumo.com/human-design │
  │ [Copy] [Open]                        │
  └─────────────────────────────────────┘

  ┌─ 📊 Status do Pedido ─────────────────┐
  │ Rastrear geração do BodyGraph...     │
  │ https://astroresumo.com/hd-status    │
  │ [Autenticado] [Copy] [Open]         │
  └─────────────────────────────────────┘

🔐 ADMIN (1)
  ┌─ 👥 Admin - Clientes HD ──────────────┐
  │ Tabela de clientes, follow-ups...    │
  │ https://astroresumo.com/admin?key... │
  │ [Copy] [Open]                        │
  └─────────────────────────────────────┘

⚙️ API (2)
  ┌─ ⚙️ API - Calcular HD ────────────────┐
  │ POST endpoint para gerar BodyGraph    │
  │ https://astroresumo.com/api/hd/...   │
  │ [Copy] [Open]                        │
  └─────────────────────────────────────┘

📊 RESUMO
  Públicas: 2 | Admin: 1 | APIs: 2 | Configurações: 0
```

---

## Onde Aparece

1. **Página de Detalhes do Projeto**
   - URL: `https://zrogest.vercel.app/projects/[project-id]`
   - Seção: Abaixo das Métricas, antes da Zona de Perigo
   - Sempre visível (não é colapsível)

2. **Na Descrição do Projeto**
   - Cada card no dashboard pode ter um tooltip
   - Futuro: mini-preview de páginas populares

---

## Como Usar

### Para Usuário

1. Abra um projeto no ZroGest
2. Scroll para "📄 Páginas & Documentação"
3. Encontre a página que precisa
4. Clique [Copy] para copiar URL ou [Open] para abrir

### Para Desenvolvedores

**Adicionar novo projeto:**

```typescript
export const projectPagesMap = {
  meuProjeto: {
    projectId: 'meu-projeto',
    projectName: 'Meu Projeto',
    projectUrl: 'https://meu-projeto.com',
    pages: [
      {
        name: 'Home',
        path: 'https://meu-projeto.com',
        description: 'Landing page',
        type: 'public',
        icon: '🏠',
      },
      // ... mais páginas
    ],
  },
}
```

**Adicionar nova página a projeto existente:**

```typescript
pages: [
  // ... páginas existentes
  {
    name: 'Nova Página',
    path: 'https://...',
    description: 'Descrição',
    type: 'admin',
    icon: '📄',
  },
]
```

---

## Páginas Documentadas

### 🧬 Human Design (4 páginas)
- 🧬 Landing Page (pública)
- 📊 Status do Pedido (pública, autenticada)
- 👥 Admin - Clientes HD (admin)
- ⚙️ API - Calcular HD (API)

### 🌙 Cosmos (11 páginas)
- 🌙 Landing Page (pública)
- 📱 App Dashboard (pública, autenticada)
- 📝 Blog (pública)
- 📚 Glossário (pública)
- 🤝 Parceiros (pública)
- 👤 Página Parceiro (pública)
- 🛒 Loja (pública)
- ⚙️ Admin Dashboard (admin)
- 🔧 Admin SEO (admin)
- ⚙️ API - Catálogo (API)
- ⚙️ API - Cupons (API)

### 🔢 Numerologia (8 páginas)
- 🔢 Home (pública)
- 📊 Resultado (pública)
- ✨ Santessência Landing (pública)
- 🎤 Palestras Form (pública)
- 📅 Consultas Form (pública)
- 🧘 Experiências Form (pública)
- 📧 Newsletter Signup (pública)
- 📊 Admin Dashboard (admin)

### ✨ OráculoAI (3 páginas)
- ✨ Home (pública)
- 📱 App Dashboard (pública, autenticada)
- 📈 Admin Analytics (admin)

### 🧘 TerapeutAI (4 páginas)
- 🧘 Home (pública)
- 📱 App Dashboard (pública, autenticada)
- 👥 Pacientes (pública, autenticada)
- 🎯 Sessões (pública, autenticada)

### 🎟️ Rifa Digital (4 páginas)
- 🎟️ Home (pública)
- 🎰 Rifas Ativas (pública)
- 💳 Checkout (pública)
- ⚙️ Admin Dashboard (admin)

### 📊 ZroGest (8 páginas)
- 📊 Dashboard (pública, autenticada)
- 📦 Meus Projetos (pública, autenticada)
- ➕ Novo Projeto (pública, autenticada)
- 🔍 Detalhes do Projeto (pública, autenticada)
- 🔌 Integrações (settings, autenticada)
- 👥 Team (settings, autenticada)
- ⚙️ Settings (settings, autenticada)
- ❤️ Health Checks (pública, autenticada)

---

## Cores por Tipo

```
🌐 PÚBLICA      → Azul (#3b82f6)    — Qualquer pessoa pode acessar
🔐 ADMIN        → Vermelho (#ef4444) — Requer senha admin
⚙️ API          → Roxo (#8b5cf6)     — Endpoints programáticos
⚙️ CONFIGURAÇÕES → Âmbar (#f59e0b)   — User settings, team, integrações
```

---

## Roadmap

### Phase 1 (Concluído)
- [x] Arquivo com todos os projetos + 30+ páginas
- [x] Componente visual com grouping por tipo
- [x] Copy URL + Open buttons
- [x] Integração na página de detalhes
- [x] Deploy

### Phase 2 (Próximo)
- [ ] Health check para cada página (testar URLs)
- [ ] Status page ao lado de cada URL (up/down/error)
- [ ] Histórico de mudanças de páginas
- [ ] API para CRUD de páginas (via ZroGest)

### Phase 3
- [ ] Mini-preview de páginas no tooltip
- [ ] Search/filter de páginas
- [ ] Favoritos (pin URLs usadas frequentemente)
- [ ] Notificações quando URL muda

### Phase 4
- [ ] Integração com GitHub (update quando commit para main)
- [ ] Webhook para atualizar URLs automaticamente
- [ ] Public status page mostrando saúde de todas as páginas

---

## API para Futuro

```typescript
// GET /api/projects/[id]/pages
// Retorna todas as páginas do projeto

// POST /api/projects/[id]/pages
// Criar nova página (admin only)

// PUT /api/projects/[id]/pages/[pageId]
// Atualizar página (admin only)

// DELETE /api/projects/[id]/pages/[pageId]
// Deletar página (admin only)

// GET /api/projects/[id]/pages/health
// Health check de todas as páginas
```

---

## Troubleshooting

### URL não abre
- Confirmar que URL é pública ou você tem autenticação
- Se requer auth, faça login primeiro
- Verificar se externa !== false

### URL expirado
- Meu repositório está desatualizado
- Abra issue em GitHub para atualizar

### Página deveria estar listada mas não aparece
- Verifique se projeto está em `projectPagesMap`
- Verifique se nome do projeto está correto
- Faça PR em GitHub para adicionar

---

## FAQ

**P: Posso editar as URLs direto no ZroGest?**  
R: Não ainda. Phase 2 vai trazer isso. Por enquanto, edite `src/lib/project-pages.ts` e faça PR.

**P: Por que alguns projetos têm mais páginas que outros?**  
R: Porque têm mais features. Human Design é simples (4 páginas), Cosmos é complexo (11 páginas).

**P: Como você sabe se uma URL ainda é válida?**  
R: Phase 2 vai fazer health checks automáticos. Por enquanto, é manual.

**P: Posso ver quantas pessoas usam cada página?**  
R: Não. Mas podemos adicionar isso na Phase 3 com analytics.

---

## Contribuindo

Para adicionar/atualizar páginas:

1. Fork do repositório ZroGest
2. Edite `src/lib/project-pages.ts`
3. Adicione/atualize em `projectPagesMap`
4. Faça PR
5. Merge → Deploy automático → Pronto

---

**Criado em:** 2026-05-27  
**Última atualização:** 2026-05-27  
**Status:** ✅ Live
