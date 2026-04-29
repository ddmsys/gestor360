import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  // Fluxo de e-mail: confirmação de cadastro e recuperação de senha
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  // Fluxo OAuth (Google, GitHub etc.) — mantido para o futuro
  const code = searchParams.get('code')

  const supabase = await createClient()

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'recovery' | 'invite' | 'magiclink',
    })

    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/login/nova-senha`)
      }
      return NextResponse.redirect(`${origin}/admin`)
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/admin`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link-invalido`)
}
