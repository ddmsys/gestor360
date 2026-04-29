# Story 005 - Editors completos: Depoimentos, Autores, Capítulos, Ferramentas

## Status

Draft

## Contexto

Quatro tipos de seção — `depoimentos`, `autores`, `capitulos` e `ferramentas` — usam o `GenericContentEditor` (campo textarea de JSON bruto) como fallback. Isso força a equipe de marketing a editar objetos JSON manualmente, o que é propenso a erros e bloqueia a autonomia operacional.

Os tipos de conteúdo já estão definidos em `src/types/cms.ts` mas não têm editor visual dedicado. O padrão de implementação está consolidado nos editors existentes (`HeroContentEditor`, `CardsContentEditor`, etc.) — basta seguir o mesmo padrão.

## Objetivo

Criar um `ContentEditor` visual guiado para cada um dos quatro tipos restantes, eliminando completamente o uso do `GenericContentEditor` para essas seções.

## Acceptance Criteria

- [ ] `DepoimentosContentEditor` permite adicionar, editar e remover depoimentos com campos: nome, cargo, empresa, texto, foto_url, e toggle de aprovado.
- [ ] `AutoresContentEditor` permite editar perfis de autores com campos: nome, cargo, bio, foto_url, e lista de links sociais (label + url).
- [ ] `CapitulosContentEditor` permite editar os 10 capítulos com campos: número, título, subtítulo, ícone/emoji e descrição.
- [ ] `FerramentasContentEditor` exibe as ferramentas agrupadas por capítulo (read-only do Supabase) e permite configurar o layout visual: columns, show_chapter_filter, show_access_badge.
- [ ] O `SectionContentEditor` (switch central) usa cada novo editor para seu respectivo tipo — `GenericContentEditor` não é mais chamado para esses 4 tipos.
- [ ] `npm run build` passa sem erros.

## Tasks

- [ ] Criar `DepoimentosContentEditor.tsx` com lista de depoimentos editável (add/remove/reorder).
- [ ] Criar `AutoresContentEditor.tsx` com campos de perfil e links sociais dinâmicos.
- [ ] Criar `CapitulosContentEditor.tsx` com 10 entradas de capítulo estruturadas.
- [ ] Criar `FerramentasContentEditor.tsx` com configurações de layout (ferramentas vêm do Supabase).
- [ ] Atualizar `SectionContentEditor.tsx` para mapear os 4 novos tipos.
- [ ] Atualizar `src/types/cms.ts` se novos campos forem necessários.
- [ ] Validar lint e build.

## Validation

- [ ] Cada editor carrega conteúdo salvo corretamente ao reabrir a seção.
- [ ] Campos obrigatórios têm placeholder claro.
- [ ] Adicionar/remover itens não corrompem o JSONB no Supabase.
- [ ] `npm run build` passa.

## File List

- `docs/stories/story-005-editors-modulos-completos.md`
- `src/components/admin/editors/DepoimentosContentEditor.tsx`
- `src/components/admin/editors/AutoresContentEditor.tsx`
- `src/components/admin/editors/CapitulosContentEditor.tsx`
- `src/components/admin/editors/FerramentasContentEditor.tsx`
- `src/components/admin/editors/SectionContentEditor.tsx`
- `src/types/cms.ts`
