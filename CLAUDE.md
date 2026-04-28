# Gestor360® — Site Oficial do Método

> Guia de contexto para Claude Code, Claude Design e qualquer IA que trabalhe neste projeto.
> Leia este arquivo antes de qualquer tarefa.

---

## O que é este projeto

Site oficial do **método Gestor360®** — plataforma de liderança consciente para pequenos e médios empresários brasileiros. O site é o hub digital de um ecossistema que inclui o livro _Manual do Gestor360®_ (DDM Editora, 2026), 31 ferramentas práticas em PDF, mentoria, treinamentos e comunidade de leitores.

**Não é a página de um livro. É a plataforma de um método.**

---

## Dono do projeto

- **Flávio Di Morais** — CEO da DDM Editora, fundador do método Gestor360®, @oCaraDoLivro
- **Marcelo Caetano** — Co-autor, especialista em gestão estratégica para PMEs
- **Daiana Di Morais** — Diretora de arte, responsável pela identidade visual do livro e do site

---

## Stack técnica

| Camada         | Tecnologia                      | Status        |
| -------------- | ------------------------------- | ------------- |
| Framework      | Next.js 14 (App Router)         | ✅ Definido   |
| Banco de dados | Supabase (PostgreSQL)           | ✅ Definido   |
| Linguagem      | TypeScript                      | ✅ Definido   |
| Estilização    | Tailwind CSS                    | ✅ Definido   |
| Deploy         | Vercel                          | ✅ Definido   |
| E-mail         | Resend + react-email            | ✅ Definido   |
| CMS (blog)     | Keystatic                       | ✅ Definido   |
| Design System  | Claude Design (tokens Tailwind) | 🔄 Em criação |

**Não usar WordPress. Não usar PHP. Não usar MySQL.**
O Supabase já é a base de dados do SaaS interno da DDM — manter consistência.

---

## Estrutura de páginas

```
/                    → Home
/livro               → Página do livro (sinopse, onde comprar)
/ferramentas         → 31 ferramentas por capítulo (acesso via cadastro)
/metodo              → O Gestor360® explicado como sistema
/mentoria            → Palestras, workshops, mentoria individual
/sobre               → Flávio Di Morais e Marcelo Caetano
/blog                → Posts (gerenciados via Keystatic)
/blog/[slug]         → Post individual
/comunidade          → Área restrita para leitores (fase 2)
```

---

## Banco de dados — Supabase

### Tabelas principais

```sql
-- Leads capturados pelo site
leads (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text not null unique,
  whatsapp    text,
  capitulo_origem integer,        -- qual QR Code originou o cadastro (1-10)
  tem_codigo_livro boolean default false,
  created_at  timestamptz default now()
)

-- 31 ferramentas organizadas por capítulo
ferramentas (
  id          uuid primary key default gen_random_uuid(),
  numero      integer not null,   -- F01 a F31
  nome        text not null,
  descricao   text,
  capitulo    integer not null,   -- 1 a 10
  arquivo_path text not null,     -- path no Supabase Storage
  acesso      text default 'gratuito' -- 'gratuito' | 'codigo_livro'
)

-- Posts do blog (gerenciados via Keystatic / MDX)
-- Keystatic armazena em /content/posts/*.mdx no repositório
-- Não precisa de tabela no Supabase

-- Depoimentos exibidos no site
depoimentos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  cargo       text,
  empresa     text,
  texto       text not null,
  foto_url    text,
  aprovado    boolean default false,
  created_at  timestamptz default now()
)
```

### Storage

```
bucket: ferramentas-pdf
  /capitulo-01/F01-GST.pdf
  /capitulo-01/F02-PESTEL.pdf
  /capitulo-01/F03-SWOT-Comportamental.pdf
  ...
  /capitulo-10/F29-Canvas-Inovacao-Agil.pdf

Acesso: signed URLs com expiração de 1 hora
RLS: leads com tem_codigo_livro = true acessam todas
     leads com tem_codigo_livro = false acessam apenas ferramentas com acesso = 'gratuito'
```

---

## Identidade visual

```ts
colors: {
  brand: {
    Blue:    '#1B3A6B',
    Orange:  '#daae5d',
    Black:   '#000000',
    White:   '#FFFFFF',
    Dourado  '#bfb3a7',

  }
}
```

### Tipografia

- **Títulos:** Fonte serifa (a definir pelo Claude Design — baseada na capa do livro)
- **Corpo:** Inter ou similar sans-serif limpa
- **Tom visual:** Autoridade + calor. Método sério, alma presente. Não frio, não corporativo.

### Frase de impacto do método

> "O método que une razão e alma para transformar quem lidera — e, por isso, transforma a empresa."

---

## Fluxo de captação de leads

```
QR Code do livro (capítulo X)
  → /ferramentas?capitulo=X
    → Formulário: nome + e-mail (obrigatório) + WhatsApp (opcional)
      → Salva lead no Supabase com capitulo_origem = X
        → Resend dispara e-mail de boas-vindas
          → Lead acessa ferramentas gratuitas do capítulo
            → CTA para inserir código do livro → libera todas as 31 ferramentas
```

**Regra de negócio importante:** Sempre salvar `capitulo_origem` — identifica qual dor o leitor tem.

---

## QR Codes — UTMs por capítulo

Cada capítulo do livro tem um QR Code que aponta para:

```
https://ogestor360.com/ferramentas?capitulo=1&utm_source=livro&utm_medium=qrcode&utm_campaign=cap01

```

O parâmetro `capitulo` é lido na página e pré-seleciona o capítulo correto. O `utm_campaign` é registrado no Google Analytics 4.

---

## E-mail de boas-vindas (Resend)

Disparado imediatamente após o cadastro:

```
Assunto: Suas ferramentas do Gestor360® estão aqui
De: noreply@ogestor360.com
Para: {email do lead}

Conteúdo:
1. Boas-vindas pelo nome
2. Link direto para as ferramentas do capítulo de origem
3. Instrução para inserir o código do livro (acesso completo)
4. Assinatura: Flávio Di Morais e Marcelo Caetano
```

Template em `/emails/boas-vindas.tsx` usando react-email.

---

## Estrutura de pastas (convenção)

```
/
├── app/
│   ├── (site)/              # Grupo de rotas públicas
│   │   ├── page.tsx         # Home
│   │   ├── livro/page.tsx
│   │   ├── ferramentas/page.tsx
│   │   ├── metodo/page.tsx
│   │   ├── mentoria/page.tsx
│   │   ├── sobre/page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   └── api/
│       ├── leads/route.ts   # POST: salvar lead
│       └── ferramentas/route.ts # GET: listar por capítulo
├── components/
│   ├── ui/                  # Componentes base do design system
│   └── sections/            # Seções das páginas (Hero, Features, etc.)
├── content/
│   └── posts/               # Arquivos .mdx gerenciados pelo Keystatic
├── emails/
│   └── boas-vindas.tsx      # Template react-email
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   └── resend.ts            # Cliente Resend
├── types/
│   └── index.ts             # Tipos TypeScript do projeto
├── tailwind.config.ts       # Design tokens (gerado pelo Claude Design)
├── CLAUDE.md                # Este arquivo
└── .env.local               # Variáveis de ambiente (não versionar)
```

---

## Variáveis de ambiente necessárias

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (e-mail)
RESEND_API_KEY=

# Código de acesso ao livro (validação simples no início)
CODIGO_LIVRO_SECRET=

# Analytics
NEXT_PUBLIC_GA_ID=
```

---

## Regras para a IA (Claude Code, v0, Cursor)

1. **Sempre usar TypeScript** — sem arquivos `.js` no projeto
2. **Sempre usar Tailwind** — sem CSS modules, sem styled-components
3. **Nunca hardcodar cores** — usar os tokens do `tailwind.config.ts`
4. **Componentes server-first** — usar Client Components só quando necessário (interatividade)
5. **Formulários com validação** — usar react-hook-form + zod
6. **Supabase via lib/supabase.ts** — nunca instanciar o cliente diretamente nos componentes
7. **Textos em português** — o site é 100% em pt-BR
8. **Acessibilidade** — sempre incluir `alt` em imagens, `aria-label` em botões sem texto
9. **SEO** — cada página tem `metadata` com title e description específicos
10. **Mobile first** — o público do livro acessa principalmente pelo celular (QR Code)

---

## Contexto editorial (para gerar textos e componentes)

### Sobre o método Gestor360®

Sistema vivo de liderança que opera em 3 dimensões simultâneas:

- **Técnica:** GST, PESTEL, SWOT, OKR, PDCA, DRE, Fluxo de Caixa, Matriz de Risco
- **Neurociência/PNL:** rapport, metamodelo, reframing, Liderança Situacional, Kahneman, Amabile
- **Filosófico-espiritual:** propósito, autoconhecimento, consciência, presença

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

### Tom de voz do site

- Direto e concreto — sem jargão vazio
- Humano e próximo — fala com o empresário, não para ele
- Autoridade com humildade — sabe muito, não se vangloria
- Inspirador sem ser motivacional vazio

---

## Roadmap

### Fase 1 — MVP (semanas 1–3)

- [ ] Design system gerado pelo Claude Design
- [ ] Setup Next.js + Supabase + Tailwind + Vercel
- [ ] Páginas: Home, Livro, Ferramentas (com cadastro), Sobre
- [ ] Blog estruturado com Keystatic (sem posts ainda)
- [ ] Formulário de leads funcionando
- [ ] QR Codes apontando para o site
- [ ] E-mail de boas-vindas via Resend

### Fase 2 — Conteúdo (mês 2)

- [ ] Página "O Método"
- [ ] Página de Mentoria e Treinamentos
- [ ] 4 primeiros posts do blog
- [ ] Integração WhatsApp (Zapier ou Z-API)
- [ ] Google Analytics 4 com UTMs por capítulo

### Fase 3 — Comunidade (mês 3+)

- [ ] Área restrita para leitores com código do livro
- [ ] Sessões ao vivo mensais
- [ ] E-commerce de treinamentos online

---

_Última atualização: Abril 2026_
_Mantenedor: Flávio Di Morais — DDM Editora_
