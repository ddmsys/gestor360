# Gestor360® — Site Oficial do Método

> Guia de contexto para Claude Code, Cowork e qualquer IA que trabalhe neste projeto.
> **Leia este arquivo antes de qualquer tarefa.**

---

## O que é este projeto

Site oficial do **método Gestor360®** — plataforma de liderança consciente para pequenos e médios empresários brasileiros. O site é o hub digital de um ecossistema que inclui o livro _Manual do Gestor360®_ (DDM Editora, 2026), 31 ferramentas práticas em PDF, mentoria, treinamentos e comunidade de leitores.

**Não é a página de um livro. É a plataforma de um método.**
**Não é um site estático. É um CMS headless próprio.**

---

## Dono do projeto

- **Flávio Di Morais** — CEO da DDM Editora, fundador do método Gestor360®, @oCaraDoLivro
- **Marcelo Caetano** — Co-autor, especialista em gestão estratégica para PMEs
- **Daiana Di Morais** — Diretora de arte, responsável pela identidade visual (livro + site)

---

## Stack técnica

| Camada         | Tecnologia                            | Status       |
| -------------- | ------------------------------------- | ------------ |
| Framework      | Next.js 16 (App Router)               | ✅ Definido  |
| Banco de dados | Supabase (PostgreSQL)                 | ✅ Definido  |
| Linguagem      | TypeScript                            | ✅ Definido  |
| Estilização    | Tailwind CSS v4                       | ✅ Definido  |
| Deploy         | Vercel                                | ✅ Definido  |
| E-mail         | Resend + react-email                  | ✅ Definido  |
| Animações      | Framer Motion                         | ✅ Definido  |
| CMS            | Headless próprio (Next.js + Supabase) | ✅ Definido  |
| Design System  | Claude Design — entregue              | ✅ Concluído |

**Não usar WordPress. Não usar PHP. Não usar MySQL.**
O Supabase já é a base de dados do SaaS interno da DDM — manter consistência.

---

## Arquitetura — CMS Headless Próprio

Este projeto **não usa páginas fixas em Next.js**. As páginas são montadas dinamicamente a partir de seções armazenadas no Supabase. O painel admin permite criar, editar, reordenar e publicar páginas sem código.

### Como funciona

```
Painel Admin (/admin)
  → CRUD de páginas (slug, título, status)
  → CRUD de seções por página (tipo, ordem, conteúdo JSON)
  → Publicar / Rascunho
  → Visualizar leads capturados

Site Público (/[slug])
  → Busca a página pelo slug no Supabase
  → Busca as seções da página (ordenadas)
  → Para cada seção, renderiza o componente pelo tipo
  → Retorna 404 se slug não existe ou status = draft
```

### Tipos de seção disponíveis

| Tipo          | Componente               | Descrição                                            |
| ------------- | ------------------------ | ---------------------------------------------------- |
| `hero`        | `HeroSection.tsx`        | Título grande, subtítulo, CTA, imagem/vídeo de fundo |
| `text`        | `TextSection.tsx`        | Título + corpo em markdown, alinhamento, bg          |
| `cards`       | `CardsSection.tsx`       | Grid de cards com ícone, título, descrição           |
| `ferramentas` | `FerramentasSection.tsx` | Lista de ferramentas por capítulo com download       |
| `form`        | `FormSection.tsx`        | Formulário dinâmico ligado ao Supabase leads         |
| `faq`         | `FAQSection.tsx`         | Accordion de perguntas e respostas                   |
| `cta`         | `CTASection.tsx`         | Fundo colorido, texto central, botão                 |
| `depoimentos` | `DepoimentosSection.tsx` | Grid/carrossel de depoimentos                        |
| `capitulos`   | `CapitulosSection.tsx`   | Os 10 capítulos do método em cards                   |
| `autores`     | `AutoresSection.tsx`     | Perfil dos autores com foto e bio                    |

### Estrutura de rotas

```
/                    → slug: "home" (página especial)
/[slug]              → renderização dinâmica pelo CMS
/livro               → slug: "livro"
/ferramentas         → slug: "ferramentas"
/metodo              → slug: "metodo"
/mentoria            → slug: "mentoria"
/sobre               → slug: "sobre"
/blog                → listagem de posts
/blog/[slug]         → post individual
/landing/[slug]      → landing pages de campanhas

/admin               → painel admin (protegido por Supabase Auth)
/admin/paginas       → lista de páginas
/admin/paginas/[id]  → editor de seções
/admin/leads         → tabela de leads capturados
/admin/ferramentas   → CRUD das ferramentas por capítulo
```

---

## Banco de dados — Supabase

### Schema completo

```sql
-- ─── PÁGINAS ─────────────────────────────────────────────────────────────
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

-- ─── SEÇÕES DE PÁGINA ────────────────────────────────────────────────────
CREATE TABLE page_sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type        text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  content     jsonb NOT NULL DEFAULT '{}',
  visible     boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX ON page_sections(page_id, order_index);

-- ─── LEADS ───────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             text NOT NULL,
  email            text NOT NULL,
  whatsapp         text,
  form_id          text,
  capitulo_origem  integer,       -- 1-10, de qual QR Code veio
  tem_codigo_livro boolean DEFAULT false,
  metadata         jsonb DEFAULT '{}',
  created_at       timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX ON leads(email);

-- ─── FORMULÁRIOS DINÂMICOS ────────────────────────────────────────────────
CREATE TABLE forms (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  fields       jsonb NOT NULL DEFAULT '[]',
  redirect_url text,
  created_at   timestamptz DEFAULT now()
);

-- ─── FERRAMENTAS ─────────────────────────────────────────────────────────
CREATE TABLE ferramentas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero       integer NOT NULL,
  nome         text NOT NULL,
  descricao    text,
  capitulo     integer NOT NULL,
  arquivo_path text NOT NULL,
  acesso       text DEFAULT 'gratuito' CHECK (acesso IN ('gratuito','codigo_livro'))
);

-- ─── DEPOIMENTOS ─────────────────────────────────────────────────────────
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
```

### Storage (Supabase)

```
bucket: ferramentas-pdf  (privado — acesso via signed URL 1h)
  /capitulo-01/F01-GST.pdf  ...  /capitulo-10/F29-Canvas-Inovacao.pdf

bucket: assets  (público)
  /og-images/   /autores/   /depoimentos/
```

### RLS (Row Level Security)

```sql
-- Leads: público insere, admin lê
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_lead" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin_read"  ON leads FOR SELECT TO authenticated USING (true);

-- Ferramentas: anon lê gratuitas, autenticado lê todas
ALTER TABLE ferramentas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_free" ON ferramentas FOR SELECT TO anon USING (acesso = 'gratuito');
CREATE POLICY "auth_all"    ON ferramentas FOR SELECT TO authenticated USING (true);

-- Páginas: anon lê published, admin faz tudo
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_published" ON pages FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "admin_all"        ON pages FOR ALL TO authenticated USING (true);

-- Seções: seguem política da página
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_sections" ON page_sections FOR SELECT TO anon USING (visible = true);
CREATE POLICY "admin_sections"  ON page_sections FOR ALL TO authenticated USING (true);
```

---

## Design System — Tokens (Tailwind v4)

Arquivo gerado pelo Claude Design: `styles/gestor360-tokens.css`

```css
@theme {
  /* Cores — extraídas da capa do livro */
  --color-brand-blue: #1f3f7a; /* "evoluir" — o 6 */
  --color-brand-gold: #d4a020; /* "prosperar" — o 0 */
  --color-brand-stone: #8b8b8b; /* "inspirar" — o 3 */
  --color-bg-canvas: #e8e6e1; /* fundo da capa */
  --color-bg-white: #ffffff;
  --color-bg-ink: #1a1a1a; /* footer e hero dark */
  --color-text-title: #1a1a1a;
  --color-text-body: #5a5a5a;
  --color-text-muted: #8b8b8b;
  --color-border: #d8d5cf;

  /* Tipografia — mesma da capa */
  --font-display: "gotham", sans-serif;
  --font-body: "DM Sans", sans-serif;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 2px 8px 0 oklch(0% 0 0 / 0.08);
  --shadow-md: 0 4px 20px 0 oklch(0% 0 0 / 0.1);
  --shadow-blue: 0 4px 20px 0 oklch(30% 0.12 260 / 0.25);
  --shadow-gold: 0 4px 20px 0 oklch(65% 0.12 70 / 0.3);
}
```

### Componentes do Design System

| Arquivo               | Componente                                   |
| --------------------- | -------------------------------------------- |
| `Button.tsx`          | Primário (azul), Secundário (outline), Ghost |
| `Logo.tsx`            | SVG com variantes light/dark                 |
| `Badge.tsx`           | Azul, dourado, neutro                        |
| `ToolCard.tsx`        | Card de ferramenta com badge de capítulo     |
| `LeadForm.tsx`        | Formulário react-hook-form + zod             |
| `TestimonialCard.tsx` | Card de depoimento                           |
| `Header.tsx`          | Navegação principal                          |
| `Footer.tsx`          | Footer dark 3 colunas                        |

### Animações (Framer Motion)

```tsx
// Hero: os três dígitos do 360 entram em sequência
// 3 (stone) → delay 0.2s | 6 (blue) → delay 0.4s | 0 (gold) → delay 0.6s

// Cards: fade + slide up com stagger de 0.1s ao entrar na viewport
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

// Transições de página: opacity 0→1, 300ms
```

**Regra:** Animações APENAS em hero, scroll reveal de cards e transições de página.
Sem parallax. Sem animações de loading. Sem excessos.

---

## Fluxo de captação de leads

```
QR Code do livro (capítulo X)
  → /ferramentas?capitulo=X&utm_source=livro&utm_medium=qrcode&utm_campaign=capXX
    → FormSection com capitulo pré-selecionado
      → POST /api/leads
        → Salva: nome + email + whatsapp + capitulo_origem + metadata UTM
          → Resend: e-mail de boas-vindas com link das ferramentas
            → Ferramentas gratuitas liberadas
              → CTA: inserir código do livro → acesso completo (todas as 31)
```

**Regra crítica:** Sempre salvar `capitulo_origem`. É o dado mais valioso da base.

---

## Painel Admin

### Telas necessárias

```
/admin                     Dashboard (métricas: leads, páginas, ferramentas)
/admin/paginas             Lista com slug, título, status, ações
/admin/paginas/nova        Criar página (slug + título + descrição)
/admin/paginas/[id]        Editor: lista de seções, reordenar, adicionar
/admin/paginas/[id]/secoes/nova   Escolher tipo + preencher conteúdo JSON
/admin/leads               Tabela filtrada por capítulo/data, exportar CSV
/admin/ferramentas         CRUD: upload PDF, nome, capítulo, tipo de acesso
/admin/depoimentos         Aprovar/reprovar depoimentos
```

### Proteção

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    // verificar sessão Supabase — redirecionar para /login se não autenticado
  }
}
```

---

## Estrutura de pastas

```
/
├── app/
│   ├── (site)/
│   │   ├── page.tsx               # Home (slug: 'home')
│   │   ├── [slug]/page.tsx        # Renderizador CMS dinâmico
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   └── layout.tsx             # Header + Footer
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── paginas/
│   │   │   ├── leads/
│   │   │   ├── ferramentas/
│   │   │   └── depoimentos/
│   │   └── layout.tsx             # Sidebar admin
│   └── api/
│       ├── leads/route.ts
│       ├── ferramentas/route.ts
│       └── pages/[slug]/route.ts
├── components/
│   ├── ui/                        # Design system
│   ├── sections/                  # Um arquivo por tipo de seção
│   │   ├── SectionRenderer.tsx    # Switch central por tipo
│   │   ├── HeroSection.tsx
│   │   ├── TextSection.tsx
│   │   ├── CardsSection.tsx
│   │   ├── FerramentasSection.tsx
│   │   ├── FormSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── DepoimentosSection.tsx
│   │   ├── CapitulosSection.tsx
│   │   └── AutoresSection.tsx
│   └── admin/
│       ├── SectionEditor.tsx
│       ├── PageEditor.tsx
│       └── LeadsTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser
│   │   ├── server.ts              # Server (App Router)
│   │   └── types.ts               # supabase gen types typescript
│   └── resend.ts
├── emails/
│   └── boas-vindas.tsx
├── styles/
│   ├── globals.css
│   └── gestor360-tokens.css       # Tokens do design system
├── types/
│   └── cms.ts                     # SectionType, PageSection, SectionContent...
├── middleware.ts                  # Proteção /admin
├── CLAUDE.md                      # Este arquivo
└── .env.local
```

---

## Variáveis de ambiente

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreplyo@gestor360.com
CODIGO_LIVRO_SECRET=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
ADMIN_EMAIL=
```

---

## Regras para a IA (Claude Code, Cowork)

1. **Sempre TypeScript** — sem `.js` no projeto
2. **Sempre Tailwind v4** — sem CSS modules, sem styled-components
3. **Nunca hardcodar cores** — usar tokens de `gestor360-tokens.css`
4. **Server Components por padrão** — Client Component só para interatividade real
5. **Formulários** — react-hook-form + zod sempre
6. **Supabase** — via `lib/supabase/client.ts` (browser) ou `lib/supabase/server.ts` (server)
7. **Textos** — 100% em pt-BR
8. **Acessibilidade** — `alt` em imagens, `aria-label` em botões sem texto visível
9. **SEO** — `metadata` de cada página vem do Supabase (title, description, og_image)
10. **Mobile first** — público acessa pelo celular via QR Code
11. **Animações** — Framer Motion apenas: hero 360, scroll reveal de cards, transições de página
12. **CMS** — nunca criar conteúdo fixo no código — usar o sistema de seções do Supabase
13. **Admin** — toda rota `/admin/*` protegida pelo middleware com Supabase Auth

---

## Contexto editorial

### Frase de impacto

> "O método que une razão e alma para transformar quem lidera — e, por isso, transforma a empresa."

### As três cores do 360 têm significado

- **Cinza `#8B8B8B`** = técnica e método ("inspirar")
- **Azul `#1F3F7A`** = consciência e evolução ("evoluir")
- **Dourado `#D4A020`** = resultado e prosperidade ("prosperar")

### As 31 ferramentas por capítulo

| Cap. | Tema              | Ferramentas                                                                                     |
| ---- | ----------------- | ----------------------------------------------------------------------------------------------- |
| 1    | Planejamento      | GST · PESTEL · SWOT Comportamental                                                              |
| 2    | Comunicação       | 4 Níveis de Fala · Rapport · Metamodelo · Reframing                                             |
| 3    | Delegação         | Mapa de Funções 360 · Roda da Autonomia · Mapa Circular                                         |
| 4    | Mentalidade       | Mapa de Crenças · Ritual da Ação Consciente                                                     |
| 5    | Finanças          | DRE · Formação de Preço · Fluxo de Caixa · Diagnóstico 15min                                    |
| 6    | Marketing/Vendas  | Roteiro da História de Valor                                                                    |
| 7    | Gestão de Pessoas | Diagnóstico de Clima · Matriz de Desempenho · Feedback SCI · 1:1 · Termômetro · Roda de Valores |
| 8    | Riscos/Decisão    | Matriz de Risco · Reversível×Irreversível · Análise de Cenários                                 |
| 9    | Autoaprendizado   | Canvas de Autoaprendizado do Líder360                                                           |
| 10   | Indicadores       | Painel de Indicadores · OKRs · PDCA · Canvas da Inovação Ágil                                   |

---

## Roadmap

### Fase 1 — Fundação (semanas 1–2)

- [ ] Setup Next.js 16 + Supabase + Tailwind v4 + Vercel
- [ ] SQL do schema + RLS no Supabase
- [ ] `gestor360-tokens.css` + componentes do design system
- [ ] `SectionRenderer.tsx` com tipos: hero, text, cta
- [ ] Rota `/[slug]` renderizando do Supabase
- [ ] `/api/leads` + e-mail de boas-vindas (Resend)

### Fase 2 — CMS completo (semanas 3–4)

- [ ] Todos os 10 tipos de seção
- [ ] Painel admin: login, páginas, editor de seções
- [ ] Upload PDFs das ferramentas no Storage
- [ ] Seção `ferramentas` com controle de acesso
- [ ] QR Codes com UTM rastreando `capitulo_origem`
- [ ] Animações Framer Motion

### Fase 3 — Conteúdo e comunidade (mês 2–3)

- [ ] Blog (admin ou Keystatic)
- [ ] Mentoria e treinamentos
- [ ] Integração WhatsApp
- [ ] Área restrita para leitores
- [ ] Google Analytics 4 + Meta Pixel

---

_Última atualização: Abril 2026_
_Mantenedor: Flávio Di Morais — DDM Editora_
