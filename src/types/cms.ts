import type { SectionStyle } from './section-style'

// ─── Enums e tipos base ───────────────────────────────────────────────────

export type SectionType =
  | 'hero'
  | 'text'
  | 'cards'
  | 'ferramentas'
  | 'form'
  | 'faq'
  | 'cta'
  | 'depoimentos'
  | 'capitulos'
  | 'autores'

export type PageStatus = 'draft' | 'published'

// ─── Página ───────────────────────────────────────────────────────────────

export interface Page {
  id: string
  slug: string
  title: string
  description?: string
  og_image?: string
  status: PageStatus
  created_at: string
  updated_at: string
}

// ─── Seção de página ──────────────────────────────────────────────────────

export interface PageSection {
  id: string
  page_id: string
  type: SectionType
  order_index: number
  content: SectionContent
  style?: SectionStyle
  visible: boolean
  created_at: string
  updated_at: string
}

// ─── Conteúdo de cada tipo de seção ──────────────────────────────────────

export interface HeroContent {
  title: string
  subtitle?: string
  cta_label?: string
  cta_url?: string
  cta_secondary_label?: string
  cta_secondary_url?: string
  variant?: 'dark' | 'canvas' | 'blue'
  bg_image?: string
  bg_video?: string
  overlay_opacity?: number
  show_360_animation?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface TextContent {
  body: string
  title?: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  max_width?: 'sm' | 'md' | 'lg' | 'full'
  bg?: 'white' | 'canvas' | 'ink'
  badge?: string
  badge_color?: 'blue' | 'gold' | 'stone'
  // Imagem lateral
  image_url?: string
  image_alt?: string
  image_side?: 'left' | 'right'
  image_ratio?: '1:1' | '4:3' | '16:9'
  // CTA embutido
  cta_label?: string
  cta_url?: string
  cta_style?: 'primary' | 'secondary' | 'ghost'
}

export interface CardItem {
  icon?: string
  title: string
  description: string
  link_url?: string
  link_label?: string
  badge?: string
}

export interface CardsContent {
  title?: string
  subtitle?: string
  badge?: string
  badge_color?: 'blue' | 'gold' | 'stone'
  cards: CardItem[]
  columns?: 2 | 3 | 4
  bg?: 'white' | 'canvas' | 'ink'
  card_style?: 'bordered' | 'shadow' | 'flat'
}

export interface FerramentasContent {
  capitulo_inicial?: number
  mostrar_todos?: boolean
  title?: string
  subtitle?: string
  layout?: 'grid' | 'list'
  mostrar_cta_codigo?: boolean
  cta_codigo_titulo?: string
  cta_codigo_descricao?: string
}

export interface FormField {
  field_key: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: string[]
  mask?: 'phone' | 'cpf'
}

export interface FormContent {
  title?: string
  subtitle?: string
  badge?: string
  fields: FormField[]
  submit_label?: string
  success_title?: string
  success_message?: string
  redirect_url?: string
  form_id?: string
  bg?: 'white' | 'canvas' | 'blue'
  layout?: 'centered' | 'side-by-side'
}

export interface FAQItem {
  question: string
  answer: string
  open_by_default?: boolean
}

export interface FAQContent {
  title?: string
  subtitle?: string
  badge?: string
  badge_color?: 'blue' | 'gold' | 'stone'
  items: FAQItem[]
  bg?: 'white' | 'canvas'
  layout?: 'single' | 'two-columns'
}

export interface CTAContent {
  title: string
  subtitle?: string
  body?: string
  cta_text: string
  cta_href: string
  cta_secondary_label?: string
  cta_secondary_url?: string
  background?: 'blue' | 'gold' | 'ink' | 'canvas'
  align?: 'left' | 'center'
  image_url?: string
  image_alt?: string
  image_side?: 'left' | 'right'
}

export interface DepoimentoItem {
  nome: string
  cargo?: string
  empresa?: string
  texto: string
  foto_url?: string
  nota?: 1 | 2 | 3 | 4 | 5
}

export interface DepoimentosContent {
  title?: string
  subtitle?: string
  badge?: string
  badge_color?: 'blue' | 'gold' | 'stone'
  source?: 'supabase' | 'manual'
  items?: DepoimentoItem[]
  layout?: 'grid' | 'carousel' | 'masonry'
  columns?: 2 | 3
  bg?: 'white' | 'canvas' | 'ink'
  limit?: number
}

export interface CapitulosContent {
  title?: string
  subtitle?: string
  badge?: string
  bg?: 'white' | 'canvas'
  layout?: 'grid' | 'numbered-list'
  link_para_ferramenta?: boolean
}

export interface AutorItem {
  nome: string
  cargo: string
  bio: string
  foto_url: string
  linkedin_url?: string
  instagram_url?: string
  site_url?: string
}

export interface AutoresContent {
  title?: string
  subtitle?: string
  autores: AutorItem[]
  bg?: 'white' | 'canvas'
  layout?: 'side-by-side' | 'stacked'
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
  | AutoresContent

// ─── Lead ─────────────────────────────────────────────────────────────────

export interface LeadFormData {
  nome: string
  email: string
  whatsapp?: string
  capitulo_origem?: number
  consent_source: string
  metadata?: Record<string, string>
}

// ─── Ferramenta ───────────────────────────────────────────────────────────

export type AcessoFerramenta = 'gratuito' | 'codigo_livro'

export interface Ferramenta {
  id: string
  numero: number
  nome: string
  descricao?: string
  capitulo: number
  arquivo_path: string
  acesso: AcessoFerramenta
  ativo: boolean
}
