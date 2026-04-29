'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Supabase redireciona erros de auth para o Site URL como hash fragments.
// Ex: /#error=access_denied&error_code=otp_expired
// Este componente intercepta, lê o hash e redireciona para /login com mensagem.
export function AuthErrorRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash || !hash.includes('error=')) return

    const params = new URLSearchParams(hash.slice(1)) // remove o '#'
    const code = params.get('error_code')

    let errorKey = 'link-invalido'
    if (code === 'otp_expired') errorKey = 'link-expirado'

    // Limpa o hash antes de redirecionar
    window.history.replaceState(null, '', window.location.pathname)
    router.replace(`/login?error=${errorKey}`)
  }, [router])

  return null
}
