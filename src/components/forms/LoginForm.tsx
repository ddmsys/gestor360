'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.').toLowerCase().trim(),
  password: z.string().min(1, 'Informe sua senha.'),
})

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedRedirect = searchParams.get('redirect')
  const redirectTo =
    requestedRedirect?.startsWith('/') && !requestedRedirect.startsWith('//')
      ? requestedRedirect
      : '/admin'
  const initialError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(
    initialError === 'unauthorized'
      ? 'Este e-mail não tem permissão para acessar o admin.'
      : ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revise os dados de acesso.')
      return
    }

    setIsSubmitting(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (signInError) {
      setError('E-mail ou senha inválidos.')
      setIsSubmitting(false)
      return
    }

    router.replace(redirectTo)
    router.refresh()
  }

  return (
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

      <Input
        label="Senha"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Sua senha"
        autoComplete="current-password"
        required
      />

      {error && (
        <p className="rounded-[var(--radius-md)] bg-error/10 px-4 py-3 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? 'Entrando...' : 'Entrar no admin'}
      </Button>
    </form>
  )
}
