# Story 001 - Refino visual da pagina de ferramentas

## Status

Ready for Review

## Contexto

O dominio `ogestor360.com` ja aponta para a Vercel e o envio pelo Resend foi validado com `contato@ogestor360.com`. A pagina `/ferramentas` e o destino principal do QR Code unico no final do livro.

## Objetivo

Melhorar a apresentacao visual da pagina de captura de ferramentas, mantendo o fluxo atual: cadastro do lead, envio de e-mail e mensagem de sucesso.

## Acceptance Criteria

- [x] A pagina `/ferramentas` comunica claramente que e a biblioteca digital do livro.
- [x] O formulario tem hierarquia visual mais premium e confiavel.
- [x] O estado de sucesso confirma o envio sem prometer downloads ainda nao implementados.
- [x] O layout funciona em mobile e desktop.
- [ ] `npm run lint` passa.

## Tasks

- [x] Refinar hero e composicao da pagina `/ferramentas`.
- [x] Refinar visual do formulario e estado de sucesso.
- [x] Validar lint dos arquivos alterados.

## Validation

- [x] `npx eslint 'src/app/(site)/ferramentas/page.tsx' src/components/forms/LeadForm.tsx`
- [x] `npm run build`
- [x] Verificacao visual em `http://localhost:3000/ferramentas` desktop 1440x1100.
- [x] Verificacao visual em `http://localhost:3000/ferramentas` mobile 390x900.
- [ ] `npm run lint` global. Bloqueado por erros preexistentes em `.aios-core`, `.claude` e `design`.

## File List

- `src/app/(site)/ferramentas/page.tsx`
- `src/components/forms/LeadForm.tsx`
- `docs/stories/story-001-refino-visual-ferramentas.md`
