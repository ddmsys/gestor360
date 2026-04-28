'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  nome: z.string().min(2, 'Nome precisa ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z
    .string()
    .regex(/^\+?[\d\s\-()]{10,15}$/, 'Número inválido')
    .optional()
    .or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

interface LeadFormProps {
  capituloOrigem?: number
  consentSource: string
  utmParams?: Record<string, string>
}

interface SuccessData {
  mensagem: string
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
        className="rounded-[var(--radius-lg)] bg-success/10 border border-success/20 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-2xl mb-2">✓</p>
        <p className="font-semibold text-[var(--color-text-title)] mb-1">
          Cadastro realizado!
        </p>
        <p className="text-sm text-[var(--color-text-body)]">
          Verifique seu e-mail em até 2 minutos com o link das ferramentas.
        </p>
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
        autoComplete="tel"
        inputMode="tel"
        hint="Opcional — para receber as ferramentas também no WhatsApp"
        error={errors.whatsapp?.message}
        {...register('whatsapp')}
      />

      {serverError && (
        <p className="text-sm text-error bg-error/10 rounded-[var(--radius-md)] px-4 py-3" role="alert">
          {serverError}
        </p>
      )}

      <p className="text-xs text-[var(--color-text-muted)] leading-[var(--leading-relaxed)]">
        Ao cadastrar, você concorda com o uso dos seus dados para envio das ferramentas e comunicações do Gestor360®.
        Você pode cancelar a qualquer momento.
      </p>

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? 'Enviando...' : 'Quero acesso gratuito →'}
      </Button>
    </form>
  )
}
