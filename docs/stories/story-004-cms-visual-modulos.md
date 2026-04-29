# Story 004 - CMS visual por modulos

## Status

In Progress

## Contexto

O CMS headless ja usa `pages` e `page_sections` no Supabase, mas o admin ainda exige que a equipe edite o conteudo das secoes em JSON. Isso bloqueia a autonomia do marketing, que precisa montar paginas e campanhas sem codigo.

## Objetivo

Transformar o editor de secoes em um fluxo visual por modulos, com campos guiados, presets responsivos e salvamento no mesmo formato `content` usado pelo renderizador publico.

## Acceptance Criteria

- [ ] `/admin/paginas/[id]/secoes/nova` permite escolher o tipo de modulo e preencher campos visuais, sem editar JSON.
- [ ] `/admin/paginas/[id]/secoes/[sectionId]` permite editar o conteudo existente por campos visuais.
- [ ] O CMS continua salvando em `page_sections.content` como JSONB para manter compatibilidade com o renderizador.
- [ ] Os modulos principais do CMS possuem campos guiados: hero, texto, cards, ferramentas, formulario, FAQ, CTA, depoimentos, capitulos e autores.
- [ ] Os campos expostos usam opcoes fechadas para layout, cores e responsividade sempre que possivel.
- [ ] As actions continuam aceitando JSON como fallback tecnico para conteudo legado.
- [ ] `npm run build` passa.

## Tasks

- [ ] Criar story e mapear estado atual.
- [ ] Criar builder de conteudo dos modulos.
- [ ] Criar formulario visual reutilizavel para secoes.
- [ ] Substituir tela de nova secao.
- [ ] Substituir tela de edicao de secao.
- [ ] Ajustar actions para salvar campos estruturados.
- [ ] Validar lint/build.

## Validation

- [ ] `npx eslint src/lib/cms/section-builder.ts src/components/forms/SectionContentForm.tsx 'src/app/(admin)/admin/paginas/[id]/secoes/nova/page.tsx' 'src/app/(admin)/admin/paginas/[id]/secoes/[sectionId]/page.tsx' src/lib/paginas/actions.ts`
- [ ] `npm run build`

## File List

- `docs/stories/story-004-cms-visual-modulos.md`
