# Story 003 - Modulo de ferramentas no admin

## Status

Ready for Review

## Contexto

As ferramentas finais ainda estao em producao, mas o site ja precisa estar preparado para cadastrar metadados, organizar capitulos e vincular PDFs/ZIP quando os arquivos chegarem.

## Objetivo

Criar o modulo administrativo de ferramentas para cadastrar, editar, listar e preparar a biblioteca digital do livro.

## Acceptance Criteria

- [x] `/admin/ferramentas` lista ferramentas por capitulo, ordem e numero.
- [x] `/admin/ferramentas/nova` cria ferramenta como rascunho ou publicada.
- [x] `/admin/ferramentas/[id]` edita metadados, arquivo, imagem, cor e status.
- [x] O modulo suporta kit completo e ferramenta individual.
- [x] Existe SQL para preparar/atualizar a tabela `ferramentas`.
- [x] `npm run build` passa.

## Tasks

- [x] Criar constants e actions do modulo.
- [x] Criar formulario reutilizavel.
- [x] Criar listagem admin.
- [x] Criar tela de nova ferramenta.
- [x] Criar tela de edicao.
- [x] Criar SQL de suporte.
- [x] Criar seed SQL com as 31 ferramentas em rascunho.
- [x] Validar build.

## Validation

- [x] `npx eslint src/lib/ferramentas/constants.ts src/lib/ferramentas/actions.ts src/components/forms/FerramentaForm.tsx 'src/app/(admin)/admin/ferramentas/page.tsx' 'src/app/(admin)/admin/ferramentas/nova/page.tsx' 'src/app/(admin)/admin/ferramentas/[id]/page.tsx'`
- [x] `npm run build`
- [x] `http://localhost:3000/admin/ferramentas` redireciona para login quando sem sessao.
- [x] `http://localhost:3000/admin/ferramentas/nova` redireciona para login quando sem sessao.
- [x] Convite Supabase Auth enviado para `ddm.editora@gmail.com`.
- [ ] Migration remota aplicada. Bloqueada localmente por falta de `SUPABASE_ACCESS_TOKEN`/login no Supabase CLI.

## File List

- `src/lib/ferramentas/constants.ts`
- `src/lib/ferramentas/actions.ts`
- `src/components/forms/FerramentaForm.tsx`
- `src/app/(admin)/admin/ferramentas/page.tsx`
- `src/app/(admin)/admin/ferramentas/nova/page.tsx`
- `src/app/(admin)/admin/ferramentas/[id]/page.tsx`
- `docs/database/ferramentas-admin.sql`
- `docs/database/ferramentas-seed-31.sql`
- `supabase/migrations/20260429000000_ferramentas_admin.sql`
- `supabase/migrations/20260429001000_ferramentas_seed_31.sql`
- `docs/stories/story-003-modulo-ferramentas-admin.md`
