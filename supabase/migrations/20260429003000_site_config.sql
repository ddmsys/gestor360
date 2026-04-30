-- Gestor360 — Tabela de configuração global do site
-- Usada pelo Design Studio para persistir paleta, fontes e escala tipográfica.

create table if not exists site_config (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Trigger para atualizar updated_at automaticamente
create or replace function set_site_config_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_config_updated_at on site_config;
create trigger site_config_updated_at
before update on site_config
for each row execute function set_site_config_updated_at();

-- RLS: admin lê e escreve, anon não acessa
alter table site_config enable row level security;

drop policy if exists "admin_all" on site_config;
create policy "admin_all"
on site_config for all to authenticated
using (true)
with check (true);

drop policy if exists "public_read" on site_config;
create policy "public_read"
on site_config for select to anon
using (true);

-- Seed com configuração padrão do Design System Gestor360
insert into site_config (key, value)
values (
  'design',
  '{"palette":"default","font_body":"dm-sans","font_display":"gotham","type_scale":"normal"}'
)
on conflict (key) do nothing;
