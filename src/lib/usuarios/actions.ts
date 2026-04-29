'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin, isSuperAdmin } from '@/lib/admin/auth'
import { createClient } from '@/lib/supabase/server'

const usuarioSchema = z.object({
  email: z.string().email('E-mail inválido.').toLowerCase().trim(),
  nome: z.string().trim().max(120).optional(),
})

function getSiteUrl() {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (vercelUrl) return vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`
  return 'https://ogestor360.com'
}

async function requireSuperAdmin() {
  await requireAdmin()
  const ok = await isSuperAdmin()
  if (!ok) redirect('/admin?error=sem-permissao')
}

async function getCurrentUserEmail(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email ?? ''
}

export async function addAdminUser(formData: FormData) {
  await requireSuperAdmin()

  const parsed = usuarioSchema.safeParse({
    email: formData.get('email'),
    nome: formData.get('nome'),
  })

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Dados inválidos.'
    redirect(`/admin/usuarios?error=${encodeURIComponent(msg)}`)
  }

  const { email, nome } = parsed.data
  const criado_por = await getCurrentUserEmail()
  const admin = createAdminClient()
  const siteUrl = getSiteUrl()
  const inviteRedirectTo = `${siteUrl}/auth/callback?type=invite`
  const recoveryRedirectTo = `${siteUrl}/auth/callback?type=recovery`

  const { error } = await admin.from('admin_users').insert({ email, nome: nome || null, criado_por })

  if (error) {
    const msg = error.code === '23505' ? 'Este e-mail já é um usuário admin.' : error.message
    redirect(`/admin/usuarios?error=${encodeURIComponent(msg)}`)
  }

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: inviteRedirectTo,
  })

  if (inviteError) {
    const alreadyExists =
      inviteError.message.toLowerCase().includes('already') ||
      inviteError.message.toLowerCase().includes('registered')

    if (alreadyExists) {
      const { error: resetError } = await admin.auth.resetPasswordForEmail(email, {
        redirectTo: recoveryRedirectTo,
      })
      if (resetError) {
        redirect(`/admin/usuarios?error=${encodeURIComponent(resetError.message)}`)
      }
    } else {
      redirect(`/admin/usuarios?error=${encodeURIComponent(inviteError.message)}`)
    }
  }

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios?success=convite-enviado')
}

export async function toggleAdminUserAtivo(id: string, ativo: boolean) {
  await requireSuperAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from('admin_users').update({ ativo: !ativo }).eq('id', id)
  if (error) redirect(`/admin/usuarios?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios')
}

export async function removeAdminUser(id: string) {
  await requireSuperAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from('admin_users').delete().eq('id', id)
  if (error) redirect(`/admin/usuarios?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios?success=usuario-removido')
}
