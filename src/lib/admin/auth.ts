import type { User } from '@supabase/supabase-js'

export function getAllowedAdminEmails() {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? ''

  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedAdmin(user: User | null) {
  if (!user?.email) return false

  const allowedEmails = getAllowedAdminEmails()
  if (allowedEmails.length === 0) return false

  return allowedEmails.includes(user.email.toLowerCase())
}
