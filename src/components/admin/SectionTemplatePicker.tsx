'use client'

import { useState, useEffect } from 'react'
import type { SectionType, SectionContent } from '@/types/cms'
import { SECTION_TYPES } from '@/lib/cms/section-templates'

interface SectionTemplatePickerProps {
  onSelect: (type: SectionType, template: Partial<SectionContent>) => void
  onClose: () => void
}

export function SectionTemplatePicker({ onSelect, onClose }: SectionTemplatePickerProps) {
  const [activeType, setActiveType] = useState<SectionType>(SECTION_TYPES[0].type)

  // Fechar com ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const activeTypeDef = SECTION_TYPES.find((t) => t.type === activeType)!

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar seção"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] flex flex-col overflow-hidden z-10 w-full"
        style={{ maxWidth: 720, maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] shrink-0">
          <div>
            <h2 className="font-display font-bold text-base text-[var(--color-text-title)]">
              Adicionar seção
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Escolha o tipo e depois o template
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-canvas)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corpo: sidebar de tipos + área de variants */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Sidebar de tipos */}
          <nav
            className="shrink-0 overflow-y-auto border-r border-[var(--color-border)] py-2"
            style={{ width: 180 }}
            aria-label="Tipos de seção"
          >
            {SECTION_TYPES.map((typeDef) => (
              <button
                key={typeDef.type}
                onClick={() => setActiveType(typeDef.type)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left ${
                  activeType === typeDef.type
                    ? 'bg-[var(--color-brand-blue)]/8 text-[var(--color-brand-blue)] font-semibold border-r-2 border-[var(--color-brand-blue)]'
                    : 'text-[var(--color-text-body)] hover:bg-[var(--color-bg-canvas)]'
                }`}
              >
                <span className="text-base" aria-hidden="true">
                  {typeDef.icon}
                </span>
                <span className="truncate">{typeDef.label}</span>
              </button>
            ))}
          </nav>

          {/* Área de variants */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              {activeTypeDef.desc}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {activeTypeDef.variants.map((variant) => (
                <TemplateCard
                  key={variant.label}
                  type={activeTypeDef.type}
                  variant={variant}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TemplateCard ─────────────────────────────────────────────────────────

function TemplateCard({
  type,
  variant,
  onSelect,
}: {
  type: SectionType
  variant: { label: string; content: Partial<SectionContent> }
  onSelect: (type: SectionType, template: Partial<SectionContent>) => void
}) {
  const c = variant.content as Record<string, unknown>
  const bg = typeof c.bg === 'string' ? c.bg : null
  const variantVal = typeof c.variant === 'string' ? c.variant : null
  const background = typeof c.background === 'string' ? c.background : null
  const val = bg ?? variantVal ?? background

  let cardBg = '#F4F2ED'
  let cardColor = '#1A1A1A'
  switch (val) {
    case 'dark':
    case 'ink':
      cardBg = '#1A1A1A'; cardColor = '#fff'; break
    case 'blue':
      cardBg = '#1F3F7A'; cardColor = '#fff'; break
    case 'gold':
      cardBg = '#D4A020'; cardColor = '#1A1A1A'; break
    case 'white':
      cardBg = '#FFFFFF'; break
    case 'canvas':
      cardBg = '#E8E6E1'; break
  }

  const title = typeof c.title === 'string' ? c.title : null

  return (
    <button
      onClick={() => onSelect(type, variant.content)}
      className="text-left rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-brand-blue)] hover:ring-2 hover:ring-[var(--color-brand-blue)]/20 transition-all group"
    >
      {/* Preview visual */}
      <div
        className="h-24 flex flex-col justify-end p-3 relative"
        style={{ background: cardBg, color: cardColor }}
      >
        {title && (
          <p className="text-[11px] font-bold leading-tight truncate" style={{ maxWidth: '90%' }}>
            {title}
          </p>
        )}
      </div>
      {/* Label */}
      <div className="px-3 py-2 bg-white border-t border-[var(--color-border)]">
        <p className="text-[11px] font-semibold text-[var(--color-text-body)] truncate group-hover:text-[var(--color-brand-blue)]">
          {variant.label}
        </p>
      </div>
    </button>
  )
}
