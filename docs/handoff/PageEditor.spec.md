# Spec de Componentes — Admin Page Editor
# Gestor360® CMS — Abril 2026

> Referência de implementação para o Claude Code.
> Descreve layout, props, estado e comportamento de cada componente.
> Veja o protótipo interativo em `Gestor360 Admin CMS.html`.

---

## 1. PageEditorClient

**Arquivo:** `src/components/admin/PageEditorClient.tsx`
**Tipo:** Client Component (`'use client'`)

### Props
```ts
interface PageEditorClientProps {
  page: {
    id: string
    title: string
    slug: string
    status: 'published' | 'draft'
  }
  initialSections: PageSection[]
}
```

### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ TopBar (height: 52px, bg: #1A1A1A)                                  │
├───────────────┬─────────────────────────────┬───────────────────────┤
│ SidebarSection│     PreviewCanvas           │  RightPanel           │
│ (280px)       │     (flex-1)                │  (340px)              │
│               │                             │                       │
│ Lista de      │  Prévia das seções          │  Tabs:                │
│ seções +      │  Clique p/ selecionar       │  [Conteúdo] [Estilo]  │
│ reordenação   │                             │                       │
│               │                             │  Formulário           │
│               │                             │  de edição            │
└───────────────┴─────────────────────────────┴───────────────────────┘
```

### Estado
```ts
const [sections, setSections]     = useState<PageSection[]>(initialSections)
const [selectedId, setSelectedId] = useState<string | null>(null)
const [showPicker, setShowPicker] = useState(false)
const [saving, setSaving]         = useState(false)
const [saved, setSaved]           = useState(false)  // feedback "Salvo!"
```

### Handlers
```ts
// Reordenar
const moveSection = (id: string, dir: 'up' | 'down') => { ... }

// Visibilidade
const toggleVisible = (id: string) => { ... }

// Deletar (sem confirmação no protótipo, mas recomendado alert/dialog)
const deleteSection = (id: string) => { ... }

// Adicionar via template
const addSection = (type: SectionType, template: Partial<SectionContent>) => {
  const newSection: PageSection = {
    id: crypto.randomUUID(),
    page_id: page.id,
    type,
    order_index: sections.length,
    content: template as SectionContent,
    style: {},
    visible: true,
    created_at: new Date().toISOString(),
  }
  setSections(prev => [...prev, newSection])
  setSelectedId(newSection.id)
  setShowPicker(false)
}

// Salvar no Supabase
const handleSave = async () => {
  setSaving(true)
  try {
    await fetch(`/api/admin/pages/${page.id}/sections`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  } finally {
    setSaving(false)
  }
}
```

---

## 2. TopBar

**Embutido em PageEditorClient** (não precisa ser componente separado)

### Elementos (esquerda → direita)
1. **← Páginas** — link para `/admin/paginas`
2. **Separador** — 1px vertical rgba(255,255,255,0.15)
3. **Título da página** — ex: "Home" (font-weight: 600, cor: white)
4. **Badge de status** — "Publicado" (verde) ou "Rascunho" (dourado)
5. **Slug** — monospace, rgba(255,255,255,0.4)
6. **flex-1** — espaçador
7. **Botão Visualizar** — outline branco, abre `/{slug}` em nova aba
8. **Botão Salvar** — bg dourado (#D4A020), muda para verde + "Salvo!" por 2.5s

---

## 3. SidebarSections

**Arquivo:** `src/components/admin/SidebarSections.tsx`

### Props
```ts
interface SidebarSectionsProps {
  sections: PageSection[]
  selectedId: string | null
  onSelect: (id: string) => void
  onMove: (id: string, dir: 'up' | 'down') => void
  onToggleVisible: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void  // abre SectionTemplatePicker
}
```

### Comportamento dos cards
- **Click no card:** seleciona/deseleciona (toggle)
- **Quando selecionado:** borda azul, bg azul claro, expande ações inline
- **Ações inline (quando selecionado):**
  - Botão "Ocultar/Mostrar" (eye icon)
  - Botão deletar (trash icon, cor error)
- **Botões ▲▼:** desabilitados no topo/fundo da lista

### Drag & drop
O protótipo usa apenas ▲▼. Para drag & drop real usar `@dnd-kit/sortable`.
É uma melhoria da Fase 2 — não bloqueia o MVP.

---

## 4. PreviewCanvas

**Arquivo:** `src/components/admin/PreviewCanvas.tsx`

### Comportamento
- Cards de seção com `SectionPreview` (miniatura visual)
- Click seleciona a seção
- Seção selecionada: borda azul 2px + linha de acento no topo
- Seção oculta: opacidade 0.4 + badge "Seção oculta"
- Botão "+ Adicionar seção" no final da lista

### SectionPreview (card miniatura)
Cada card mostra:
- Background real da seção (cor/gradiente do `content.bg` ou `content.variant`)
- Ícone tipo em marca d'água (opacity 0.08)
- Label do tipo (uppercase, 10px)
- Título (se houver no content)
- Subtítulo truncado (se houver)
- Para `form`: chips com labels dos campos
- Para `cards`/`faq`: contador de itens

---

## 5. SectionTemplatePicker

**Arquivo:** `src/components/admin/SectionTemplatePicker.tsx`

### Props
```ts
interface SectionTemplatePickerProps {
  onSelect: (type: SectionType, template: object) => void
  onClose: () => void
}
```

### Layout do modal
```
┌─────────────────────────────────────────────────────┐
│ Header: "Adicionar seção"                   [X]     │
├─────────────────┬───────────────────────────────────┤
│ Sidebar (180px) │ Variants area (flex-1)            │
│                 │                                   │
│ • Hero          │ [Template card 1]                 │
│ • Cards         │ [Template card 2]                 │
│ ● Texto  ←ativo │ [Template card 3]                 │
│ • Formulário    │                                   │
│ • CTA           │                                   │
│ • FAQ           │                                   │
│ ...             │                                   │
└─────────────────┴───────────────────────────────────┘
```

### Template cards
- Mini-prévia com bg real + título
- Label do template no rodapé
- Hover: borda azul + ring azul
- Click: chama `onSelect(type, templateData)`

### Dados dos templates
Ver constante `SECTION_TYPES` no `Gestor360 Admin CMS.html`.
Extrair para `src/lib/cms/section-templates.ts`.

---

## 6. RightPanel

**Arquivo:** `src/components/admin/RightPanel.tsx`

### Props
```ts
interface RightPanelProps {
  section: PageSection
  onChange: (updated: PageSection) => void
  onClose: () => void
}
```

### Layout
```
┌─────────────────────────────────────────┐
│ Header: [icon] Tipo da Seção       [X]  │
│ Tabs: [✏️ Conteúdo] [🎨 Estilo]         │
├─────────────────────────────────────────┤
│ (quando Estilo ativo)                   │
│ Style badges strip + botão Resetar      │
├─────────────────────────────────────────┤
│                                         │
│  ScrollArea — SectionContentEditor      │
│           ou SectionStyleEditor         │
│                                         │
├─────────────────────────────────────────┤
│ (quando Estilo ativo)                   │
│ Live preview do estilo aplicado         │
└─────────────────────────────────────────┘
```

### Style badges strip
Quando aba Estilo está ativa e há estilos definidos, mostrar chips:
- 🌈 Gradiente (se `style.gradient`)
- Chip colorido (se `style.bgColor` sem gradiente)
- Aa [FontName] (se `style.fontPair`)
- Sombra (se `style.shadow && !== 'none'`)
- Glass (se `style.blur`)
- ✨ Animação (se `style.animation`)
- Botão "Resetar" → `onChange({ ...section, style: {} })`

---

## 7. SectionContentEditor

**Arquivo:** `src/components/admin/editors/SectionContentEditor.tsx`

### Dispatch por tipo
```ts
const CONTENT_EDITORS: Record<SectionType, ComponentType<ContentEditorProps>> = {
  hero:        HeroContentEditor,
  cards:       CardsContentEditor,
  form:        FormContentEditor,
  cta:         CTAContentEditor,
  text:        TextContentEditor,
  faq:         FAQContentEditor,
  depoimentos: GenericContentEditor,
  capitulos:   GenericContentEditor,
  autores:     GenericContentEditor,
  ferramentas: GenericContentEditor,
}
```

### ContentEditorProps
```ts
interface ContentEditorProps<T = SectionContent> {
  content: T
  onChange: (updated: T) => void
}
```

### Campos comuns a todos os editores
- `FieldGroup` — container com label uppercase pequeno
- `TextInput` — label + input ou textarea, border azul no focus
- `SegmentControl` — radio group horizontal (2–5 opções)
- `Toggle` — switch on/off com label

---

## 8. SectionStyleEditor

**Arquivo:** `src/components/admin/style/SectionStyleEditor.tsx`

### Props
```ts
interface SectionStyleEditorProps {
  style: SectionStyle
  sectionTitle?: string  // para live preview
  onChange: (updated: SectionStyle) => void
}
```

### 4 sub-abas

#### Fundo
- Paletas de cor (Brand, Quente, Frio, Terra, Verde) — 6 swatches cada
- Color picker nativo + input hex
- Grid de gradientes pré-prontos com mini-prévia
- Slider opacidade (10–100%)

#### Tipo
- Lista de 5 pares de fontes com prévia visual do "Aa"
- SegmentControl: escala de título (XS SM MD LG XL)
- SegmentControl: peso do título
- Color picker: cor do título
- Color picker: cor do texto corpo
- Slider: letter-spacing (-2px a 12px)

#### Espaço
- Botões preset padding vertical (XS SM MD LG XL com valor em px)
- Slider: padding horizontal (0–120px)
- SegmentControl: largura máxima (SM MD LG XL Full)
- Botões: border-radius (Zero Leve Médio Grande Pill)
- SegmentControl: divisor (Nenhum Linha Onda Diagonal)

#### Efeitos
- Lista de shadow presets com prévia visual
- Slider: overlay opacity (0–80%)
- Toggle: glassmorphism + slider blur amount (2–32px)
- Toggle: borda + color picker borda
- Toggle: animação de entrada

---

## 9. API Route — PUT /api/admin/pages/[id]/sections

**Arquivo:** `src/app/api/admin/pages/[id]/sections/route.ts`

```ts
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  // 1. Validar autenticação + role admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Validar body com Zod
  const body = await request.json()
  const parsed = SaveSectionsRequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { sections } = parsed.data
  const pageId = params.id

  // 3. Deletar seções removidas
  const incomingIds = sections.map(s => s.id)
  await supabase
    .from('page_sections')
    .delete()
    .eq('page_id', pageId)
    .not('id', 'in', `(${incomingIds.join(',')})`)

  // 4. Upsert seções (preserva created_at)
  const upsertData = sections.map((s, i) => ({
    id:          s.id,
    page_id:     pageId,
    type:        s.type,
    order_index: i,          // usa posição no array como order_index
    content:     s.content,
    style:       s.style ?? {},
    visible:     s.visible,
  }))

  const { error } = await supabase
    .from('page_sections')
    .upsert(upsertData, { onConflict: 'id' })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // 5. Atualizar updated_at da página
  await supabase
    .from('pages')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', pageId)

  return Response.json({ ok: true, count: sections.length })
}
```

---

## 10. Atualização do SectionRenderer

Após implementar, adicionar suporte a `style` no wrapper:

```tsx
// src/components/sections/SectionRenderer.tsx

import { buildSectionStyle } from '@/lib/cms/build-section-style'

export function SectionRenderer({ section }: { section: PageSection }) {
  const wrapperStyle = buildSectionStyle(section.style)

  const inner = (() => {
    switch (section.type) {
      case 'hero':        return <HeroSection content={section.content as HeroContent} />
      case 'text':        return <TextSection content={section.content as TextContent} />
      // ... demais cases inalterados
      default:            return null
    }
  })()

  // Só adiciona wrapper se houver estilo definido (evita div desnecessária)
  if (!section.style || Object.keys(section.style).length === 0) return inner

  return (
    <div style={wrapperStyle} data-section-type={section.type}>
      {inner}
    </div>
  )
}
```

---

## Armadilhas comuns — leia antes de implementar

1. **`style` pode ser `{}` ou `undefined`** — sempre use `section.style ?? {}` ao ler
2. **Gradiente sobrescreve bgColor** — na UI, quando o usuário escolhe gradiente, limpar bgColor e vice-versa
3. **FontPair requer Google Fonts** — ao salvar uma seção com fontPair !== 'Gotham + DM Sans', injetar o `<link>` do Google Fonts correspondente no `<head>` da página pública
4. **order_index** — use a posição no array (índice), não um campo separado. Ao salvar, percorre o array e atribui `order_index: i`
5. **Drag & drop** — use `@dnd-kit/sortable` (já listado no package.json do projeto? verificar). Se não estiver, adicionar. Não use `react-beautiful-dnd` — descontinuado
6. **Animação de entrada** — se `style.animation === true`, adicionar `data-animate="true"` no wrapper e usar Intersection Observer via hook `useIntersectionObserver` para aplicar classe CSS de fade-in
7. **Não use `style` como prop name em componentes React** — colide com o atributo nativo. Use `sectionStyle` ou `styleConfig` internamente

---

_Gestor360® CMS Handoff — DDM Editora — Abril 2026_
