import type { Metadata } from 'next'
import Image from 'next/image'
import { LeadForm } from '@/components/forms/LeadForm'
import { FerramentasLibrary } from '@/components/sections/FerramentasLibrary'
import { Logo } from '@/components/ui/Logo'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Ferramentas Práticas do Gestor360®',
  description: 'Acesse gratuitamente as 31 ferramentas do Manual do Gestor360®. Baixe o kit completo ou escolha por capítulo.',
}

interface Props {
  searchParams: Promise<{ acesso?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string }>
}

async function getFerramentasPublicadas() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('ferramentas')
    .select('id, numero, nome, descricao, capitulo, arquivo_path, tipo, cor')
    .eq('status', 'published')
    .eq('ativo', true)
    .eq('acesso', 'gratuito')
    .not('arquivo_path', 'is', null)
    .order('tipo', { ascending: false })
    .order('capitulo', { ascending: true })
    .order('ordem', { ascending: true })
    .order('numero', { ascending: true })

  return data ?? []
}

export default async function FerramentasPage({ searchParams }: Props) {
  const params = await searchParams
  const acessoLiberado = params.acesso === 'liberado'

  const utmParams: Record<string, string> = {}
  if (params.utm_source)   utmParams.utm_source   = params.utm_source
  if (params.utm_medium)   utmParams.utm_medium   = params.utm_medium
  if (params.utm_campaign) utmParams.utm_campaign = params.utm_campaign

  const ferramentas = acessoLiberado ? await getFerramentasPublicadas() : []

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-canvas">

      {/* Hero — texto à esquerda, capa do livro à direita */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-(--gradient-360)" aria-hidden="true" />
        <div className="mx-auto grid max-w-[var(--container-xl)] items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-20">

          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Logo variant="full" theme="light" height={42} />
              <span className="h-8 w-px bg-border" aria-hidden="true" />
              <span className="text-sm font-semibold uppercase tracking-widest text-(--color-text-muted)">
                Biblioteca digital do livro
              </span>
            </div>

            <h1 className="max-w-3xl font-display text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-[0.95] text-(--color-text-title)">
              31 ferramentas para colocar o Gestor360 em prática
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-body sm:text-lg">
              Acesse a biblioteca complementar do Manual do Gestor360®. Preencha o cadastro e receba o link das ferramentas no seu e-mail.
            </p>

            {/* Stats */}
            <div className="mt-8 grid max-w-xl grid-cols-3 border-y border-border text-center sm:text-left">
              {[
                { valor: '31', label: 'ferramentas' },
                { valor: '10', label: 'capítulos' },
                { valor: '1',  label: 'método' },
              ].map(({ valor, label }, i) => (
                <div key={label} className={`py-4 ${i === 1 ? 'border-x border-border px-3' : i === 0 ? 'pr-3' : 'pl-3'}`}>
                  <p className="font-display text-2xl font-black text-(--color-text-title)">{valor}</p>
                  <p className="text-xs font-medium text-(--color-text-muted)">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Capa do livro */}
          <div className="mx-auto w-full max-w-65 lg:max-w-80">
            <div className="relative aspect-797/1058">
              <Image
                src="/Mockup_01.png"
                alt="Capa do Manual do Gestor360®"
                fill
                priority
                sizes="(min-width: 1024px) 320px, 260px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      {acessoLiberado ? (
        /* Biblioteca completa — tela inteira após acesso */
        <div className="mx-auto max-w-[var(--container-xl)] px-4 py-10 sm:px-6 sm:py-14">
          <FerramentasLibrary ferramentas={ferramentas} />
        </div>
      ) : (
        /* Como funciona + formulário de cadastro */
        <div className="mx-auto grid max-w-[var(--container-xl)] gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">

          <section className="rounded-lg border border-border bg-white p-6 shadow-(--shadow-sm) sm:p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-blue">
              Como funciona
            </p>
            <h2 className="font-display text-xl font-black leading-tight text-(--color-text-title) sm:text-2xl">
              O material complementar fica organizado em um único acesso.
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-3">
              {[
                ['01', 'Preencha o cadastro', 'Seu e-mail identifica o acesso e ajuda a manter a entrega organizada.'],
                ['02', 'Receba o link', 'A confirmação chega pelo e-mail oficial contato@ogestor360.com.'],
                ['03', 'Baixe as ferramentas', 'Acesse a biblioteca completa com 31 ferramentas organizadas por capítulo.'],
              ].map(([numero, titulo, texto]) => (
                <div key={numero} className="border-t border-border pt-4">
                  <p className="font-display text-2xl font-black text-brand-gold">{numero}</p>
                  <h3 className="mt-3 text-base font-bold text-(--color-text-title)">{titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-body">{texto}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-white p-6 shadow-(--shadow-md) sm:p-8">
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-gold">
                Acesso gratuito
              </p>
              <h2 className="font-display text-2xl font-black leading-tight text-(--color-text-title)">
                Receba as ferramentas do Gestor360®
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted)">
                Use o mesmo e-mail que você quer receber o link de acesso.
              </p>
            </div>
            <LeadForm consentSource="site-ferramentas" utmParams={utmParams} />
          </section>

        </div>
      )}

    </div>
  )
}
