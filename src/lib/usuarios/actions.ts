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

  const { error } = await admin.from('admin_users').insert({ email, nome: nome || null, criado_por })

  if (error) {
    const msg = error.code === '23505' ? 'Este e-mail já é um usuário admin.' : error.message
    redirect(`/admin/usuarios?error=${encodeURIComponent(msg)}`)
  }

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios?success=usuario-adicionado')
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
