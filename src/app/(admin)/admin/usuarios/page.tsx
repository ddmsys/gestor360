import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSuperAdmin, getAllowedAdminEmails } from '@/lib/admin/auth'
import { addAdminUser, toggleAdminUserAtivo, removeAdminUser } from '@/lib/usuarios/actions'
import { Badge } from '@/components/ui/Badge'

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [isSuper, params] = await Promise.all([isSuperAdmin(), searchParams])

  if (!isSuper) {
    redirect('/admin?error=sem-permissao')
  }

  const admin = createAdminClient()
  const { data: usuarios } = await admin
    .from('admin_users')
    .select('id, email, nome, ativo, criado_por, created_at')
    .order('created_at', { ascending: false })

  const superAdminEmails = getAllowedAdminEmails()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
          Usuários do Admin
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Delegue acesso ao painel para membros da equipe.
        </p>
      </div>

      {params.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          {params.success === 'usuario-adicionado' && 'Usuário adicionado. Ele já pode fazer login no admin.'}
          {params.success === 'convite-enviado' && 'Usuário autorizado e link enviado por e-mail.'}
          {params.success === 'usuario-removido' && 'Usuário removido com sucesso.'}
        </div>
      )}

      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          {decodeURIComponent(params.error)}
        </div>
      )}

      {/* Super admins (env var) */}
      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-title)]">
            Super admins
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Definidos via variável de ambiente <code className="bg-white px-1 rounded">ADMIN_EMAILS</code>. Acesso permanente.
          </p>
        </div>
        <ul className="divide-y divide-[var(--color-border)]">
          {superAdminEmails.map((email) => (
            <li key={email} className="px-6 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-title)]">{email}</span>
              <Badge variant="blue">Super admin</Badge>
            </li>
          ))}
          {superAdminEmails.length === 0 && (
            <li className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
              Nenhum super admin configurado em ADMIN_EMAILS.
            </li>
          )}
        </ul>
      </div>

      {/* Usuários convidados */}
      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-title)]">
            Usuários convidados
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Podem acessar o admin após fazer login com o e-mail cadastrado abaixo.
          </p>
        </div>

        {!usuarios || usuarios.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">Nenhum usuário convidado ainda.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Nome / E-mail
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Adicionado por
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {usuarios.map((u) => {
                const toggleAction = toggleAdminUserAtivo.bind(null, u.id, u.ativo)
                const removeAction = removeAdminUser.bind(null, u.id)
                return (
                  <tr key={u.id} className="hover:bg-[var(--color-bg-canvas)] transition-colors">
                    <td className="px-6 py-3">
                      {u.nome && (
                        <p className="font-semibold text-[var(--color-text-title)]">{u.nome}</p>
                      )}
                      <p className="text-[var(--color-text-body)]">{u.email}</p>
                    </td>
                    <td className="px-6 py-3 text-[var(--color-text-muted)]">
                      {u.criado_por ?? '—'}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={u.ativo ? 'success' : 'stone'}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <form action={toggleAction}>
                          <button
                            type="submit"
                            className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
                          >
                            {u.ativo ? 'Desativar' : 'Ativar'}
                          </button>
                        </form>
                        <form action={removeAction}>
                          <button
                            type="submit"
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Remover
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Formulário de convite */}
      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] p-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-title)] mb-4">
          Adicionar usuário
        </h2>
        <form action={addAdminUser} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px_auto]">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="funcionario@empresa.com"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
              Nome
            </label>
            <input
              name="nome"
              type="text"
              placeholder="Maria Silva"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-semibold bg-[var(--color-brand-blue)] text-white rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
            >
              Adicionar
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          Ao adicionar, o sistema autoriza o e-mail e envia um convite pelo Supabase Auth.
          Se a conta já existir, será enviado um link para redefinir a senha.
        </p>
      </div>
    </div>
  )
}
