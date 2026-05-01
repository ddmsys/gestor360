import type { ReactNode } from 'react'

/**
 * Formata texto inline com suporte a:
 *   \n            → quebra de linha
 *   **texto**     → negrito
 *   _texto_       → itálico
 *   [azul]...[/azul]      → cor azul (brand-blue)
 *   [dourado]...[/dourado] → cor dourada (brand-gold)
 *   [cinza]...[/cinza]    → cor cinza (brand-stone)
 *   [upper]...[/upper]    → maiúsculas
 *
 * Uso: <h2>{renderText(title)}</h2>  ou  <p>{renderText(subtitle)}</p>
 */

const TOKEN_RE = /(\*\*[\s\S]+?\*\*|_[\s\S]+?_|\[azul\][\s\S]+?\[\/azul\]|\[dourado\][\s\S]+?\[\/dourado\]|\[cinza\][\s\S]+?\[\/cinza\]|\[upper\][\s\S]+?\[\/upper\]|\\n|\n)/g

export function renderText(text: string): ReactNode {
  if (!text) return text

  const parts = text.split(TOKEN_RE)
  if (parts.length === 1) return text

  return parts.map((part, i) => {
    if (part === '\\n' || part === '\n') return <br key={i} />

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={i}>{part.slice(2, -2)}</strong>

    if (part.startsWith('_') && part.endsWith('_') && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>

    if (part.startsWith('[azul]'))
      return <span key={i} className="text-brand-blue">{part.slice(6, -7)}</span>

    if (part.startsWith('[dourado]'))
      return <span key={i} className="text-brand-gold">{part.slice(9, -10)}</span>

    if (part.startsWith('[cinza]'))
      return <span key={i} className="text-(--color-brand-stone)">{part.slice(7, -8)}</span>

    if (part.startsWith('[upper]'))
      return <span key={i} className="uppercase">{part.slice(7, -8)}</span>

    return part
  })
}

// Alias mantido — renderTitle continua funcionando em todos os componentes existentes
export const renderTitle = renderText
