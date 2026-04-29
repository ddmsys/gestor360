'use client'

import { useState, useEffect, useRef } from 'react'

interface SEOData {
  title: string
  description: string
  og_image: string
}

interface SEODrawerProps {
  pageId: string
  initial: SEOData
  onClose: () => void
  onSaved: (data: SEOData) => void
}

const TITLE_MAX       = 60
const DESCRIPTION_MAX = 160

function CharCounter({ value, max }: { value: string; max: number }) {
  const len  = value.length
  const over = len > max
  return (
    <span className={`text-[10px] font-mono tabular-nums ${over ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
      {len}/{max}
    </span>
  )
}

export function SEODrawer({ pageId, initial, onClose, onSaved }: SEODrawerProps) {
  const [data,   setData]   = useState<SEOData>(initial)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  // ESC fecha
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const patch = (partial: Partial<SEOData>) => {
    setData((prev) => ({ ...prev, ...partial }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/meta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        onSaved(data)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-[var(--color-border)] shadow-[var(--shadow-md)] z-50 flex flex-col">
        {/* Header */}
        <div className="shrink-0 flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--color-border)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-brand-blue)]">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span className="font-bold text-sm text-[var(--color-text-title)] flex-1">
            SEO & Metadados
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-canvas)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Campos */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--color-text-title)]">
                Título da página
              </label>
              <CharCounter value={data.title} max={TITLE_MAX} />
            </div>
            <input
              type="text"
              value={data.title}
              maxLength={120}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Título para o Google (máx. 60 caracteres)"
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/30"
            />
            {/* Preview da serp */}
            <div className="mt-1 px-3 py-2 rounded-[var(--radius-md)] bg-[#F4F2ED] border border-[var(--color-border)]">
              <p className="text-[10px] text-[var(--color-text-muted)] mb-1 font-semibold uppercase tracking-wider">
                Preview Google
              </p>
              <p className="text-[13px] font-medium text-[#1a0dab] truncate">
                {data.title || 'Título da página'}
              </p>
              <p className="text-[11px] text-[#006621]">gestor360.com.br</p>
              <p className="text-[11px] text-[#545454] line-clamp-2 mt-0.5">
                {data.description || 'Descrição da página aparecerá aqui…'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--color-text-title)]">
                Meta description
              </label>
              <CharCounter value={data.description} max={DESCRIPTION_MAX} />
            </div>
            <textarea
              value={data.description}
              maxLength={300}
              rows={4}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="Descrição para o Google (máx. 160 caracteres)"
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/30 resize-none"
            />
          </div>

          {/* OG Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-title)]">
              Imagem OG (Open Graph)
            </label>
            <input
              type="url"
              value={data.og_image}
              onChange={(e) => patch({ og_image: e.target.value })}
              placeholder="https://…/og-image.jpg (1200×630)"
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/30"
            />
            {data.og_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.og_image}
                alt="Preview OG"
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] object-cover aspect-[1200/630]"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <p className="text-[10px] text-[var(--color-text-muted)]">
              Recomendado: 1200×630 px. Usado no compartilhamento em redes sociais.
            </p>
          </div>
        </div>

        {/* Footer com botão salvar */}
        <div className="shrink-0 px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-canvas)]/50">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-2 text-sm font-bold rounded-[var(--radius-md)] transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-[var(--color-brand-blue)] text-white hover:opacity-90'
            }`}
          >
            {saving ? 'Salvando…' : saved ? '✓ Salvo!' : 'Salvar metadados'}
          </button>
        </div>
      </aside>
    </>
  )
}
