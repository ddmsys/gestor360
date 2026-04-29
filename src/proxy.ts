import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

async function isAdminUserInDb(email: string): Promise<boolean> {
  try {
    const admin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data } = await admin
      .from('admin_users')
      .select('ativo')
      .eq('email', email.toLowerCase())
      .eq('ativo', true)
      .single()
    return !!data
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Atualiza sessão (obrigatório para SSR com Supabase)
  const { data: { user } } = await supabase.auth.getUser()

  // Protege todas as rotas /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    const email = user.email?.toLowerCase() ?? ''

    // Super admins via env var
    const envEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
      .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)

    const isEnvAdmin = envEmails.length > 0 && envEmails.includes(email)
    const isDbAdmin = isEnvAdmin ? false : await isAdminUserInDb(email)

    if (!isEnvAdmin && !isDbAdmin) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
