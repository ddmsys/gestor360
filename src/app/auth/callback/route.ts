import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type') // 'recovery' para redefinição de senha

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/login/nova-senha`)
      }
      // Confirmação de cadastro ou login com link mágico
      return NextResponse.redirect(`${origin}/admin`)
    }
  }

  // Em caso de erro ou code ausente, volta para o login com mensagem
  return NextResponse.redirect(`${origin}/login?error=link-invalido`)
}
