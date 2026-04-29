# Epic — CMS Gestor360: Autonomia Total do Marketing

## Status

Draft

## Contexto

O CMS headless do Gestor360 passou pelas Semanas 1–4 de desenvolvimento e hoje permite criar páginas com seções, editar conteúdo via campos visuais e aplicar estilos via `SectionStyleEditor`. No entanto, quatro lacunas críticas impedem que a equipe de marketing opere com autonomia real:

1. **Editors incompletos**: `DepoimentosSection`, `AutoresSection`, `CapitulosSection` e `FerramentasSection` usam um `GenericContentEditor` (JSON bruto) em vez de formulários guiados.
2. **TextSection limitada**: Não suporta imagem lateral, CTA embutido nem formatação markdown rica.
3. **Conflito arquitetural**: O campo `content.variant` (classe Tailwind aplicada dentro da seção) e o `SectionStyle.bgColor` (inline style no wrapper) brigam pelo controle visual — backgrounds configurados no StyleEditor não funcionam para Hero, CTA, Text e Cards.
4. **Controles de título ausentes**: Quebra de linha manual, tamanho responsivo real e outros controles finos necessários para layouts de marketing.

## Objetivo

Entregar um CMS onde a equipe de marketing possa criar qualquer página de campanha — com controle total de tipografia, imagens, vídeos, textos formatados e layouts — sem escrever uma linha de código.

## Stories

| # | Story | Prioridade |
|---|-------|-----------|
| 005 | Editors completos: Depoimentos, Autores, Capítulos, Ferramentas | Alta |
| 006 | TextSection: imagem lateral + CTA opcional + markdown | Alta |
| 007 | Reconciliação arquitetural: `content.variant` × `SectionStyle` | Crítica |
| 008 | Controles finos de título: quebra de linha + drag & drop sidebar | Média |

## Critério de Conclusão do Epic

- [ ] Todas as 10 seções têm editors visuais guiados (sem JSON bruto)
- [ ] TextSection suporta imagem lateral e markdown
- [ ] StyleEditor controla background/cores de TODAS as seções (sem conflito)
- [ ] Marketing consegue criar e publicar uma landing page completa sem suporte técnico

## Rastreabilidade

- Origem: Análise UX — `docs/handoff/` + gap analysis realizado em Abril 2026
- Epic pai: CMS headless Gestor360 (Fases 1–4 concluídas)
- Próximo epic planejado: Blog + Área de Membros (Mês 2–3)
