import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: totalLeads }, { count: paginasPublicadas }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('pages').select('*', { count: 'exact', head: true }).eq('status', 'published'),
  ])

  const stats = [
    { label: 'Total de leads', value: totalLeads ?? 0, color: 'text-brand-blue' },
    { label: 'Páginas publicadas', value: paginasPublicadas ?? 0, color: 'text-brand-gold' },
  ]

  return (
    <div>
      <h1 className="font-display font-black text-[var(--text-heading)] text-[var(--color-text-title)] mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]"
          >
            <p className="text-sm text-[var(--color-text-muted)] mb-1">{label}</p>
            <p className={`font-display font-black text-4xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
