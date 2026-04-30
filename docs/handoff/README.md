# Handoff: Admin CMS — Editor de Páginas + Painel de Estilo

> **Para o Claude Code:** Este pacote contém referências de design criadas em HTML e TypeScript.
> **NÃO copie o HTML diretamente.** Implemente usando a stack do projeto:
> Next.js 14 · App Router · TypeScript · Tailwind CSS v4 · Supabase · React Hook Form + Zod

---

## Visão Geral

O objetivo é transformar o painel admin existente (`/admin/paginas/[id]`) num editor
de páginas visual onde a equipe de marketing consiga:

1. **Reordenar seções** da página via drag & drop (ou botões ▲▼)
2. **Adicionar seções** a partir de templates pré-prontos (sem JSON)
3. **Editar conteúdo** via formulários gerados automaticamente por tipo de seção
4. **Estilizar cada seção** individualmente (cor, tipografia, espaçamento, efeitos)

---

## Fidelidade

**Alta fidelidade (hifi).** O protótipo HTML é pixel-preciso em termos de layout,
componentes, fluxos e interações. Reproduza-o fielmente usando os tokens do
design system (`gestor360-tokens.css`) e os componentes UI já existentes em
`src/components/ui/`.

---

## Arquivos de referência neste pacote

| Arquivo | Descrição |
|---------|-----------|
| `Gestor360 Admin CMS.html` | Protótipo interativo completo — abra no browser |
| `types/section-style.ts` | Tipos TypeScript do sistema de estilo (novo) |
| `lib/cms/style-schemas.ts` | Schemas Zod para validação do estilo |
| `supabase/add-style-column.sql` | Migration para adicionar coluna `style` à tabela `page_sections` |
| `components/admin/PageEditor.spec.md` | Spec detalhada de cada componente do editor |

---

## Estrutura de rotas a implementar

```
src/app/(admin)/admin/
└── paginas/
    ├── page.tsx                ← JÁ EXISTE — apenas adicionar botão "Editar"
    ├── nova/
    │   └── page.tsx            ← JÁ EXISTE — manter
    └── [id]/
        └── page.tsx            ← IMPLEMENTAR: PageEditor completo
```

---

## Banco de dados — mudanças necessárias

### 1. Coluna `style` em `page_sections`

Adicionar coluna `style JSONB DEFAULT '{}'::jsonb` à tabela existente.
Ver `supabase/add-style-column.sql` neste pacote.

### 2. Schema atual de `page_sections` (referência)

```sql
page_sections (
  id          uuid PRIMARY KEY,
  page_id     uuid REFERENCES pages(id) ON DELETE CASCADE,
  type        text NOT NULL,          -- 'hero' | 'cards' | 'form' etc.
  order_index integer NOT NULL,
  content     jsonb NOT NULL,         -- JÁ EXISTE — dados do conteúdo
  style       jsonb DEFAULT '{}',     -- NOVO — dados de estilo visual
  visible     boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
)
```

---

## Componentes a criar

### `/admin/paginas/[id]/page.tsx` — PageEditor (Server Component wrapper)

```tsx
// Busca page + sections do Supabase, passa para PageEditorClient
export default async function PageEditorPage({ params }) {
  const supabase = await createClient()
  const page = await supabase.from('pages').select('*').eq('id', params.id).single()
  const sections = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', params.id)
    .order('order_index')
  return <PageEditorClient page={page.data} initialSections={sections.data} />
}
```

### `PageEditorClient` — Client Component principal

**Layout de 3 colunas:**
```
[SidebarSections 280px] [PreviewCanvas flex-1] [StyleContentPanel 340px]
```

**Estado necessário:**
```ts
const [sections, setSections] = useState<PageSection[]>(initialSections)
const [selectedId, setSelectedId] = useState<string | null>(null)
const [showPicker, setShowPicker] = useState(false)
const [activeTab, setActiveTab] = useState<'conteudo' | 'estilo'>('conteudo')
const [saving, setSaving] = useState(false)
```

**Ações:**
- `handleSave()` — PATCH `/api/admin/pages/[id]/sections` com array completo
- `moveSection(id, 'up' | 'down')` — reordena `order_index`
- `toggleVisible(id)` — toggle `visible`
- `deleteSection(id)` — remove com confirmação
- `addSection(type, template)` — adiciona no final

### `SectionTemplatePicker` — Modal de seleção

- Modal com lista lateral de tipos + grid de templates
- Ao selecionar: cria novo `PageSection` com `content` pré-preenchido + `style: {}`
- Ver `SECTION_TYPES` no HTML de referência para os dados completos

### `SectionContentEditor` — Formulário de conteúdo

Dispatch por tipo — usar `react-hook-form` + Zod schemas de `docs/cms-fields.md`:

```tsx
const EDITORS = {
  hero: HeroContentEditor,
  cards: CardsContentEditor,
  form: FormContentEditor,
  cta: CTAContentEditor,
  text: TextContentEditor,
  faq: FAQContentEditor,
  // demais: editor genérico
}
```

### `SectionStyleEditor` — Painel de estilo (NOVO)

4 sub-abas: **Fundo · Tipo · Espaço · Efeitos**

Ver tipos em `types/section-style.ts` e spec completa em `components/admin/PageEditor.spec.md`.

---

## API Routes necessárias

### `PUT /api/admin/pages/[id]/sections`

Salva o estado completo das seções da página.

```ts
// Request body
{
  sections: Array<{
    id: string
    type: SectionType
    order_index: number
    content: SectionContent
    style: SectionStyle      // NOVO
    visible: boolean
  }>
}
```

**Lógica:** upsert em `page_sections`, deletar seções removidas, atualizar `pages.updated_at`.

---

## Design tokens a usar

Todos os tokens já existem em `src/styles/gestor360-tokens.css`. Use sempre via CSS vars:

| Necessidade | Token |
|-------------|-------|
| Cor primária | `var(--color-brand-blue)` → `#1F3F7A` |
| Cor de acento | `var(--color-brand-gold)` → `#D4A020` |
| Fundo canvas | `var(--color-bg-canvas)` → `#E8E6E1` |
| Fundo canvas2 | `#F4F2ED` (não tem token — use literal) |
| Borda padrão | `var(--color-border)` → `#D8D5CF` |
| Radius médio | `var(--radius-md)` → `8px` |
| Sombra média | `var(--shadow-md)` |
| Fonte display | `var(--font-display)` → Gotham |
| Fonte corpo | `var(--font-body)` → DM Sans |

---

## Paletas do StyleEditor

Estas paletas devem ser hardcoded no componente `SectionStyleEditor`:

```ts
export const COLOR_PALETTES = [
  { label: 'Brand',  colors: ['#1F3F7A','#D4A020','#8B8B8B','#E8E6E1','#1A1A1A','#FFFFFF'] },
  { label: 'Quente', colors: ['#7C2D12','#B45309','#D97706','#FEF3C7','#FFF7ED','#FFFFFF'] },
  { label: 'Frio',   colors: ['#1E3A5F','#1D4ED8','#60A5FA','#DBEAFE','#EFF6FF','#FFFFFF'] },
  { label: 'Terra',  colors: ['#44403C','#78716C','#A8A29E','#D6D3D1','#F5F5F4','#FAFAF9'] },
  { label: 'Verde',  colors: ['#14532D','#166534','#15803D','#BBF7D0','#DCFCE7','#F0FDF4'] },
]

export const GRADIENT_PRESETS = [
  { label: 'Nenhum',     value: '' },
  { label: '360 Brand',  value: 'linear-gradient(135deg, #1F3F7A 0%, #1A1A1A 100%)' },
  { label: 'Dourado',    value: 'linear-gradient(135deg, #D4A020 0%, #7C2D12 100%)' },
  { label: 'Azul frio',  value: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)' },
  { label: 'Canvas',     value: 'linear-gradient(180deg, #E8E6E1 0%, #F4F2ED 100%)' },
  { label: 'Escuro',     value: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)' },
]

export const FONT_PAIRS = [
  { label: 'Gotham + DM Sans',       display: 'gotham, sans-serif',                  body: "'DM Sans', sans-serif"   },
  { label: 'Playfair + DM Sans',     display: "'Playfair Display', serif",           body: "'DM Sans', sans-serif"   },
  { label: 'Montserrat + Inter',     display: "'Montserrat', sans-serif",            body: "'Inter', sans-serif"     },
  { label: 'Cormorant + DM Sans',    display: "'Cormorant Garamond', serif",         body: "'DM Sans', sans-serif"   },
  { label: 'Space Grotesk + Inter',  display: "'Space Grotesk', sans-serif",         body: "'Inter', sans-serif"     },
]

export const SHADOW_PRESETS = [
  { label: 'Nenhuma', value: 'none' },
  { label: 'Suave',   value: '0 2px 12px rgba(0,0,0,0.06)' },
  { label: 'Média',   value: '0 4px 24px rgba(0,0,0,0.10)' },
  { label: 'Forte',   value: '0 8px 40px rgba(0,0,0,0.16)' },
  { label: 'Azul',    value: '0 4px 24px rgba(31,63,122,0.25)' },
  { label: 'Dourada', value: '0 4px 24px rgba(212,160,32,0.30)' },
]
```

---

## Como o `style` é aplicado no SectionRenderer

Após implementar o editor, o `SectionRenderer.tsx` deve aceitar e aplicar o `style`:

```tsx
// SectionRenderer.tsx — atualizar para aceitar style
export function SectionRenderer({ section }: { section: PageSection }) {
  const sectionStyle = buildSectionStyle(section.style)  // helper abaixo
  return (
    <div style={sectionStyle}>
      {/* switch atual permanece igual */}
    </div>
  )
}

// lib/cms/build-section-style.ts — helper novo
export function buildSectionStyle(style: SectionStyle = {}): React.CSSProperties {
  return {
    background: style.gradient || style.bgColor || undefined,
    paddingTop: style.paddingY || undefined,
    paddingBottom: style.paddingY || undefined,
    paddingLeft: style.paddingX ? `${style.paddingX}px` : undefined,
    paddingRight: style.paddingX ? `${style.paddingX}px` : undefined,
    borderRadius: style.borderRadius || undefined,
    boxShadow: style.shadow !== 'none' ? style.shadow : undefined,
    backdropFilter: style.blur ? `blur(${style.blurAmount || 8}px)` : undefined,
    border: style.border ? `1.5px solid ${style.borderColor || '#D8D5CF'}` : undefined,
    '--section-title-color': style.titleColor,
    '--section-text-color': style.textColor,
    '--section-font-display': style.fontPair
      ? FONT_PAIRS.find(f => f.label === style.fontPair)?.display
      : undefined,
  } as React.CSSProperties
}
```

---

## Checklist de implementação

### Fase 1 — estrutura base
- [ ] Migration SQL: adicionar coluna `style` em `page_sections`
- [ ] Atualizar tipo `PageSection` em `src/types/cms.ts` para incluir `style?: SectionStyle`
- [ ] Criar `src/types/section-style.ts` (arquivo neste pacote)
- [ ] Criar `src/lib/cms/style-schemas.ts` (arquivo neste pacote)
- [ ] Criar `src/lib/cms/build-section-style.ts`

### Fase 2 — editor de conteúdo
- [ ] `src/app/(admin)/admin/paginas/[id]/page.tsx` — Server wrapper
- [ ] `src/components/admin/PageEditorClient.tsx` — layout 3 colunas
- [ ] `src/components/admin/SidebarSections.tsx` — lista + reordenação
- [ ] `src/components/admin/SectionTemplatePicker.tsx` — modal de templates
- [ ] `src/components/admin/editors/HeroContentEditor.tsx`
- [ ] `src/components/admin/editors/CardsContentEditor.tsx`
- [ ] `src/components/admin/editors/FormContentEditor.tsx`
- [ ] `src/components/admin/editors/CTAContentEditor.tsx`
- [ ] `src/components/admin/editors/TextContentEditor.tsx`
- [ ] `src/components/admin/editors/FAQContentEditor.tsx`

### Fase 3 — editor de estilo
- [ ] `src/components/admin/style/SectionStyleEditor.tsx` — painel principal
- [ ] `src/components/admin/style/StyleColorPicker.tsx`
- [ ] `src/components/admin/style/StyleGradientPicker.tsx`
- [ ] `src/components/admin/style/StyleFontPicker.tsx`
- [ ] `src/components/admin/style/StyleSpacingControls.tsx`
- [ ] `src/components/admin/style/StyleEffectsControls.tsx`

### Fase 4 — save + render
- [ ] `src/app/api/admin/pages/[id]/sections/route.ts` — PUT endpoint
- [ ] Atualizar `SectionRenderer.tsx` para aceitar e aplicar `style`
- [ ] Criar `src/lib/cms/build-section-style.ts`

---

_Gerado em Abril 2026 — DDM Editora_
_Design: Daiana Di Morais — Protótipo: Claude_
