# Story 007 - Reconciliação arquitetural: content.variant × SectionStyle

## Status

Draft

## Contexto

### O problema

Existe um conflito de autoridade entre dois sistemas de styling:

**Sistema A — `content.variant`** (dentro da seção):
- Campo no JSONB de conteúdo: ex. `{ variant: 'dark' }` em HeroContent
- A seção aplica uma classe Tailwind fixa: `bg-brand-blue`, `bg-bg-ink`, etc.
- **Problema**: inline styles têm menos especificidade que classes Tailwind v4 + tokens CSS → o background do StyleEditor é sobrescrito pela classe da seção.

**Sistema B — `SectionStyle.bgColor`** (wrapper externo):
- `buildSectionStyle()` gera `background: '#1F3F7A'` como inline style no wrapper `<div>`
- O wrapper fica FORA do componente da seção → não consegue sobrescrever classes internas

**Resultado atual**: O `SectionStyleEditor` no admin permite ao usuário escolher uma cor de fundo, mas ela não aparece no site para Hero, CTA, Text e Cards — porque as classes Tailwind internas ganham.

### A solução

Migrar o controle de background/cores para o `SectionStyle` exclusivamente, consumindo os CSS Custom Properties (`--section-*`) injetados pelo wrapper dentro de cada componente.

### Abordagem escolhida

1. **Remover `content.variant`** de Hero, CTA, Text, Cards — o campo ainda pode existir para compatibilidade mas não deve mais controlar cores.
2. **Remover classes Tailwind de background** dos componentes de seção — eles passam a usar `var(--section-bg-color)` ou herdar o background do wrapper.
3. **Adicionar `--section-bg-color`** como CSS Custom Property no `buildSectionStyle()`.
4. **Manter `content.bg` em Cards** apenas para o fundo do card individual (não da seção inteira).

## Objetivo

Resolver o conflito arquitetural de forma que o `SectionStyleEditor` seja a fonte única de verdade para todos os controles visuais de seção (fundo, cores, tipografia), eliminando o sistema duplicado de `content.variant`.

## Acceptance Criteria

- [ ] Alterar a cor de fundo de uma seção Hero via `SectionStyleEditor` reflete imediatamente no preview/site público.
- [ ] Alterar a cor de fundo de uma seção CTA via `SectionStyleEditor` reflete imediatamente.
- [ ] Alterar a cor de fundo de uma seção Text via `SectionStyleEditor` reflete imediatamente.
- [ ] Alterar a cor de fundo de uma seção Cards via `SectionStyleEditor` reflete apenas no fundo da seção (não dos cards individuais).
- [ ] `buildSectionStyle()` expõe `--section-bg-color` como CSS Custom Property.
- [ ] Os campos `variant` em HeroContentEditor, CTAContentEditor permanecem no editor admin como "preset rápido" mas disparam `onChange` atualizando o `SectionStyle` em vez de `content.variant`.
- [ ] Seções sem `SectionStyle` configurado renderizam com fundo transparente (herdam o fundo da página).
- [ ] Sem regressões visuais nas seções que já funcionavam.
- [ ] `npm run build` passa.

## Tasks

- [ ] Adicionar `--section-bg-color` em `buildSectionStyle()` em `build-section-style.ts`.
- [ ] Refatorar `HeroSection.tsx`: remover `bg-*` classes condicionais por `variant`, usar `var(--section-bg-color)` ou background transparente.
- [ ] Refatorar `CTASection.tsx`: mesmo padrão.
- [ ] Refatorar `TextSection.tsx`: mesmo padrão.
- [ ] Refatorar `CardsSection.tsx`: manter `bg-*` apenas no card individual, remover da seção wrapper.
- [ ] Atualizar `HeroContentEditor` e `CTAContentEditor`: campo `variant` como "preset rápido" → ao mudar, chama `onStyleChange({ bgColor: presetColor })` em vez de `onChange({ variant })`.
- [ ] Garantir `SectionRenderer` passa `onStyleChange` para editors (ou via prop drilling controlado).
- [ ] Validar lint e build.

## Validation

- [ ] Criar uma página de teste com uma seção Hero, uma CTA e uma Cards.
- [ ] Alterar o fundo de cada uma no StyleEditor e verificar que a cor aparece no `/preview/[slug]`.
- [ ] Verificar que `npm run build` passa sem erros de tipo.

## File List

- `docs/stories/story-007-reconciliacao-content-variant-style.md`
- `src/lib/cms/build-section-style.ts`
- `src/types/section-style.ts`
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/CTASection.tsx`
- `src/components/sections/TextSection.tsx`
- `src/components/sections/CardsSection.tsx`
- `src/components/admin/editors/HeroContentEditor.tsx`
- `src/components/admin/editors/CTAContentEditor.tsx`
- `src/components/admin/PageEditorClient.tsx`

## Notas técnicas

A abordagem de CSS Custom Properties é superior ao prop drilling porque:
- O wrapper `<div>` injetado pelo `SectionRenderer` já envolve toda a seção
- Componentes filhos podem consumir `var(--section-bg-color)` diretamente via CSS/Tailwind `[background:var(--section-bg-color)]`
- Sem necessidade de passar props de style por toda a árvore de componentes
- Compatível com Server Components (nenhum estado React envolvido)
