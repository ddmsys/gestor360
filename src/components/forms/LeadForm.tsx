'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    .min(1, 'WhatsApp é obrigatório')
    .regex(/^\+?[\d\s\-()]{10,15}$/, 'Número inválido'),
})

type FormValues = z.infer<typeof schema>

interface LeadFormProps {
  consentSource: string
  utmParams?: Record<string, string>
}

export function LeadForm({ consentSource, utmParams }: LeadFormProps) {
  const router = useRouter()
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
          consent_source: consentSource,
          metadata: { ...utmParams },
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error ?? 'Ocorreu um erro. Tente novamente.')
        return
      }

      // Redireciona para a biblioteca completa em tela cheia
      router.push('/ferramentas?acesso=liberado')
    } catch {
      setServerError('Erro de conexão. Verifique sua internet e tente novamente.')
    }
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
        <p className="rounded-md bg-error/10 px-4 py-3 text-sm text-error" role="alert">
          {serverError}
        </p>
      )}

      <p className="text-xs leading-relaxed text-(--color-text-muted)">
        Ao cadastrar, você autoriza o envio do link das ferramentas e comunicações do Gestor360®.
        Seus dados não serão vendidos ou compartilhados com terceiros.
      </p>

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? 'Enviando...' : 'Receber acesso gratuito'}
      </Button>
    </form>
  )
}
