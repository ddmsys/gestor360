import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  SECTION_TEMPLATES,
  SECTION_TYPE_LABELS,
} from '@/lib/cms/section-builder'
import type {
  AutorItem,
  CardItem,
  DepoimentoItem,
  FAQItem,
  FormField,
  SectionContent,
  SectionType,
} from '@/types/cms'

type SectionFormAction = (formData: FormData) => void | Promise<void>

interface SectionContentFormProps {
  action: SectionFormAction
  type: SectionType
  pageId: string
  sectionId?: string
  content?: SectionContent
  submitLabel: string
  cancelHref: string
}

const fieldBase =
  'w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-title)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent'

const textareaBase = `${fieldBase} min-h-24 resize-y`

function mergeContent(type: SectionType, content?: SectionContent) {
  return {
    ...(SECTION_TEMPLATES[type] as Record<string, unknown>),
    ...((content ?? {}) as Record<string, unknown>),
  }
}

function textValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: unknown) {
  return typeof value === 'number' ? String(value) : ''
}

function boolValue(value: unknown) {
  return value === true
}

function listValue<T>(value: unknown, fallback: T[], minLength: number) {
  const list = Array.isArray(value) ? (value as T[]) : fallback
  return Array.from({ length: Math.max(minLength, list.length) }, (_, index) => list[index] ?? ({} as T))
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  type = 'text',
  hint,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  placeholder?: string
  type?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={fieldBase}
      />
      {hint && <span className="mt-1 block text-xs text-[var(--color-text-muted)]">{hint}</span>}
    </label>
  )
}

function TextField({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
  hint,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  rows?: number
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className={textareaBase}
      />
      {hint && <span className="mt-1 block text-xs text-[var(--color-text-muted)]">{hint}</span>}
    </label>
  )
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string
  name: string
  defaultValue?: string
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <select name={name} defaultValue={defaultValue} className={fieldBase}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function CheckboxField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string
  name: string
  defaultChecked?: boolean
  hint?: string
}) {
  return (
    <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-3">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 size-4 rounded border-[var(--color-border)]"
      />
      <span>
        <span className="block text-sm font-semibold text-[var(--color-text-title)]">{label}</span>
        {hint && <span className="block text-xs text-[var(--color-text-muted)]">{hint}</span>}
      </span>
    </label>
  )
}

function Panel({
  title,
  children,
  description,
}: {
  title: string
  children: ReactNode
  description?: string
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4">
        <h2 className="font-display text-base font-bold text-[var(--color-text-title)]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function HeaderFields({ data }: { data: Record<string, unknown> }) {
  return (
    <Panel title="Cabecalho" description="Textos principais que aparecem no topo do modulo.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Titulo" name="title" defaultValue={textValue(data.title)} />
        <Field label="Selo pequeno" name="badge" defaultValue={textValue(data.badge)} />
      </div>
      <TextField label="Subtitulo" name="subtitle" defaultValue={textValue(data.subtitle)} rows={3} />
    </Panel>
  )
}

function renderHero(data: Record<string, unknown>) {
  return (
    <>
      <Panel title="Conteudo principal">
        <Field label="Titulo" name="title" defaultValue={textValue(data.title)} required />
        <TextField label="Subtitulo" name="subtitle" defaultValue={textValue(data.subtitle)} rows={3} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Botao principal" name="cta_label" defaultValue={textValue(data.cta_label)} />
          <Field label="Link do botao principal" name="cta_url" defaultValue={textValue(data.cta_url)} />
          <Field label="Botao secundario" name="cta_secondary_label" defaultValue={textValue(data.cta_secondary_label)} />
          <Field label="Link do botao secundario" name="cta_secondary_url" defaultValue={textValue(data.cta_secondary_url)} />
        </div>
      </Panel>
      <Panel title="Visual e responsividade">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="Estilo"
            name="variant"
            defaultValue={textValue(data.variant) || 'canvas'}
            options={[
              { value: 'canvas', label: 'Claro' },
              { value: 'dark', label: 'Escuro' },
              { value: 'blue', label: 'Azul' },
            ]}
          />
          <SelectField
            label="Alinhamento"
            name="align"
            defaultValue={textValue(data.align) || 'center'}
            options={[
              { value: 'left', label: 'Esquerda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Direita' },
            ]}
          />
          <Field label="Imagem de fundo" name="bg_image" defaultValue={textValue(data.bg_image)} placeholder="/imagem.jpg" />
        </div>
        <CheckboxField
          label="Mostrar animacao 360"
          name="show_360_animation"
          defaultChecked={boolValue(data.show_360_animation)}
          hint="Use apenas em paginas onde a animacao nao competir com o mockup principal."
        />
      </Panel>
    </>
  )
}

function renderText(data: Record<string, unknown>) {
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Texto">
        <TextField label="Corpo" name="body" defaultValue={textValue(data.body)} required rows={8} />
      </Panel>
      <Panel title="Layout">
        <div className="grid gap-4 md:grid-cols-4">
          <SelectField label="Fundo" name="bg" defaultValue={textValue(data.bg) || 'white'} options={backgroundOptions(['white', 'canvas', 'ink'])} />
          <SelectField label="Alinhamento" name="align" defaultValue={textValue(data.align) || 'center'} options={alignOptions(['left', 'center', 'right'])} />
          <SelectField label="Largura" name="max_width" defaultValue={textValue(data.max_width) || 'lg'} options={widthOptions} />
          <SelectField label="Cor do selo" name="badge_color" defaultValue={textValue(data.badge_color) || 'blue'} options={badgeColorOptions} />
        </div>
      </Panel>
    </>
  )
}

function renderCards(data: Record<string, unknown>) {
  const cards = listValue<CardItem>(data.cards, [], 6)
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Layout dos cards">
        <div className="grid gap-4 md:grid-cols-4">
          <SelectField label="Colunas" name="columns" defaultValue={numberValue(data.columns) || '3'} options={columnOptions} />
          <SelectField label="Fundo" name="bg" defaultValue={textValue(data.bg) || 'white'} options={backgroundOptions(['white', 'canvas', 'ink'])} />
          <SelectField label="Estilo" name="card_style" defaultValue={textValue(data.card_style) || 'shadow'} options={cardStyleOptions} />
          <SelectField label="Cor do selo" name="badge_color" defaultValue={textValue(data.badge_color) || 'blue'} options={badgeColorOptions} />
        </div>
      </Panel>
      <Panel title="Cards" description="Preencha apenas os itens que quiser publicar. Os vazios serao ignorados.">
        <div className="space-y-5">
          {cards.map((card, index) => (
            <div key={index} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Card {index + 1}</p>
              <div className="grid gap-4 md:grid-cols-[90px_1fr_1fr]">
                <Field label="Icone" name={`card_${index}_icon`} defaultValue={card.icon} />
                <Field label="Titulo" name={`card_${index}_title`} defaultValue={card.title} />
                <Field label="Selo" name={`card_${index}_badge`} defaultValue={card.badge} />
              </div>
              <div className="mt-4">
                <TextField label="Descricao" name={`card_${index}_description`} defaultValue={card.description} rows={3} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Texto do link" name={`card_${index}_link_label`} defaultValue={card.link_label} />
                <Field label="URL do link" name={`card_${index}_link_url`} defaultValue={card.link_url} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function renderFerramentas(data: Record<string, unknown>) {
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Biblioteca">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Capitulo inicial" name="capitulo_inicial" type="number" defaultValue={numberValue(data.capitulo_inicial)} placeholder="1 a 10" />
          <SelectField label="Layout" name="layout" defaultValue={textValue(data.layout) || 'grid'} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'Lista' }]} />
          <Field label="Titulo do CTA" name="cta_codigo_titulo" defaultValue={textValue(data.cta_codigo_titulo)} />
        </div>
        <TextField label="Descricao do CTA" name="cta_codigo_descricao" defaultValue={textValue(data.cta_codigo_descricao)} rows={3} />
        <div className="grid gap-3 md:grid-cols-2">
          <CheckboxField label="Mostrar todas as ferramentas" name="mostrar_todos" defaultChecked={boolValue(data.mostrar_todos)} />
          <CheckboxField label="Mostrar CTA de codigo do livro" name="mostrar_cta_codigo" defaultChecked={boolValue(data.mostrar_cta_codigo)} />
        </div>
      </Panel>
    </>
  )
}

function renderForm(data: Record<string, unknown>) {
  const fields = listValue<FormField>(data.fields, [], 6)
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Configuracao do formulario">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Fundo" name="bg" defaultValue={textValue(data.bg) || 'white'} options={backgroundOptions(['white', 'canvas', 'blue'])} />
          <SelectField label="Layout" name="layout" defaultValue={textValue(data.layout) || 'centered'} options={[{ value: 'centered', label: 'Centralizado' }, { value: 'side-by-side', label: 'Texto + formulario' }]} />
          <Field label="ID interno" name="form_id" defaultValue={textValue(data.form_id)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Texto do botao" name="submit_label" defaultValue={textValue(data.submit_label)} />
          <Field label="Redirect apos envio" name="redirect_url" defaultValue={textValue(data.redirect_url)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Titulo de sucesso" name="success_title" defaultValue={textValue(data.success_title)} />
          <Field label="Mensagem de sucesso" name="success_message" defaultValue={textValue(data.success_message)} />
        </div>
      </Panel>
      <Panel title="Campos do formulario" description="Use chaves simples como nome, email, whatsapp, empresa. Campos vazios serao ignorados.">
        <div className="space-y-5">
          {fields.map((field, index) => (
            <div key={index} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Campo {index + 1}</p>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Chave" name={`field_${index}_field_key`} defaultValue={field.field_key} />
                <Field label="Label" name={`field_${index}_label`} defaultValue={field.label} />
                <SelectField label="Tipo" name={`field_${index}_type`} defaultValue={field.type || 'text'} options={formFieldTypeOptions} />
                <Field label="Placeholder" name={`field_${index}_placeholder`} defaultValue={field.placeholder} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <TextField label="Opcoes do select" name={`field_${index}_options`} defaultValue={field.options?.join('\n') ?? ''} rows={3} hint="Uma opcao por linha." />
                <div className="space-y-3">
                  <SelectField label="Mascara" name={`field_${index}_mask`} defaultValue={field.mask ?? ''} options={[{ value: '', label: 'Sem mascara' }, { value: 'phone', label: 'Telefone' }, { value: 'cpf', label: 'CPF' }]} />
                  <CheckboxField label="Obrigatorio" name={`field_${index}_required`} defaultChecked={field.required} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function renderFaq(data: Record<string, unknown>) {
  const items = listValue<FAQItem>(data.items, [], 8)
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Layout">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Fundo" name="bg" defaultValue={textValue(data.bg) || 'canvas'} options={backgroundOptions(['white', 'canvas'])} />
          <SelectField label="Layout" name="layout" defaultValue={textValue(data.layout) || 'single'} options={[{ value: 'single', label: 'Uma coluna' }, { value: 'two-columns', label: 'Duas colunas' }]} />
          <SelectField label="Cor do selo" name="badge_color" defaultValue={textValue(data.badge_color) || 'blue'} options={badgeColorOptions} />
        </div>
      </Panel>
      <Panel title="Perguntas" description="Itens vazios serao ignorados.">
        <div className="space-y-5">
          {items.map((item, index) => (
            <div key={index} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Pergunta {index + 1}</p>
              <Field label="Pergunta" name={`faq_${index}_question`} defaultValue={item.question} />
              <div className="mt-4">
                <TextField label="Resposta" name={`faq_${index}_answer`} defaultValue={item.answer} rows={4} />
              </div>
              <div className="mt-4">
                <CheckboxField label="Abrir por padrao" name={`faq_${index}_open_by_default`} defaultChecked={item.open_by_default} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function renderCta(data: Record<string, unknown>) {
  return (
    <>
      <Panel title="Chamada">
        <Field label="Titulo" name="title" defaultValue={textValue(data.title)} required />
        <TextField label="Subtitulo" name="subtitle" defaultValue={textValue(data.subtitle)} rows={3} />
        <TextField label="Texto complementar" name="body" defaultValue={textValue(data.body)} rows={4} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Texto do botao" name="cta_text" defaultValue={textValue(data.cta_text)} required />
          <Field label="URL do botao" name="cta_href" defaultValue={textValue(data.cta_href)} required />
          <Field label="Botao secundario" name="cta_secondary_label" defaultValue={textValue(data.cta_secondary_label)} />
          <Field label="URL secundaria" name="cta_secondary_url" defaultValue={textValue(data.cta_secondary_url)} />
        </div>
      </Panel>
      <Panel title="Visual">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Fundo" name="background" defaultValue={textValue(data.background) || 'blue'} options={backgroundOptions(['blue', 'gold', 'ink', 'canvas'])} />
          <SelectField label="Alinhamento" name="align" defaultValue={textValue(data.align) || 'center'} options={alignOptions(['left', 'center'])} />
          <SelectField label="Lado da imagem" name="image_side" defaultValue={textValue(data.image_side) || 'right'} options={[{ value: 'left', label: 'Esquerda' }, { value: 'right', label: 'Direita' }]} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="URL da imagem" name="image_url" defaultValue={textValue(data.image_url)} />
          <Field label="Texto alternativo" name="image_alt" defaultValue={textValue(data.image_alt)} />
        </div>
      </Panel>
    </>
  )
}

function renderDepoimentos(data: Record<string, unknown>) {
  const items = listValue<DepoimentoItem>(data.items, [], 4)
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Origem e layout">
        <div className="grid gap-4 md:grid-cols-5">
          <SelectField label="Origem" name="source" defaultValue={textValue(data.source) || 'manual'} options={[{ value: 'manual', label: 'Manual' }, { value: 'supabase', label: 'Banco' }]} />
          <SelectField label="Layout" name="layout" defaultValue={textValue(data.layout) || 'grid'} options={[{ value: 'grid', label: 'Grid' }, { value: 'carousel', label: 'Carrossel' }, { value: 'masonry', label: 'Masonry' }]} />
          <SelectField label="Colunas" name="columns" defaultValue={numberValue(data.columns) || '3'} options={[{ value: '2', label: '2' }, { value: '3', label: '3' }]} />
          <SelectField label="Fundo" name="bg" defaultValue={textValue(data.bg) || 'canvas'} options={backgroundOptions(['white', 'canvas', 'ink'])} />
          <Field label="Limite" name="limit" type="number" defaultValue={numberValue(data.limit)} />
        </div>
      </Panel>
      <Panel title="Depoimentos manuais" description="Se a origem for Banco, estes itens podem ficar vazios.">
        <div className="space-y-5">
          {items.map((item, index) => (
            <div key={index} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Depoimento {index + 1}</p>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Nome" name={`depoimento_${index}_nome`} defaultValue={item.nome} />
                <Field label="Cargo" name={`depoimento_${index}_cargo`} defaultValue={item.cargo} />
                <Field label="Empresa" name={`depoimento_${index}_empresa`} defaultValue={item.empresa} />
                <Field label="Nota" name={`depoimento_${index}_nota`} type="number" defaultValue={numberValue(item.nota)} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_2fr]">
                <Field label="Foto" name={`depoimento_${index}_foto_url`} defaultValue={item.foto_url} />
                <TextField label="Texto" name={`depoimento_${index}_texto`} defaultValue={item.texto} rows={4} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function renderCapitulos(data: Record<string, unknown>) {
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Layout">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Fundo" name="bg" defaultValue={textValue(data.bg) || 'white'} options={backgroundOptions(['white', 'canvas'])} />
          <SelectField label="Layout" name="layout" defaultValue={textValue(data.layout) || 'grid'} options={[{ value: 'grid', label: 'Grid' }, { value: 'numbered-list', label: 'Lista numerada' }]} />
          <CheckboxField label="Linkar para ferramentas" name="link_para_ferramenta" defaultChecked={boolValue(data.link_para_ferramenta)} />
        </div>
      </Panel>
    </>
  )
}

function renderAutores(data: Record<string, unknown>) {
  const autores = listValue<AutorItem>(data.autores, [], 3)
  return (
    <>
      <HeaderFields data={data} />
      <Panel title="Layout">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Fundo" name="bg" defaultValue={textValue(data.bg) || 'white'} options={backgroundOptions(['white', 'canvas'])} />
          <SelectField label="Layout" name="layout" defaultValue={textValue(data.layout) || 'side-by-side'} options={[{ value: 'side-by-side', label: 'Lado a lado' }, { value: 'stacked', label: 'Empilhado' }]} />
        </div>
      </Panel>
      <Panel title="Autores" description="Itens vazios serao ignorados.">
        <div className="space-y-5">
          {autores.map((autor, index) => (
            <div key={index} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Autor {index + 1}</p>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Nome" name={`autor_${index}_nome`} defaultValue={autor.nome} />
                <Field label="Cargo" name={`autor_${index}_cargo`} defaultValue={autor.cargo} />
                <Field label="Foto" name={`autor_${index}_foto_url`} defaultValue={autor.foto_url} />
              </div>
              <div className="mt-4">
                <TextField label="Bio" name={`autor_${index}_bio`} defaultValue={autor.bio} rows={4} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field label="LinkedIn" name={`autor_${index}_linkedin_url`} defaultValue={autor.linkedin_url} />
                <Field label="Instagram" name={`autor_${index}_instagram_url`} defaultValue={autor.instagram_url} />
                <Field label="Site" name={`autor_${index}_site_url`} defaultValue={autor.site_url} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

const badgeColorOptions = [
  { value: 'blue', label: 'Azul' },
  { value: 'gold', label: 'Dourado' },
  { value: 'stone', label: 'Neutro' },
]

const widthOptions = [
  { value: 'sm', label: 'Pequena' },
  { value: 'md', label: 'Media' },
  { value: 'lg', label: 'Grande' },
  { value: 'full', label: 'Tela inteira' },
]

const columnOptions = [
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
]

const cardStyleOptions = [
  { value: 'shadow', label: 'Sombra' },
  { value: 'bordered', label: 'Borda' },
  { value: 'flat', label: 'Plano' },
]

const formFieldTypeOptions = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'E-mail' },
  { value: 'tel', label: 'Telefone' },
  { value: 'textarea', label: 'Area de texto' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
]

function backgroundOptions(values: string[]) {
  const labels: Record<string, string> = {
    white: 'Branco',
    canvas: 'Claro',
    ink: 'Escuro',
    blue: 'Azul',
    gold: 'Dourado',
  }
  return values.map((value) => ({ value, label: labels[value] ?? value }))
}

function alignOptions(values: string[]) {
  const labels: Record<string, string> = {
    left: 'Esquerda',
    center: 'Centro',
    right: 'Direita',
  }
  return values.map((value) => ({ value, label: labels[value] ?? value }))
}

function renderFields(type: SectionType, data: Record<string, unknown>) {
  switch (type) {
    case 'hero':
      return renderHero(data)
    case 'text':
      return renderText(data)
    case 'cards':
      return renderCards(data)
    case 'ferramentas':
      return renderFerramentas(data)
    case 'form':
      return renderForm(data)
    case 'faq':
      return renderFaq(data)
    case 'cta':
      return renderCta(data)
    case 'depoimentos':
      return renderDepoimentos(data)
    case 'capitulos':
      return renderCapitulos(data)
    case 'autores':
      return renderAutores(data)
  }
}

export function SectionContentForm({
  action,
  type,
  pageId,
  sectionId,
  content,
  submitLabel,
  cancelHref,
}: SectionContentFormProps) {
  const data = mergeContent(type, content)

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="page_id" value={pageId} />
      <input type="hidden" name="type" value={type} />
      {sectionId && <input type="hidden" name="section_id" value={sectionId} />}

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] p-4">
        <p className="text-sm font-semibold text-[var(--color-text-title)]">
          Modulo: {SECTION_TYPE_LABELS[type]}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Os campos abaixo geram automaticamente o JSON do CMS e ja seguem os presets responsivos do site.
        </p>
      </div>

      {renderFields(type, data)}

      <div className="flex items-center justify-end gap-3">
        <Link
          href={cancelHref}
          className="px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-blue)] hover:bg-[var(--color-brand-blue-hover)] transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
