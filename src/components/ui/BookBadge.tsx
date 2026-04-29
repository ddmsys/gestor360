/**
 * BookBadge — referência visual ao "Manual do Gestor360®"
 *
 * Usado onde o livro precisa ser citado com identidade própria,
 * separado do método oGestor360®.
 *
 * variant="inline"  — texto simples para uso dentro de parágrafos
 * variant="badge"   — chip com borda, para destaques e CTAs
 * variant="lockup"  — bloco vertical com rótulo "Livro" + título completo
 */

interface BookBadgeProps {
  variant?: "inline" | "badge" | "lockup";
  className?: string;
}

export function BookBadge({ variant = "inline", className }: BookBadgeProps) {
  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-(--color-brand-gold) text-xs font-semibold text-(--color-brand-gold) tracking-wide bg-(--color-brand-gold)/8 select-none ${className ?? ""}`}
      >
        <BookIcon />
        Manual do Gestor360®
      </span>
    );
  }

  if (variant === "lockup") {
    return (
      <div className={`flex flex-col gap-0.5 ${className ?? ""}`}>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
          Livro
        </span>
        <span className="font-display font-black text-lg leading-tight text-(--color-text-title)">
          Manual do <span className="text-brand-blue">Gestor</span>
          <span className="text-brand-gold">360</span>
          <span className="text-(--color-text-muted)">®</span>
        </span>
        <span className="text-xs text-(--color-text-muted)">
          DDM Editora · 2026
        </span>
      </div>
    );
  }

  // inline (padrão)
  return (
    <span
      className={`font-semibold text-(--color-text-title) ${className ?? ""}`}
    >
      Manual do Gestor360®
    </span>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 2.5A2.5 2.5 0 0 1 3.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5H11v-2H3.5a1 1 0 0 0-.5 1.873V14.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75zM2.5 1.5A1 1 0 0 0 2 3.373V11h9V1.5z" />
    </svg>
  );
}
