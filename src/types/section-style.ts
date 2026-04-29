// src/types/section-style.ts
// Tipos TypeScript para o sistema de estilo visual por seção
// Gerado em Abril 2026 — DDM Editora

/**
 * Pares de fontes disponíveis no StyleEditor.
 * Chave = label exibido no UI. Valor = CSS font-family strings.
 */
export type FontPairLabel =
  | 'Gotham + DM Sans'
  | 'Playfair + DM Sans'
  | 'Montserrat + Inter'
  | 'Cormorant + DM Sans'
  | 'Space Grotesk + Inter'

/**
 * Escala de tamanho do título da seção.
 * Mapeada para clamp() em build-section-style.ts
 */
export type TitleScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Peso visual do título.
 */
export type TitleWeight = '400' | '500' | '600' | '700' | '900'

/**
 * Largura máxima do container de conteúdo.
 */
export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Divisor visual entre seções.
 */
export type DividerType = 'none' | 'line' | 'wave' | 'diagonal'

/**
 * Presets de padding vertical por nome semântico.
 */
export type SpacingPreset = '32px' | '48px' | '64px' | '96px' | '128px'

/**
 * Estilo visual de uma seção individual.
 * Armazenado em `page_sections.style` (JSONB).
 * Todos os campos são opcionais — ausência = usar padrão do componente.
 */
export interface SectionStyle {
  // ─── FUNDO ───────────────────────────────────────────────────────────────

  /** Cor sólida de fundo. Hex string. Ex: '#1F3F7A' */
  bgColor?: string

  /**
   * Gradiente CSS. Sobrescreve bgColor quando presente.
   * Ex: 'linear-gradient(135deg, #1F3F7A 0%, #1A1A1A 100%)'
   * String vazia = sem gradiente.
   */
  gradient?: string

  /**
   * Opacidade do fundo. 10–100 (inteiro, percentual).
   * Default: 100
   */
  bgOpacity?: number

  // ─── TIPOGRAFIA ───────────────────────────────────────────────────────────

  /** Par de fontes selecionado. Controla --section-font-display e --section-font-body */
  fontPair?: FontPairLabel

  /** Escala do título. Default: 'md' */
  titleScale?: TitleScale

  /** Peso do título. Default: '700' */
  titleWeight?: TitleWeight

  /** Cor do título. Hex string. */
  titleColor?: string

  /** Cor do texto de corpo. Hex string. */
  textColor?: string

  /**
   * Letter-spacing do título em px. Número (pode ser negativo).
   * Ex: -1 = -1px, 2 = 2px. Default: 0
   */
  letterSpacing?: number

  // ─── ESPAÇAMENTO ─────────────────────────────────────────────────────────

  /**
   * Padding top e bottom da seção.
   * Preset semântico em CSS string. Ex: '64px'
   * Default: não aplicado (usa padding do componente)
   */
  paddingY?: SpacingPreset

  /**
   * Padding horizontal em px (número inteiro).
   * Default: 24
   */
  paddingX?: number

  /** Largura máxima do conteúdo interno. Default: 'xl' (1200px) */
  maxWidth?: MaxWidth

  /** Border-radius da seção em CSS. Ex: '16px', '0px'. Default: não aplicado */
  borderRadius?: string

  /** Divisor visual após a seção. Default: 'none' */
  divider?: DividerType

  // ─── EFEITOS ─────────────────────────────────────────────────────────────

  /**
   * Box-shadow CSS completo.
   * Use as strings de SHADOW_PRESETS ou valor customizado.
   * 'none' = sem sombra.
   */
  shadow?: string

  /**
   * Opacidade de overlay escuro sobre imagem de fundo.
   * 0–80 (inteiro, percentual). Default: 0
   */
  overlayOpacity?: number

  /** Ativa glassmorphism (backdrop-filter: blur). Default: false */
  blur?: boolean

  /** Intensidade do blur em px. Usado apenas quando blur=true. Default: 8 */
  blurAmount?: number

  /** Ativa borda na seção. Default: false */
  border?: boolean

  /** Cor da borda. Hex string. Usado apenas quando border=true. */
  borderColor?: string

  /** Ativa animação de entrada (fade+slide ao entrar no viewport). Default: false */
  animation?: boolean
}

/**
 * Mapeamento de TitleScale para valores CSS clamp().
 * Use em build-section-style.ts
 */
export const TITLE_SCALE_MAP: Record<TitleScale, string> = {
  xs: '1rem',           // 16px
  sm: '1.25rem',        // 20px
  md: '1.5rem',         // 24px — default
  lg: 'clamp(1.5rem, 3vw, 2.25rem)',
  xl: 'clamp(2rem, 5vw, 3.5rem)',
}

/**
 * Mapeamento de MaxWidth para valores CSS max-width.
 */
export const MAX_WIDTH_MAP: Record<MaxWidth, string> = {
  sm:   '640px',
  md:   '768px',
  lg:   '1024px',
  xl:   '1200px',   // default do design system
  full: '100%',
}

/**
 * Definição de um par de fontes.
 */
export interface FontPairDefinition {
  label: FontPairLabel
  /** CSS font-family para títulos/display */
  display: string
  /** CSS font-family para corpo/UI */
  body: string
  /** Google Fonts import slug (se necessário) */
  googleFonts?: string
}

export const FONT_PAIRS: FontPairDefinition[] = [
  {
    label: 'Gotham + DM Sans',
    display: 'gotham, sans-serif',
    body: "'DM Sans', sans-serif",
    // Gotham carregado via Adobe Fonts (já no layout.tsx)
  },
  {
    label: 'Playfair + DM Sans',
    display: "'Playfair Display', serif",
    body: "'DM Sans', sans-serif",
    googleFonts: 'Playfair+Display:wght@400;700;900',
  },
  {
    label: 'Montserrat + Inter',
    display: "'Montserrat', sans-serif",
    body: "'Inter', sans-serif",
    googleFonts: 'Montserrat:wght@400;600;700;900&family=Inter:wght@400;500;600',
  },
  {
    label: 'Cormorant + DM Sans',
    display: "'Cormorant Garamond', serif",
    body: "'DM Sans', sans-serif",
    googleFonts: 'Cormorant+Garamond:wght@400;600;700',
  },
  {
    label: 'Space Grotesk + Inter',
    display: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    googleFonts: 'Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600',
  },
]
