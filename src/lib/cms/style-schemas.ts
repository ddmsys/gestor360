// src/lib/cms/style-schemas.ts
// Schemas Zod para validação do SectionStyle
// Importar junto com os schemas existentes em lib/cms/schemas.ts
// Gerado em Abril 2026 — DDM Editora

import { z } from 'zod'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const TitleScaleSchema = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])

export const TitleWeightSchema = z.enum(['400', '500', '600', '700', '900'])

export const MaxWidthSchema = z.enum(['sm', 'md', 'lg', 'xl', 'full'])

export const DividerTypeSchema = z.enum(['none', 'line', 'wave', 'diagonal'])

export const SpacingPresetSchema = z.enum(['32px', '48px', '64px', '96px', '128px'])

export const FontPairLabelSchema = z.enum([
  'Gotham + DM Sans',
  'Playfair + DM Sans',
  'Montserrat + Inter',
  'Cormorant + DM Sans',
  'Space Grotesk + Inter',
])

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Valida string hexadecimal de cor. Ex: '#1F3F7A' ou '#fff' */
const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Cor inválida — use formato hex (#RRGGBB)')

/** Valida valor CSS de gradiente ou string vazia */
const gradientSchema = z
  .string()
  .refine(
    (v) => v === '' || v.startsWith('linear-gradient') || v.startsWith('radial-gradient'),
    'Gradiente inválido — use linear-gradient() ou radial-gradient()'
  )

// ─── SectionStyle Schema ──────────────────────────────────────────────────────

export const SectionStyleSchema = z.object({
  // Fundo
  bgColor:        hexColorSchema.optional(),
  gradient:       gradientSchema.optional(),
  bgOpacity:      z.number().int().min(10).max(100).optional(),

  // Tipografia
  fontPair:       FontPairLabelSchema.optional(),
  titleScale:     TitleScaleSchema.optional(),
  titleWeight:    TitleWeightSchema.optional(),
  titleColor:     hexColorSchema.optional(),
  textColor:      hexColorSchema.optional(),
  letterSpacing:  z.number().min(-2).max(12).optional(),

  // Espaçamento
  paddingY:       SpacingPresetSchema.optional(),
  paddingX:       z.number().int().min(0).max(120).optional(),
  maxWidth:       MaxWidthSchema.optional(),
  borderRadius:   z.string().optional(),   // CSS string ex: '16px'
  divider:        DividerTypeSchema.optional(),

  // Efeitos
  shadow:         z.string().optional(),   // CSS box-shadow ou 'none'
  overlayOpacity: z.number().int().min(0).max(80).optional(),
  blur:           z.boolean().optional(),
  blurAmount:     z.number().int().min(2).max(32).optional(),
  border:         z.boolean().optional(),
  borderColor:    hexColorSchema.optional(),
  animation:      z.boolean().optional(),
  titleTransform: z.enum(['uppercase', 'lowercase', 'capitalize', 'none']).optional(),
}).strict()

export type SectionStyleInput = z.input<typeof SectionStyleSchema>
export type SectionStyleOutput = z.output<typeof SectionStyleSchema>

// ─── Atualização do PageSection type ──────────────────────────────────────────
//
// No arquivo src/types/cms.ts, adicionar o campo style:
//
// import type { SectionStyle } from './section-style'
//
// export interface PageSection {
//   id: string
//   page_id: string
//   type: SectionType
//   order_index: number
//   content: SectionContent
//   style?: SectionStyle       ← ADICIONAR
//   visible: boolean
//   created_at: string
// }

// ─── Schema completo de PageSection para validação da API ─────────────────────

export const PageSectionUpsertSchema = z.object({
  id:          z.string().uuid(),
  type:        z.enum([
    'hero', 'text', 'cards', 'ferramentas', 'form',
    'faq', 'cta', 'depoimentos', 'capitulos', 'autores',
  ]),
  order_index: z.number().int().min(0),
  content:     z.record(z.string(), z.unknown()),
  style:       SectionStyleSchema.optional().default({}),
  visible:     z.boolean().default(true),
})

export const SaveSectionsRequestSchema = z.object({
  sections: z.array(PageSectionUpsertSchema).min(0).max(50),
})

export type SaveSectionsRequest = z.infer<typeof SaveSectionsRequestSchema>
