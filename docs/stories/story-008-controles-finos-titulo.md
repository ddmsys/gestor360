# Story 008 - Controles finos de título e UX do sidebar

## Status

Draft

## Contexto

Com a Story 007 resolvendo o conflito arquitetural, o StyleEditor passa a ser funcional. Para campanhas de marketing de alto impacto, a equipe precisa de dois controles adicionais:

1. **Quebra de linha manual em títulos**: Escrever `Gestor\n360` no campo e ver o título renderizado com a quebra exatamente onde foi digitado — controle tipográfico essencial para headlines de hero.

2. **Reordenação via drag & drop no sidebar**: Hoje a reordenação de seções usa botões ▲▼ (funcional mas lento). Para páginas com 8–12 seções, arrastar é muito mais ágil.

## Objetivo

Adicionar suporte a quebra de linha intencional em títulos e melhorar a UX de reordenação de seções no sidebar do editor.

## Acceptance Criteria

- [ ] Em qualquer campo de título no admin que aceite `\n`, o usuário pode digitar `\n` e o preview/site público renderiza `<br>` no lugar.
- [ ] `HeroSection`, `TextSection`, `CTASection`, `CardsSection` (título da seção) processam `\n` → `<br>` nos títulos.
- [ ] Uma dica visual ("use \\n para quebrar linha") aparece como `placeholder` ou tooltip nos campos de título nos editors.
- [ ] O sidebar de seções (`LeftPanel`) suporta reordenação via drag & drop usando `@dnd-kit/core` + `@dnd-kit/sortable`.
- [ ] A ordem após drag & drop é salva da mesma forma que os botões ▲▼ (mesma chamada de API).
- [ ] Os botões ▲▼ continuam funcionando como fallback (acessibilidade).
- [ ] `npm run build` passa.

## Tasks

- [ ] Criar helper `renderTitle(text: string): ReactNode` que converte `\n` → array com `<br>`.
- [ ] Aplicar `renderTitle()` em `HeroSection`, `TextSection`, `CTASection`, `CardsSection`.
- [ ] Adicionar hint de `\n` nos placeholders/tooltips dos campos título nos editors.
- [ ] Instalar `@dnd-kit/core` e `@dnd-kit/sortable`.
- [ ] Refatorar `LeftPanel.tsx` para usar `<SortableContext>` + `<DragOverlay>`.
- [ ] Validar lint e build.

## Validation

- [ ] Digitar `Gestor\n360` no título de um Hero e verificar quebra no preview.
- [ ] Arrastar seção 3 para posição 1 e verificar que a ordem é preservada após reload da página.
- [ ] Botões ▲▼ continuam funcionando após a refatoração.
- [ ] `npm run build` passa.

## File List

- `docs/stories/story-008-controles-finos-titulo.md`
- `src/lib/cms/render-title.tsx`
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/TextSection.tsx`
- `src/components/sections/CTASection.tsx`
- `src/components/sections/CardsSection.tsx`
- `src/components/admin/editors/HeroContentEditor.tsx`
- `src/components/admin/editors/TextContentEditor.tsx`
- `src/components/admin/editors/CTAContentEditor.tsx`
- `src/components/admin/LeftPanel.tsx`
- `package.json`

## Dependências

- Story 005 (pode ser implementada em paralelo)
- Story 006 (pode ser implementada em paralelo)
- Story 007 deve estar concluída antes desta (especialmente para testar quebra de linha em HeroSection sem conflito de estilos)
