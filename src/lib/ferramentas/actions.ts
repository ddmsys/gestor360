'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const ferramentaSchema = z.object({
  numero: z.coerce.number().int().min(1, 'Informe o número.').max(999),
  nome: z.string().trim().min(2, 'Informe o nome da ferramenta.').max(160),
  descricao: z.string().trim().max(700).optional(),
  capitulo: z.coerce.number().int().min(1).max(10),
  tipo: z.enum(['individual', 'kit_completo']),
  status: z.enum(['draft', 'published']),
  acesso: z.enum(['gratuito', 'codigo_livro']),
  ordem: z.coerce.number().int().min(0).max(999).default(0),
  arquivo_path: z.string().trim().max(300).optional(),
  imagem_url: z.string().trim().max(500).optional(),
  cor: z.string().trim().max(40).optional(),
})

function normalizeOptional(value: string | undefined) {
  return value && value.length > 0 ? value : null
}

function parseFerramentaForm(formData: FormData) {
  const parsed = ferramentaSchema.safeParse({
    numero: formData.get('numero'),
    nome: formData.get('nome'),
    descricao: formData.get('descricao'),
    capitulo: formData.get('capitulo'),
    tipo: formData.get('tipo'),
    status: formData.get('status'),
    acesso: formData.get('acesso'),
    ordem: formData.get('ordem'),
    arquivo_path: formData.get('arquivo_path'),
    imagem_url: formData.get('imagem_url'),
    cor: formData.get('cor'),
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Dados inválidos.'
    redirect(`/admin/ferramentas?error=${encodeURIComponent(message)}`)
  }

  return {
    numero: parsed.data.numero,
    nome: parsed.data.nome,
    descricao: normalizeOptional(parsed.data.descricao),
    capitulo: parsed.data.capitulo,
    tipo: parsed.data.tipo,
    status: parsed.data.status,
    acesso: parsed.data.acesso,
    ordem: parsed.data.ordem,
    arquivo_path: normalizeOptional(parsed.data.arquivo_path),
    imagem_url: normalizeOptional(parsed.data.imagem_url),
    cor: normalizeOptional(parsed.data.cor),
    ativo: parsed.data.status === 'published',
  }
}

export async function createFerramenta(formData: FormData) {
  const payload = parseFerramentaForm(formData)
  const supabase = await createClient()

  const { error } = await supabase.from('ferramentas').insert(payload)

  if (error) {
    redirect(`/admin/ferramentas?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ferramentas')
  redirect('/admin/ferramentas?success=ferramenta-criada')
}

export async function updateFerramenta(id: string, formData: FormData) {
  const payload = parseFerramentaForm(formData)
  const supabase = await createClient()

  const { error } = await supabase
    .from('ferramentas')
    .update(payload)
    .eq('id', id)

  if (error) {
    redirect(`/admin/ferramentas/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ferramentas')
  revalidatePath(`/admin/ferramentas/${id}`)
  redirect('/admin/ferramentas?success=ferramenta-atualizada')
}

export async function deleteFerramenta(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('ferramentas').delete().eq('id', id)

  if (error) {
    redirect(`/admin/ferramentas?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ferramentas')
  redirect('/admin/ferramentas?success=ferramenta-removida')
}
