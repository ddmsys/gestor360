# Gestor360® — Blueprint dos Campos CMS

> Este documento define o contrato de dados de cada tipo de seção.
> O campo `content` no banco (`page_sections.content`) é um JSONB que segue estes schemas.
> **O painel admin usa estes campos para montar os formulários de edição.**
> **O `SectionRenderer.tsx` usa estes tipos para renderizar cada seção.**

---

## Índice

- [Tipos TypeScript base](#tipos-typescript-base)
- [hero](#hero)
- [text](#text)
- [cards](#cards)
- [ferramentas](#ferramentas)
- [form](#form)
- [faq](#faq)
- [cta](#cta)
- [depoimentos](#depoimentos)
- [capitulos](#capitulos)
- [autores](#autores)

---

## Tipos TypeScript base

```typescript
// types/cms.ts

export type SectionType =
  | "hero"
  | "text"
  | "cards"
  | "ferramentas"
  | "form"
  | "faq"
  | "cta"
  | "depoimentos"
  | "capitulos"
  | "autores";

export interface PageSection {
  id: string;
  page_id: string;
  type: SectionType;
  order_index: number;
  content: SectionContent;
  visible: boolean;
  created_at: string;
}

export type SectionContent =
  | HeroContent
  | TextContent
  | CardsContent
  | FerramentasContent
  | FormContent
  | FAQContent
  | CTAContent
  | DepoimentosContent
  | CapitulosContent
  | AutoresContent;
```

---

## hero

**Componente:** `HeroSection.tsx`
**Uso:** seção principal de qualquer página — geralmente a primeira

```typescript
export interface HeroContent {
  // Obrigatórios
  title: string; // Ex: "O método que transforma quem lidera"

  // Opcionais
  subtitle?: string; // Parágrafo abaixo do título
  cta_label?: string; // Texto do botão principal. Ex: "Acessar ferramentas"
  cta_url?: string; // Link do botão. Ex: "/ferramentas" ou "#form"
  cta_secondary_label?: string; // Botão secundário (outline)
  cta_secondary_url?: string;

  // Visual
  variant?: "dark" | "canvas" | "blue"; // Default: 'dark'
  // dark   = fundo #1A1A1A (hero do livro)
  // canvas = fundo #E8E6E1 (tom da capa)
  // blue   = fundo #1F3F7A (azul da marca)

  bg_image?: string; // URL de imagem de fundo (Supabase Storage)
  show_360_animation?: boolean; // Ativa animação "3·6·0". Default: false

  // Alinhamento
  align?: "left" | "center" | "right"; // Default: 'center'
}
```

**Exemplo de `content` para a Home:**

```json
{
  "title": "O método que une razão e alma para transformar quem lidera",
  "subtitle": "31 ferramentas práticas, 10 capítulos, 1 método. Para pequenos e médios empresários que querem liderar com consciência e prosperidade.",
  "cta_label": "Acessar ferramentas gratuitas",
  "cta_url": "/ferramentas",
  "cta_secondary_label": "Conhecer o método",
  "cta_secondary_url": "/metodo",
  "variant": "dark",
  "show_360_animation": true,
  "align": "center"
}
```

---

## text

**Componente:** `TextSection.tsx`
**Uso:** blocos de texto corrido — sobre, explicações, contexto

```typescript
export interface TextContent {
  // Obrigatórios
  body: string; // Markdown suportado: **negrito**, _itálico_, listas, links

  // Opcionais
  title?: string; // Título H2 da seção
  subtitle?: string; // Subtítulo H3 ou parágrafo de apoio

  // Layout
  align?: "left" | "center" | "right"; // Default: 'left'
  max_width?: "sm" | "md" | "lg" | "full"; // Default: 'md' (680px)

  // Visual
  bg?: "white" | "canvas" | "ink"; // Default: 'white'
  // white  = fundo branco
  // canvas = fundo #E8E6E1
  // ink    = fundo dark (texto invertido)

  // Badge/eyebrow acima do título
  badge?: string; // Ex: "O Método", "Capítulo 1"
  badge_color?: "blue" | "gold" | "stone"; // Default: 'blue'
}
```

**Exemplo:**

```json
{
  "badge": "O Método",
  "badge_color": "blue",
  "title": "Gestão é técnica. Liderança é consciência.",
  "subtitle": "O Gestor360® nasce da convicção de que o melhor líder é aquele que se conhece.",
  "body": "Flávio Di Morais e Marcelo Caetano reuniram **31 ferramentas** das três dimensões da liderança em um método único...\n\nNão é só sobre gestão. É sobre quem você é quando lidera.",
  "align": "center",
  "bg": "canvas"
}
```

---

## cards

**Componente:** `CardsSection.tsx`
**Uso:** benefícios, recursos, pilares, diferenciais — qualquer conteúdo em grade

```typescript
export interface CardItem {
  icon?: string; // Emoji ou nome de ícone Lucide. Ex: "🎯" ou "target"
  title: string;
  description: string;
  link_url?: string; // Card clicável — URL destino
  link_label?: string; // Texto do link. Ex: "Saiba mais"
  badge?: string; // Badge no card. Ex: "Novo", "Cap. 3"
}

export interface CardsContent {
  // Obrigatório
  items: CardItem[]; // Mínimo 2, máximo 12 cards

  // Cabeçalho da seção
  title?: string;
  subtitle?: string;
  badge?: string;
  badge_color?: "blue" | "gold" | "stone";

  // Layout
  columns?: 2 | 3 | 4; // Default: 3. Mobile sempre 1 coluna.
  bg?: "white" | "canvas" | "ink"; // Default: 'white'

  // Estilo dos cards
  card_style?: "bordered" | "shadow" | "flat"; // Default: 'shadow'
}
```

**Exemplo — "Os 3 Pilares do Método":**

```json
{
  "title": "Três dimensões. Um método completo.",
  "subtitle": "O Gestor360® integra o que outros métodos tratam separado.",
  "columns": 3,
  "bg": "canvas",
  "items": [
    {
      "icon": "⚙️",
      "title": "Técnica",
      "description": "GST, PESTEL, SWOT, OKR, DRE — as ferramentas de gestão que todo empresário precisa dominar."
    },
    {
      "icon": "🧠",
      "title": "Neurociência e PNL",
      "description": "Rapport, Metamodelo, Reframing, Kahneman — como sua mente interfere no seu negócio."
    },
    {
      "icon": "✨",
      "title": "Propósito",
      "description": "Autoconhecimento, consciência, legado — a dimensão que transforma gestores em líderes."
    }
  ]
}
```

---

## ferramentas

**Componente:** `FerramentasSection.tsx`
**Uso:** listagem das 31 ferramentas com controle de acesso e download

```typescript
export interface FerramentasContent {
  // Cabeçalho
  title?: string; // Default: "Ferramentas do Gestor360®"
  subtitle?: string;

  // Filtro pré-selecionado
  capitulo_inicial?: number; // 1–10. Pré-filtra o capítulo na URL ?capitulo=X
  mostrar_todos?: boolean; // Mostra todos os capítulos ou apenas o selecionado. Default: false

  // Layout
  layout?: "grid" | "list"; // Default: 'grid'

  // CTA para código do livro
  mostrar_cta_codigo?: boolean; // Exibe bloco "Tem o livro? Desbloqueie tudo". Default: true
  cta_codigo_titulo?: string;
  cta_codigo_descricao?: string;
}
```

> **Nota:** as ferramentas em si são carregadas dinamicamente da tabela `ferramentas` no Supabase,
> não ficam no `content`. O `content` apenas configura como a seção se comporta.

---

## form

**Componente:** `FormSection.tsx`
**Uso:** captura de leads, contato, inscrição em eventos

```typescript
export interface FormField {
  field_key: string; // Nome da coluna no Supabase. Ex: "nome", "email", "whatsapp"
  label: string; // Label visível. Ex: "Seu nome completo"
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean; // Default: false
  options?: string[]; // Para type: 'select'. Ex: ["1–5 funcionários", "6–20", "21–50"]
  mask?: "phone" | "cpf"; // Máscara de input
}

export interface FormContent {
  // Cabeçalho
  title?: string; // Ex: "Acesse suas ferramentas gratuitas"
  subtitle?: string; // Ex: "Preencha para receber por e-mail"
  badge?: string;

  // Campos
  fields: FormField[];

  // Submit
  submit_label?: string; // Default: "Acessar ferramentas"

  // Pós-submit
  success_title?: string; // Default: "Pronto! Verifique seu e-mail."
  success_message?: string;
  redirect_url?: string; // Se preenchido, redireciona após submit

  // Contexto
  form_id?: string; // ID do formulário na tabela `forms` (opcional)

  // Visual
  bg?: "white" | "canvas" | "blue"; // Default: 'blue'
  layout?: "centered" | "side-by-side"; // Default: 'centered'
}
```

**Exemplo — formulário de captura da página /ferramentas:**

```json
{
  "title": "Acesse as ferramentas gratuitamente",
  "subtitle": "Preencha abaixo e receba os PDFs por e-mail em instantes.",
  "badge_color": "gold",
  "bg": "blue",
  "submit_label": "Quero as ferramentas",
  "success_title": "Pronto! Verifique seu e-mail.",
  "success_message": "Enviamos o link das ferramentas para o seu e-mail. Verifique também o spam.",
  "fields": [
    {
      "field_key": "nome",
      "label": "Seu nome",
      "type": "text",
      "placeholder": "Como posso te chamar?",
      "required": true
    },
    {
      "field_key": "email",
      "label": "E-mail",
      "type": "email",
      "placeholder": "seu@email.com",
      "required": true
    },
    {
      "field_key": "whatsapp",
      "label": "WhatsApp (opcional)",
      "type": "tel",
      "placeholder": "(11) 99999-9999",
      "mask": "phone",
      "required": false
    }
  ]
}
```

---

## faq

**Componente:** `FAQSection.tsx`
**Uso:** perguntas frequentes — accordion expansível

```typescript
export interface FAQItem {
  question: string;
  answer: string; // Markdown suportado
  open_by_default?: boolean; // Expande ao carregar. Default: false
}

export interface FAQContent {
  title?: string; // Default: "Perguntas frequentes"
  subtitle?: string;
  badge?: string;
  badge_color?: "blue" | "gold" | "stone";

  items: FAQItem[]; // Sem limite, mas recomendado até 12

  bg?: "white" | "canvas"; // Default: 'white'
  layout?: "single" | "two-columns"; // Default: 'single'. Two-columns apenas desktop.
}
```

**Exemplo:**

```json
{
  "title": "Dúvidas sobre o Gestor360®",
  "bg": "canvas",
  "items": [
    {
      "question": "O livro é para qualquer tipo de empresa?",
      "answer": "Sim. O método foi desenvolvido especificamente para **pequenos e médios empresários** brasileiros, mas os princípios se aplicam a qualquer líder que queira evoluir.",
      "open_by_default": true
    },
    {
      "question": "Preciso ter o livro para usar as ferramentas?",
      "answer": "Não. As ferramentas gratuitas de cada capítulo são acessíveis mediante cadastro no site. Com o código do livro, você desbloqueia todas as 31 ferramentas."
    }
  ]
}
```

---

## cta

**Componente:** `CTASection.tsx`
**Uso:** chamada para ação — geralmente ao final de seções ou da página

```typescript
export interface CTAContent {
  // Obrigatório
  title: string;

  // Opcionais
  subtitle?: string;
  body?: string; // Parágrafo de apoio

  // Botão principal
  cta_label?: string; // Ex: "Comprar o livro"
  cta_url?: string;

  // Botão secundário
  cta_secondary_label?: string;
  cta_secondary_url?: string;

  // Visual
  variant?: "blue" | "gold" | "dark" | "canvas"; // Default: 'blue'
  // blue   = fundo brand-blue, texto branco
  // gold   = fundo brand-gold, texto escuro
  // dark   = fundo ink, texto branco
  // canvas = fundo canvas, texto escuro

  align?: "left" | "center"; // Default: 'center'

  // Imagem lateral (layout split)
  image_url?: string; // Se presente, cria layout text + image
  image_alt?: string;
  image_side?: "left" | "right"; // Default: 'right'
}
```

---

## depoimentos

**Componente:** `DepoimentosSection.tsx`
**Uso:** prova social — avaliações e depoimentos de clientes/leitores

```typescript
export interface DepoimentosContent {
  title?: string; // Default: "O que dizem sobre o Gestor360®"
  subtitle?: string;
  badge?: string;
  badge_color?: "blue" | "gold" | "stone";

  // Fonte dos depoimentos
  // 'supabase' = carrega da tabela `depoimentos` onde aprovado = true
  // 'manual'   = usa os itens definidos aqui (para controle total)
  source?: "supabase" | "manual"; // Default: 'supabase'

  // Usado apenas se source = 'manual'
  items?: Array<{
    nome: string;
    cargo?: string;
    empresa?: string;
    texto: string;
    foto_url?: string;
    nota?: 1 | 2 | 3 | 4 | 5; // Estrelas
  }>;

  // Layout
  layout?: "grid" | "carousel" | "masonry"; // Default: 'grid'
  columns?: 2 | 3; // Default: 3 (desktop)
  bg?: "white" | "canvas" | "ink"; // Default: 'canvas'
  limit?: number; // Máximo de depoimentos a exibir. Default: 6
}
```

---

## capitulos

**Componente:** `CapitulosSection.tsx`
**Uso:** exibir os 10 capítulos do método

```typescript
export interface CapitulosContent {
  title?: string; // Default: "Os 10 capítulos do método"
  subtitle?: string;
  badge?: string;

  // Visual
  bg?: "white" | "canvas"; // Default: 'white'
  layout?: "grid" | "numbered-list"; // Default: 'grid'

  // Cada card de capítulo pode ter link
  link_para_ferramenta?: boolean; // CTA "Ver ferramentas" em cada card. Default: true

  // Os dados dos capítulos são fixos no componente (não vêm do Supabase)
  // pois fazem parte do conteúdo editorial do livro
}
```

> **Nota:** o conteúdo dos capítulos (número, tema, ferramentas) é hardcoded no componente
> `CapitulosSection.tsx` pois faz parte do livro impresso e não muda.
> O que muda via CMS é apenas o layout e estilo visual da seção.

---

## autores

**Componente:** `AutoresSection.tsx`
**Uso:** apresentar Flávio Di Morais e Marcelo Caetano

```typescript
export interface AutorItem {
  nome: string;
  cargo: string; // Ex: "CEO da DDM Editora · Fundador do Gestor360®"
  bio: string; // Markdown suportado
  foto_url: string; // Supabase Storage: /assets/autores/flavio.jpg

  linkedin_url?: string;
  instagram_url?: string;
  site_url?: string;
}

export interface AutoresContent {
  title?: string; // Default: "Quem está por trás do método"
  subtitle?: string;

  autores: AutorItem[]; // Geralmente 2: Flávio e Marcelo

  bg?: "white" | "canvas"; // Default: 'canvas'
  layout?: "side-by-side" | "stacked"; // Default: 'side-by-side'
}
```

---

## Campos obrigatórios por tipo — Resumo rápido

| Tipo          | Campos obrigatórios                                             |
| ------------- | --------------------------------------------------------------- |
| `hero`        | `title`                                                         |
| `text`        | `body`                                                          |
| `cards`       | `items[]` (cada item: `title` + `description`)                  |
| `ferramentas` | _(nenhum — todos opcionais)_                                    |
| `form`        | `fields[]` (cada field: `field_key` + `label` + `type`)         |
| `faq`         | `items[]` (cada item: `question` + `answer`)                    |
| `cta`         | `title`                                                         |
| `depoimentos` | _(nenhum se `source = 'supabase'`)_                             |
| `capitulos`   | _(nenhum — conteúdo do componente)_                             |
| `autores`     | `autores[]` (cada autor: `nome` + `cargo` + `bio` + `foto_url`) |

---

## Validação Zod (referência)

```typescript
// lib/cms/schemas.ts — para validar o content no painel admin e na API

import { z } from "zod";

export const HeroContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  cta_label: z.string().optional(),
  cta_url: z.string().optional(),
  cta_secondary_label: z.string().optional(),
  cta_secondary_url: z.string().optional(),
  variant: z.enum(["dark", "canvas", "blue"]).default("dark"),
  bg_image: z.string().url().optional(),
  show_360_animation: z.boolean().default(false),
  align: z.enum(["left", "center", "right"]).default("center"),
});

export const FormFieldSchema = z.object({
  field_key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "email", "tel", "textarea", "select", "checkbox"]),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  mask: z.enum(["phone", "cpf"]).optional(),
});

export const FormContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  fields: z.array(FormFieldSchema).min(1),
  submit_label: z.string().default("Enviar"),
  success_title: z.string().default("Pronto! Verifique seu e-mail."),
  success_message: z.string().optional(),
  redirect_url: z.string().url().optional(),
  bg: z.enum(["white", "canvas", "blue"]).default("blue"),
  layout: z.enum(["centered", "side-by-side"]).default("centered"),
});

// ... demais schemas seguem o mesmo padrão
```

---

_Última atualização: Abril 2026 — DDM Editora_
_Referência: [`docs/PRD.md`](./PRD.md) · [`docs/api.md`](./api.md)_
