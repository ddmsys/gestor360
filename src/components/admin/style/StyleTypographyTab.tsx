'use client'

import type { SectionStyle, FontPairLabel, TitleScale, TitleWeight } from '@/types/section-style'
import { FONT_PAIRS } from '@/types/section-style'
import {
  StyleSection, StyleRow,
  ColorSwatch, HexInput, ClearButton,
  StyleSlider, StyleSegment, WCAGBadge,
} from './style-primitives'

const TITLE_SCALE_OPTIONS: { value: TitleScale; label: string }[] = [
  { value: 'xs', label: 'XS'  },
  { value: 'sm', label: 'SM'  },
  { value: 'md', label: 'MD'  },
  { value: 'lg', label: 'LG'  },
  { value: 'xl', label: 'XL'  },
]

const TITLE_WEIGHT_OPTIONS: { value: TitleWeight; label: string }[] = [
  { value: '400', label: '400' },
  { value: '500', label: '500' },
  { value: '600', label: '600' },
  { value: '700', label: '700' },
  { value: '900', label: '900' },
]

const TITLE_COLOR_PRESETS = [
  { color: '#1A1A1A', label: 'Tinta'   },
  { color: '#ffffff', label: 'Branco'  },
  { color: '#1F3F7A', label: 'Azul'   },
  { color: '#D4A020', label: 'Dourado' },
]

interface Props {
  style: SectionStyle
  onChange: (partial: Partial<SectionStyle>) => void
}

export function StyleTypographyTab({ style, onChange }: Props) {
  return (
    <>
      {/* ── Par de fontes ── */}
      <StyleSection title="Par de fontes">
        <div className="flex flex-col gap-1.5">
          {FONT_PAIRS.map((pair) => {
            const selected = style.fontPair === pair.label
            return (
              <button
                key={pair.label}
                type="button"
                onClick={() => onChange({ fontPair: selected ? undefined : pair.label as FontPairLabel })}
                className={`flex flex-col items-start px-3 py-2 rounded-[var(--radius-sm)] border-2 text-left transition-all ${
                  selected
                    ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-brand-blue)]/40'
                }`}
              >
                <span
                  className="text-sm font-bold leading-tight"
                  style={{ fontFamily: pair.display }}
                >
                  {pair.label.split(' + ')[0]}
                </span>
                <span
                  className="text-[10px] text-[var(--color-text-muted)]"
                  style={{ fontFamily: pair.body }}
                >
                  + {pair.label.split(' + ')[1]}
                </span>
              </button>
            )
          })}
        </div>
        {style.fontPair && (
          <ClearButton onClick={() => onChange({ fontPair: undefined })} />
        )}
      </StyleSection>

      {/* ── Tamanho do título ── */}
      <StyleSection title="Tamanho do título">
        <StyleSegment
          options={TITLE_SCALE_OPTIONS}
          value={style.titleScale}
          onChange={(v) => onChange({ titleScale: v })}
        />
        {style.titleScale && (
          <ClearButton onClick={() => onChange({ titleScale: undefined })} />
        )}
      </StyleSection>

      {/* ── Peso do título ── */}
      <StyleSection title="Peso do título">
        <StyleSegment
          options={TITLE_WEIGHT_OPTIONS}
          value={style.titleWeight}
          onChange={(v) => onChange({ titleWeight: v })}
        />
        {style.titleWeight && (
          <ClearButton onClick={() => onChange({ titleWeight: undefined })} />
        )}
      </StyleSection>

      {/* ── Caixa alta / baixa ── */}
      <StyleSection title="Caixa do título">
        <StyleSegment
          options={[
            { value: 'none',       label: 'Normal'    },
            { value: 'uppercase',  label: 'MAIÚSC.'   },
            { value: 'lowercase',  label: 'minúsc.'   },
            { value: 'capitalize', label: 'Título'    },
          ]}
          value={style.titleTransform ?? 'none'}
          onChange={(v) => onChange({ titleTransform: v !== 'none' ? v : undefined })}
        />
      </StyleSection>

      {/* ── Letter-spacing ── */}
      <StyleSection title="Espaçamento de letras">
        <StyleSlider
          value={style.letterSpacing ?? 0}
          min={-2}
          max={12}
          step={0.5}
          unit="px"
          onChange={(v) => onChange({ letterSpacing: v !== 0 ? v : undefined })}
        />
      </StyleSection>

      {/* ── Cor do título ── */}
      <StyleSection title="Cor do título">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {TITLE_COLOR_PRESETS.map(({ color, label }) => (
            <ColorSwatch
              key={color}
              color={color}
              title={label}
              selected={style.titleColor === color}
              onClick={() => onChange({ titleColor: style.titleColor === color ? undefined : color })}
            />
          ))}
        </div>
        <StyleRow label="Hex">
          <HexInput
            value={style.titleColor}
            onChange={(v) => onChange({ titleColor: v || undefined })}
          />
          {style.titleColor && <ClearButton onClick={() => onChange({ titleColor: undefined })} />}
        </StyleRow>
        {style.titleColor && style.bgColor && (
          <WCAGBadge fg={style.titleColor} bg={style.bgColor} />
        )}
      </StyleSection>
    </>
  )
}
