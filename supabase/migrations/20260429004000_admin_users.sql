-- Gestor360 — Tabela de usuários admin convidados via painel
-- Super admins são definidos via variável de ambiente ADMIN_EMAILS.
-- Esta tabela gerencia usuários adicionais convidados pelo super admin.

create table if not exists admin_users (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  nome       text,
  ativo      boolean default true,
  criado_por text,
  created_at timestamptz default now()
);

create index if not exists admin_users_email_idx on admin_users(email);
create index if not exists admin_users_ativo_idx  on admin_users(ativo);

-- RLS: apenas service role acessa (acessado via createAdminClient com service key)
alter table admin_users enable row level security;

drop policy if exists "service_all" on admin_users;
create policy "service_all"
on admin_users for all to authenticated
using (true)
with check (true);
