'use client'

import type { SectionStyle, SpacingPreset, MaxWidth, DividerType } from '@/types/section-style'
import {
  StyleSection, StyleRow,
  StyleSlider, StyleSegment, ClearButton,
} from './style-primitives'

const PADDING_Y_OPTIONS: { value: SpacingPreset; label: string }[] = [
  { value: '32px',  label: 'XS'  },
  { value: '48px',  label: 'SM'  },
  { value: '64px',  label: 'MD'  },
  { value: '96px',  label: 'LG'  },
  { value: '128px', label: 'XL'  },
]

const MAX_WIDTH_OPTIONS: { value: MaxWidth; label: string }[] = [
  { value: 'sm',   label: '640'  },
  { value: 'md',   label: '768'  },
  { value: 'lg',   label: '1024' },
  { value: 'xl',   label: '1200' },
  { value: 'full', label: '100%' },
]

const DIVIDER_OPTIONS: { value: DividerType; label: string }[] = [
  { value: 'none',     label: 'Nenhum'   },
  { value: 'line',     label: 'Linha'    },
  { value: 'wave',     label: 'Onda'     },
  { value: 'diagonal', label: 'Diagonal' },
]

const BORDER_RADIUS_PRESETS: { label: string; value: string }[] = [
  { label: 'Nenhum',  value: '0px'   },
  { label: 'SM',      value: '8px'   },
  { label: 'MD',      value: '16px'  },
  { label: 'LG',      value: '24px'  },
  { label: 'Pill',    value: '999px' },
]

interface Props {
  style: SectionStyle
  onChange: (partial: Partial<SectionStyle>) => void
}

export function StyleSpacingTab({ style, onChange }: Props) {
  return (
    <>
      {/* ── Padding vertical ── */}
      <StyleSection title="Padding vertical">
        <StyleSegment
          options={PADDING_Y_OPTIONS}
          value={style.paddingY}
          onChange={(v) => onChange({ paddingY: v })}
        />
        <StyleRow label="Preset selecionado">
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
            {style.paddingY ?? 'padrão do componente'}
          </span>
          {style.paddingY && <ClearButton onClick={() => onChange({ paddingY: undefined })} />}
        </StyleRow>
      </StyleSection>

      {/* ── Padding horizontal ── */}
      <StyleSection title="Padding horizontal">
        <StyleSlider
          value={style.paddingX ?? 24}
          min={0}
          max={120}
          step={8}
          unit="px"
          onChange={(v) => onChange({ paddingX: v !== 24 ? v : undefined })}
        />
      </StyleSection>

      {/* ── Largura máxima ── */}
      <StyleSection title="Largura máxima do conteúdo">
        <StyleSegment
          options={MAX_WIDTH_OPTIONS}
          value={style.maxWidth}
          onChange={(v) => onChange({ maxWidth: v })}
        />
        {style.maxWidth && <ClearButton onClick={() => onChange({ maxWidth: undefined })} />}
      </StyleSection>

      {/* ── Border-radius ── */}
      <StyleSection title="Arredondamento de bordas">
        <div className="flex flex-wrap gap-1.5">
          {BORDER_RADIUS_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange({ borderRadius: style.borderRadius === p.value ? undefined : p.value })}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-[var(--radius-sm)] border-2 transition-all ${
                style.borderRadius === p.value
                  ? 'border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-blue)]/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <StyleRow label="Valor CSS">
          <input
            type="text"
            value={style.borderRadius ?? ''}
            placeholder="ex: 12px"
            onChange={(e) => onChange({ borderRadius: e.target.value || undefined })}
            className="w-24 px-2 py-1 text-[10px] font-mono rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-brand-blue)]"
          />
          {style.borderRadius && <ClearButton onClick={() => onChange({ borderRadius: undefined })} />}
        </StyleRow>
      </StyleSection>

      {/* ── Divisor ── */}
      <StyleSection title="Divisor após a seção">
        <StyleSegment
          options={DIVIDER_OPTIONS}
          value={style.divider ?? 'none'}
          onChange={(v) => onChange({ divider: v !== 'none' ? v : undefined })}
        />
      </StyleSection>
    </>
  )
}
