// ─── Tipos base do CMS ────────────────────────────────────────────────────

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

export interface PageSection {
  id: string
  page_id: string
  type: SectionType
  order_index: number
  content: SectionContent
  visible: boolean
  created_at: string
  updated_at: string
}

// ─── Conteúdo de cada tipo de seção ───────────────────────────────────────

export interface HeroContent {
  title: string
  subtitle?: string
  cta_text?: string
  cta_href?: string
  background_type?: 'image' | 'video' | 'color'
  background_src?: string
}

export interface TextContent {
  title?: string
  body: string
  alignment?: 'left' | 'center' | 'right'
  background?: 'canvas' | 'white' | 'ink'
}

export interface CardItem {
  icon?: string
  title: string
  description: string
  href?: string
}

export interface CardsContent {
  title?: string
  subtitle?: string
  cards: CardItem[]
  columns?: 2 | 3 | 4
}

export interface FerramentasContent {
  capitulo?: number
  title?: string
}

export interface FormContent {
  form_id: string
  title?: string
  subtitle?: string
  success_message?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQContent {
  title?: string
  items: FAQItem[]
}

export interface CTAContent {
  title: string
  subtitle?: string
  cta_text: string
  cta_href: string
  background?: 'blue' | 'gold' | 'ink'
}

export interface DepoimentosContent {
  title?: string
  layout?: 'grid' | 'carousel'
}

export interface CapitulosContent {
  title?: string
  show_count?: boolean
}

export interface AutoresContent {
  show_bio?: boolean
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
