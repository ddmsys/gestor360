import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const FERRAMENTAS_BUCKET = 'ferramentas-pdf'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: ferramenta, error } = await supabase
    .from('ferramentas')
    .select('arquivo_path, status, ativo, acesso')
    .eq('id', id)
    .single<{ arquivo_path: string | null; status: string | null; ativo: boolean | null; acesso: string | null }>()

  if (
    error ||
    !ferramenta?.arquivo_path ||
    ferramenta.status !== 'published' ||
    ferramenta.ativo !== true ||
    ferramenta.acesso !== 'gratuito'
  ) {
    return NextResponse.json({ error: 'Arquivo não disponível.' }, { status: 404 })
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(FERRAMENTAS_BUCKET)
    .createSignedUrl(ferramenta.arquivo_path, 60 * 10, { download: true })

  if (signedUrlError || !data?.signedUrl) {
    return NextResponse.json(
      { error: signedUrlError?.message ?? 'Não foi possível gerar o link.' },
      { status: 500 }
    )
  }

  return NextResponse.redirect(data.signedUrl)
}
