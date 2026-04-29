'use client'

import { useState } from 'react'
import type { PageSection } from '@/types/cms'
import type { SectionStyle } from '@/types/section-style'
import { TYPE_LABELS, TYPE_ICONS } from '@/lib/cms/section-templates'
import { SectionContentEditor } from '@/components/admin/editors/SectionContentEditor'
import { SectionStyleEditor } from '@/components/admin/style/SectionStyleEditor'

interface RightPanelProps {
  section: PageSection
  onChange: (updated: PageSection) => void
  onClose: () => void
}

// ─── Style badges strip ────────────────────────────────────────────────────

function StyleBadges({
  style,
  onReset,
}: {
  style: SectionStyle
  onReset: () => void
}) {
  const badges: string[] = []
  if (style.gradient) badges.push('🌈 Gradiente')
  else if (style.bgColor) badges.push('🎨 Cor')
  if (style.fontPair) badges.push(`Aa ${style.fontPair.split(' + ')[0]}`)
  if (style.shadow && style.shadow !== 'none') badges.push('Sombra')
  if (style.blur) badges.push('Glass')
  if (style.animation) badges.push('✨ Animação')

  if (badges.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 flex-wrap px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]/50">
      {badges.map((b) => (
        <span
          key={b}
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]"
        >
          {b}
        </span>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="ml-auto text-[10px] text-red-400 hover:text-red-600 font-medium"
      >
        Resetar
      </button>
    </div>
  )
}

// ─── RightPanel ────────────────────────────────────────────────────────────

export function RightPanel({ section, onChange, onClose }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'conteudo' | 'estilo'>('conteudo')

  const handleContentChange = (updatedContent: typeof section.content) => {
    onChange({ ...section, content: updatedContent })
  }

  const handleStyleChange = (updatedStyle: SectionStyle) => {
    onChange({ ...section, style: updatedStyle })
  }

  const resetStyle = () => {
    onChange({ ...section, style: {} })
  }

  const currentStyle = section.style ?? {}

  return (
    <aside className="flex flex-col shrink-0 w-85 overflow-hidden border-l border-[var(--color-border)] bg-white">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2.5 px-4 py-3 border-b border-[var(--color-border)]">
        <span className="text-xl" aria-hidden="true">
          {TYPE_ICONS[section.type]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[var(--color-text-title)] truncate">
            {TYPE_LABELS[section.type]}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono truncate">
            {section.id.slice(0, 8)}…
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar painel"
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-canvas)] hover:text-[var(--color-text-body)] transition-colors shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-[var(--color-border)]">
        {(['conteudo', 'estilo'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-[var(--color-brand-blue)] border-[var(--color-brand-blue)]'
                : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-body)]'
            }`}
          >
            {tab === 'conteudo' ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Conteúdo
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
                </svg>
                Estilo
              </>
            )}
          </button>
        ))}
      </div>

      {/* Style badges (apenas na aba Estilo, quando há estilos definidos) */}
      {activeTab === 'estilo' && Object.keys(currentStyle).length > 0 && (
        <StyleBadges style={currentStyle} onReset={resetStyle} />
      )}

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'conteudo' ? (
          <SectionContentEditor
            section={section}
            onChange={handleContentChange}
          />
        ) : (
          <SectionStyleEditor
            style={currentStyle}
            onChange={handleStyleChange}
          />
        )}
      </div>
    </aside>
  )
}
