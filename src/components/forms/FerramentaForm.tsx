import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  ACESSO_OPTIONS,
  CAPITULOS,
  STATUS_OPTIONS,
  TIPO_OPTIONS,
} from '@/lib/ferramentas/constants'

export interface FerramentaFormData {
  id?: string
  numero?: number | null
  nome?: string | null
  descricao?: string | null
  capitulo?: number | null
  tipo?: string | null
  status?: string | null
  acesso?: string | null
  ordem?: number | null
  arquivo_path?: string | null
  imagem_url?: string | null
  cor?: string | null
}

interface FerramentaFormProps {
  action: (formData: FormData) => void | Promise<void>
  ferramenta?: FerramentaFormData
  submitLabel: string
}

export function FerramentaForm({
  action,
  ferramenta,
  submitLabel,
}: FerramentaFormProps) {
  return (
    <form action={action} className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
        <Input
          label="Número"
          name="numero"
          type="number"
          min={1}
          max={999}
          defaultValue={ferramenta?.numero ?? ''}
          placeholder="1"
          required
        />
        <Input
          label="Nome"
          name="nome"
          defaultValue={ferramenta?.nome ?? ''}
          placeholder="GST"
          required
        />
      </div>

      <Textarea
        label="Descrição curta"
        name="descricao"
        defaultValue={ferramenta?.descricao ?? ''}
        placeholder="Explique em uma frase o que esta ferramenta ajuda o leitor a fazer."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Capítulo"
          name="capitulo"
          options={CAPITULOS}
          defaultValue={String(ferramenta?.capitulo ?? '1')}
          required
        />
        <Select
          label="Tipo"
          name="tipo"
          options={TIPO_OPTIONS}
          defaultValue={ferramenta?.tipo ?? 'individual'}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
          defaultValue={ferramenta?.status ?? 'draft'}
          required
        />
        <Select
          label="Acesso"
          name="acesso"
          options={ACESSO_OPTIONS}
          defaultValue={ferramenta?.acesso ?? 'gratuito'}
          required
        />
        <Input
          label="Ordem"
          name="ordem"
          type="number"
          min={0}
          max={999}
          defaultValue={ferramenta?.ordem ?? 0}
          required
        />
      </div>

      <Input
        label="Arquivo no Supabase Storage"
        name="arquivo_path"
        defaultValue={ferramenta?.arquivo_path ?? ''}
        placeholder="capitulo-01/01-gst.pdf"
        hint="Pode ficar vazio enquanto os PDFs finais não estiverem prontos."
      />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
        <Input
          label="Imagem do card"
          name="imagem_url"
          defaultValue={ferramenta?.imagem_url ?? ''}
          placeholder="/ferramentas/gst-card.png"
          hint="Preparado para cards visuais no estilo biblioteca."
        />
        <Input
          label="Cor"
          name="cor"
          defaultValue={ferramenta?.cor ?? ''}
          placeholder="#25346e"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-6">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
