'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.').toLowerCase().trim(),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
})

type Mode = 'login' | 'signup'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedRedirect = searchParams.get('redirect')
  const redirectTo =
    requestedRedirect?.startsWith('/') && !requestedRedirect.startsWith('//')
      ? requestedRedirect
      : '/admin'
  const initialError = searchParams.get('error')

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(
    initialError === 'unauthorized'
      ? 'Este e-mail não tem permissão para acessar o admin. Solicite acesso ao administrador.'
      : initialError === 'link-expirado'
        ? 'O link expirou. Solicite um novo link de redefinição de senha.'
        : initialError === 'link-invalido'
          ? 'O link de confirmação é inválido ou expirou. Tente novamente.'
          : ''
  )
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
  }

  async function handleLogin(email: string, password: string) {
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError('E-mail ou senha inválidos.')
      return
    }
    router.replace(redirectTo)
    router.refresh()
  }

  async function handleSignup(email: string, password: string) {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Este e-mail já possui uma conta. Faça login.')
      } else {
        setError(signUpError.message)
      }
      return
    }

    setSuccess(
      'Conta criada! Verifique seu e-mail para confirmar o cadastro. Após confirmar, volte aqui para entrar.'
    )
    setMode('login')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revise os dados.')
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await handleLogin(parsed.data.email, parsed.data.password)
      } else {
        await handleSignup(parsed.data.email, parsed.data.password)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] p-1">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={[
            'flex-1 rounded-[var(--radius-sm)] py-2 text-sm font-semibold transition-colors',
            mode === 'login'
              ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]',
          ].join(' ')}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => switchMode('signup')}
          className={[
            'flex-1 rounded-[var(--radius-sm)] py-2 text-sm font-semibold transition-colors',
            mode === 'signup'
              ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]',
          ].join(' ')}
        >
          Criar conta
        </button>
      </div>

      {success && (
        <div className="mb-4 rounded-[var(--radius-md)] bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          autoComplete="email"
          required
        />

        <Input
          label={mode === 'login' ? 'Senha' : 'Criar senha'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'login' ? 'Sua senha' : 'Mínimo 6 caracteres'}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
        />

        {mode === 'signup' && (
          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            autoComplete="new-password"
            required
          />
        )}

        {error && (
          <p
            className="rounded-[var(--radius-md)] bg-error/10 px-4 py-3 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
          {isSubmitting
            ? mode === 'login' ? 'Entrando...' : 'Criando conta...'
            : mode === 'login' ? 'Entrar no admin' : 'Criar conta'}
        </Button>

        {mode === 'login' && (
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            <Link
              href="/login/redefinir-senha"
              className="text-brand-blue underline-offset-2 hover:underline"
            >
              Esqueci minha senha
            </Link>
          </p>
        )}

        {mode === 'signup' && (
          <p className="text-center text-xs text-[var(--color-text-muted)]">
            Após criar a conta, confirme seu e-mail e peça ao administrador para liberar seu acesso.
          </p>
        )}
      </form>
    </div>
  )
}
