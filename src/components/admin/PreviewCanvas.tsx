'use client'

import { useState } from 'react'
import type { PageSection } from '@/types/cms'
import { TYPE_LABELS, TYPE_ICONS } from '@/lib/cms/section-templates'
import { SectionRendererPreview } from '@/components/sections/SectionRendererPreview'

// ─── SectionPreview (miniatura — modo compacto) ───────────────────────────

function SectionPreview({ section }: { section: PageSection }) {
  const c = section.content as Record<string, unknown>
  const st = section.style ?? {}

  const bgStyle: React.CSSProperties = st.gradient
    ? { background: st.gradient }
    : st.bgColor
      ? { background: st.bgColor }
      : getBgFromContent(section)

  const title = typeof c.title === 'string' ? c.title : null
  const subtitle = typeof c.subtitle === 'string' ? c.subtitle : null

  let detail: React.ReactNode = null
  switch (section.type) {
    case 'cards':
      detail = (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/10">
          {Array.isArray(c.cards) ? c.cards.length : 0} cards
        </span>
      )
      break
    case 'faq':
      detail = (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/10">
          {Array.isArray(c.items) ? c.items.length : 0} perguntas
        </span>
      )
      break
    case 'form':
      detail = (
        <div className="flex flex-wrap gap-1 mt-1">
          {(Array.isArray(c.fields) ? c.fields : []).slice(0, 3).map((f: Record<string, unknown>, i: number) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[9px] bg-black/10 font-medium"
            >
              {String(f.label ?? '')}
            </span>
          ))}
        </div>
      )
      break
  }

  return (
    <div
      className="relative rounded-[var(--radius-md)] overflow-hidden min-h-[80px] flex flex-col justify-between p-3"
      style={bgStyle}
    >
      <span
        className="absolute inset-0 flex items-center justify-center text-5xl select-none pointer-events-none opacity-[0.06]"
        aria-hidden="true"
      >
        {TYPE_ICONS[section.type]}
      </span>

      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
            {TYPE_LABELS[section.type]}
          </span>
        </div>
        {title && (
          <p className="text-xs font-bold leading-tight truncate max-w-[90%]">
            {title}
          </p>
        )}
        {subtitle && (
          <p className="text-[10px] opacity-60 truncate mt-0.5 max-w-[90%]">
            {subtitle}
          </p>
        )}
        {detail}
      </div>
    </div>
  )
}

function getBgFromContent(section: PageSection): React.CSSProperties {
  const c = section.content as Record<string, unknown>
  const bg = typeof c.bg === 'string' ? c.bg : null
  const variant = typeof c.variant === 'string' ? c.variant : null
  const background = typeof c.background === 'string' ? c.background : null

  const val = bg ?? variant ?? background
  switch (val) {
    case 'dark':
    case 'ink':
      return { background: '#1A1A1A', color: '#fff' }
    case 'blue':
      return { background: '#1F3F7A', color: '#fff' }
    case 'gold':
      return { background: '#D4A020', color: '#1A1A1A' }
    case 'canvas':
      return { background: '#E8E6E1', color: '#1A1A1A' }
    default:
      return { background: '#ffffff', color: '#1A1A1A' }
  }
}

// ─── PreviewCanvas ─────────────────────────────────────────────────────────

interface PreviewCanvasProps {
  sections: PageSection[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
}

export function PreviewCanvas({ sections, selectedId, onSelect, onAdd }: PreviewCanvasProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [mode, setMode] = useState<'live' | 'compact'>('live')

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F2ED] min-w-0">
      {/* Toolbar do canvas */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-white/60">
        {/* Toggle Live / Compacto */}
        <div className="flex items-center gap-1 p-0.5 rounded-[var(--radius-md)] bg-[var(--color-bg-canvas)] border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setMode('live')}
            aria-label="Preview ao vivo"
            title="Componentes reais"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-semibold transition-all ${
              mode === 'live'
                ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="2" /><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
            </svg>
            Ao vivo
          </button>
          <button
            type="button"
            onClick={() => setMode('compact')}
            aria-label="Vista compacta"
            title="Miniaturas"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-semibold transition-all ${
              mode === 'compact'
                ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Compacto
          </button>
        </div>

        {/* Toggle Desktop / Mobile */}
        <div className="flex items-center gap-1 p-0.5 rounded-[var(--radius-md)] bg-[var(--color-bg-canvas)] border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            aria-label="Visão desktop"
            title="Desktop"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-semibold transition-all ${
              viewport === 'desktop'
                ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            aria-label="Visão mobile"
            title="Mobile (390px)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-semibold transition-all ${
              viewport === 'mobile'
                ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
            }`}
          >
            <svg width="11" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            Mobile
          </button>
        </div>
      </div>

      {/* Área de scroll */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col items-center">
        <div
          className={`w-full transition-all duration-300 ${viewport === 'mobile' ? 'max-w-97.5' : 'max-w-full'}`}
        >
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--color-border)] flex items-center justify-center text-3xl shadow-[var(--shadow-sm)]">
                📄
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[var(--color-text-body)]">
                  Página vazia
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Adicione seções para montar a página
                </p>
              </div>
              <button
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-brand-blue)] rounded-[var(--radius-md)] hover:opacity-90 transition-opacity shadow-[var(--shadow-blue)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Adicionar primeira seção
              </button>
            </div>
          ) : mode === 'live' ? (
            /* ── Modo ao vivo: componentes reais ── */
            <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)] border border-[var(--color-border)]">
              {sections.map((section) => {
                const isSelected = section.id === selectedId
                return (
                  <div
                    key={section.id}
                    onClick={() => onSelect(section.id)}
                    className={`relative cursor-pointer transition-all group ${
                      isSelected ? 'ring-2 ring-inset ring-(--color-brand-blue)' : 'hover:ring-1 hover:ring-inset hover:ring-(--color-brand-blue)/40'
                    } ${!section.visible ? 'opacity-40' : ''}`}
                  >
                    {/* Badge selecionado */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 z-20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[var(--color-brand-blue)] text-white rounded shadow">
                        {TYPE_LABELS[section.type]}
                      </div>
                    )}
                    {/* Badge oculta */}
                    {!section.visible && (
                      <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[var(--color-text-muted)] text-white rounded">
                        Oculta
                      </div>
                    )}
                    {/* Overlay de clique */}
                    <div className={`absolute inset-0 z-10 transition-colors ${isSelected ? 'bg-transparent' : 'hover:bg-[var(--color-brand-blue)]/5'}`} />
                    <SectionRendererPreview section={section} />
                  </div>
                )
              })}
            </div>
          ) : (
            /* ── Modo compacto: miniaturas ── */
            <div className="space-y-2">
              {sections.map((section) => {
                const isSelected = section.id === selectedId
                return (
                  <div
                    key={section.id}
                    onClick={() => onSelect(section.id)}
                    className={`relative rounded-[var(--radius-lg)] cursor-pointer transition-all group ${
                      isSelected
                        ? 'ring-2 ring-[var(--color-brand-blue)] ring-offset-2'
                        : 'hover:ring-1 hover:ring-[var(--color-brand-blue)]/40 hover:ring-offset-1'
                    } ${!section.visible ? 'opacity-40' : ''}`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--color-brand-blue)] rounded-t-[var(--radius-lg)] z-10" />
                    )}
                    {!section.visible && (
                      <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[var(--color-text-muted)] text-white rounded">
                        Oculta
                      </div>
                    )}
                    <SectionPreview section={section} />
                  </div>
                )
              })}

              <button
                onClick={onAdd}
                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-[var(--color-brand-blue)] border border-dashed border-[var(--color-brand-blue)]/30 rounded-[var(--radius-md)] hover:bg-[var(--color-brand-blue)]/5 transition-colors mt-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Adicionar seção
              </button>
            </div>
          )}

          {/* Botão adicionar no modo live */}
          {mode === 'live' && sections.length > 0 && (
            <button
              type="button"
              onClick={onAdd}
              className="w-full flex items-center justify-center gap-2 py-3 mt-3 text-xs font-semibold text-[var(--color-brand-blue)] border border-dashed border-[var(--color-brand-blue)]/30 rounded-[var(--radius-md)] hover:bg-[var(--color-brand-blue)]/5 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Adicionar seção
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
