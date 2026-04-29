export const CAPITULOS = [
  { value: '1', label: 'Capítulo 1 - Planejamento Estratégico' },
  { value: '2', label: 'Capítulo 2 - Comunicação com Resultado' },
  { value: '3', label: 'Capítulo 3 - Delegação Consciente' },
  { value: '4', label: 'Capítulo 4 - Mentalidade de Liderança' },
  { value: '5', label: 'Capítulo 5 - Gestão Financeira Prática' },
  { value: '6', label: 'Capítulo 6 - Marketing e Vendas' },
  { value: '7', label: 'Capítulo 7 - Gestão de Pessoas' },
  { value: '8', label: 'Capítulo 8 - Riscos e Decisão' },
  { value: '9', label: 'Capítulo 9 - Autoaprendizado do Líder' },
  { value: '10', label: 'Capítulo 10 - Indicadores e Inovação' },
]

export const TIPO_OPTIONS = [
  { value: 'individual', label: 'Ferramenta individual' },
  { value: 'kit_completo', label: 'Kit completo' },
]

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
]

export const ACESSO_OPTIONS = [
  { value: 'gratuito', label: 'Gratuito' },
  { value: 'codigo_livro', label: 'Código do livro' },
]

export function getCapituloLabel(capitulo: number | null | undefined) {
  if (!capitulo) return 'Sem capítulo'
  return CAPITULOS.find((item) => item.value === String(capitulo))?.label ?? `Capítulo ${capitulo}`
}

export function getStatusLabel(status: string | null | undefined, ativo?: boolean | null) {
  if (status === 'published' || ativo) return 'Publicado'
  return 'Rascunho'
}

export function getTipoLabel(tipo: string | null | undefined) {
  if (tipo === 'kit_completo') return 'Kit completo'
  return 'Individual'
}
