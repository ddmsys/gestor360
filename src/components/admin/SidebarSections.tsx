'use client'

import { useState } from 'react'
import type { PageSection } from '@/types/cms'
import { TYPE_LABELS, TYPE_ICONS } from '@/lib/cms/section-templates'

// ─── AlertDialog inline ────────────────────────────────────────────────────

function DeleteConfirmDialog({
  sectionLabel,
  onConfirm,
  onCancel,
}: {
  sectionLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar exclusão"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-6 w-full max-w-sm mx-4 z-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-title)] text-sm">
              Remover seção
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Tem certeza que quer remover a seção{' '}
              <strong className="text-[var(--color-text-body)]">{sectionLabel}</strong>?
              Esta ação não pode ser desfeita até você salvar.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-[var(--color-text-body)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-canvas)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-[var(--radius-md)] hover:bg-red-700 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SidebarSections ───────────────────────────────────────────────────────

interface SidebarSectionsProps {
  sections: PageSection[]
  selectedId: string | null
  onSelect: (id: string) => void
  onMove: (id: string, dir: 'up' | 'down') => void
  onToggleVisible: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onAdd: () => void
}

export function SidebarSections({
  sections,
  selectedId,
  onSelect,
  onMove,
  onToggleVisible,
  onDelete,
  onDuplicate,
  onAdd,
}: SidebarSectionsProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const sectionToDelete = sections.find((s) => s.id === confirmDeleteId)

  return (
    <>
      <aside
        className="flex flex-col shrink-0 overflow-hidden border-r border-[var(--color-border)] bg-white"
        style={{ width: 280 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Seções{' '}
            <span className="font-normal text-[var(--color-text-muted)]/60">
              ({sections.length})
            </span>
          </span>
          <button
            onClick={onAdd}
            aria-label="Adicionar seção"
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-brand-blue)] text-white hover:opacity-90 transition-opacity"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Lista de seções */}
        <ul className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
          {sections.length === 0 && (
            <li className="text-center py-8">
              <p className="text-xs text-[var(--color-text-muted)]">
                Nenhuma seção ainda.
              </p>
              <button
                onClick={onAdd}
                className="mt-2 text-xs font-semibold text-[var(--color-brand-blue)] hover:underline"
              >
                Adicionar seção →
              </button>
            </li>
          )}

          {sections.map((section, idx) => {
            const isSelected = section.id === selectedId
            const label = `${TYPE_ICONS[section.type]} ${TYPE_LABELS[section.type]}`

            return (
              <li key={section.id}>
                <div
                  onClick={() => onSelect(section.id)}
                  className={`rounded-[var(--radius-md)] cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--color-brand-blue)]/8 border border-[var(--color-brand-blue)]/25 ring-1 ring-[var(--color-brand-blue)]/20'
                      : 'hover:bg-[var(--color-bg-canvas)] border border-transparent'
                  } ${!section.visible ? 'opacity-50' : ''}`}
                >
                  {/* Linha principal */}
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    {/* Drag handle (visual) */}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[var(--color-border)] shrink-0"
                    >
                      <path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                    </svg>

                    {/* Tipo + índice */}
                    <span className="flex-1 min-w-0 text-xs font-medium text-[var(--color-text-body)] truncate">
                      {label}
                    </span>

                    {!section.visible && (
                      <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">
                        oculta
                      </span>
                    )}

                    {/* Botões ▲▼ */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onMove(section.id, 'up') }}
                        disabled={idx === 0}
                        aria-label="Mover para cima"
                        className="w-5 h-5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 15l-6-6-6 6" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onMove(section.id, 'down') }}
                        disabled={idx === sections.length - 1}
                        aria-label="Mover para baixo"
                        className="w-5 h-5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Ações expandidas (só quando selecionado) */}
                  {isSelected && (
                    <div
                      className="flex items-center gap-1 px-3 pb-2.5 border-t border-[var(--color-brand-blue)]/10 pt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Ocultar/Mostrar */}
                      <button
                        onClick={() => onToggleVisible(section.id)}
                        aria-label={section.visible ? 'Ocultar seção' : 'Mostrar seção'}
                        title={section.visible ? 'Ocultar' : 'Mostrar'}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-semibold text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-canvas)] transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {section.visible ? (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </>
                          ) : (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </>
                          )}
                        </svg>
                        {section.visible ? 'Ocultar' : 'Mostrar'}
                      </button>

                      {/* Duplicar ⎘ */}
                      <button
                        onClick={() => onDuplicate(section.id)}
                        aria-label="Duplicar seção"
                        title="Duplicar"
                        className="flex items-center justify-center w-8 h-7 text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-canvas)] transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                        </svg>
                      </button>

                      {/* Deletar */}
                      <button
                        onClick={() => setConfirmDeleteId(section.id)}
                        aria-label="Remover seção"
                        title="Remover"
                        className="flex items-center justify-center w-8 h-7 text-red-400 border border-red-100 rounded-[var(--radius-sm)] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        {/* Botão adicionar no rodapé */}
        <div className="shrink-0 p-3 border-t border-[var(--color-border)]">
          <button
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[var(--color-brand-blue)] border border-dashed border-[var(--color-brand-blue)]/30 rounded-[var(--radius-md)] hover:bg-[var(--color-brand-blue)]/5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Adicionar seção
          </button>
        </div>
      </aside>

      {/* AlertDialog de confirmação */}
      {confirmDeleteId && sectionToDelete && (
        <DeleteConfirmDialog
          sectionLabel={`${TYPE_LABELS[sectionToDelete.type]}`}
          onConfirm={() => {
            onDelete(confirmDeleteId)
            setConfirmDeleteId(null)
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </>
  )
}
