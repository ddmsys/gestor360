# Gestor360® — Relatório de Validação Completo

> **Data:** 28/04/2026 | **Orquestrado por:** Orion (@aios-master)
> **Especialistas:** Atlas (Analyst) · Aria (Architect) · Dara (Data Engineer) · Uma (UX/Design)
> **Status:** 🔴 URGENTE — livro lançado ontem, QR Codes em circulação

---

## Estado Atual (o que existe)

### ✅ Validado e Pronto

- PRD v1.0 completo com personas, user stories, requisitos não-funcionais
- `docs/cms-fields.md` — blueprint completo dos campos JSON de cada seção
- `docs/api.md` — contratos de API documentados com schemas Zod
- Design tokens CSS (`gestor360-tokens.css`) completos e importados no `globals.css`
- Schema SQL documentado (não executado no Supabase ainda)
- Next.js 16 + Supabase + TypeScript + Tailwind v4 instalados e configurados
- `globals.css` importa os tokens corretamente

### ❌ Não existe ainda (código vazio)

- `src/components/ui/` — vazio
- `src/components/sections/` — vazio
- `src/types/` — vazio (sem `cms.ts`)
- `middleware.ts` — não existe (admin desprotegido)
- `.env.local` — não existe
- `src/app/(site)/` e `src/app/(admin)/` — route groups não criados
- `src/lib/supabase/admin.ts` — não existe
- Schema SQL não executado no Supabase
- Dependências críticas não instaladas: `framer-motion`, `react-hook-form`, `zod`, `resend`, `react-email`
- Logo SVG, OG Image — não criados
- `/ferramentas` — boilerplate do Next.js (QR Codes apontam para lá agora)

---

## 🔴 CRÍTICOS — Bloqueadores que impedem o go-live

### [BLOQUEADOR-01] Página `/ferramentas` mostra boilerplate do Next.js

**Fonte: UX** | Qualquer leitor que escaneia um QR Code hoje vê a tela padrão do Next.js.
**Ação:** Criar `src/app/ferramentas/page.tsx` com holding page personalizada **antes de qualquer outra coisa**.

### [BLOQUEADOR-02] Route groups `(site)/` e `(admin)/` não existem

**Fonte: Arquiteto** | O layout raiz aplica header+footer para todas as rotas incluindo `/admin`.
Rotas estáticas atuais (`ferramentas/`, `livro/`, `sobre/`) conflitam com o CMS dinâmico `[slug]/`.
**Ação:** Criar os route groups antes de qualquer componente UI.

### [BLOQUEADOR-03] `middleware.ts` ausente

**Fonte: Arquiteto** | O painel `/admin` está completamente desprotegido.
**Ação:** Primeiro arquivo a criar após os route groups.

### [BLOQUEADOR-04] Domínio `ogestor360.com` não confirmado

**Fonte: Analyst** | Nenhum artefato confirma que o domínio foi registrado e DNS apontado para Vercel.
**Ação:** Confirmar imediatamente com o Flávio — sem DNS, nada vai ao ar.

### [BLOQUEADOR-05] Signed URLs de 1h em e-mails = links quebrados

**Fonte: Analyst + Architect** | Leitores que abrem o e-mail horas depois encontram links expirados.
**Ação:** Aumentar para 24–72h ou criar área de acesso persistente com token no lead.

### [BLOQUEADOR-06] Código do livro único para toda a tiragem = risco de pirataria

**Fonte: Analyst** | Um único `CODIGO_LIVRO_SECRET` para todos os exemplares. Quando postado em redes sociais (inevitável), qualquer pessoa acessa todas as 31 ferramentas sem comprar o livro.
**Ação:** Criar tabela `codigos_livro` com códigos únicos por exemplar e controle de usos. (ver Dara abaixo)

### [BLOQUEADOR-07] RLS: `forms` e `depoimentos` sem policies

**Fonte: Data Engineer** | Tabelas sem RLS habilitado ficam bloqueadas silenciosamente no PostgREST. Admin não consegue gerenciar.
**Ação:** Adicionar RLS + policies nas duas tabelas antes de criar o admin.

### [BLOQUEADOR-08] RLS: `page_sections` vaza conteúdo de páginas em draft

**Fonte: Data Engineer** | A policy atual não verifica se a página pai está publicada.
**Ação:** Corrigir policy com EXISTS subquery na tabela `pages`.

### [BLOQUEADOR-09] LGPD: sem campos de consentimento e soft delete em `leads`

**Fonte: Data Engineer** | Capturar email + WhatsApp sem rastrear consentimento viola Art. 7º e 18º da LGPD.
**Ação:** Adicionar `consent_at`, `consent_source` e `deleted_at` na tabela `leads`.

### [BLOQUEADOR-10] `lib/supabase/admin.ts` não existe

**Fonte: Arquiteto** | Operações de admin (CRUD páginas, seções, aprovar depoimentos) precisam de `service_role_key` que bypassa RLS. Sem isso, o admin recebe 403 em todas as escritas.
**Ação:** Criar `src/lib/supabase/admin.ts` com `SUPABASE_SERVICE_ROLE_KEY`.

### [BLOQUEADOR-11] Fluxo de acesso às ferramentas com código do livro não está modelado

**Fonte: Data Engineer** | Não há tabela que modela códigos únicos por exemplar. O fluxo atual quebra a promessa de negócio.
**Ação:** Criar tabela `codigos_livro` com controle de usos.

### [BLOQUEADOR-12] Contraste WCAG AA falha em 2 cores core do design

**Fonte: UX** |

- `#8B8B8B` (stone) sobre `#E8E6E1` (canvas) = ratio 2.8:1 (mínimo: 4.5:1)
- `#D4A020` (gold) sobre `#FFFFFF` (branco) = ratio 2.8:1
  **Ação:** Gold nunca como texto sobre fundo claro. Stone apenas em texto grande (≥24px bold). Escurecer stone para `#6B6B6B` para texto pequeno.

### [BLOQUEADOR-13] Gotham (Adobe Fonts) sem estratégia de carregamento

**Fonte: Arquiteto** | `@font-face` comercial não é compatível com `next/font`. Bloqueia renderização se o script falhar.
**Ação:** Hospedar Gotham localmente em `public/fonts/` com `@font-face` ou decidir alternativa open-source (Montserrat Bold).

---

## 🟠 ALTOS — Não bloqueiam MVP mas criam dívida técnica séria

### [ALTO-01] `updated_at` nunca atualiza (falta trigger)

**Fonte: Data Engineer** | PostgreSQL não tem `ON UPDATE` automático. O campo existe mas não funciona.

```sql
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
-- Aplicar em: pages, page_sections, ferramentas, leads
```

### [ALTO-02] ISR não configurado — SSR puro em rota de alto tráfego

**Fonte: Arquiteto** | A rota `/[slug]` (acessada via QR Code) sem ISR consulta o Supabase a cada request.
**Ação:** `export const revalidate = 3600` + webhook de invalidação do admin.

### [ALTO-03] Índices críticos faltando

**Fonte: Data Engineer** |

```sql
CREATE INDEX ON leads(capitulo_origem);         -- dado mais valioso
CREATE INDEX ON leads(created_at DESC);         -- relatórios por período
CREATE INDEX ON ferramentas(capitulo);          -- listagem por capítulo
CREATE INDEX ON ferramentas(acesso);
CREATE INDEX ON depoimentos(aprovado) WHERE aprovado = true;
CREATE INDEX ON pages(status);
```

### [ALTO-04] Rate limiting por IP bloqueia eventos com Wi-Fi compartilhado

**Fonte: Analyst** | Máx 5 req/min por IP. Eventos com NAT compartilhado (50 pessoas, mesmo IP) = 429 para a maioria.
**Ação:** Rate limit por IP + por email. Usar `@upstash/ratelimit` ou Vercel Edge Middleware.

### [ALTO-05] Resend free tier: 100 e-mails/dia

**Fonte: Analyst** | Limite ultrapassado no primeiro dia de lançamento viral.
**Ação:** Verificar plano do Resend e fazer upgrade antes do go-live.

### [ALTO-06] GA4 na Fase 3 perde dados do lançamento

**Fonte: Analyst** | Os primeiros dias são os mais ricos. Dados de funil do lançamento perdidos para sempre.
**Ação:** Mover GA4 para Fase 0 ou no máximo Fase 1.

### [ALTO-07] Tokens de estado interativo faltando

**Fonte: UX** | Sem tokens de hover/active/disabled, cada componente inventa o seu próprio estado.
**Ação:** Adicionar em `gestor360-tokens.css`:

```css
--color-brand-blue-hover: #163060;
--color-brand-blue-subtle: oklch(from #1f3f7a l c h / 0.1);
--color-brand-gold-hover: #b8891a;
--focus-ring: 0 0 0 3px var(--color-border-focus);
```

### [ALTO-08] SectionEditor precisa gerar forms tipados (não JSON bruto)

**Fonte: UX** | Se o admin mostrar textarea JSON, a Daiana precisará do dev para qualquer edição.
**Ação:** `SectionEditor.tsx` deve gerar formulários visuais por tipo de seção, não campos JSON livres.

### [ALTO-09] `POST /api/leads/validar-codigo` vulnerável a timing attack

**Fonte: Arquiteto** | Comparação com `===` permite inferir o valor pelo tempo de resposta.
**Ação:** Usar `crypto.timingSafeEqual()` na comparação.

### [ALTO-10] Fontes no `layout.tsx` ainda são Geist (boilerplate)

**Fonte: Arquiteto + UX** | O layout ainda usa as fontes padrão do create-next-app.
**Ação:** Substituir pelas fontes do projeto (DM Sans via `next/font`, Gotham local).

---

## 🟡 MÉDIOS — Melhorias relevantes para depois do MVP

- `page_sections.type` sem CHECK constraint (typos causam renderização silenciosa vazia)
- `capitulo_origem` em leads sem constraint `CHECK (1–10)`
- Blog sem tabela `posts` no schema (rota `/blog/[slug]` órfã)
- Rota `/landing/[slug]` planejada mas não existe na estrutura de pastas
- Tokens de animação Framer Motion não definidos como CSS variables
- Tokens de container/breakpoints faltando (`--container-xl`)
- Formulário: WhatsApp "opcional" precisa de microcopy ("para receber no WhatsApp")
- Preview antes de publicar no admin (rascunho → preview URL → publicar)
- Inputs precisam de `font-size: 16px` mínimo para não causar zoom no iOS
- Touch targets mínimos 48×48px não especificados nos tokens
- Accordion FAQ precisa de padrão ARIA completo

---

## 📋 Assets — O que criar com Claude Design

| #   | Asset                                       | Urgência    | Justificativa                            |
| --- | ------------------------------------------- | ----------- | ---------------------------------------- |
| 1   | **Logo SVG** (variantes light + dark)       | 🔴 HOJE     | Header, Footer, OG Image, Favicon        |
| 2   | **OG Image 1200×630px**                     | 🔴 HOJE     | Sem isso, WhatsApp/Instagram sem preview |
| 3   | **Favicon + Apple Touch Icon**              | 🟠 SEMANA 1 | Não existe no scaffolding                |
| 4   | **Keyframe "360"** referência visual        | 🟠 SEMANA 1 | Guia para animação Framer Motion         |
| 5   | **Ícones dos 10 capítulos**                 | 🟠 SEMANA 1 | ToolCard, CapitulosSection, badges       |
| 6   | **Foto/avatar dos autores** (se não houver) | 🟡 SEMANA 2 | Credibilidade na AutoresSection          |
| 7   | **Thumbnail das ferramentas**               | 🟡 SEMANA 2 | Preview antes do cadastro reduz atrito   |

---

## 🗺️ Ordem de execução (prioridade real)

### AGORA (antes de qualquer código de componente)

1. Confirmar domínio ogestor360.com + DNS Vercel ← **pergunta para o Flávio**
2. Verificar plano Resend (upgrade se necessário) ← **ação de negócio**
3. Criar logo SVG + OG Image com Claude Design ← **ação de design**
4. Executar schema SQL no Supabase (com as correções do Dara) ← **@data-engineer**
5. Criar `.env.local` com as chaves ← **manual**

### FASE 0 — MVP (48-72h)

1. Corrigir estrutura de pastas (route groups)
2. Criar `middleware.ts`
3. Criar `lib/supabase/admin.ts`
4. Instalar dependências faltando
5. Criar `src/types/cms.ts`
6. Criar `src/app/ferramentas/page.tsx` (holding page imediata)
7. Criar `LeadForm.tsx` + `FormSection.tsx`
8. Criar `POST /api/leads`
9. Criar template de e-mail boas-vindas (react-email)
10. Criar `Button.tsx`, `Header.tsx`, `Footer.tsx`
11. Adicionar GA4 (não deixar para Fase 3)

---

## Perguntas que precisam de resposta antes de começar

| #   | Pergunta                                                    | Para quem     | Impacto                    |
| --- | ----------------------------------------------------------- | ------------- | -------------------------- |
| 1   | `ogestor360.com` está registrado? DNS apontado para Vercel? | Flávio        | BLOQUEADOR deploy          |
| 2   | Plano do Resend (free = 100/dia)? Upgrade já?               | Flávio/Daiana | CRÍTICO dia 1              |
| 3   | Os PDFs das 31 ferramentas existem? Onde estão?             | Flávio        | CRÍTICO MVP                |
| 4   | Código do livro: único ou um por exemplar?                  | Flávio        | CRÍTICO segurança          |
| 5   | Conta Supabase criada? Chaves disponíveis?                  | Daiana        | BLOQUEADOR desenvolvimento |
| 6   | Gotham: temos o arquivo `.otf`/`.woff2`?                    | Daiana        | BLOQUEADOR fontes          |
| 7   | Conta Resend criada? Domínio verificado?                    | Daiana        | BLOQUEADOR e-mail          |
| 8   | Logo SVG existe? Em que formato?                            | Daiana        | CRÍTICO branding           |
