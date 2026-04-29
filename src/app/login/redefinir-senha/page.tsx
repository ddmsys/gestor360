'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'

const emailSchema = z.object({
  email: z.string().email('Informe um e-mail válido.').toLowerCase().trim(),
})

export default function RedefinirSenhaPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsed = emailSchema.safeParse({ email })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revise o e-mail informado.')
      return
    }

    setIsSubmitting(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email,
      { redirectTo: `${window.location.origin}/login/nova-senha` },
    )

    if (resetError) {
      setError('Não foi possível enviar o e-mail. Tente novamente.')
      setIsSubmitting(false)
      return
    }

    setEnviado(true)
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-canvas)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[var(--container-xl)] items-center justify-center">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)] lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="bg-[var(--color-bg-ink)] p-8 text-white sm:p-10">
            <div className="mb-10">
              <Logo variant="full" theme="dark" height={44} />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                Admin
              </p>
              <p className="mt-3 max-w-md text-sm leading-[var(--leading-relaxed)] text-white/62">
                Painel interno para gerenciar o site, leads e a biblioteca digital do Gestor360.
              </p>
            </div>

            <div className="border-t border-white/12 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-gold">
                Recuperação de acesso
              </p>
              <h1 className="mt-3 max-w-md font-display text-[var(--text-heading)] font-black leading-[var(--leading-tight)] text-white">
                Vamos te ajudar a recuperar o acesso.
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-blue">
              Redefinir senha
            </p>
            <h2 className="font-display text-2xl font-black text-[var(--color-text-title)]">
              Recuperar acesso
            </h2>

            {enviado ? (
              <div className="mt-6">
                <div className="rounded-[var(--radius-md)] bg-brand-blue/8 px-4 py-4 text-sm leading-[var(--leading-relaxed)] text-brand-blue">
                  <p className="font-semibold">E-mail enviado!</p>
                  <p className="mt-1 text-brand-blue/75">
                    Verifique a caixa de entrada de <strong>{email}</strong> e clique no link para definir sua nova senha.
                  </p>
                </div>
                <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                  <Link
                    href="/login"
                    className="text-brand-blue underline-offset-2 hover:underline"
                  >
                    Voltar para o login
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <p className="mb-7 mt-3 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
                  Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="contato@ogestor360.com"
                    autoComplete="email"
                    required
                  />

                  {error && (
                    <p className="rounded-[var(--radius-md)] bg-error/10 px-4 py-3 text-sm text-error" role="alert">
                      {error}
                    </p>
                  )}

                  <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
                    {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
                  </Button>

                  <p className="text-center text-sm text-[var(--color-text-muted)]">
                    <Link
                      href="/login"
                      className="text-brand-blue underline-offset-2 hover:underline"
                    >
                      Voltar para o login
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
