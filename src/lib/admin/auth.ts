import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export function getAllowedAdminEmails() {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? ''
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

// Verifica somente via env var (uso síncrono legado — mantido por compatibilidade)
export function isAllowedAdmin(user: User | null) {
  if (!user?.email) return false
  const allowedEmails = getAllowedAdminEmails()
  if (allowedEmails.length === 0) return false
  return allowedEmails.includes(user.email.toLowerCase())
}

// Verifica env var + tabela admin_users (use em proxy e server actions)
export async function isAdminUser(email: string): Promise<boolean> {
  const normalized = email.toLowerCase()

  // Super admins via env var — verificação rápida sem DB
  const envEmails = getAllowedAdminEmails()
  if (envEmails.length > 0 && envEmails.includes(normalized)) return true

  // Usuários convidados via painel — consulta na tabela admin_users
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('admin_users')
      .select('ativo')
      .eq('email', normalized)
      .eq('ativo', true)
      .single()
    return !!data
  } catch {
    return false
  }
}

// Helper central para server actions — retorna o supabase client autenticado
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) redirect('/login')

  const allowed = await isAdminUser(user.email)
  if (!allowed) redirect('/login?error=unauthorized')

  return supabase
}

// Indica se o usuário atual é super admin (env var) — para controle de UI
export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return false
  const envEmails = getAllowedAdminEmails()
  return envEmails.includes(user.email.toLowerCase())
}
