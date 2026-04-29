import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { LoginForm } from '@/components/forms/LoginForm'
import { isAllowedAdmin } from '@/lib/admin/auth'
import { createClient } from '@/lib/supabase/server'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'Login Admin',
  description: 'Acesso administrativo do Gestor360.',
}

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isAllowedAdmin(user)) {
    redirect('/admin')
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
                Acesso restrito
              </p>
              <h1 className="mt-3 max-w-md font-display text-[var(--text-heading)] font-black leading-[var(--leading-tight)] text-white">
                Entre com o e-mail autorizado da equipe.
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-blue">
              Login
            </p>
            <h2 className="font-display text-2xl font-black text-[var(--color-text-title)]">
              Acessar painel
            </h2>
            <p className="mb-7 mt-3 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
              Use o cadastro criado no Supabase Auth.
            </p>

            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  )
}
