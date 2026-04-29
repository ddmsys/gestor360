# Story 006 - TextSection: imagem lateral + CTA opcional + markdown

## Status

Draft

## Contexto

A `TextSection` atual suporta apenas título + corpo em texto simples + alinhamento + bg. Layouts de marketing comuns — como "texto à esquerda, imagem à direita" ou "parágrafo formatado com lista de benefícios + botão" — exigem hoje uma combinação de seções separadas ou código manual.

O `docs/handoff/` desenhado pelo Claude Design previa que TextSection seria a seção mais versátil do CMS, suportando markdown, imagem lateral e CTA embutido.

## Objetivo

Expandir `TextSection` (componente público + editor admin) para suportar:
1. **Imagem lateral** com lado configurável (esq/dir) e proporções
2. **Markdown real** no corpo (usando `react-markdown`)
3. **CTA opcional** embutido (label + url + estilo do botão)

## Acceptance Criteria

- [ ] `TextContent` (tipo em `cms.ts`) inclui: `body_markdown`, `image_url`, `image_alt`, `image_side` (`left` | `right`), `image_ratio` (`1:1` | `4:3` | `16:9`), `cta_label`, `cta_url`, `cta_style` (`primary` | `secondary` | `ghost`).
- [ ] `TextSection.tsx` renderiza markdown com `react-markdown` (suporte a negrito, itálico, listas, links).
- [ ] Quando `image_url` presente: layout side-by-side responsivo (coluna em mobile, lado a lado em `lg:`).
- [ ] `image_side === 'left'` inverte a ordem (imagem à esquerda, texto à direita).
- [ ] Quando `cta_label` + `cta_url` presentes: botão renderizado abaixo do corpo com o estilo correto.
- [ ] `TextContentEditor.tsx` expõe todos os novos campos com UI guiada (campos condicionais: image_alt/image_side/image_ratio só aparecem quando image_url preenchido; cta_url só aparece quando cta_label preenchido).
- [ ] Campo `body` legado continua funcionando (backward-compatible).
- [ ] `react-markdown` adicionado como dependência.
- [ ] `npm run build` passa.

## Tasks

- [ ] Instalar `react-markdown`.
- [ ] Atualizar `TextContent` em `src/types/cms.ts` com novos campos.
- [ ] Reescrever `TextSection.tsx` com suporte a markdown, imagem lateral e CTA.
- [ ] Criar `TextContentEditor.tsx` dedicado (substituir o `GenericContentEditor` para tipo `text`).
- [ ] Atualizar `SectionContentEditor.tsx` para usar o novo editor.
- [ ] Validar lint e build.

## Validation

- [ ] Texto com `**negrito**` e `*itálico*` renderiza corretamente no site público.
- [ ] Layout side-by-side funciona em desktop e colapsa para coluna em mobile (< 1024px).
- [ ] Remover `image_url` oculta o bloco de imagem sem quebrar o layout.
- [ ] `npm run build` passa.

## File List

- `docs/stories/story-006-textsection-imagem-markdown.md`
- `package.json`
- `src/types/cms.ts`
- `src/components/sections/TextSection.tsx`
- `src/components/admin/editors/TextContentEditor.tsx`
- `src/components/admin/editors/SectionContentEditor.tsx`
