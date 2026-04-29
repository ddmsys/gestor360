import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { isAllowedAdmin } from '@/lib/admin/auth'
import { createClient } from '@/lib/supabase/server'
import { Logo } from '@/components/ui/Logo'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function signOut() {
    'use server'

    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const userPromise = getAdminUser()

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-canvas)]">
      <aside className="flex w-64 shrink-0 flex-col bg-[var(--color-bg-ink)] text-white">
        <div className="p-6 border-b border-white/10">
          <Logo variant="full" theme="dark" height={36} />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
            Admin
          </p>
        </div>
        <nav className="p-4" aria-label="Navegação admin">
          <ul className="flex flex-col gap-1" role="list">
            {[
              { href: '/admin', label: 'Dashboard' },
              { href: '/admin/paginas', label: 'Páginas' },
              { href: '/admin/leads', label: 'Leads' },
              { href: '/admin/ferramentas', label: 'Ferramentas' },
              { href: '/admin/blog', label: 'Blog' },
              { href: '/admin/depoimentos', label: 'Depoimentos' },
              { href: '/admin/design', label: 'Design Studio' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block px-3 py-2 rounded-[var(--radius-md)] text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-[var(--transition-fast)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto border-t border-white/10 p-4">
          <UserSummary userPromise={userPromise} signOut={signOut} />
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

async function UserSummary({
  userPromise,
  signOut,
}: {
  userPromise: ReturnType<typeof getAdminUser>
  signOut: () => Promise<void>
}) {
  const user = await userPromise

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
        Logado como
      </p>
      <p className="mt-1 truncate text-sm text-white/78">{user.email}</p>
      <form action={signOut} className="mt-4">
        <button
          type="submit"
          className="w-full rounded-[var(--radius-md)] border border-white/12 px-3 py-2 text-left text-sm font-semibold text-white/70 transition-colors duration-[var(--transition-fast)] hover:bg-white/10 hover:text-white"
        >
          Sair
        </button>
      </form>
    </div>
  )
}

async function getAdminUser(): Promise<User> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAllowedAdmin(user)) {
    await supabase.auth.signOut()
    redirect('/login?error=unauthorized')
  }

  return user
}
