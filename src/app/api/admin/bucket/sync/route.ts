import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAllowedAdmin } from '@/lib/admin/auth'

const BUCKET = 'ferramentas-pdf'

const BUCKET_CONFIG = {
  public: false,
  fileSizeLimit: 500 * 1024 * 1024, // 500 MB
  allowedMimeTypes: [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.ms-excel',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    'audio/mpeg',
    'image/jpeg',
    'image/png',
  ],
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: buckets } = await admin.storage.listBuckets()
  const bucket = buckets?.find((b) => b.name === BUCKET)

  return NextResponse.json({
    bucket_name: BUCKET,
    exists: !!bucket,
    current_config: bucket ?? null,
    target_file_size_limit_mb: 500,
  })
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: buckets } = await admin.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === BUCKET)

  if (!exists) {
    const { error } = await admin.storage.createBucket(BUCKET, BUCKET_CONFIG)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, action: 'created', config: BUCKET_CONFIG })
  }

  const { error } = await admin.storage.updateBucket(BUCKET, BUCKET_CONFIG)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, action: 'updated', config: BUCKET_CONFIG })
}
