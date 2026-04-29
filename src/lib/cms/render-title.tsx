import type { ReactNode } from 'react'

/**
 * Converte \n em <br> para quebras de linha manuais em títulos.
 * Uso: <h1>{renderTitle(title)}</h1>
 */
export function renderTitle(text: string): ReactNode {
  if (!text.includes('\\n') && !text.includes('\n')) return text

  const parts = text.split(/\\n|\n/)
  return parts.map((part, i) =>
    i < parts.length - 1 ? [part, <br key={i} />] : part
  ).flat()
}
