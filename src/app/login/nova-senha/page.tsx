'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'

const novaSenhaSchema = z
  .object({
    password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'As senhas não coincidem.',
    path: ['confirm'],
  })

export default function NovaSenhaPage() {
  const router = useRouter()
  const [pronto, setPronto] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // O callback /auth/callback já trocou o code por sessão.
    // Verificamos se há uma sessão ativa — se sim, o usuário pode redefinir a senha.
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setPronto(true)
      }
    })
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    const parsed = novaSenhaSchema.safeParse({ password, confirm })
    if (!parsed.success) {
      const erros: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const campo = issue.path[0] as string
        erros[campo] = issue.message
      }
      setFieldErrors(erros)
      return
    }

    setIsSubmitting(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    })

    if (updateError) {
      setError('Não foi possível atualizar a senha. O link pode ter expirado.')
      setIsSubmitting(false)
      return
    }

    router.replace('/admin')
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
                Nova senha
              </p>
              <h1 className="mt-3 max-w-md font-display text-[var(--text-heading)] font-black leading-[var(--leading-tight)] text-white">
                Escolha uma senha segura para continuar.
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-blue">
              Nova senha
            </p>
            <h2 className="font-display text-2xl font-black text-[var(--color-text-title)]">
              Definir nova senha
            </h2>

            {!pronto ? (
              <div className="mt-6">
                <p className="text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
                  Verificando o link de recuperação… Se este formulário não carregar, o link pode ter expirado.{' '}
                  <a
                    href="/login/redefinir-senha"
                    className="text-brand-blue underline-offset-2 hover:underline"
                  >
                    Solicitar novo link.
                  </a>
                </p>
              </div>
            ) : (
              <>
                <p className="mb-7 mt-3 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
                  Crie uma senha com pelo menos 8 caracteres.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Nova senha"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    error={fieldErrors.password}
                    required
                  />

                  <Input
                    label="Confirmar senha"
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    error={fieldErrors.confirm}
                    required
                  />

                  {error && (
                    <p className="rounded-[var(--radius-md)] bg-error/10 px-4 py-3 text-sm text-error" role="alert">
                      {error}
                    </p>
                  )}

                  <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
