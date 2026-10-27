-- Rodar no SQL Editor do Supabase. Desabilitar cadastro público e criar apenas o dono em Authentication > Users.
create table if not exists public.messages(id bigint generated always as identity primary key,name text not null,email text not null,message text not null,replied boolean not null default false,created_at timestamptz not null default now());
create table if not exists public.featured_projects(repo_name text primary key);
alter table public.messages enable row level security;
alter table public.featured_projects enable row level security;
create policy "owner read messages" on public.messages for select to authenticated using (true);
create policy "owner update messages" on public.messages for update to authenticated using (true) with check (true);
create policy "public read featured" on public.featured_projects for select to anon,authenticated using (true);
create policy "owner create featured" on public.featured_projects for insert to authenticated with check (true);
create policy "owner remove featured" on public.featured_projects for delete to authenticated using (true);
-- A inserção em messages é feita exclusivamente em api/contact com service_role. Não liberar insert público.
