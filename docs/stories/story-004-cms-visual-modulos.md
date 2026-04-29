# Story 004 - CMS visual por modulos

## Status

Ready for Review

## Contexto

O CMS headless ja usa `pages` e `page_sections` no Supabase, mas o admin ainda exige que a equipe edite o conteudo das secoes em JSON. Isso bloqueia a autonomia do marketing, que precisa montar paginas e campanhas sem codigo.

## Objetivo

Transformar o editor de secoes em um fluxo visual por modulos, com campos guiados, presets responsivos e salvamento no mesmo formato `content` usado pelo renderizador publico.

## Acceptance Criteria

- [x] `/admin/paginas/[id]/secoes/nova` permite escolher o tipo de modulo e preencher campos visuais, sem editar JSON.
- [x] `/admin/paginas/[id]/secoes/[sectionId]` permite editar o conteudo existente por campos visuais.
- [x] O CMS continua salvando em `page_sections.content` como JSONB para manter compatibilidade com o renderizador.
- [x] Os modulos principais do CMS possuem campos guiados: hero, texto, cards, ferramentas, formulario, FAQ, CTA, depoimentos, capitulos e autores.
- [x] Os campos expostos usam opcoes fechadas para layout, cores e responsividade sempre que possivel.
- [x] As actions continuam aceitando JSON como fallback tecnico para conteudo legado.
- [x] `npm run build` passa.

## Tasks

- [x] Criar story e mapear estado atual.
- [x] Criar builder de conteudo dos modulos.
- [x] Criar formulario visual reutilizavel para secoes.
- [x] Substituir tela de nova secao.
- [x] Substituir tela de edicao de secao.
- [x] Ajustar actions para salvar campos estruturados.
- [x] Validar lint/build.

## Validation

- [x] `npx eslint src/lib/cms/section-builder.ts src/components/forms/SectionContentForm.tsx 'src/app/(admin)/admin/paginas/[id]/secoes/nova/page.tsx' 'src/app/(admin)/admin/paginas/[id]/secoes/[sectionId]/page.tsx' src/lib/paginas/actions.ts`
- [x] `npm run build`
- [ ] `npm run lint` global. Bloqueado por erros antigos fora da Story 004 em `.aios-core`, `.claude`, `design` e algumas telas existentes.
- [ ] `npm run typecheck`. Bloqueado: script nao existe no `package.json`.
- [ ] `npm test`. Bloqueado: script nao existe no `package.json`.

## File List

- `docs/stories/story-004-cms-visual-modulos.md`
- `src/lib/cms/section-builder.ts`
- `src/components/forms/SectionContentForm.tsx`
- `src/lib/paginas/actions.ts`
- `src/app/(admin)/admin/paginas/[id]/secoes/nova/page.tsx`
- `src/app/(admin)/admin/paginas/[id]/secoes/[sectionId]/page.tsx`
