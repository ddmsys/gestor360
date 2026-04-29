'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

const FERRAMENTAS_BUCKET = 'ferramentas-pdf'

const BUCKET_CONFIG = {
  public: false,
  fileSizeLimit: 500 * 1024 * 1024, // 500 MB
  allowedMimeTypes: [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/msword',                                                       // .doc
    'application/vnd.ms-excel',                                                 // .xls
    'video/mp4',
    'video/quicktime',   // .mov
    'video/x-msvideo',   // .avi
    'video/webm',
    'audio/mpeg',        // .mp3
    'image/jpeg',
    'image/png',
  ],
}

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

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildStoragePath(payload: {
  tipo: string
  capitulo: number
  arquivo_path: string | null
}, fileName: string) {
  if (payload.arquivo_path) {
    return payload.arquivo_path
  }

  const safeName = sanitizeFileName(fileName)

  if (payload.tipo === 'kit_completo') {
    return `kit-completo/${safeName}`
  }

  return `capitulo-${String(payload.capitulo).padStart(2, '0')}/${safeName}`
}

function getUploadedFile(formData: FormData) {
  const file = formData.get('arquivo_file')
  if (!(file instanceof File) || file.size === 0) return null
  return file
}

async function ensureFerramentasBucket() {
  const supabaseAdmin = createAdminClient()
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

  if (listError) throw new Error(listError.message)

  const exists = buckets.some((b) => b.name === FERRAMENTAS_BUCKET)

  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(FERRAMENTAS_BUCKET, BUCKET_CONFIG)
    if (error) throw new Error(error.message)
  }

  // Para atualizar o bucket manualmente, use: POST /api/admin/bucket/sync

  return supabaseAdmin
}

async function uploadArquivoIfPresent(formData: FormData, payload: ReturnType<typeof parseFerramentaForm>) {
  const file = getUploadedFile(formData)
  if (!file) return payload

  const storagePath = buildStoragePath(payload, file.name)
  const supabaseAdmin = await ensureFerramentasBucket()
  const { error } = await supabaseAdmin.storage
    .from(FERRAMENTAS_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      contentType: file.type || undefined,
      upsert: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  return {
    ...payload,
    arquivo_path: storagePath,
  }
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
  const supabase = await requireAdmin()
  const parsedPayload = parseFerramentaForm(formData)
  let payload: typeof parsedPayload
  try {
    payload = await uploadArquivoIfPresent(formData, parsedPayload)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao enviar arquivo.'
    redirect(`/admin/ferramentas?error=${encodeURIComponent(message)}`)
  }

  const { error } = await supabase.from('ferramentas').insert(payload)

  if (error) {
    redirect(`/admin/ferramentas?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ferramentas')
  redirect('/admin/ferramentas?success=ferramenta-criada')
}

export async function updateFerramenta(id: string, formData: FormData) {
  const supabase = await requireAdmin()
  const parsedPayload = parseFerramentaForm(formData)
  let payload: typeof parsedPayload
  try {
    payload = await uploadArquivoIfPresent(formData, parsedPayload)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao enviar arquivo.'
    redirect(`/admin/ferramentas/${id}?error=${encodeURIComponent(message)}`)
  }

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
  const supabase = await requireAdmin()
  const { error } = await supabase.from('ferramentas').delete().eq('id', id)

  if (error) {
    redirect(`/admin/ferramentas?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ferramentas')
  redirect('/admin/ferramentas?success=ferramenta-removida')
}
