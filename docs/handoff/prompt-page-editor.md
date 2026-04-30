Leia o CLAUDE.md e os arquivos em uploads/:
- README.md (visão geral e checklist)
- PageEditor.spec.md (spec detalhada de cada componente)
- section-style.ts → copiar para src/types/section-style.ts
- style-schemas.ts → copiar para src/lib/cms/style-schemas.ts
- build-section-style.ts → copiar para src/lib/cms/build-section-style.ts
- add-style-column.sql → rodar no Supabase

Implemente o Admin Page Editor do Gestor360 CMS seguindo a ordem
do checklist do README.md. Além da spec original, inclua:

── CRÍTICAS (implementar junto com o MVP) ──────────────────────────

1. Alerta de saída sem salvar
   - Indicador "● Alterações não salvas" em dourado na TopBar
   - Hook useBeforeUnload que dispara confirm() quando isDirty === true
   - isDirty = deep-equal entre sections e initialSections

2. Preview mobile no PreviewCanvas
   - Toggle 🖥 Desktop / 📱 Mobile na TopBar
   - Em modo mobile: container com max-width 390px centralizado
     com borda simulando tela de celular

3. Publicar/Despublicar direto do editor
   - Badge de status vira DropdownMenu: "Publicar agora" / 
     "Voltar para rascunho"
   - handleSave aceita parâmetro newStatus? que atualiza pages.status
     junto com as seções

4. Duplicar seção
   - Ícone ⎘ nas ações inline do SidebarSections
   - Cria cópia com novo crypto.randomUUID() inserida logo abaixo
     da original

5. Dialog de confirmação no deleteSection
   - Usar AlertDialog do Radix/shadcn
   - Texto: "Remover a seção '{tipo}'? Esta ação não pode ser desfeita."

── ALTAS (implementar na Fase 3, junto com o StyleEditor) ──────────

6. Checker de contraste WCAG inline no StyleEditor (aba Tipo)
   - Após os color pickers de titleColor e textColor, calcular razão
     de contraste vs bgColor atual
   - Algoritmo WCAG 2.1 em JS puro (sem lib)
   - Badge: ✅ Legível (≥4.5:1) · ⚠️ Baixo contraste · ❌ Ilegível

7. Histórico simplificado — últimas 5 versões salvas
   - Nova tabela: page_snapshots(id uuid, page_id uuid, 
     sections_json jsonb, created_at timestamptz, label text)
   - A cada handleSave(), salvar snapshot com label = timestamp
   - Botão "Histórico" na TopBar abre Drawer lateral com os últimos 5
   - Clicar em snapshot restaura sections no estado local (ainda
     precisa salvar para confirmar)

── NICE TO HAVE (Fase 4 se houver tempo) ───────────────────────────

8. SEO fields inline no editor
   - Seção colapsável no topo da Sidebar: título SEO (máx 60 chars 
     com contador), meta description (máx 160), og_image
   - Preview estilo "card do Google" e "card de WhatsApp"
   - Salvar em pages.title, pages.description, pages.og_image

9. Autosave de rascunho
   - useEffect com setInterval a cada 2 minutos quando isDirty === true
   - Nunca muda status de Rascunho → Publicado
   - Exibir "Salvo automaticamente às HH:MM" em cinza na TopBar

Execute fase por fase conforme o README. Confirme antes de
iniciar cada nova fase.