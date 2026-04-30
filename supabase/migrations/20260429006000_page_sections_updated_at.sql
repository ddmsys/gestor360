-- Gestor360 — Adiciona updated_at em page_sections
-- O type PageSection em src/types/cms.ts declara o campo mas ele não existia no schema original.

alter table page_sections
  add column if not exists updated_at timestamptz default now();

-- Trigger para manter updated_at sincronizado
create or replace function set_page_sections_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists page_sections_updated_at on page_sections;
create trigger page_sections_updated_at
before update on page_sections
for each row execute function set_page_sections_updated_at();
