export interface DesignConfig {
  palette: 'default' | 'warm' | 'clean' | 'dark' | 'slate'
  font_body: 'dm-sans' | 'inter' | 'nunito' | 'open-sans'
  font_display: 'gotham' | 'oswald' | 'montserrat' | 'playfair'
  type_scale: 'compact' | 'normal' | 'generous'
}

export const PALETTE_VARS: Record<DesignConfig['palette'], Record<string, string>> = {
  default: {
    '--color-bg-canvas': '#E8E6E1',
    '--color-bg-ink': '#1A1A1A',
    '--color-brand-blue': '#1F3F7A',
    '--color-brand-gold': '#D4A020',
    '--color-brand-blue-hover': '#163060',
    '--color-text-title': '#1A1A1A',
    '--color-text-body': '#5A5A5A',
    '--color-text-muted': '#8B8B8B',
    '--color-border': '#D8D5CF',
  },
  warm: {
    '--color-bg-canvas': '#F5EDE0',
    '--color-bg-ink': '#1E1208',
    '--color-brand-blue': '#5C3D2E',
    '--color-brand-gold': '#D4821A',
    '--color-brand-blue-hover': '#472E22',
    '--color-text-title': '#1E1208',
    '--color-text-body': '#5A4030',
    '--color-text-muted': '#9B7860',
    '--color-border': '#D8C4B0',
  },
  clean: {
    '--color-bg-canvas': '#FFFFFF',
    '--color-bg-ink': '#1A1A1A',
    '--color-brand-blue': '#1F3F7A',
    '--color-brand-gold': '#D4A020',
    '--color-brand-blue-hover': '#163060',
    '--color-text-title': '#1A1A1A',
    '--color-text-body': '#5A5A5A',
    '--color-text-muted': '#8B8B8B',
    '--color-border': '#E5E5E5',
  },
  dark: {
    '--color-bg-canvas': '#111111',
    '--color-bg-ink': '#000000',
    '--color-brand-blue': '#4A7ADE',
    '--color-brand-gold': '#E8C040',
    '--color-brand-blue-hover': '#3A68C0',
    '--color-text-title': '#F5F5F5',
    '--color-text-body': '#AAAAAA',
    '--color-text-muted': '#777777',
    '--color-border': '#2A2A2A',
  },
  slate: {
    '--color-bg-canvas': '#F0F4FA',
    '--color-bg-ink': '#1A1A2E',
    '--color-brand-blue': '#1F3F7A',
    '--color-brand-gold': '#D4A020',
    '--color-brand-blue-hover': '#163060',
    '--color-text-title': '#1A1A2E',
    '--color-text-body': '#4A4A6A',
    '--color-text-muted': '#7A7A9A',
    '--color-border': '#D0D8E8',
  },
}

export const FONT_BODY_VARS: Record<DesignConfig['font_body'], string> = {
  'dm-sans': "var(--font-dm-sans), sans-serif",
  'inter': "var(--font-inter), sans-serif",
  'nunito': "var(--font-nunito), sans-serif",
  'open-sans': "var(--font-open-sans), sans-serif",
}

export const FONT_DISPLAY_VARS: Record<DesignConfig['font_display'], string> = {
  'gotham': "'gotham', sans-serif",
  'oswald': "var(--font-oswald), sans-serif",
  'montserrat': "var(--font-montserrat), sans-serif",
  'playfair': "var(--font-playfair), serif",
}

export const TYPE_SCALE_VARS: Record<DesignConfig['type_scale'], Record<string, string>> = {
  compact: {
    '--text-display': 'clamp(2.5rem, 7vw, 5rem)',
    '--text-hero': 'clamp(1.75rem, 4.5vw, 3rem)',
    '--text-heading': 'clamp(1.25rem, 2.75vw, 2rem)',
    '--text-title': 'clamp(1rem, 1.75vw, 1.375rem)',
    '--text-body': '0.9375rem',
    '--text-sm': '0.8125rem',
  },
  normal: {
    '--text-display': 'clamp(3rem, 8vw, 6rem)',
    '--text-hero': 'clamp(2rem, 5vw, 3.5rem)',
    '--text-heading': 'clamp(1.5rem, 3vw, 2.25rem)',
    '--text-title': 'clamp(1.125rem, 2vw, 1.5rem)',
    '--text-body': '1rem',
    '--text-sm': '0.875rem',
  },
  generous: {
    '--text-display': 'clamp(3.5rem, 9vw, 7rem)',
    '--text-hero': 'clamp(2.25rem, 5.5vw, 4rem)',
    '--text-heading': 'clamp(1.75rem, 3.25vw, 2.5rem)',
    '--text-title': 'clamp(1.25rem, 2.25vw, 1.625rem)',
    '--text-body': '1.0625rem',
    '--text-sm': '0.9375rem',
  },
}

export function buildDesignCss(config: DesignConfig): string {
  const palette = PALETTE_VARS[config.palette] ?? PALETTE_VARS.default
  const fontBody = FONT_BODY_VARS[config.font_body] ?? FONT_BODY_VARS['dm-sans']
  const fontDisplay = FONT_DISPLAY_VARS[config.font_display] ?? FONT_DISPLAY_VARS['gotham']
  const scale = TYPE_SCALE_VARS[config.type_scale] ?? TYPE_SCALE_VARS.normal

  const vars = {
    ...palette,
    ...scale,
    '--font-body': fontBody,
    '--font-display': fontDisplay,
  }

  const declarations = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')

  return `:root {\n${declarations}\n}`
}
