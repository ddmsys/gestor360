'use client'

import type { SectionStyle } from '@/types/section-style'
import {
  StyleSection, StyleRow,
  ColorSwatch, HexInput, ClearButton,
  StyleSlider, StyleSegment, WCAGBadge,
} from './style-primitives'

// Paleta Gestor360 + neutros
const BRAND_COLORS: { color: string; label: string }[] = [
  { color: '#1F3F7A', label: 'Azul marca'    },
  { color: '#D4A020', label: 'Dourado marca'  },
  { color: '#1A1A1A', label: 'Tinta'          },
  { color: '#E8E6E1', label: 'Canvas'         },
  { color: '#ffffff', label: 'Branco'         },
  { color: '#F4F2ED', label: 'Off-white'      },
  { color: '#5a5a5a', label: 'Cinza médio'   },
  { color: '#8B8B8B', label: 'Stone'          },
]

// Gradientes prontos
const GRADIENT_PRESETS: { label: string; value: string }[] = [
  { label: 'Azul → Tinta',    value: 'linear-gradient(135deg, #1F3F7A 0%, #1A1A1A 100%)' },
  { label: 'Ouro → Cobre',    value: 'linear-gradient(135deg, #D4A020 0%, #b87c0e 100%)' },
  { label: 'Canvas → Branco', value: 'linear-gradient(180deg, #E8E6E1 0%, #ffffff 100%)' },
  { label: 'Azul claro',      value: 'linear-gradient(135deg, #2a5baf 0%, #1F3F7A 100%)' },
  { label: 'Escuro Premium',  value: 'linear-gradient(135deg, #1A1A1A 0%, #2d2d2d 100%)' },
  { label: 'Azul + Ouro',     value: 'linear-gradient(135deg, #1F3F7A 0%, #D4A020 100%)' },
]

interface Props {
  style: SectionStyle
  onChange: (partial: Partial<SectionStyle>) => void
}

export function StyleBackgroundTab({ style, onChange }: Props) {
  const hasGradient = !!style.gradient
  const hasBgColor  = !!style.bgColor && !hasGradient

  return (
    <>
      {/* ── Cor sólida ── */}
      <StyleSection title="Cor de fundo">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {BRAND_COLORS.map(({ color, label }) => (
            <ColorSwatch
              key={color}
              color={color}
              title={label}
              selected={style.bgColor === color && !hasGradient}
              onClick={() => onChange({ bgColor: color, gradient: undefined })}
            />
          ))}
        </div>
        <StyleRow label="Hex personalizado">
          <HexInput
            value={hasBgColor ? style.bgColor : undefined}
            placeholder="#RRGGBB"
            onChange={(v) => onChange({ bgColor: v, gradient: undefined })}
          />
          {style.bgColor && <ClearButton onClick={() => onChange({ bgColor: undefined })} />}
        </StyleRow>
        {style.bgColor && style.textColor && (
          <WCAGBadge fg={style.textColor} bg={style.bgColor} />
        )}
      </StyleSection>

      {/* ── Opacidade ── */}
      {style.bgColor && (
        <StyleSection title="Opacidade do fundo">
          <StyleSlider
            value={style.bgOpacity ?? 100}
            min={10}
            max={100}
            step={5}
            unit="%"
            onChange={(v) => onChange({ bgOpacity: v })}
          />
        </StyleSection>
      )}

      {/* ── Gradiente ── */}
      <StyleSection title="Gradiente">
        <div className="grid grid-cols-2 gap-1.5">
          {GRADIENT_PRESETS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => onChange({ gradient: g.value, bgColor: undefined })}
              className={`relative h-9 rounded-[var(--radius-sm)] border-2 text-[9px] font-semibold text-white overflow-hidden transition-all ${
                style.gradient === g.value
                  ? 'border-[var(--color-brand-blue)] scale-[1.02]'
                  : 'border-transparent hover:border-[var(--color-border)]'
              }`}
              style={{ background: g.value }}
            >
              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                {g.label}
              </span>
            </button>
          ))}
        </div>

        <StyleRow label="CSS personalizado">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={style.gradient ?? ''}
              placeholder="linear-gradient(…)"
              onChange={(e) => onChange({ gradient: e.target.value || undefined, bgColor: undefined })}
              className="w-full px-2 py-1 text-[10px] font-mono rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-brand-blue)]"
            />
          </div>
          {style.gradient && <ClearButton onClick={() => onChange({ gradient: undefined })} />}
        </StyleRow>
      </StyleSection>

      {/* ── Cor do texto ── */}
      <StyleSection title="Cor do texto (global)">
        <StyleRow label="Sobre o fundo">
          <StyleSegment
            options={[
              { value: '#1A1A1A', label: 'Escuro' },
              { value: '#ffffff', label: 'Claro'  },
            ]}
            value={style.textColor as '#1A1A1A' | '#ffffff' | undefined}
            onChange={(v) => onChange({ textColor: v })}
          />
        </StyleRow>
        <StyleRow label="Hex personalizado">
          <HexInput
            value={style.textColor}
            onChange={(v) => onChange({ textColor: v || undefined })}
          />
          {style.textColor && <ClearButton onClick={() => onChange({ textColor: undefined })} />}
        </StyleRow>
        {style.textColor && (style.bgColor || style.gradient) && (
          <WCAGBadge
            fg={style.textColor}
            bg={style.bgColor ?? (style.gradient ? '#1A1A1A' : '#ffffff')}
          />
        )}
      </StyleSection>
    </>
  )
}
