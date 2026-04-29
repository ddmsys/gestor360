'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FerramentasLibrary } from '@/components/sections/FerramentasLibrary'

const schema = z.object({
  nome: z.string().min(2, 'Nome precisa ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z
    .string()
    .min(1, 'WhatsApp é obrigatório')
    .regex(/^\+?[\d\s\-()]{10,15}$/, 'Número inválido'),
})

type FormValues = z.infer<typeof schema>

interface LeadFormProps {
  capituloOrigem?: number
  consentSource: string
  utmParams?: Record<string, string>
}

interface SuccessData {
  mensagem: string
  ferramentas?: React.ComponentProps<typeof FerramentasLibrary>['ferramentas']
}

export function LeadForm({ capituloOrigem, consentSource, utmParams }: LeadFormProps) {
  const [success, setSuccess] = useState<SuccessData | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          capitulo_origem: capituloOrigem,
          consent_source: consentSource,
          metadata: { ...utmParams },
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error ?? 'Ocorreu um erro. Tente novamente.')
        return
      }
      setSuccess(data)
    } catch {
      setServerError('Erro de conexão. Verifique sua internet e tente novamente.')
    }
  }

  if (success) {
    return (
      <div
        className="rounded-[var(--radius-lg)] border border-success/20 bg-success/10 p-6"
        role="status"
        aria-live="polite"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] bg-success text-white">
          <span className="text-xl font-bold" aria-hidden="true">✓</span>
        </div>
        <p className="font-display text-2xl font-black leading-[var(--leading-tight)] text-[var(--color-text-title)]">
          Cadastro confirmado.
        </p>
        <p className="mt-3 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-body)]">
          {success.mensagem || 'Enviamos o link das ferramentas para o seu e-mail.'}
        </p>
        <div className="mt-5 rounded-[var(--radius-md)] border border-success/20 bg-white/70 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-success">
            Acesso liberado
          </p>
          <p className="mt-2 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-body)]">
            Você também receberá este link por e-mail para voltar depois.
          </p>
        </div>
        {success.ferramentas && (
          <div className="mt-6">
            <FerramentasLibrary ferramentas={success.ferramentas} />
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Seu nome"
        placeholder="Como podemos te chamar?"
        required
        autoComplete="name"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <Input
        label="Seu e-mail"
        type="email"
        placeholder="seu@email.com"
        required
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="WhatsApp"
        type="tel"
        placeholder="(11) 9 0000-0000"
        required
        autoComplete="tel"
        inputMode="tel"
        hint="Vamos te enviar as ferramentas também no WhatsApp"
        error={errors.whatsapp?.message}
        {...register('whatsapp')}
      />

      {serverError && (
        <p className="text-sm text-error bg-error/10 rounded-[var(--radius-md)] px-4 py-3" role="alert">
          {serverError}
        </p>
      )}

      <p className="text-xs text-[var(--color-text-muted)] leading-[var(--leading-relaxed)]">
        Ao cadastrar, você autoriza o envio do link das ferramentas e comunicações do Gestor360®.
        Seus dados não serão vendidos ou compartilhados com terceiros.
      </p>

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? 'Enviando...' : 'Receber acesso gratuito'}
      </Button>
    </form>
  )
}
