import type { Metadata } from 'next'
import Image from 'next/image'
import { LeadForm } from '@/components/forms/LeadForm'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'

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
      <section className="relative overflow-hidden bg-[var(--color-bg-ink)] text-white">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--gradient-360)]" aria-hidden="true" />
        <div className="mx-auto grid max-w-[var(--container-xl)] items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-20">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Logo variant="full" theme="dark" height={42} />
              <span className="h-8 w-px bg-white/20" aria-hidden="true" />
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
                Biblioteca digital do livro
              </span>
            </div>

            {capInfo ? (
              <>
                <Badge variant="gold" className="mb-5">
                  Capítulo {capitulo}
                </Badge>
                <h1 className="max-w-3xl font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.95] text-white">
                  {capInfo.titulo}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-[var(--leading-relaxed)] text-white/72 sm:text-lg">
                  {capInfo.ferramentas}
                </p>
              </>
            ) : (
              <>
                <h1 className="max-w-3xl font-display text-[clamp(2.75rem,8vw,6rem)] font-black leading-[0.95] text-white">
                  31 ferramentas para colocar o Gestor360 em prática
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-[var(--leading-relaxed)] text-white/72 sm:text-lg">
                  Acesse a biblioteca complementar do Manual do Gestor360. Depois do cadastro, enviaremos o link das ferramentas no seu e-mail.
                </p>
              </>
            )}

            <div className="mt-8 grid max-w-xl grid-cols-3 border-y border-white/12 text-center sm:text-left">
              <div className="py-4 pr-3">
                <p className="font-display text-2xl font-black text-white">31</p>
                <p className="text-xs font-medium text-white/58">ferramentas</p>
              </div>
              <div className="border-x border-white/12 px-3 py-4">
                <p className="font-display text-2xl font-black text-white">10</p>
                <p className="text-xs font-medium text-white/58">capítulos</p>
              </div>
              <div className="py-4 pl-3">
                <p className="font-display text-2xl font-black text-white">1</p>
                <p className="text-xs font-medium text-white/58">método</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[280px] lg:max-w-[340px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-white/5 shadow-[var(--shadow-lg)] ring-1 ring-white/12">
              <Image
                src="/Capa_livro.png"
                alt="Manual do Gestor360"
                fill
                priority
                sizes="(min-width: 1024px) 340px, 280px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[var(--container-xl)] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-blue">
            Como funciona
          </p>
          <h2 className="font-display text-[var(--text-heading)] font-black leading-[var(--leading-tight)]">
            O material complementar fica organizado em um único acesso.
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              ['01', 'Preencha o cadastro', 'Seu e-mail identifica o acesso e ajuda a manter a entrega organizada.'],
              ['02', 'Receba o link', 'A confirmação chega pelo e-mail oficial contato@ogestor360.com.'],
              ['03', 'Use as ferramentas', 'A biblioteca reunirá o kit completo e os arquivos organizados por capítulo.'],
            ].map(([number, title, text]) => (
              <div key={number} className="border-t border-[var(--color-border)] pt-4">
                <p className="font-display text-2xl font-black text-brand-gold">{number}</p>
                <h3 className="mt-3 text-base font-bold text-[var(--color-text-title)]">{title}</h3>
                <p className="mt-2 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-body)]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
          <div className="mb-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-gold">
              Acesso gratuito
            </p>
            <h2 className="font-display text-2xl font-black leading-[var(--leading-tight)] text-[var(--color-text-title)]">
              {capInfo
                ? `Ferramentas do Capítulo ${capitulo}`
                : 'Receba as ferramentas do Gestor360'}
            </h2>
            <p className="mt-3 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
              Use o mesmo e-mail que você quer receber o link de acesso.
            </p>
          </div>

          <LeadForm
            capituloOrigem={capitulo || undefined}
            consentSource={consentSource}
            utmParams={utmParams}
          />
        </section>
      </div>
    </div>
  )
}
