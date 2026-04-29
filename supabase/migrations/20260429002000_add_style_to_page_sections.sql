-- supabase/migrations/YYYYMMDD_add_style_to_page_sections.sql
-- Adiciona coluna `style` (JSONB) à tabela page_sections
-- Executar via: supabase db push OU Supabase Dashboard > SQL Editor
-- Gerado em Abril 2026 — DDM Editora

-- 1. Adicionar coluna style
ALTER TABLE page_sections
  ADD COLUMN IF NOT EXISTS style JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 2. Comentário descritivo
COMMENT ON COLUMN page_sections.style IS
  'Estilo visual da seção — cor de fundo, tipografia, espaçamento, efeitos. Ver src/types/section-style.ts';

-- 3. Índice GIN para queries no JSONB (opcional, recomendado se filtrar por estilo no futuro)
CREATE INDEX IF NOT EXISTS page_sections_style_gin
  ON page_sections USING gin (style);

-- 4. Política RLS — admin pode atualizar style (igual ao content)
-- ATENÇÃO: ajuste o nome da policy conforme suas policies existentes

-- Verificar policies existentes antes de criar:
-- SELECT policyname FROM pg_policies WHERE tablename = 'page_sections';

-- Exemplo de policy (adapte conforme sua implementação):
-- CREATE POLICY "admin_update_sections"
--   ON page_sections FOR UPDATE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM profiles
--       WHERE profiles.id = auth.uid()
--       AND profiles.role = 'admin'
--     )
--   );

-- 5. Rollback (caso necessário)
-- ALTER TABLE page_sections DROP COLUMN IF EXISTS style;
-- DROP INDEX IF EXISTS page_sections_style_gin;
