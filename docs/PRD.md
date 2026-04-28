# Gestor360® — PRD & Blueprint Técnico

> **Versão:** 1.0 — Abril 2026
> **Domínio:** ogestor360.com
> **Responsável:** Flávio Di Morais — DDM Editora
> **Design:** Daiana Di Morais
> **Prioridade:** 🔴 URGENTE — lançamento ocorreu em 27/04/2026

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Personas](#2-personas)
3. [User Stories e Critérios de Aceitação](#3-user-stories-e-critérios-de-aceitação)
4. [Requisitos Não-Funcionais](#4-requisitos-não-funcionais)
5. [Prioridade de Entrega — MVP Urgente](#5-prioridade-de-entrega--mvp-urgente)
6. [Stack Técnica](#6-stack-técnica)
7. [Arquitetura — CMS Headless Próprio](#7-arquitetura--cms-headless-próprio)
8. [Banco de Dados — Supabase](#8-banco-de-dados--supabase)
9. [Design System](#9-design-system)
10. [Estrutura de Rotas e Páginas](#10-estrutura-de-rotas-e-páginas)
11. [Fluxo de Captação de Leads](#11-fluxo-de-captação-de-leads)
12. [Eventos de Analytics](#12-eventos-de-analytics)
13. [Estrutura de Pastas](#13-estrutura-de-pastas)
14. [Variáveis de Ambiente e Integrações](#14-variáveis-de-ambiente-e-integrações)
15. [Regras de Desenvolvimento](#15-regras-de-desenvolvimento)
16. [Roadmap](#16-roadmap)
17. [Equipe e Responsabilidades](#17-equipe-e-responsabilidades)

> **Documentos complementares:**
>
> - [`docs/cms-fields.md`](./cms-fields.md) — Blueprint completo dos campos de cada seção CMS
> - [`docs/api.md`](./api.md) — Contratos das APIs (request/response)

---

## 1. Visão Geral

### 1.1 O Problema

O livro _Manual do Gestor360®_ foi lançado em 27 de abril de 2026, com mais de 400 pessoas presentes na livraria. Cada exemplar contém QR Codes nos 10 capítulos que apontam para `ogestor360.com` — mas o site ainda não existe.

Qualquer leitor que escaneia um QR Code encontra uma página inativa. Cada dia sem o site é um lead perdido e uma promessa do livro não cumprida.

### 1.2 A Solução

O `ogestor360.com` é a plataforma digital do método Gestor360® — não apenas a página de um livro, mas o hub de um ecossistema que inclui ferramentas práticas, mentoria, treinamentos e comunidade de líderes.

O site é construído como um **CMS headless próprio**: páginas montadas dinamicamente a partir de seções armazenadas no Supabase, com painel admin para que a equipe publique conteúdo sem código.

### 1.3 Proposta de Valor

> _"O método que une razão e alma para transformar quem lidera — e, por isso, transforma a empresa."_

- Acesso imediato às 31 ferramentas práticas do livro via QR Code
- Captura de leads qualificados segmentados por capítulo (dor do leitor)
- Base de leads zero — cada cadastro é novo e valioso
- Plataforma que cresce: ferramentas → mentoria → treinamentos → comunidade

### 1.4 As Três Dimensões do Método

| Dimensão                  | Conteúdo                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Técnica**               | GST · PESTEL · SWOT · OKR · PDCA · DRE · Fluxo de Caixa · Matriz de Risco |
| **Neurociência / PNL**    | Rapport · Metamodelo · Reframing · Blanchard/Hersey · Kahneman · Amabile  |
| **Filosófico-Espiritual** | Propósito · Autoconhecimento · Consciência · Presença · Legado            |

---

## 2. Personas

### P1 — Leitor com QR Code (persona principal)

> **"Acabei de ler o capítulo 3 e quero a ferramenta de delegação agora."**

- **Quem é:** empresário de PME, 35–55 anos, leu ou está lendo o livro
- **Dispositivo:** celular (70% das visitas virão de mobile via QR Code)
- **Contexto:** chegou pelo QR Code de um capítulo específico — já tem a dor identificada
- **Objetivo:** baixar a ferramenta do capítulo que leu
- **Objeção:** "não vou preencher formulário grande"
- **Critério de sucesso:** cadastro feito + ferramenta acessada em menos de 2 minutos

### P2 — Visitante Orgânico

> **"Ouvi falar do Gestor360, quero entender o método."**

- **Quem é:** gestor, empreendedor ou RH que chegou via Google, redes ou indicação
- **Dispositivo:** mix desktop e mobile
- **Contexto:** não tem o livro ainda — está descobrindo o método
- **Objetivo:** entender o que é o Gestor360 e considerar comprar o livro
- **Objeção:** "mais um método de gestão?"
- **Critério de sucesso:** tempo na página > 2min + clique em "comprar livro" ou cadastro

### P3 — Admin (Daiana / Flávio)

> **"Preciso publicar uma landing page para a palestra de amanhã sem chamar desenvolvedor."**

- **Quem é:** equipe DDM Editora — não é developer
- **Dispositivo:** desktop
- **Contexto:** precisa criar e editar conteúdo do site de forma autônoma
- **Objetivo:** gerenciar páginas, leads, ferramentas e depoimentos pelo painel
- **Objeção:** "CMS complexo demais para aprender"
- **Critério de sucesso:** criar e publicar uma página nova em menos de 15 minutos, sem ajuda técnica

---

## 3. User Stories e Critérios de Aceitação

### Epic 1 — Captura de Leads (MVP)

---

**US-01 — Acessar ferramentas via QR Code**

> Como **leitor com o livro**, quero acessar as ferramentas do capítulo que li,
> para aplicar o método no meu negócio imediatamente.

**Critérios de aceitação:**

- [ ] URL `?capitulo=X` pré-seleciona o capítulo no formulário
- [ ] Formulário exibe apenas nome, e-mail e WhatsApp (opcional)
- [ ] Ao submeter, o lead é salvo no Supabase com `capitulo_origem = X`
- [ ] `capitulo_origem` é salvo mesmo se o parâmetro for adulterado (validar 1–10)
- [ ] UTMs presentes na URL são capturados em `metadata`
- [ ] E-mail de boas-vindas é disparado via Resend em < 30 segundos
- [ ] Usuário vê mensagem de confirmação e link para as ferramentas
- [ ] E-mail duplicado retorna mensagem amigável (não erro técnico)
- [ ] Todo o fluxo funciona em mobile com 1 mão

---

**US-02 — Receber ferramentas por e-mail**

> Como **lead cadastrado**, quero receber um e-mail com as ferramentas do meu capítulo,
> para acessá-las mesmo sem internet no momento do cadastro.

**Critérios de aceitação:**

- [ ] E-mail enviado para o endereço cadastrado em < 30s
- [ ] E-mail contém o nome do usuário (personalizado)
- [ ] E-mail contém links para as ferramentas gratuitas do capítulo de origem
- [ ] Links são signed URLs do Supabase Storage (válidas por 1h)
- [ ] E-mail tem CTA "Insira o código do livro" para acesso completo
- [ ] E-mail renderiza corretamente em Gmail, Outlook e Apple Mail (mobile)

---

**US-03 — Acessar todas as ferramentas com código do livro**

> Como **leitor com o código impresso no livro**, quero desbloquear todas as 31 ferramentas,
> para ter acesso completo ao método.

**Critérios de aceitação:**

- [ ] Campo de código aparece após o cadastro inicial
- [ ] Código válido atualiza `tem_codigo_livro = true` no lead
- [ ] Ferramentas com `acesso = 'codigo_livro'` ficam disponíveis para download
- [ ] Código inválido exibe mensagem clara: "Código incorreto. Verifique na página X do livro."
- [ ] Signed URLs têm expiração de 1h (nunca expor URL permanente)

---

### Epic 2 — CMS e Painel Admin

---

**US-04 — Criar e publicar página sem código**

> Como **admin (Daiana)**, quero criar uma nova página pelo painel e publicá-la,
> para divulgar um evento sem precisar chamar desenvolvedor.

**Critérios de aceitação:**

- [ ] Admin cria página com slug, título, descrição e og_image
- [ ] Slug validado: apenas letras minúsculas, números e hífens
- [ ] Admin adiciona seções escolhendo o tipo numa lista
- [ ] Cada seção tem formulário de campos específicos para o tipo
- [ ] Admin pode reordenar seções por drag-and-drop
- [ ] Admin pode ocultar uma seção sem deletar (toggle `visible`)
- [ ] Status `rascunho` não é acessível no site público
- [ ] Publicar com 1 clique — página vai ao ar imediatamente
- [ ] Página publicada acessível em `ogestor360.com/[slug]` em < 5s

---

**US-05 — Gerenciar leads**

> Como **admin (Flávio)**, quero ver os leads capturados filtrados por capítulo e data,
> para entender qual capítulo gera mais engajamento.

**Critérios de aceitação:**

- [ ] Tabela exibe: nome, e-mail, WhatsApp, capítulo, data
- [ ] Filtro por capítulo (1–10) e por período (hoje, semana, mês)
- [ ] Contador total de leads por capítulo no topo
- [ ] Exportar CSV com todos os campos visíveis
- [ ] Dados sensíveis (e-mail, WhatsApp) visíveis apenas para admin autenticado
- [ ] Paginação: máximo 50 leads por página

---

### Epic 3 — Site Público

---

**US-06 — Descobrir o método**

> Como **visitante orgânico**, quero entender rapidamente o que é o Gestor360,
> para decidir se vale comprar o livro.

**Critérios de aceitação:**

- [ ] Home carrega em < 3s no mobile (3G)
- [ ] Hero comunica a proposta de valor em 1 frase acima do fold
- [ ] Os 10 capítulos estão listados com tema e ferramentas associadas
- [ ] Depoimentos visíveis apenas se `aprovado = true`
- [ ] CTA "Comprar livro" leva para `/livro` ou link externo da livraria
- [ ] Autores têm foto, cargo e bio visíveis

---

**US-07 — Página SEO**

> Como **motor de busca**, quero metadados corretos por página,
> para indexar o conteúdo com título e descrição relevantes.

**Critérios de aceitação:**

- [ ] Cada página tem `<title>` e `<meta description>` vindos do Supabase
- [ ] `og:image` configura preview correto no WhatsApp e redes
- [ ] Página 404 existe e tem link para home
- [ ] Sitemap gerado automaticamente em `/sitemap.xml`
- [ ] `robots.txt` bloqueia `/admin` e permite o resto

---

## 4. Requisitos Não-Funcionais

### Performance

| Métrica         | Alvo            | Motivo                                  |
| --------------- | --------------- | --------------------------------------- |
| LCP (mobile 3G) | < 3s            | Público acessa via QR Code no celular   |
| CLS             | < 0.1           | Evitar layout shift em imagens do livro |
| FID / INP       | < 200ms         | Formulário deve responder rápido        |
| First load JS   | < 150KB         | Next.js + Tailwind no bundle            |
| Imagens         | WebP, lazy load | Fotos do livro são pesadas              |

### Segurança

| Requisito                               | Implementação                                   |
| --------------------------------------- | ----------------------------------------------- |
| `/admin` protegido                      | Middleware Next.js + Supabase Auth              |
| Dados de leads inacessíveis para `anon` | RLS no Supabase                                 |
| Signed URLs para PDFs                   | Expiração de 1h — nunca URL pública             |
| Código do livro não exposto             | Validação server-side via `CODIGO_LIVRO_SECRET` |
| Rate limiting no `/api/leads`           | Middleware: max 5 req/min por IP                |
| Inputs sanitizados                      | Validação Zod antes de salvar no Supabase       |

### Acessibilidade

- WCAG 2.1 nível AA
- Contraste mínimo 4.5:1 para texto sobre `--color-bg-canvas`
- `alt` em todas as imagens
- `aria-label` em botões sem texto visível
- Navegação por teclado funcional no formulário e admin

### SEO

- Core Web Vitals verde no Google Search Console
- Metadados dinâmicos por página (title, description, og_image do Supabase)
- Sitemap XML automático
- Schema markup: `Book`, `Person` (autores), `FAQPage`

---

## 5. Prioridade de Entrega — MVP Urgente

**O lançamento ocorreu em 27/04/2026. Os QR Codes do livro impresso já estão nas mãos dos leitores. A prioridade absoluta é colocar o formulário de captura de leads no ar antes de qualquer outra funcionalidade.**

### 5.1 Ordem de entrega

| Fase     | Nome            | O que entrega                                                         | Prazo       |
| -------- | --------------- | --------------------------------------------------------------------- | ----------- |
| 🔴 **0** | **MVP Urgente** | Formulário de captura em `/ferramentas` com Supabase + Resend         | **48–72h**  |
| 1        | Fundação        | Home + Livro + Ferramentas completo + Sobre + Blog (vazio) + CMS base | 2–3 semanas |
| 2        | CMS Completo    | Todos os 10 tipos de seção + Painel admin + Leads dashboard           | Semanas 3–4 |
| 3        | Conteúdo        | Blog ativo + Mentoria + WhatsApp + GA4 + Meta Pixel                   | Mês 2       |
| 4        | Comunidade      | Área restrita leitores + Sessões ao vivo + E-commerce                 | Mês 3+      |

### 5.2 Escopo do MVP (Fase 0 — 48h)

Uma única página em `ogestor360.com/ferramentas` com:

- Formulário: nome (obrigatório), e-mail (obrigatório), WhatsApp (opcional)
- Parâmetro `?capitulo=X` lido da URL e salvo como `capitulo_origem` no lead
- Parâmetros UTM salvos em `metadata`
- Ao submeter: salvar lead no Supabase + disparar e-mail via Resend
- Ferramentas servidas via Supabase Storage com signed URL (validade 1h)
- Design mínimo fiel aos tokens do design system

---

## 6. Stack Técnica

| Camada        | Tecnologia                            | Motivo                      | Status       |
| ------------- | ------------------------------------- | --------------------------- | ------------ |
| Framework     | Next.js 16 — App Router               | Stack conhecida do SaaS DDM | ✅ Definido  |
| Banco         | Supabase (PostgreSQL)                 | Já em uso no SaaS DDM       | ✅ Definido  |
| Linguagem     | TypeScript                            | Tipagem + segurança         | ✅ Definido  |
| Estilização   | Tailwind CSS v4                       | Tokens do design system     | ✅ Definido  |
| Deploy        | Vercel                                | CI/CD automático            | ✅ Definido  |
| E-mail        | Resend + react-email                  | SDK TypeScript nativo       | ✅ Definido  |
| Animações     | Framer Motion                         | Hero 360, scroll reveal     | ✅ Definido  |
| CMS           | Headless próprio (Next.js + Supabase) | Autonomia total da equipe   | ✅ Definido  |
| Design System | Claude Design — tokens Tailwind v4    | Identidade visual do livro  | ✅ Concluído |

> ❌ **Não usar:** WordPress · PHP · MySQL · CSS Modules · styled-components

---

## 7. Arquitetura — CMS Headless Próprio

### 7.1 Princípio

Este site **não usa páginas fixas em Next.js**. Todo conteúdo é montado dinamicamente a partir de seções armazenadas no Supabase. O painel admin permite criar, editar, reordenar e publicar páginas sem código.

A Daiana pode criar uma landing page para um evento sem precisar de desenvolvedor.

### 7.2 Fluxo de renderização

**Site Público `/[slug]`:**

1. Next.js busca a página pelo slug no Supabase (apenas `status = published`)
2. Busca as seções da página, ordenadas por `order_index`
3. `SectionRenderer.tsx` renderiza cada seção pelo tipo (switch)
4. Retorna 404 se slug não existe ou `status = draft`

**Painel Admin `/admin`:**

1. Login com Supabase Auth (role admin)
2. CRUD de páginas: slug, título, descrição, og_image, status
3. CRUD de seções: tipo, campos, ordem
4. Drag-and-drop para reordenar
5. Publicar / Despublicar com um clique

### 7.3 Tipos de seção

| type          | Componente               | Descrição                                                          |
| ------------- | ------------------------ | ------------------------------------------------------------------ |
| `hero`        | `HeroSection.tsx`        | Título, subtítulo, CTA, imagem. Variantes: dark / canvas / blue    |
| `text`        | `TextSection.tsx`        | Título + corpo markdown. Alinhamento e bg configuráveis            |
| `cards`       | `CardsSection.tsx`       | Grid com ícone, título, descrição. 2, 3 ou 4 colunas               |
| `ferramentas` | `FerramentasSection.tsx` | 31 ferramentas por capítulo. Download via signed URL após cadastro |
| `form`        | `FormSection.tsx`        | Formulário dinâmico. Submit salva no Supabase + dispara Resend     |
| `faq`         | `FAQSection.tsx`         | Accordion de perguntas e respostas                                 |
| `cta`         | `CTASection.tsx`         | Fundo colorido, texto central, botão                               |
| `depoimentos` | `DepoimentosSection.tsx` | Grid ou carrossel de depoimentos aprovados                         |
| `capitulos`   | `CapitulosSection.tsx`   | Os 10 capítulos do método em cards numerados                       |
| `autores`     | `AutoresSection.tsx`     | Perfil de Flávio e Marcelo com foto, bio e redes                   |

---

## 8. Banco de Dados — Supabase

### 8.1 Schema completo

```sql
-- PÁGINAS
CREATE TABLE pages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,     -- 'home', 'sobre', 'landing/abc'
  title       text NOT NULL,
  description text,                     -- meta description SEO
  og_image    text,
  status      text DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- SEÇÕES DE PÁGINA
CREATE TABLE page_sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type        text NOT NULL,            -- 'hero' | 'text' | 'cards' | etc.
  order_index integer NOT NULL DEFAULT 0,
  content     jsonb NOT NULL DEFAULT '{}',
  visible     boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX ON page_sections(page_id, order_index);

-- LEADS
CREATE TABLE leads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             text NOT NULL,
  email            text NOT NULL,
  whatsapp         text,
  form_id          text,
  capitulo_origem  integer,             -- 1-10, qual QR Code originou
  tem_codigo_livro boolean DEFAULT false,
  metadata         jsonb DEFAULT '{}',  -- UTMs e campos extras
  created_at       timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX ON leads(email);

-- FORMULÁRIOS DINÂMICOS
CREATE TABLE forms (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  fields       jsonb NOT NULL DEFAULT '[]',
  -- [{label, type, placeholder, required, field_key}]
  redirect_url text,
  created_at   timestamptz DEFAULT now()
);

-- FERRAMENTAS
CREATE TABLE ferramentas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero       integer NOT NULL,        -- F01 a F31
  nome         text NOT NULL,
  descricao    text,
  capitulo     integer NOT NULL,        -- 1 a 10
  arquivo_path text NOT NULL,           -- path no Supabase Storage
  acesso       text DEFAULT 'gratuito'
    CHECK (acesso IN ('gratuito','codigo_livro'))
);

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
```

### 8.2 Storage (buckets)

| Bucket            | Tipo    | Conteúdo                                                     |
| ----------------- | ------- | ------------------------------------------------------------ |
| `ferramentas-pdf` | Privado | `/capitulo-01/F01-GST.pdf` ... `/capitulo-10/F29-Canvas.pdf` |
| `assets`          | Público | `/og-images/` · `/autores/` · `/depoimentos/`                |

> Acesso às ferramentas via **signed URLs com expiração de 1 hora**. Nunca expor o arquivo diretamente.

### 8.3 Row Level Security (RLS)

```sql
-- LEADS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_lead" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin_read"  ON leads FOR SELECT TO authenticated USING (true);

-- FERRAMENTAS
ALTER TABLE ferramentas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_free" ON ferramentas FOR SELECT TO anon
  USING (acesso = 'gratuito');
CREATE POLICY "auth_all" ON ferramentas FOR SELECT TO authenticated
  USING (true);

-- PÁGINAS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_published" ON pages FOR SELECT TO anon
  USING (status = 'published');
CREATE POLICY "admin_all" ON pages FOR ALL TO authenticated USING (true);

-- SEÇÕES
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_sections" ON page_sections FOR SELECT TO anon
  USING (visible = true);
CREATE POLICY "admin_sections" ON page_sections FOR ALL TO authenticated
  USING (true);
```

---

## 9. Design System

Criado por **Daiana Di Morais** para o livro e gerado pelo Claude Design. Importar como `gestor360-tokens.css` no `globals.css`.

### 9.1 As três cores do 360

| Dígito | Token                 | Valor     | Significado                            |
| ------ | --------------------- | --------- | -------------------------------------- |
| **3**  | `--color-brand-stone` | `#8B8B8B` | "Inspirar" — técnica e método          |
| **6**  | `--color-brand-blue`  | `#1F3F7A` | "Evoluir" — consciência e profundidade |
| **0**  | `--color-brand-gold`  | `#D4A020` | "Prosperar" — resultado e propósito    |

### 9.2 Tokens completos

```css
@theme {
  --color-brand-blue: #1f3f7a;
  --color-brand-gold: #d4a020;
  --color-brand-stone: #8b8b8b;
  --color-bg-canvas: #e8e6e1; /* fundo da capa */
  --color-bg-white: #ffffff;
  --color-bg-ink: #1a1a1a; /* footer e hero dark */
  --color-text-title: #1a1a1a;
  --color-text-body: #5a5a5a;
  --color-text-muted: #8b8b8b;
  --color-border: #d8d5cf;

  --font-display: "gotham", sans-serif; /* títulos — mesma da capa */
  --font-body: "DM Sans", sans-serif;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  --shadow-sm: 0 2px 8px 0 oklch(0% 0 0 / 0.08);
  --shadow-md: 0 4px 20px 0 oklch(0% 0 0 / 0.1);
  --shadow-blue: 0 4px 20px 0 oklch(30% 0.12 260 / 0.25);
  --shadow-gold: 0 4px 20px 0 oklch(65% 0.12 70 / 0.3);
}
```

### 9.3 Animações (Framer Motion)

```tsx
// Hero: "3 · 6 · 0" entram em sequência com delay 0.2s cada
// Cards: fade-in + slide-up ao entrar na viewport
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};
// Transições de página: opacity 0→1, 300ms
```

> **Regra:** Animações APENAS em hero, scroll reveal de cards e transições de página.
> Sem parallax. Sem loading animations. Sem excessos.

---

## 10. Estrutura de Rotas e Páginas

### 10.1 Site público

| Rota               | Slug Supabase  | Conteúdo                                                        |
| ------------------ | -------------- | --------------------------------------------------------------- |
| `/`                | `home`         | Hero + Método + Livro + Ferramentas CTA + Depoimentos + Autores |
| `/livro`           | `livro`        | Sinopse, capítulos, onde comprar, foto do lançamento            |
| **`/ferramentas`** | `ferramentas`  | 🔴 **PRIORIDADE** — 31 ferramentas por capítulo com formulário  |
| `/metodo`          | `metodo`       | O Gestor360® explicado como sistema                             |
| `/mentoria`        | `mentoria`     | Palestras, workshops, mentoria individual                       |
| `/sobre`           | `sobre`        | Flávio Di Morais e Marcelo Caetano                              |
| `/blog`            | —              | Listagem de posts                                               |
| `/blog/[slug]`     | —              | Post individual                                                 |
| `/landing/[slug]`  | `landing/nome` | Landing pages de campanhas — sem código                         |

### 10.2 Painel admin

| Rota                  | Função                                                   |
| --------------------- | -------------------------------------------------------- |
| `/admin`              | Dashboard: leads, páginas, ferramentas                   |
| `/admin/paginas`      | Lista de páginas com slug, título, status                |
| `/admin/paginas/nova` | Criar página                                             |
| `/admin/paginas/[id]` | Editor de seções: lista, reordenar, adicionar            |
| `/admin/leads`        | Tabela de leads filtrada por capítulo/data, exportar CSV |
| `/admin/ferramentas`  | CRUD: upload PDF, nome, capítulo, tipo de acesso         |
| `/admin/depoimentos`  | Aprovar ou reprovar depoimentos                          |

---

## 11. Fluxo de Captação de Leads

### 11.1 Fluxo principal

```
1. Leitor escaneia QR Code do capítulo X no livro impresso
2. Acessa: ogestor360.com/ferramentas?capitulo=X&utm_source=livro&utm_medium=qrcode&utm_campaign=capXX
3. Formulário exibe: "Acesse as ferramentas do Capítulo X"
4. Leitor preenche: nome + e-mail (obrigatório) + WhatsApp (opcional)
5. POST /api/leads → Supabase: nome, email, whatsapp, capitulo_origem=X, metadata={UTMs}
6. Resend dispara e-mail de boas-vindas com link das ferramentas gratuitas
7. Leitor acessa ferramentas gratuitas do capítulo
8. CTA: "Tem o livro? Insira o código para acessar todas as 31 ferramentas"
9. Código válido → tem_codigo_livro=true → acesso completo via signed URLs
```

### 11.2 Dado estratégico — capitulo_origem

**Este é o dado mais valioso da base.** Segmenta campanhas por dor do leitor.

| capitulo_origem | Tema              | Dor implícita do leitor                |
| --------------- | ----------------- | -------------------------------------- |
| 1               | Planejamento      | Plano não sai do papel                 |
| 2               | Comunicação       | Problemas com equipe ou clientes       |
| 3               | Delegação         | Faz tudo sozinho, não consegue delegar |
| 4               | Mentalidade       | Crenças limitantes, bloqueios          |
| 5               | Finanças          | Não entende os números do negócio      |
| 6               | Marketing/Vendas  | Dificuldade em vender ou posicionar    |
| 7               | Gestão de Pessoas | Equipe, cultura ou retenção            |
| 8               | Riscos/Decisão    | Dificuldade para decidir               |
| 9               | Autoaprendizado   | Quer se desenvolver mas não sabe como  |
| 10              | Indicadores       | Mede a coisa errada ou não mede nada   |

### 11.3 E-mail de boas-vindas (Resend)

- **De:** `noreply@ogestor360.com`
- **Assunto:** "Suas ferramentas do Gestor360® estão aqui"
- **Conteúdo:** boas-vindas pelo nome + link ferramentas do capítulo + instrução código do livro
- **Template:** `/emails/boas-vindas.tsx` em react-email

---

---

## 12. Eventos de Analytics

> Todos os eventos devem ser enviados para GA4 e Meta Pixel (quando configurado).

| Evento                | Quando disparar                                 | Propriedades                                                                  |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `lead_captured`       | Lead salvo com sucesso no Supabase              | `capitulo_origem`, `tem_whatsapp`, `utm_source`, `utm_medium`, `utm_campaign` |
| `tool_downloaded`     | Clique em download de ferramenta                | `tool_id`, `tool_name`, `capitulo`, `acesso`                                  |
| `book_code_activated` | Código do livro validado com sucesso            | `capitulo_origem`                                                             |
| `page_view`           | Visita a qualquer página                        | `slug`, `referrer`                                                            |
| `section_viewed`      | Seção CMS entra no viewport                     | `section_type`, `page_slug`                                                   |
| `cta_clicked`         | Clique em qualquer CTA                          | `cta_label`, `cta_destination`, `page_slug`                                   |
| `form_started`        | Primeiro campo preenchido                       | `form_id`, `page_slug`                                                        |
| `form_abandoned`      | Saiu da página com form parcialmente preenchido | `form_id`, `fields_filled`                                                    |

---

## 13. Estrutura de Pastas

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
│   │   ├── admin/page.tsx         # Dashboard
│   │   ├── admin/paginas/
│   │   ├── admin/leads/
│   │   ├── admin/ferramentas/
│   │   ├── admin/depoimentos/
│   │   └── layout.tsx             # Sidebar admin
│   └── api/
│       ├── leads/route.ts         # POST: salvar lead + e-mail
│       ├── ferramentas/route.ts   # GET: listar + signed URL
│       └── pages/[slug]/route.ts  # GET: página + seções
├── components/
│   ├── ui/                        # Design system (Button, Logo, Badge...)
│   ├── sections/
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
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client (App Router)
│   │   └── types.ts               # supabase gen types typescript
│   └── resend.ts
├── emails/
│   └── boas-vindas.tsx            # Template react-email
├── styles/
│   ├── globals.css
│   └── gestor360-tokens.css       # Tokens do design system
├── types/
│   └── cms.ts                     # SectionType, PageSection, SectionContent...
├── middleware.ts                  # Proteção /admin com Supabase Auth
├── CLAUDE.md                      # Contexto para IA
├── PRD.md                         # Este arquivo
├── README.md                      # Documentação humana
└── .env.local                     # Variáveis (não versionar)
```

---

## 14. Variáveis de Ambiente e Integrações

### 14.1 .env.local

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@ogestor360.com

# Acesso ao livro
CODIGO_LIVRO_SECRET=        # valida o código impresso no livro

# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=

# Admin
ADMIN_EMAIL=
```

### 14.2 Integrações — Fase 1

| Serviço            | Uso                    | Notas                                        |
| ------------------ | ---------------------- | -------------------------------------------- |
| Supabase           | Banco + Auth + Storage | Criar projeto separado do SaaS DDM           |
| Resend             | E-mail transacional    | Gratuito até 3.000/mês. Verificar domínio    |
| Vercel             | Deploy + CDN           | Domínio ogestor360.com apontar para Vercel   |
| Google Analytics 4 | Analytics + UTMs       | Evento `lead_captured` com `capitulo_origem` |

### 14.3 Integrações — Fase 2+

- WhatsApp Business API (Z-API ou Twilio)
- Meta Pixel — conversões do formulário
- Hotjar — gravação de sessões

---

## 15. Regras de Desenvolvimento

> Para Claude Code, Cowork e qualquer IA que trabalhe neste projeto.

| #   | Regra                            | Detalhe                                                   |
| --- | -------------------------------- | --------------------------------------------------------- |
| 1   | **Sempre TypeScript**            | Sem `.js` no projeto                                      |
| 2   | **Sempre Tailwind v4**           | Sem CSS Modules, sem styled-components                    |
| 3   | **Nunca hardcodar cores**        | Usar tokens de `gestor360-tokens.css`                     |
| 4   | **Server Components por padrão** | Client Component só para interatividade real              |
| 5   | **Formulários com zod**          | react-hook-form + zod sempre                              |
| 6   | **Supabase via `lib/`**          | Nunca instanciar diretamente nos componentes              |
| 7   | **100% pt-BR**                   | Todos os textos, labels e erros em português              |
| 8   | **Acessibilidade**               | `alt` em imagens, `aria-label` em botões sem texto        |
| 9   | **SEO dinâmico**                 | `metadata` vem do Supabase por página                     |
| 10  | **Mobile first**                 | Público acessa pelo celular via QR Code                   |
| 11  | **Animações controladas**        | Framer Motion apenas: hero 360, scroll reveal, transições |
| 12  | **CMS obrigatório**              | Nunca criar conteúdo fixo no código                       |
| 13  | **Admin protegido**              | Toda rota `/admin/*` via middleware + Supabase Auth       |

---

## 16. Roadmap

### 🔴 Fase 0 — MVP Urgente (48–72h)

> **Objetivo:** formulário no ar. QR Codes do livro têm destino.

> **Objetivo:** formulário no ar. QR Codes do livro têm destino.

- [ ] Projeto Next.js no Vercel com domínio `ogestor360.com`
- [ ] Supabase: tabela `leads` + RLS
- [ ] Resend: domínio `ogestor360.com` verificado
- [ ] Página `/ferramentas` com formulário completo
- [ ] API `/api/leads`: salvar + disparar e-mail
- [ ] Upload dos PDFs no Supabase Storage
- [ ] E-mail de boas-vindas com link das ferramentas

### Fase 1 — Fundação (semanas 1–3)

- [ ] Setup completo: Tailwind v4 + tokens + componentes do design system
- [ ] `SectionRenderer.tsx` com tipos: hero, text, cta, cards
- [ ] Rota `/[slug]` renderizando do Supabase
- [ ] Home, Livro, Sobre, Blog (vazio)
- [ ] Animações Framer Motion

### Fase 2 — CMS Completo (semanas 3–4)

- [ ] Todos os 10 tipos de seção
- [ ] Painel admin: login, CRUD páginas, editor, reordenação
- [ ] Dashboard de leads por capítulo
- [ ] CRUD de ferramentas com upload
- [ ] QR Codes com UTM rastreando `capitulo_origem`

### Fase 3 — Conteúdo (mês 2)

- [ ] Blog ativo: 4 primeiros posts
- [ ] Página de mentoria e treinamentos
- [ ] Integração WhatsApp (Z-API)
- [ ] Meta Pixel

### Fase 4 — Comunidade (mês 3+)

- [ ] Área restrita para leitores com código do livro
- [ ] Sessões ao vivo mensais
- [ ] E-commerce de treinamentos
- [ ] Programa de afiliados

---

## 17. Equipe e Responsabilidades

| Pessoa                   | Função         | Responsabilidades                                   |
| ------------------------ | -------------- | --------------------------------------------------- |
| **Flávio Di Morais**     | CEO + Dev (IA) | Arquitetura, desenvolvimento com Claude Code/Cowork |
| **Daiana Di Morais**     | Design + Admin | Identidade visual, painel admin, upload de assets   |
| **Marcelo Caetano**      | Co-autor       | Aprovação de conteúdo, blog, depoimentos            |
| **Claude Code / Cowork** | IA Developer   | Desenvolvimento guiado por `CLAUDE.md`              |

---

## As 31 Ferramentas por Capítulo

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

> _O ogestor360.com não é a página de um livro. É onde o método vive depois que o livro é fechado._

---

_Última atualização: Abril 2026 — DDM Editora_
