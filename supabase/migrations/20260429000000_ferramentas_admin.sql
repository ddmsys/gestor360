-- Gestor360 - Modulo de ferramentas
-- Aplicar no Supabase SQL Editor antes de usar /admin/ferramentas.

create table if not exists ferramentas (
  id uuid primary key default gen_random_uuid(),
  numero integer not null,
  nome text not null,
  descricao text,
  capitulo integer not null check (capitulo >= 1 and capitulo <= 10),
  arquivo_path text,
  acesso text default 'gratuito' check (acesso in ('gratuito', 'codigo_livro')),
  ativo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ferramentas
  add column if not exists tipo text default 'individual'
    check (tipo in ('individual', 'kit_completo'));

alter table ferramentas
  add column if not exists status text default 'draft'
    check (status in ('draft', 'published'));

alter table ferramentas
  add column if not exists ordem integer default 0;

alter table ferramentas
  add column if not exists imagem_url text;

alter table ferramentas
  add column if not exists cor text;

alter table ferramentas
  alter column arquivo_path drop not null;

create index if not exists ferramentas_capitulo_idx on ferramentas(capitulo);
create index if not exists ferramentas_acesso_idx on ferramentas(acesso);
create index if not exists ferramentas_status_idx on ferramentas(status);
create index if not exists ferramentas_ordem_idx on ferramentas(capitulo, ordem, numero);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ferramentas_updated_at on ferramentas;
create trigger ferramentas_updated_at
before update on ferramentas
for each row execute function set_updated_at();

alter table ferramentas enable row level security;

drop policy if exists "public_free" on ferramentas;
create policy "public_free"
on ferramentas for select to anon
using (status = 'published' and ativo = true and acesso = 'gratuito');

drop policy if exists "auth_all" on ferramentas;
create policy "auth_all"
on ferramentas for all to authenticated
using (true)
with check (true);

-- Opcional: registro do ZIP completo como rascunho.
-- Ajuste arquivo_path quando o ZIP final for enviado ao bucket privado ferramentas-pdf.
insert into ferramentas (
  numero,
  nome,
  descricao,
  capitulo,
  tipo,
  status,
  acesso,
  ativo,
  ordem,
  arquivo_path,
  cor
)
select
  0,
  'Kit completo Gestor360',
  'Arquivo ZIP com todas as ferramentas do livro.',
  1,
  'kit_completo',
  'draft',
  'gratuito',
  false,
  0,
  'kit-completo/gestor360-kit-completo.zip',
  '#25346e'
where not exists (
  select 1 from ferramentas where tipo = 'kit_completo'
);
