# Gestor360® — Contexto de Engenharia

> Este arquivo é carregado por qualquer agente/sessão antes de começar a trabalhar.
> Leia este arquivo antes de qualquer task. Atualizar conforme o projeto avança.
> **Última atualização:** 28/04/2026

---

## 1. Contexto de Negócio (3 linhas)

Site do método **Gestor360®** (ogestor360.com). Livro lançado em 27/04/2026 com QR Codes nos 10 capítulos que apontam para o site — que ainda não existe. Prioridade máxima: formulário de captura de leads em `/ferramentas` funcionando.

---

## 2. Stack (imutável — não questionar)

```
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
Supabase (PostgreSQL + Auth + Storage)
Resend + react-email
Framer Motion
react-hook-form + zod
Vercel (deploy)
```

**Proibido:** WordPress · PHP · MySQL · CSS Modules · styled-components

---

## 3. Regras de código (imutáveis)

1. Sempre TypeScript — sem `.js` no projeto
2. Sempre Tailwind v4 — tokens via `var(--color-*)`, nunca hardcode de cor
3. Server Components por padrão — Client Component só com `"use client"` explícito
4. Formulários: `react-hook-form + zod` sempre
5. Supabase: via `lib/supabase/server.ts` em Server Components, `client.ts` em Client Components, `admin.ts` (service_role) apenas em API Routes que precisam bypassar RLS
6. Textos: 100% pt-BR
7. Mobile-first: `<input>` sempre `font-size: 16px` mínimo (evita zoom iOS)
8. Acessibilidade: `alt` em imagens, `aria-label` em botões sem texto, WCAG 2.1 AA
9. Cores: gold (`#D4A020`) nunca como texto sobre fundo claro (ratio insuficiente)
10. Animações: apenas Framer Motion, apenas hero 360 + scroll reveal + transição de página

---

## 4. Estrutura de pastas (arquitetura definida)

```
src/
  app/
    (site)/                    ← layout com Header + Footer
      page.tsx                 ← home (slug: 'home' no Supabase)
      [slug]/page.tsx          ← renderizador CMS dinâmico (ISR: revalidate=3600)
      ferramentas/page.tsx     ← página do MVP (fluxo QR Code)
      blog/[slug]/page.tsx
      landing/[slug]/page.tsx
      layout.tsx               ← Header + Footer
    (admin)/                   ← layout com Sidebar
      admin/
        page.tsx               ← dashboard
        paginas/
        leads/
        ferramentas/
        depoimentos/
      layout.tsx               ← Sidebar admin
    api/
      leads/route.ts
      leads/validar-codigo/route.ts
      ferramentas/route.ts
      ferramentas/[id]/download/route.ts
      revalidate/route.ts      ← webhook de invalidação de cache ISR
    layout.tsx                 ← root layout (sem header/footer)
  components/
    ui/                        ← Button, Logo, Badge, Input, etc.
    sections/                  ← HeroSection, TextSection, ..., SectionRenderer.tsx
    admin/                     ← SectionEditor, PageEditor, LeadsTable
  lib/
    supabase/
      client.ts                ← createBrowserClient (Client Components)
      server.ts                ← createServerClient (Server Components/API Routes)
      admin.ts                 ← createClient(SERVICE_ROLE_KEY) — apenas API Routes admin
      types.ts                 ← tipos gerados pelo Supabase CLI
  styles/
    gestor360-tokens.css       ← NUNCA EDITAR — tokens do design system
  types/
    cms.ts                     ← SectionType, PageSection, SectionContent e subtipos
  middleware.ts                ← proteção /admin + SSR Supabase Auth
```

---

## 5. Fluxo crítico do MVP (entender antes de qualquer linha)

```
Leitor escaneia QR Code do capítulo X
↓
GET /ferramentas?capitulo=X&utm_source=livro&utm_medium=qrcode&utm_campaign=capXX
↓
Página mostra:
  - Nome da ferramenta do cap X (acima do formulário, sem scroll)
  - Formulário: nome (req) + e-mail (req) + WhatsApp (opcional, microcopy "receber no WhatsApp")
↓
Submit → POST /api/leads
  - Valida com Zod (nome min2, email, whatsapp opcional, capitulo 1-10, UTMs)
  - Rate limit: Upstash ou Vercel Edge (não apenas por IP — também por email)
  - Salva no Supabase com capitulo_origem + metadata UTMs + consent_at + consent_source
  - Dispara e-mail boas-vindas via Resend (signed URLs de 72h, não 1h)
  - Retorna 201 com lead_id
↓
Frontend mostra:
  - Mensagem de confirmação
  - Link imediato para ferramentas gratuitas do capítulo (não esperar e-mail)
  - "Verifique também seu e-mail em até 2 min"
  - CTA suave: "Insira o código do livro para acessar todas as 31 ferramentas"
↓
Opcional: usuário insere código do livro
  → POST /api/leads/validar-codigo
  → Valida com crypto.timingSafeEqual() contra tabela codigos_livro
  → Atualiza lead.tem_codigo_livro = true
  → Gera signed URLs 72h para TODAS as ferramentas
```

---

## 6. Schema Supabase (estado final com correções)

```sql
-- PÁGINAS
CREATE TABLE pages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  title       text NOT NULL,
  description text,
  og_image    text,
  status      text DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- SEÇÕES
CREATE TABLE page_sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('hero','text','cards','ferramentas','form','faq','cta','depoimentos','capitulos','autores')),
  order_index integer NOT NULL DEFAULT 0,
  content     jsonb NOT NULL DEFAULT '{}',
  visible     boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
CREATE INDEX ON page_sections(page_id, order_index);

-- LEADS (com LGPD)
CREATE TABLE leads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             text NOT NULL,
  email            text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  whatsapp         text,
  form_id          uuid REFERENCES forms(id) ON DELETE SET NULL,
  capitulo_origem  integer CHECK (capitulo_origem IS NULL OR (capitulo_origem >= 1 AND capitulo_origem <= 10)),
  tem_codigo_livro boolean DEFAULT false,
  metadata         jsonb DEFAULT '{}',
  consent_at       timestamptz NOT NULL DEFAULT now(),   -- LGPD
  consent_source   text NOT NULL,                        -- LGPD: "qrcode-cap01", etc.
  deleted_at       timestamptz,                          -- LGPD: soft delete
  created_at       timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX ON leads(email) WHERE deleted_at IS NULL;
CREATE INDEX ON leads(capitulo_origem);
CREATE INDEX ON leads(created_at DESC);
CREATE INDEX ON leads(deleted_at) WHERE deleted_at IS NULL;

-- CÓDIGOS DO LIVRO (segurança: um código por exemplar)
CREATE TABLE codigos_livro (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo     text UNIQUE NOT NULL,
  ativo      boolean DEFAULT true,
  usos       integer DEFAULT 0,
  max_usos   integer DEFAULT 1,
  lead_id    uuid REFERENCES leads(id),
  usado_em   timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX ON codigos_livro(codigo) WHERE ativo = true;

-- FORMULÁRIOS
CREATE TABLE forms (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  fields       jsonb NOT NULL DEFAULT '[]',
  redirect_url text,
  created_at   timestamptz DEFAULT now()
);

-- FERRAMENTAS
CREATE TABLE ferramentas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero       integer NOT NULL,
  nome         text NOT NULL,
  descricao    text,
  capitulo     integer NOT NULL CHECK (capitulo >= 1 AND capitulo <= 10),
  arquivo_path text NOT NULL,
  acesso       text DEFAULT 'gratuito' CHECK (acesso IN ('gratuito','codigo_livro')),
  ativo        boolean DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
CREATE INDEX ON ferramentas(capitulo);
CREATE INDEX ON ferramentas(acesso);

-- DEPOIMENTOS
CREATE TABLE depoimentos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       text NOT NULL,
  cargo      text,
  empresa    text,
  texto      text NOT NULL,
  foto_url   text,
  aprovado   boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX ON depoimentos(aprovado) WHERE aprovado = true;

-- TRIGGER updated_at (aplicar em pages, page_sections, ferramentas)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER page_sections_updated_at BEFORE UPDATE ON page_sections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER ferramentas_updated_at BEFORE UPDATE ON ferramentas FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## 7. RLS (corrigido)

```sql
-- Leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_lead"  ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin_select" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_update" ON leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin_delete" ON leads FOR DELETE TO authenticated USING (true);

-- Ferramentas
ALTER TABLE ferramentas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_free" ON ferramentas FOR SELECT TO anon USING (acesso = 'gratuito' AND ativo = true);
CREATE POLICY "auth_all"    ON ferramentas FOR ALL TO authenticated USING (true);

-- Páginas
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_published" ON pages FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "admin_all"        ON pages FOR ALL TO authenticated USING (true);

-- Seções (CORRIGIDO: verifica página pai publicada)
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_sections" ON page_sections FOR SELECT TO anon
  USING (visible = true AND EXISTS (
    SELECT 1 FROM pages WHERE pages.id = page_sections.page_id AND pages.status = 'published'
  ));
CREATE POLICY "admin_sections" ON page_sections FOR ALL TO authenticated USING (true);

-- Forms (NOVO)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON forms FOR ALL TO authenticated USING (true);

-- Depoimentos (NOVO)
ALTER TABLE depoimentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_approved" ON depoimentos FOR SELECT TO anon USING (aprovado = true);
CREATE POLICY "admin_all"       ON depoimentos FOR ALL TO authenticated USING (true);

-- Códigos do livro (NOVO)
ALTER TABLE codigos_livro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON codigos_livro FOR ALL TO authenticated USING (true);
```

---

## 8. Variáveis de ambiente necessárias

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # nunca expor no client
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@ogestor360.com
NEXT_PUBLIC_GA_ID=             # GA4 — colocar no MVP, não na Fase 3
NEXT_PUBLIC_META_PIXEL_ID=
ADMIN_EMAIL=
REVALIDATE_SECRET=             # para o webhook /api/revalidate
```

---

## 9. Dependências a instalar

```bash
npm install framer-motion react-hook-form zod resend react-email
npm install @upstash/ratelimit @upstash/redis  # rate limiting
```

---

## 10. Tokens adicionais a adicionar em gestor360-tokens.css

```css
/* Estados interativos */
--color-brand-blue-hover: #163060;
--color-brand-blue-active: #0d1f45;
--color-brand-blue-subtle: oklch(from #1f3f7a l c h / 0.1);
--color-brand-gold-hover: #b8891a;
--color-brand-gold-subtle: oklch(from #d4a020 l c h / 0.12);
--color-stone-accessible: #6b6b6b; /* stone escurecido: ratio 4.2:1 sobre canvas */

/* Focus */
--focus-ring: 0 0 0 3px var(--color-border-focus);
--focus-ring-offset: 2px;

/* Touch targets */
--touch-target-min: 48px;

/* Containers */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1200px;

/* Animações */
--motion-duration-enter: 500ms;
--motion-duration-page: 300ms;
--motion-stagger-base: 100ms;

/* Gradientes */
--gradient-360: linear-gradient(
  90deg,
  var(--color-brand-stone),
  var(--color-brand-blue),
  var(--color-brand-gold)
);
```

---

## 11. Perguntas pendentes (responder antes de codificar)

| Status | Pergunta                                                  | Para          |
| ------ | --------------------------------------------------------- | ------------- |
| ⏳     | `ogestor360.com` registrado? DNS → Vercel?                | Flávio        |
| ⏳     | Plano Resend: free (100/dia) ou pago?                     | Flávio/Daiana |
| ⏳     | PDFs das 31 ferramentas existem? Onde estão?              | Flávio        |
| ⏳     | Código do livro: único para todos ou um por exemplar?     | Flávio        |
| ⏳     | Conta Supabase criada? Chaves disponíveis?                | Daiana        |
| ⏳     | Arquivo `.woff2` da Gotham disponível?                    | Daiana        |
| ⏳     | Logo SVG existe em arquivo? Qual formato?                 | Daiana        |
| ⏳     | Conta Resend criada? Domínio `ogestor360.com` verificado? | Daiana        |

---

## 12. Assets do Claude Design (solicitar)

| Prioridade  | Asset              | Especificação                                                                |
| ----------- | ------------------ | ---------------------------------------------------------------------------- |
| 🔴 HOJE     | Logo SVG           | Variantes: light (azul sobre transparente), dark (branco sobre transparente) |
| 🔴 HOJE     | OG Image           | 1200×630px, fundo canvas #E8E6E1, logo centralizado, tagline                 |
| 🟠 SEMANA 1 | Favicon            | 32×32px + Apple Touch Icon 180×180px                                         |
| 🟠 SEMANA 1 | Ícones capítulos   | 10 ícones representando os temas dos capítulos                               |
| 🟡 SEMANA 2 | Thumbs ferramentas | Preview visual de cada ferramenta                                            |

---

## 13. Semáforo de status por área

| Área                         | Status      | Observação                         |
| ---------------------------- | ----------- | ---------------------------------- |
| Documentação (PRD, API, CMS) | ✅ COMPLETO |                                    |
| Design tokens CSS            | ✅ COMPLETO | Faltam tokens de estado interativo |
| Setup Next.js + Tailwind     | ✅ COMPLETO |                                    |
| Setup Supabase (npm)         | ✅ COMPLETO |                                    |
| Schema SQL no Supabase       | ⏳ PENDENTE | Executar SQL corrigido             |
| `.env.local`                 | ❌ FALTA    | Aguardando chaves                  |
| Route groups (site)/(admin)  | ❌ FALTA    | Primeiro passo arquitetural        |
| middleware.ts                | ❌ FALTA    | Admin desprotegido                 |
| lib/supabase/admin.ts        | ❌ FALTA    | Admin não consegue escrever        |
| Dependências npm             | ❌ FALTA    | framer-motion, rhf, zod, resend... |
| src/types/cms.ts             | ❌ FALTA    |                                    |
| Componentes UI               | ❌ FALTA    | Todos os componentes               |
| Página /ferramentas          | ❌ FALTA    | 🔴 URGENTE — QR Codes ativos       |
| API /api/leads               | ❌ FALTA    |                                    |
| Template e-mail              | ❌ FALTA    |                                    |
| Logo SVG + OG Image          | ❌ FALTA    | Solicitar ao Claude Design         |
