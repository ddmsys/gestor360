// src/lib/cms/build-section-style.ts
// Helper que converte SectionStyle → React.CSSProperties
// Usado pelo SectionRenderer para aplicar estilos no render do site
// Gerado em Abril 2026 — DDM Editora

import type { CSSProperties } from 'react'
import type { SectionStyle } from '@/types/section-style'
import { FONT_PAIRS, TITLE_SCALE_MAP, MAX_WIDTH_MAP } from '@/types/section-style'

/**
 * Converte um SectionStyle em CSSProperties aplicável num wrapper <div>.
 *
 * Uso no SectionRenderer:
 * ```tsx
 * const wrapperStyle = buildSectionStyle(section.style)
 * return <div style={wrapperStyle}>{...}</div>
 * ```
 *
 * Os tokens CSS injetados (--section-*) permitem que componentes
 * filhos sobrescrevam seus estilos internos sem prop drilling.
 */
export function buildSectionStyle(style: SectionStyle = {}): CSSProperties {
  const fontPairDef = style.fontPair
    ? FONT_PAIRS.find(f => f.label === style.fontPair)
    : undefined

  return {
    // ── Fundo ──────────────────────────────────────────────────────────────
    background: style.gradient
      ? style.gradient
      : style.bgColor
        ? hexWithOpacity(style.bgColor, style.bgOpacity ?? 100)
        : undefined,

    // ── Espaçamento ────────────────────────────────────────────────────────
    paddingTop:    style.paddingY ?? undefined,
    paddingBottom: style.paddingY ?? undefined,
    paddingLeft:   style.paddingX != null ? `${style.paddingX}px` : undefined,
    paddingRight:  style.paddingX != null ? `${style.paddingX}px` : undefined,

    // ── Bordas ─────────────────────────────────────────────────────────────
    borderRadius: style.borderRadius ?? undefined,
    border: style.border
      ? `1.5px solid ${style.borderColor ?? '#D8D5CF'}`
      : undefined,

    // ── Sombra ─────────────────────────────────────────────────────────────
    boxShadow: style.shadow && style.shadow !== 'none'
      ? style.shadow
      : undefined,

    // ── Efeitos ────────────────────────────────────────────────────────────
    backdropFilter: style.blur
      ? `blur(${style.blurAmount ?? 8}px)`
      : undefined,

    // ── CSS Custom Properties (tokens de seção) ────────────────────────────
    // Componentes filhos podem consumir via var(--section-title-color), etc.
    ...({
      '--section-bg-color':       style.gradient
        ? style.gradient
        : style.bgColor
          ? hexWithOpacity(style.bgColor, style.bgOpacity ?? 100)
          : undefined,
      '--section-title-color':    style.titleColor   ?? undefined,
      '--section-text-color':     style.textColor    ?? undefined,
      '--section-font-display':   fontPairDef?.display ?? undefined,
      '--section-font-body':      fontPairDef?.body    ?? undefined,
      '--section-title-size':     style.titleScale
        ? TITLE_SCALE_MAP[style.titleScale]
        : undefined,
      '--section-title-weight':   style.titleWeight  ?? undefined,
      '--section-letter-spacing': style.letterSpacing != null
        ? `${style.letterSpacing}px`
        : undefined,
      '--section-title-transform': style.titleTransform && style.titleTransform !== 'none'
        ? style.titleTransform
        : undefined,
      '--section-max-width':      style.maxWidth
        ? MAX_WIDTH_MAP[style.maxWidth]
        : undefined,
    } as Record<string, string | undefined>),

  } as CSSProperties
}

/**
 * Constrói o estilo do overlay escuro sobre imagem de fundo.
 * Usar em seções com bg_image (HeroSection, CTASection).
 */
export function buildOverlayStyle(overlayOpacity?: number): CSSProperties {
  if (!overlayOpacity || overlayOpacity === 0) return {}
  return {
    position: 'absolute',
    inset: 0,
    background: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
    zIndex: 1,
    pointerEvents: 'none',
  }
}

/**
 * Converte hex + opacidade (0–100) em string rgba.
 */
function hexWithOpacity(hex: string, opacity: number): string {
  if (opacity === 100) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

/**
 * Verifica se um SectionStyle tem algum valor definido.
 * Útil para evitar renderizar wrapper desnecessário.
 */
export function hasStyle(style?: SectionStyle): boolean {
  if (!style) return false
  return Object.values(style).some(v => v !== undefined && v !== '' && v !== false)
}
