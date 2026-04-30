'use client'

import type { CSSProperties } from 'react'
import type { PageSection } from '@/types/cms'
import type { SectionStyle } from '@/types/section-style'
import { FONT_PAIRS, TITLE_SCALE_MAP } from '@/types/section-style'

interface SectionStylePreviewProps {
  section: PageSection
  style: SectionStyle
}

const DEFAULT_BG = '#F4F2ED'
const DEFAULT_TITLE = '#1A1A1A'
const DEFAULT_TEXT = '#5A5A5A'

export function SectionStylePreview({ section, style }: SectionStylePreviewProps) {
  const content = section.content as Record<string, unknown>
  const title = textValue(content.title) ?? fallbackTitle(section.type)
  const subtitle = textValue(content.subtitle) ?? textValue(content.body)
  const fontPair = style.fontPair
    ? FONT_PAIRS.find((pair) => pair.label === style.fontPair)
    : undefined
  const darkBackground = isDarkBackground(style)
  const titleColor = style.titleColor ?? (darkBackground ? '#FFFFFF' : DEFAULT_TITLE)
  const textColor = style.textColor ?? (darkBackground ? 'rgba(255,255,255,0.72)' : DEFAULT_TEXT)

  const previewStyle: CSSProperties = {
    background: getBackground(style),
    borderRadius: style.borderRadius ?? '10px',
    border: style.border
      ? `1.5px solid ${style.borderColor ?? '#D8D5CF'}`
      : '1px solid rgba(26, 26, 26, 0.08)',
    boxShadow: style.shadow && style.shadow !== 'none' ? style.shadow : 'none',
    backdropFilter: style.blur ? `blur(${style.blurAmount ?? 8}px)` : undefined,
  }

  const titleStyle: CSSProperties = {
    color: titleColor,
    fontFamily: fontPair?.display,
    fontSize: style.titleScale ? TITLE_SCALE_MAP[style.titleScale] : '1rem',
    fontWeight: style.titleWeight ?? 700,
    letterSpacing: style.letterSpacing != null ? `${style.letterSpacing}px` : undefined,
    textTransform: style.titleTransform && style.titleTransform !== 'none'
      ? style.titleTransform
      : undefined,
  }

  return (
    <div className="shrink-0 border-t border-[var(--color-border)] bg-white px-4 py-3">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        Prévia de estilo
      </div>
      <div
        className="min-h-18 overflow-hidden px-4 py-3 transition-all duration-300"
        style={previewStyle}
      >
        <div
          className="line-clamp-2 leading-tight"
          style={titleStyle}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className="mt-1 line-clamp-2 text-[11px] leading-relaxed"
            style={{ color: textColor, fontFamily: fontPair?.body }}
          >
            {truncate(subtitle, 95)}
          </div>
        )}
      </div>
    </div>
  )
}

function textValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value
}

function getBackground(style: SectionStyle): string {
  if (style.gradient) return style.gradient
  if (!style.bgColor) return DEFAULT_BG
  if (!style.bgOpacity || style.bgOpacity >= 100) return style.bgColor

  return hexWithOpacity(style.bgColor, style.bgOpacity)
}

function hexWithOpacity(hex: string, opacity: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

function isDarkBackground(style: SectionStyle): boolean {
  const bg = style.gradient ?? style.bgColor
  if (!bg) return false

  return ['#1A1A1A', '#1F3F7A', '#000000'].some((color) =>
    bg.toLowerCase().includes(color.toLowerCase())
  )
}

function fallbackTitle(type: PageSection['type']): string {
  const labels: Record<PageSection['type'], string> = {
    hero: 'Título principal',
    text: 'Bloco de texto',
    cards: 'Cards da seção',
    ferramentas: 'Ferramentas do capítulo',
    form: 'Formulário de captura',
    faq: 'Perguntas frequentes',
    cta: 'Chamada para ação',
    depoimentos: 'Depoimentos',
    capitulos: 'Capítulos do método',
    autores: 'Autores',
  }

  return labels[type]
}
