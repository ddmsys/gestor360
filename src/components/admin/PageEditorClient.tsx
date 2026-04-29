'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { PageSection, SectionType, SectionContent } from '@/types/cms'
import { SidebarSections } from '@/components/admin/SidebarSections'
import { PreviewCanvas } from '@/components/admin/PreviewCanvas'
import { RightPanel } from '@/components/admin/RightPanel'
import { SectionTemplatePicker } from '@/components/admin/SectionTemplatePicker'
import { SEODrawer } from '@/components/admin/SEODrawer'

interface PageData {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  description?: string
  og_image?: string
}

interface PageEditorClientProps {
  page: PageData
  initialSections: PageSection[]
}

// ─── StatusDropdown ────────────────────────────────────────────────────────

function StatusDropdown({
  status,
  onToggle,
  saving,
}: {
  status: 'published' | 'draft'
  onToggle: () => void
  saving: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isPublished = status === 'published'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={saving}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
          isPublished
            ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
            : 'bg-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/30'
        }`}
        aria-label="Alterar status da página"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-green-400' : 'bg-[var(--color-brand-gold)]'}`} />
        {isPublished ? 'Publicada' : 'Rascunho'}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 rounded-[var(--radius-md)] bg-[#2a2a2a] border border-white/10 shadow-[var(--shadow-md)] overflow-hidden z-50">
          <button
            type="button"
            onClick={() => { onToggle(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/80 hover:bg-white/10 transition-colors text-left"
          >
            {isPublished ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]" />
                Voltar para rascunho
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Publicar página
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── PageEditorClient ──────────────────────────────────────────────────────

export function PageEditorClient({ page, initialSections }: PageEditorClientProps) {
  const [sections, setSections] = useState<PageSection[]>(initialSections)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [pageStatus, setPageStatus] = useState<'published' | 'draft'>(page.status)
  const [statusSaving, setStatusSaving] = useState(false)
  const [showSEO, setShowSEO] = useState(false)
  const [autoSavedAt, setAutoSavedAt] = useState<Date | null>(null)

  const selectedSection = sections.find((s) => s.id === selectedId) ?? null

  // Aviso de alterações não salvas ao fechar/recarregar aba
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Autosave a cada 2 minutos quando há alterações não salvas
  useEffect(() => {
    if (!isDirty) return
    const id = setInterval(async () => {
      const res = await fetch(`/api/admin/pages/${page.id}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      })
      if (res.ok) {
        setIsDirty(false)
        setAutoSavedAt(new Date())
      }
    }, 120_000)
    return () => clearInterval(id)
  }, [isDirty, page.id, sections])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const markDirty = useCallback(() => setIsDirty(true), [])

  const moveSection = useCallback((id: string, dir: 'up' | 'down') => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx === -1) return prev
      const next = [...prev]
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= next.length) return prev
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
    markDirty()
  }, [markDirty])

  const toggleVisible = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    )
    markDirty()
  }, [markDirty])

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
    markDirty()
  }, [markDirty])

  const duplicateSection = useCallback((id: string) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx === -1) return prev
      const original = prev[idx]
      const copy: PageSection = {
        ...original,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
    markDirty()
  }, [markDirty])

  const addSection = useCallback(
    (type: SectionType, template: Partial<SectionContent>) => {
      const newSection: PageSection = {
        id: crypto.randomUUID(),
        page_id: page.id,
        type,
        order_index: sections.length,
        content: template as SectionContent,
        style: {},
        visible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setSections((prev) => [...prev, newSection])
      setSelectedId(newSection.id)
      setShowPicker(false)
      markDirty()
    },
    [page.id, sections.length, markDirty],
  )

  const updateSection = useCallback((updated: PageSection) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    markDirty()
  }, [markDirty])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      })
      if (res.ok) {
        setIsDirty(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }, [page.id, sections])

  const handleStatusToggle = useCallback(async () => {
    setStatusSaving(true)
    const nextStatus = pageStatus === 'published' ? 'draft' : 'published'
    try {
      // Salva as seções primeiro (se houver mudanças)
      if (isDirty) await handleSave()

      const res = await fetch(`/api/admin/pages/${page.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) setPageStatus(nextStatus)
    } finally {
      setStatusSaving(false)
    }
  }, [pageStatus, page.id, isDirty, handleSave])

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="-m-8 flex flex-col overflow-hidden h-screen">
      {/* TopBar */}
      <header className="shrink-0 flex items-center gap-3 px-4 h-13 bg-[#1A1A1A] border-b border-white/8">
        {/* Navegação */}
        <Link
          href="/admin/paginas"
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Páginas
        </Link>

        <div className="w-px h-4 bg-white/15 shrink-0" />

        {/* Título */}
        <span className="font-semibold text-sm text-white truncate max-w-[180px]">
          {page.title}
        </span>

        {/* Status dropdown */}
        <StatusDropdown
          status={pageStatus}
          onToggle={handleStatusToggle}
          saving={statusSaving}
        />

        {/* Slug */}
        <span className="text-xs text-white/30 font-mono hidden md:block">
          /{page.slug}
        </span>

        <div className="flex-1" />

        {/* Indicadores de estado */}
        {autoSavedAt && !isDirty && (
          <span className="text-[10px] text-white/35 shrink-0 font-mono">
            Auto-salvo {autoSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        {isDirty && !saving && (
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-brand-gold)] shrink-0 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)] animate-pulse" />
            Alterações não salvas
          </span>
        )}

        {/* SEO */}
        <button
          type="button"
          onClick={() => setShowSEO(true)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/70 border border-white/20 rounded-[var(--radius-md)] hover:bg-white/10 transition-colors"
          title="Editar metadados SEO"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          SEO
        </button>

        {/* Visualizar */}
        <a
          href={`/${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1.5 text-xs font-semibold text-white/70 border border-white/20 rounded-[var(--radius-md)] hover:bg-white/10 transition-colors"
        >
          Visualizar →
        </a>

        {/* Salvar */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !isDirty}
          className={`shrink-0 px-4 py-1.5 text-xs font-bold rounded-[var(--radius-md)] transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : isDirty
                ? 'bg-[var(--color-brand-gold)] text-[var(--color-bg-ink)] hover:opacity-90'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {saving ? 'Salvando…' : saved ? '✓ Salvo!' : 'Salvar'}
        </button>
      </header>

      {/* Corpo do editor: 3 colunas */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Coluna 1: Sidebar com lista de seções */}
        <SidebarSections
          sections={sections}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
          onMove={moveSection}
          onToggleVisible={toggleVisible}
          onDelete={deleteSection}
          onDuplicate={duplicateSection}
          onAdd={() => setShowPicker(true)}
        />

        {/* Coluna 2: Preview */}
        <PreviewCanvas
          sections={sections}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={() => setShowPicker(true)}
        />

        {/* Coluna 3: Painel direito (só quando há seção selecionada) */}
        {selectedSection && (
          <RightPanel
            section={selectedSection}
            onChange={updateSection}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      {/* Modal de seleção de template */}
      {showPicker && (
        <SectionTemplatePicker
          onSelect={addSection}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Drawer de SEO */}
      {showSEO && (
        <SEODrawer
          pageId={page.id}
          initial={{
            title:       page.title       ?? '',
            description: page.description ?? '',
            og_image:    page.og_image    ?? '',
          }}
          onClose={() => setShowSEO(false)}
          onSaved={() => setShowSEO(false)}
        />
      )}
    </div>
  )
}
