'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/auth'
import type { DesignConfig } from './config'

export async function saveDesignConfig(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) redirect('/login?error=unauthorized')

  const config: DesignConfig = {
    palette: (String(formData.get('palette') ?? 'default')) as DesignConfig['palette'],
    font_body: (String(formData.get('font_body') ?? 'dm-sans')) as DesignConfig['font_body'],
    font_display: (String(formData.get('font_display') ?? 'gotham')) as DesignConfig['font_display'],
    type_scale: (String(formData.get('type_scale') ?? 'normal')) as DesignConfig['type_scale'],
  }

  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'design', value: config, updated_at: new Date().toISOString() })

  if (error) {
    redirect(`/admin/design?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/admin/design?success=design-salvo')
}
