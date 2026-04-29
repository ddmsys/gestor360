# Story 002 - Login e protecao do admin

## Status

Ready for Review

## Contexto

O site publico ja tem dominio, formulario e envio de e-mail funcionando. Antes de criar modulos administrativos para ferramentas e CMS, o `/admin` precisa ter login, logout e regra minima de autorizacao.

## Objetivo

Permitir que apenas usuarios autorizados acessem o painel admin usando Supabase Auth.

## Acceptance Criteria

- [x] `/login` permite entrar com e-mail e senha via Supabase Auth.
- [x] `/admin` redireciona usuarios anonimos para `/login`.
- [x] Admin valida o e-mail autenticado contra `ADMIN_EMAIL` ou `ADMIN_EMAILS`.
- [x] Admin exibe o usuario autenticado e permite logout.
- [x] `npm run build` passa.

## Tasks

- [x] Criar helper de autorizacao admin.
- [x] Criar formulario de login.
- [x] Criar pagina `/login`.
- [x] Adicionar validacao e logout no layout admin.
- [x] Validar build.

## Validation

- [x] `npx eslint src/lib/admin/auth.ts src/components/forms/LoginForm.tsx src/app/login/page.tsx 'src/app/(admin)/layout.tsx' 'src/app/(admin)/admin/paginas/page.tsx' src/components/sections/CTASection.tsx src/components/sections/FormSection.tsx`
- [x] `npm run build`

## File List

- `src/lib/admin/auth.ts`
- `src/components/forms/LoginForm.tsx`
- `src/app/login/page.tsx`
- `src/app/(admin)/layout.tsx`
- `src/app/(admin)/admin/paginas/page.tsx`
- `src/components/sections/CTASection.tsx`
- `src/components/sections/FormSection.tsx`
- `docs/stories/story-002-login-admin.md`
