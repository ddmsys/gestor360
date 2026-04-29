'use client'

import type { SectionStyle } from '@/types/section-style'
import {
  StyleSection, StyleRow,
  StyleToggle, StyleSlider, ColorSwatch, HexInput, ClearButton,
} from './style-primitives'

const SHADOW_PRESETS: { label: string; value: string }[] = [
  { label: 'Nenhuma',  value: 'none' },
  { label: 'Sutil',    value: '0 2px 8px rgba(0,0,0,0.08)' },
  { label: 'Média',    value: '0 4px 20px rgba(0,0,0,0.12)' },
  { label: 'Forte',    value: '0 8px 40px rgba(0,0,0,0.2)' },
  { label: 'Azul',     value: '0 4px 20px rgba(31,63,122,0.25)' },
  { label: 'Dourado',  value: '0 4px 20px rgba(212,160,32,0.3)' },
]

const BORDER_COLOR_PRESETS = [
  { color: '#D8D5CF', label: 'Borda padrão' },
  { color: '#1F3F7A', label: 'Azul'         },
  { color: '#D4A020', label: 'Dourado'       },
  { color: '#ffffff', label: 'Branco'        },
  { color: '#1A1A1A', label: 'Tinta'         },
]

interface Props {
  style: SectionStyle
  onChange: (partial: Partial<SectionStyle>) => void
}

export function StyleEffectsTab({ style, onChange }: Props) {
  return (
    <>
      {/* ── Sombra ── */}
      <StyleSection title="Sombra">
        <div className="flex flex-col gap-1.5">
          {SHADOW_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange({ shadow: style.shadow === p.value ? undefined : p.value })}
              className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] border-2 text-xs text-left transition-all ${
                style.shadow === p.value
                  ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 text-[var(--color-brand-blue)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-blue)]/40'
              }`}
            >
              <span className="font-semibold">{p.label}</span>
              {p.value !== 'none' && (
                <div
                  className="w-8 h-4 rounded bg-white"
                  style={{ boxShadow: p.value }}
                />
              )}
            </button>
          ))}
        </div>
      </StyleSection>

      {/* ── Glassmorphism ── */}
      <StyleSection title="Glassmorphism">
        <StyleRow label="Ativar efeito vidro">
          <StyleToggle
            value={style.blur ?? false}
            onChange={(v) => onChange({ blur: v, blurAmount: v ? 8 : undefined })}
          />
        </StyleRow>
        {style.blur && (
          <>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              Intensidade do blur
            </p>
            <StyleSlider
              value={style.blurAmount ?? 8}
              min={2}
              max={32}
              step={2}
              unit="px"
              onChange={(v) => onChange({ blurAmount: v })}
            />
          </>
        )}
      </StyleSection>

      {/* ── Borda ── */}
      <StyleSection title="Borda da seção">
        <StyleRow label="Ativar borda">
          <StyleToggle
            value={style.border ?? false}
            onChange={(v) => onChange({ border: v, borderColor: v ? '#D8D5CF' : undefined })}
          />
        </StyleRow>
        {style.border && (
          <>
            <div className="flex flex-wrap gap-1.5 my-1">
              {BORDER_COLOR_PRESETS.map(({ color, label }) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  title={label}
                  selected={style.borderColor === color}
                  onClick={() => onChange({ borderColor: color })}
                />
              ))}
            </div>
            <StyleRow label="Hex">
              <HexInput
                value={style.borderColor}
                onChange={(v) => onChange({ borderColor: v || undefined })}
              />
              {style.borderColor && (
                <ClearButton onClick={() => onChange({ borderColor: undefined })} />
              )}
            </StyleRow>
          </>
        )}
      </StyleSection>

      {/* ── Overlay ── */}
      <StyleSection title="Overlay escuro (sobre imagem)">
        <StyleSlider
          value={style.overlayOpacity ?? 0}
          min={0}
          max={80}
          step={5}
          unit="%"
          onChange={(v) => onChange({ overlayOpacity: v !== 0 ? v : undefined })}
        />
        <p className="text-[9px] text-[var(--color-text-muted)]">
          Útil quando a seção tem imagem de fundo definida no conteúdo.
        </p>
      </StyleSection>

      {/* ── Animação ── */}
      <StyleSection title="Animação de entrada">
        <StyleRow label="Fade + slide ao entrar na tela">
          <StyleToggle
            value={style.animation ?? false}
            onChange={(v) => onChange({ animation: v || undefined })}
          />
        </StyleRow>
        <p className="text-[9px] text-[var(--color-text-muted)]">
          Aplica `fade-in-up` ao seção entrar no viewport (Framer Motion).
        </p>
      </StyleSection>
    </>
  )
}
