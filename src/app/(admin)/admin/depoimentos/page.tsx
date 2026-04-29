import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAllowedAdmin } from '@/lib/admin/auth'

async function toggleAprovado(id: string, aprovado: boolean) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) redirect('/login?error=unauthorized')

  await supabase.from('depoimentos').update({ aprovado: !aprovado }).eq('id', id)
  revalidatePath('/admin/depoimentos')
  redirect('/admin/depoimentos')
}

async function deleteDepoimento(id: string) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) redirect('/login?error=unauthorized')

  await supabase.from('depoimentos').delete().eq('id', id)
  revalidatePath('/admin/depoimentos')
  redirect('/admin/depoimentos?success=removido')
}

interface Props {
  searchParams: Promise<{ filter?: 'aprovados' | 'pendentes' }>
}

export default async function DepoimentosPage({ searchParams }: Props) {
  const { filter } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('depoimentos')
    .select('*')
    .order('created_at', { ascending: false })

  if (filter === 'aprovados') query = query.eq('aprovado', true)
  if (filter === 'pendentes') query = query.eq('aprovado', false)

  const { data: depoimentos } = await query

  const aprovados = depoimentos?.filter((d) => d.aprovado).length ?? 0
  const pendentes = depoimentos?.filter((d) => !d.aprovado).length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
            Depoimentos
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {aprovados} aprovados · {pendentes} pendentes
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {[
          { href: '/admin/depoimentos', label: 'Todos' },
          { href: '/admin/depoimentos?filter=aprovados', label: 'Aprovados' },
          { href: '/admin/depoimentos?filter=pendentes', label: 'Pendentes' },
        ].map(({ href, label }) => {
          const isActive =
            (label === 'Todos' && !filter) ||
            (label === 'Aprovados' && filter === 'aprovados') ||
            (label === 'Pendentes' && filter === 'pendentes')
          return (
            <a
              key={label}
              href={href}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-full)] transition-colors ${
                isActive
                  ? 'bg-[var(--color-brand-blue)] text-white'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
              }`}
            >
              {label}
            </a>
          )
        })}
      </div>

      <div className="space-y-3">
        {!depoimentos || depoimentos.length === 0 ? (
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">Nenhum depoimento encontrado.</p>
          </div>
        ) : (
          depoimentos.map((dep) => {
            const toggle = toggleAprovado.bind(null, dep.id, dep.aprovado)
            const remove = deleteDepoimento.bind(null, dep.id)

            return (
              <div
                key={dep.id}
                className={`bg-white rounded-[var(--radius-lg)] border shadow-[var(--shadow-xs)] p-4 ${
                  dep.aprovado ? 'border-green-200' : 'border-[var(--color-border)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {dep.foto_url && (
                    <img
                      src={dep.foto_url}
                      alt={dep.nome}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[var(--color-text-title)]">
                        {dep.nome}
                      </span>
                      {dep.cargo && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          · {dep.cargo}
                          {dep.empresa && ` @ ${dep.empresa}`}
                        </span>
                      )}
                      <span
                        className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-full)] ${
                          dep.aprovado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {dep.aprovado ? 'Aprovado' : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-body)] line-clamp-3">
                      "{dep.texto}"
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      {new Date(dep.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
                  <form action={toggle}>
                    <button
                      type="submit"
                      className={`px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-md)] transition-colors ${
                        dep.aprovado
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {dep.aprovado ? 'Reprovar' : 'Aprovar'}
                    </button>
                  </form>
                  <form action={remove}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 rounded-[var(--radius-md)] hover:bg-red-50 transition-colors"
                    >
                      Deletar
                    </button>
                  </form>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
