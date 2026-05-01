'use client'

import { useState, useEffect } from 'react'

interface NavLink {
  href: string
  label: string
}

interface NavConfig {
  links: NavLink[]
  cta_label: string
  cta_href: string
}

interface FooterConfig {
  tagline: string
  endereco: string
  email: string
  copyright: string
  nota_livro: string
}

type Tab = 'nav' | 'footer'

function LinkEditor({
  links,
  onChange,
}: {
  links: NavLink[]
  onChange: (links: NavLink[]) => void
}) {
  function update(index: number, field: keyof NavLink, value: string) {
    const next = links.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    onChange(next)
  }

  function remove(index: number) {
    onChange(links.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...links, { href: '/', label: '' }])
  }

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={link.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            placeholder="Rótulo (ex: O Método)"
            className="flex-1 h-9 px-3 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30"
          />
          <input
            type="text"
            value={link.href}
            onChange={(e) => update(i, 'href', e.target.value)}
            placeholder="/rota"
            className="w-40 h-9 px-3 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 font-mono"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remover link"
            className="shrink-0 w-9 h-9 flex items-center justify-center text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 rounded-[var(--radius-md)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-[var(--color-brand-blue)] hover:underline mt-1"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Adicionar link
      </button>
    </div>
  )
}

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<Tab>('nav')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const [nav, setNav] = useState<NavConfig>({
    links: [],
    cta_label: '',
    cta_href: '',
  })

  const [footer, setFooter] = useState<FooterConfig>({
    tagline: '',
    endereco: '',
    email: '',
    copyright: '',
    nota_livro: '',
  })

  useEffect(() => {
    fetch('/api/admin/site-config/current')
      .then((r) => r.json())
      .then((data) => {
        if (data.nav) setNav(data.nav)
        if (data.footer) setFooter(data.footer)
      })
      .catch(() => {})
  }, [])

  async function save(key: Tab) {
    setSaving(true)
    setToast(null)
    try {
      const value = key === 'nav' ? nav : footer
      const res = await fetch('/api/admin/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.formErrors?.[0] ?? 'Erro ao salvar')
      }
      setToast({ type: 'success', msg: `${key === 'nav' ? 'Navegação' : 'Rodapé'} salvo com sucesso!` })
    } catch (e) {
      setToast({ type: 'error', msg: String(e instanceof Error ? e.message : e) })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const inputClass =
    'w-full h-9 px-3 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30'

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
          Configurações do site
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Edite a navegação e o rodapé. As alterações são aplicadas ao site ao salvar.
        </p>
      </div>

      {toast && (
        <div
          className={`mb-6 rounded-[var(--radius-md)] px-4 py-3 text-sm ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-bg-canvas)] rounded-[var(--radius-lg)] border border-[var(--color-border)] mb-6 w-fit">
        {(['nav', 'footer'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-[var(--radius-md)] transition-all ${
              tab === t
                ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
            }`}
          >
            {t === 'nav' ? 'Navegação (Header)' : 'Rodapé (Footer)'}
          </button>
        ))}
      </div>

      {/* Aba Nav */}
      {tab === 'nav' && (
        <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-6">
          <div>
            <h2 className="font-display font-bold text-base text-[var(--color-text-title)] mb-4">
              Links da navegação
            </h2>
            <LinkEditor links={nav.links} onChange={(links) => setNav({ ...nav, links })} />
          </div>

          <div className="border-t border-[var(--color-border)] pt-6">
            <h2 className="font-display font-bold text-base text-[var(--color-text-title)] mb-4">
              Botão CTA
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                  Texto do botão
                </label>
                <input
                  type="text"
                  value={nav.cta_label}
                  onChange={(e) => setNav({ ...nav, cta_label: e.target.value })}
                  className={inputClass}
                  placeholder="ex: Falar com um Conselheiro"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                  Destino do botão
                </label>
                <input
                  type="text"
                  value={nav.cta_href}
                  onChange={(e) => setNav({ ...nav, cta_href: e.target.value })}
                  className={`${inputClass} font-mono`}
                  placeholder="ex: /mentoria"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => save('nav')}
              disabled={saving}
              className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar navegação →'}
            </button>
          </div>
        </section>
      )}

      {/* Aba Footer */}
      {tab === 'footer' && (
        <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base text-[var(--color-text-title)]">
              Informações do rodapé
            </h2>

            {(
              [
                { key: 'tagline', label: 'Tagline (frase abaixo do logo)', placeholder: 'Liderar é servir. Servir é amar com estratégia.' },
                { key: 'endereco', label: 'Endereço', placeholder: 'Alameda Rio Negro 585, Alphaville — SP' },
                { key: 'email', label: 'E-mail de contato', placeholder: 'contato@ogestor360.com' },
                { key: 'copyright', label: 'Texto de copyright ({year} será substituído pelo ano atual)', placeholder: '© {year} oGestor360® — DDM Editora. Todos os direitos reservados.' },
                { key: 'nota_livro', label: 'Nota do livro (rodapé inferior direito)', placeholder: 'Livro publicado em abril de 2026' },
              ] as { key: keyof FooterConfig; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={footer[key] as string}
                  onChange={(e) => setFooter({ ...footer, [key]: e.target.value })}
                  className={inputClass}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] pt-6">
          <div className="flex items-start gap-3 rounded-md bg-blue-50 border border-blue-100 p-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-blue-500 mt-0.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            <p className="text-sm text-blue-700 leading-relaxed">
              Os links do rodapé são os mesmos da navegação — edite-os na aba <strong>Navegação (Header)</strong>.
            </p>
          </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => save('footer')}
              disabled={saving}
              className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar rodapé →'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
