-- Gestor360 — Blog: tabela de posts
-- Suporta markdown no campo content, imagem de capa e status draft/published.

create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  cover_url    text,
  content      text not null default '',
  status       text default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists posts_slug_idx        on posts(slug);
create index if not exists posts_status_idx      on posts(status);
create index if not exists posts_published_at_idx on posts(published_at desc);

-- Trigger updated_at
create or replace function set_posts_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at
before update on posts
for each row execute function set_posts_updated_at();

-- RLS
alter table posts enable row level security;

-- Anon só lê posts publicados
drop policy if exists "public_published" on posts;
create policy "public_published"
on posts for select to anon
using (status = 'published');

-- Admin faz tudo
drop policy if exists "admin_all" on posts;
create policy "admin_all"
on posts for all to authenticated
using (true)
with check (true);
