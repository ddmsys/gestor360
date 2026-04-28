# Gestor360 - Site Oficial do Metodo

> Plataforma digital do metodo Gestor360: lideranca consciente para pequenas e medias empresas brasileiras.

---

## Sobre o projeto

Este repositorio contem o site oficial do **metodo Gestor360**, desenvolvido pela DDM Editora. O site e um **CMS headless proprio** construido com Next.js e Supabase, permitindo criar e publicar paginas dinamicamente sem codigo, capturar leads pelo QR Code do livro e disponibilizar as 31 ferramentas praticas do metodo.

O site nao e uma pagina de livro. E a plataforma digital de um ecossistema que inclui o livro _Manual do Gestor360_ (DDM Editora / Aurora Books, 2026), mentoria, treinamentos e comunidade de leitores.

---

## Stack

- **Next.js 16** - App Router e Server Components
- **Supabase** - banco de dados, auth e storage
- **TypeScript** - tipagem completa
- **Tailwind CSS v4** - com design tokens do Gestor360
- **Framer Motion** - animacoes pontuais no hero e scroll reveal
- **Resend + react-email** - e-mail transacional
- **Deploy flexivel** - Netlify, Railway, Render, Coolify/VPS ou Vercel

O Supabase e a base de dados do projeto. O provedor de deploy hospeda apenas a aplicacao Next.js.

---

## Decisoes de arquitetura

Este projeto usa um **CMS headless proprio**, nao WordPress, PHP, MySQL, Elementor ou page builder externo.

As paginas publicas sao compostas por secoes salvas no Supabase:

```txt
Painel Admin (/admin)
  -> CRUD de paginas
  -> CRUD de secoes por pagina
  -> Reordenacao de secoes
  -> Publicar / rascunho
  -> Visualizacao de leads

Site Publico
  -> Busca a pagina pelo slug no Supabase
  -> Busca as secoes visiveis e ordenadas
  -> Renderiza cada secao pelo tipo
  -> Retorna 404 se a pagina nao existir ou estiver em rascunho
```

Tipos de secao previstos:

```txt
hero
text
cards
ferramentas
form
faq
cta
depoimentos
capitulos
autores
```

O conteudo editorial deve vir do CMS. Excecoes aceitaveis no codigo: layout estrutural, estados vazios, loading, erro, 404, login e shell do admin.

---

## Estrutura do projeto

O projeto usa a estrutura com `src/`.

```txt
src/
  app/
    (site)/
      page.tsx                  # Home, slug "home"
      [slug]/page.tsx           # Renderizador publico do CMS
      blog/page.tsx
      blog/[slug]/page.tsx
      layout.tsx                # Header + Footer
    (admin)/
      admin/
        page.tsx                # Dashboard
        paginas/
        leads/
        ferramentas/
        depoimentos/
      layout.tsx                # Sidebar admin
    api/
      leads/route.ts
      ferramentas/route.ts
      pages/[slug]/route.ts
  components/
    ui/                         # Design system
    sections/                   # Componentes por tipo de secao
    admin/                      # Componentes do painel admin
  lib/
    supabase/
      client.ts                 # Browser client
      server.ts                 # Server client
      types.ts                  # Tipos gerados pelo Supabase
    resend.ts
  emails/
    boas-vindas.tsx
  styles/
    gestor360-tokens.css
  types/
    cms.ts
middleware.ts
```

---

## Banco de dados

Modelo base recomendado:

```sql
CREATE TABLE admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users
    WHERE user_id = auth.uid()
  );
$$;

CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  og_image text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  content jsonb NOT NULL DEFAULT '{}',
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX page_sections_page_order_idx ON page_sections(page_id, order_index);

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  whatsapp text,
  tem_codigo_livro boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE lead_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  form_id text,
  page_slug text,
  capitulo_origem integer CHECK (capitulo_origem BETWEEN 1 AND 10),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  fields jsonb NOT NULL DEFAULT '[]',
  redirect_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE ferramentas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero integer NOT NULL,
  nome text NOT NULL,
  descricao text,
  capitulo integer NOT NULL CHECK (capitulo BETWEEN 1 AND 10),
  arquivo_path text NOT NULL,
  acesso text DEFAULT 'gratuito' CHECK (acesso IN ('gratuito', 'codigo_livro')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE depoimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cargo text,
  empresa text,
  texto text NOT NULL,
  foto_url text,
  aprovado boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

## RLS recomendado

Nao use `authenticated` como sinonimo de admin. Qualquer usuario logado no Supabase pertence ao role `authenticated`. Permissoes administrativas devem passar por `is_admin()`.

```sql
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferramentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE depoimentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_pages"
ON pages FOR SELECT TO anon
USING (status = 'published');

CREATE POLICY "admin_manage_pages"
ON pages FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "public_read_visible_sections_from_published_pages"
ON page_sections FOR SELECT TO anon
USING (
  visible = true
  AND EXISTS (
    SELECT 1
    FROM pages
    WHERE pages.id = page_sections.page_id
      AND pages.status = 'published'
  )
);

CREATE POLICY "admin_manage_sections"
ON page_sections FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "public_insert_leads"
ON leads FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "public_insert_lead_submissions"
ON lead_submissions FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "admin_read_leads"
ON leads FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "admin_read_lead_submissions"
ON lead_submissions FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "public_read_free_tools"
ON ferramentas FOR SELECT TO anon
USING (acesso = 'gratuito');

CREATE POLICY "admin_manage_tools"
ON ferramentas FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "public_read_approved_testimonials"
ON depoimentos FOR SELECT TO anon
USING (aprovado = true);

CREATE POLICY "admin_manage_testimonials"
ON depoimentos FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

---

## Storage

```txt
bucket: ferramentas-pdf
  privado
  acesso via signed URL com expiracao curta

bucket: assets
  publico
  usado para og-images, autores e depoimentos
```

---

## Fluxo de leads

Cada capitulo do livro deve apontar para uma URL com rastreamento:

```txt
/ferramentas?capitulo=3&utm_source=livro&utm_medium=qrcode&utm_campaign=cap03
```

Fluxo esperado:

```txt
QR Code do livro
  -> pagina de ferramentas
  -> formulario captura nome, email e whatsapp
  -> POST /api/leads
  -> upsert em leads
  -> insert em lead_submissions
  -> salva capitulo_origem e UTMs
  -> envia e-mail de boas-vindas via Resend
  -> libera ferramentas gratuitas
```

Regra critica: sempre salvar `capitulo_origem` em `lead_submissions`. Esse e o dado mais valioso para segmentacao.

---

## Design System

Os tokens devem ficar em `src/styles/gestor360-tokens.css` e ser consumidos pelo Tailwind v4.

```css
@theme {
  --color-brand-blue: #1f3f7a;
  --color-brand-gold: #d4a020;
  --color-brand-stone: #8b8b8b;
  --color-bg-canvas: #e8e6e1;
  --color-bg-white: #ffffff;
  --color-bg-ink: #1a1a1a;
  --color-text-title: #1a1a1a;
  --color-text-body: #5a5a5a;
  --color-text-muted: #8b8b8b;
  --color-border: #d8d5cf;

  --font-display: "gotham", sans-serif;
  --font-body: "DM Sans", sans-serif;
}
```

Evite hardcode de cores em componentes. Use tokens do projeto.

---

## Variaveis de ambiente

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@ogestor360.com
CODIGO_LIVRO_SECRET=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
ADMIN_EMAIL=
```

---

## Deploy

O projeto nao depende obrigatoriamente da Vercel. Opcoes recomendadas:

| Opcao | Quando usar |
| --- | --- |
| Netlify | Deploy gerenciado parecido com Vercel, com bom suporte a Next.js |
| Railway | App full-stack em Node com deploy simples por GitHub |
| Render | Node server simples e previsivel |
| Coolify + VPS | Mais controle, menos lock-in e custo previsivel |
| Vercel | Melhor integracao nativa com Next.js, se o custo/lock-in nao for problema |

Para Railway, Render e Coolify, prefira build standalone:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

E use:

```bash
npm run build
npm run start
```

---

## Instalacao

```bash
npm install
npm run dev
```

Dependencias que ainda devem ser adicionadas quando as respectivas features forem implementadas:

```txt
framer-motion
resend
react-email
react-hook-form
zod
```

---

## Regras de desenvolvimento

- Sempre TypeScript.
- Server Components por padrao.
- Client Components somente para interatividade real.
- Tailwind CSS v4 com tokens do Gestor360.
- Formularios com `react-hook-form` + `zod`.
- Validar `content jsonb` por tipo de secao antes de renderizar.
- Usar `src/lib/supabase/server.ts` no servidor.
- Usar `src/lib/supabase/client.ts` no browser.
- Conteudo editorial em pt-BR.
- Mobile first, pois muito trafego vira de QR Code.
- Admin protegido por Supabase Auth + role admin.

---

## Roadmap

### Fase 1 - Fundacao

- [ ] Schema Supabase + RLS seguro
- [ ] Tokens do design system
- [ ] Componentes base de UI
- [ ] `SectionRenderer` com `hero`, `text` e `cta`
- [ ] Rota publica por slug
- [ ] API de leads com `leads` + `lead_submissions`

### Fase 2 - CMS completo

- [ ] Todos os tipos de secao
- [ ] Painel admin
- [ ] Upload de PDFs no Storage
- [ ] Controle de acesso das ferramentas
- [ ] E-mail de boas-vindas via Resend
- [ ] Rastreamento por QR Code e UTM

### Fase 3 - Conteudo e comunidade

- [ ] Blog
- [ ] Mentoria e treinamentos
- [ ] Integracao WhatsApp
- [ ] Area restrita para leitores
- [ ] GA4 + Meta Pixel

---

## Documentacao tecnica

Para contexto detalhado de arquitetura, regras para IAs e orientacoes editoriais, leia tambem o arquivo [CLAUDE.md](./CLAUDE.md).

---

## Autores

**Flavio Di Morais** - CEO DDM Editora, @oCaraDoLivro  
**Marcelo Caetano** - Co-autor do metodo  
**Daiana Di Morais** - Identidade visual

---

© 2026 Gestor360 - DDM Editora. Todos os direitos reservados.
