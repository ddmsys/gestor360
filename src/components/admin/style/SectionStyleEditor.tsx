'use client'

import { useState } from 'react'
import type { SectionStyle } from '@/types/section-style'
import { StyleBackgroundTab } from './StyleBackgroundTab'
import { StyleTypographyTab } from './StyleTypographyTab'
import { StyleSpacingTab } from './StyleSpacingTab'
import { StyleEffectsTab } from './StyleEffectsTab'

interface SectionStyleEditorProps {
  style: SectionStyle
  onChange: (s: SectionStyle) => void
}

type StyleTab = 'fundo' | 'tipografia' | 'espacamento' | 'efeitos'

const TABS: { id: StyleTab; label: string; icon: string }[] = [
  { id: 'fundo',       label: 'Fundo',       icon: '🎨' },
  { id: 'tipografia',  label: 'Tipografia',  icon: 'Aa' },
  { id: 'espacamento', label: 'Espaçamento', icon: '⬛' },
  { id: 'efeitos',     label: 'Efeitos',     icon: '✨' },
]

export function SectionStyleEditor({ style, onChange }: SectionStyleEditorProps) {
  const [activeTab, setActiveTab] = useState<StyleTab>('fundo')

  const patch = (partial: Partial<SectionStyle>) => {
    onChange({ ...style, ...partial })
  }

  return (
    <div className="flex flex-col">
      {/* Sub-tabs */}
      <div className="grid grid-cols-4 border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]/40">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-[var(--color-brand-blue)] border-[var(--color-brand-blue)] bg-white'
                : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-body)]'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da sub-aba */}
      <div className="flex flex-col gap-0">
        {activeTab === 'fundo'       && <StyleBackgroundTab  style={style} onChange={patch} />}
        {activeTab === 'tipografia'  && <StyleTypographyTab  style={style} onChange={patch} />}
        {activeTab === 'espacamento' && <StyleSpacingTab     style={style} onChange={patch} />}
        {activeTab === 'efeitos'     && <StyleEffectsTab     style={style} onChange={patch} />}
      </div>
    </div>
  )
}
