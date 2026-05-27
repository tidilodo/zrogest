# ZroGest Seed Setup — Ecossistema Akasha

## Quick Start

Após login no ZroGest, você verá uma tela vazia com a opção de **"Seed dos 6 Projetos"**.

### Um clique, 6 projetos 🚀

```
[Nenhum projeto cadastrado]
↓
[Botão "Seed dos 6 Projetos"]
↓
POST /api/seed-projects?user_id=xxx
↓
✅ 6 projetos criados + 30 métricas pré-configuradas
↓
Dashboard mostra: Cosmos, Mapa, Cria, Cuida, Vitrine, ZroGest
```

---

## Os 6 Projetos Akasha

### 1. 🌙 Astro Resumo (Cosmos)
**URL:** https://astroresumo.com  
**Repo:** github.com/tidilodo/astro-resumo  
**Cor:** #c9a84c (ouro)

**Métricas:**
- 👥 Usuários Registrados
- 💰 Transações com Cupom
- 🎟️ Pedidos Human Design
- 🔗 Afiliados Ativos
- 🤝 Parceiros Cadastrados

**O que é:** App de previsões astrológicas semanais. Resumos automáticos toda segunda via Claude. Human Design com 3 planos dinâmicos (R$97/247/497). Sistema de cupons 50-60% OFF. Admin dashboard com aba HD para follow-ups.

---

### 2. 🔢 Numerologia (Mapa)
**URL:** https://numerologia.astroresumo.com  
**Repo:** github.com/tidilodo/numerologia  
**Cor:** #7c3aed (roxo)

**Métricas:**
- 👥 Usuários
- 📝 Relatórios Gerados
- 📊 Leads - Palestras
- 💬 Leads - Consultas
- 📧 Newsletter Inscritos

**O que é:** Mapa numerológico Pitagórico com relatório PDF. Integração Santessência (Aline Paixão) com 5 funnels: palestras, consultas, experiências, newsletter, mapa.

---

### 3. ✨ OráculoAI (Cria)
**URL:** https://oraculo.ai  
**Repo:** github.com/tidilodo/oraculo-ai  
**Cor:** #06b6d4 (ciano)

**Métricas:**
- 👥 Usuários Assinados
- 📝 Posts Criados
- 🖼️ Imagens Geradas
- 💳 Assinaturas Ativas
- 💰 MRR (Receita Mensal)

**O que é:** SaaS de conteúdo com IA para terapeutas holísticos. Gera posts, imagens (FLUX), carrossel automático. Contexto astral injetado do Cosmos em tempo real.

---

### 4. 🧘 TerapeutAI (Cuida)
**URL:** https://terapeutai.com  
**Repo:** github.com/tidilodo/terapeutai  
**Cor:** #f59e0b (âmbar)

**Métricas:**
- 🧘 Terapeutas
- 👥 Pacientes Cadastrados
- 🎯 Sessões Realizadas
- 💳 Assinaturas Ativas
- 📋 Notas/Prontuários

**O que é:** SaaS de gestão de pacientes para terapeutas. Prontuário holístico com mapas energéticos, padrões. Feature IA: "Com base no histórico + energia da semana, o que pode surgir?"

---

### 5. 🎟️ Rifa Digital (Vitrine)
**URL:** https://rifa-digital.vercel.app  
**Repo:** github.com/tidilodo/rifa-digital  
**Cor:** #ec4899 (rosa)

**Métricas:**
- 🎟️ Rifas Ativas
- 💸 Números Vendidos
- 💰 Receita Total
- 👥 Compradores
- 📊 Ticket Médio

**O que é:** Sistema de rifa digital com PIX + Mercado Pago. Doações com intenção, sorteios, ingressos workshops. Monetização do terapeuta além de consultas.

---

### 6. 📊 ZroGest (esse dashboard)
**URL:** https://zrogest.vercel.app  
**Repo:** github.com/tidilodo/zrogest  
**Cor:** #10b981 (verde)

**Métricas:**
- 📦 Projetos Monitorados
- 🔍 Health Checks (últimas 24h)
- 📊 Uptime Médio
- 👥 Membros da Equipe
- 🔔 Alertas Ativos

**O que é:** Hub de gestão e monitoramento de projetos. Esse dashboard que você está vendo. Self-monitoring de todo o ecossistema Akasha.

---

## Dashboard Stats

Após seed, você verá 4 cards no topo:

```
┌────────────────────────────────────────────┐
│ Projetos Ativos: 6 │ Status Up: 6 │ Uptime: 99.8% │ Alertas: 0 │
└────────────────────────────────────────────┘
```

---

## Como Cada Projeto Aparece

Cada card mostra:

```
┌─ 🌙 Astro Resumo (Cosmos) ────────────────┐
│                                           │
│ 👥 Usuários: —           💰 Transações: —│
│ 🎟️ Cupons: —              🤝 Parceiros: —│
│                                           │
│ 🔗 GitHub    🌐 Website    📊 Ver detalhes
└───────────────────────────────────────────┘
```

Métricas aparecem como "—" porque a coleta automática não está ativa ainda.

---

## Próximas Fases

### Fase 1: Coleta Automática (Week 1)
- Cron job que puxa valores reais das tabelas
- Calcula MRR, ARR, uptime
- Atualiza a cada 30 min

### Fase 2: Health Checks Automáticos (Week 2)
- Ping periódico para URLs dos 6 projetos
- Atualiza status (up/down/degraded)
- Response time em ms

### Fase 3: Notificações (Week 3)
- Alert quando projeto cai (email/Slack/WhatsApp)
- Resumo semanal de uptime
- Anomalias detectadas

### Fase 4: Public Status Page (Week 4)
- `/public/[project-slug]` para compartilhar com clientes
- Status page bonita + histórico
- RSS feed de incidents

---

## Troubleshooting

### "Seed não funciona"
1. Confirmar autenticação (login antes)
2. Checar console (F12 → Network → seed-projects)
3. Se 401: user_id inválido
4. Se 500: ver servidor logs

### "Métricas mostram —"
Isso é normal! Coleta automática ainda não está ativa. As métricas estão configuradas, faltam os valores.

### "Projeto apareceu mas sem descrição"
Todos aparecem com descrição. Se ficou vazio, recarregar página (Ctrl+R).

---

## Estrutura de Dados

### Tabelas Criadas

```
projects (6 linhas)
├─ Astro Resumo
├─ Numerologia
├─ OráculoAI
├─ TerapeutAI
├─ Rifa Digital
└─ ZroGest

project_metrics (30 linhas, ~5 por projeto)
├─ astro_total_users
├─ astro_transactions
├─ astro_hd_pedidos
└─ ...

health_checks (6 linhas, 1 por projeto + histórico)
├─ status: 'up'
├─ response_time_ms: 150
└─ checked_at: now()
```

---

## Arquivos Chave

- `src/lib/seed-projects.ts` — definição dos 6 projetos + métricas
- `src/app/api/seed-projects/route.ts` — endpoint POST/GET
- `src/components/seed-init.tsx` — botão de inicialização
- `src/components/project-card-metrics.tsx` — card com 4 KPIs
- `supabase/migration-v3-metrics.sql` — tabela project_metrics

---

## Deploy

Toda vez que você faz push para `main`:
- GitHub webhook → Vercel build
- `npm run build` compila
- Deploy automático
- Mudanças aparecem em ~2 min

---

**Última atualização:** 2026-05-27  
**Status:** ✅ MVP Pronto para demonstração
