import type { Metadata } from 'next'
import { LeadForm } from '@/components/forms/LeadForm'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Ferramentas Práticas do Gestor360®',
  description: 'Acesse gratuitamente as ferramentas do capítulo que você está lendo. 31 ferramentas para transformar sua gestão.',
}

const capitulos: Record<number, { titulo: string; ferramentas: string }> = {
  1:  { titulo: 'Planejamento Estratégico',     ferramentas: 'GST · PESTEL · SWOT Comportamental' },
  2:  { titulo: 'Comunicação com Resultado',    ferramentas: '4 Níveis de Fala · Rapport · Metamodelo · Reframing' },
  3:  { titulo: 'Delegação Consciente',         ferramentas: 'Mapa de Funções 360 · Roda da Autonomia · Mapa Circular' },
  4:  { titulo: 'Mentalidade de Liderança',     ferramentas: 'Mapa de Crenças · Ritual da Ação Consciente' },
  5:  { titulo: 'Gestão Financeira Prática',    ferramentas: 'DRE · Formação de Preço · Fluxo de Caixa · Diagnóstico 15min' },
  6:  { titulo: 'Marketing e Vendas',           ferramentas: 'Roteiro da História de Valor' },
  7:  { titulo: 'Gestão de Pessoas',            ferramentas: 'Diagnóstico de Clima · Matriz de Desempenho · Feedback SCI · 1:1' },
  8:  { titulo: 'Riscos e Decisão',             ferramentas: 'Matriz de Risco · Reversível×Irreversível · Análise de Cenários' },
  9:  { titulo: 'Autoaprendizado do Líder',     ferramentas: 'Canvas de Autoaprendizado do Líder360' },
  10: { titulo: 'Indicadores e Inovação',       ferramentas: 'OKRs · PDCA · Canvas da Inovação Ágil' },
}

interface Props {
  searchParams: Promise<{ capitulo?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string }>
}

export default async function FerramentasPage({ searchParams }: Props) {
  const params = await searchParams
  const capitulo = Number(params.capitulo)
  const capInfo = capitulos[capitulo] ?? null

  const utmParams: Record<string, string> = {}
  if (params.utm_source)   utmParams.utm_source   = params.utm_source
  if (params.utm_medium)   utmParams.utm_medium   = params.utm_medium
  if (params.utm_campaign) utmParams.utm_campaign = params.utm_campaign

  const consentSource = capitulo
    ? `qrcode-cap${String(capitulo).padStart(2, '0')}`
    : 'site-ferramentas'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg-canvas)]">
      <div className="mx-auto max-w-[var(--container-md)] px-4 sm:px-6 py-12 sm:py-16">

        {/* Cabeçalho da página */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span
              className="font-display font-black text-5xl leading-none tracking-[var(--tracking-tight)]"
              aria-label="360"
            >
              <span className="text-[var(--color-stone-accessible)]">3</span>
              <span className="text-brand-blue">6</span>
              <span className="text-brand-gold">0</span>
            </span>
          </div>

          {capInfo ? (
            <>
              <Badge variant="blue" className="mb-4">
                Capítulo {capitulo}
              </Badge>
              <h1 className="font-display font-black text-[var(--text-hero)] text-[var(--color-text-title)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] mb-3">
                {capInfo.titulo}
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm">
                {capInfo.ferramentas}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display font-black text-[var(--text-hero)] text-[var(--color-text-title)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] mb-3">
                31 Ferramentas Práticas
              </h1>
              <p className="text-[var(--color-text-body)] max-w-md mx-auto">
                Para os 10 capítulos do método. Cadastre-se e acesse gratuitamente as ferramentas do capítulo que está lendo.
              </p>
            </>
          )}
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-6 sm:p-8 max-w-md mx-auto">
          <h2 className="font-display font-bold text-lg text-[var(--color-text-title)] mb-2">
            {capInfo
              ? `Acesse as ferramentas do Capítulo ${capitulo}`
              : 'Cadastre-se e acesse gratuitamente'}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            É grátis. Você receberá os PDFs por e-mail em segundos.
          </p>

          <LeadForm
            capituloOrigem={capitulo || undefined}
            consentSource={consentSource}
            utmParams={utmParams}
          />
        </div>

        {/* Rodapé informativo */}
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-8">
          Você receberá acesso às ferramentas gratuitas do capítulo.{' '}
          Tem o livro? Insira o código impresso para desbloquear todas as 31 ferramentas.
        </p>
      </div>
    </div>
  )
}
