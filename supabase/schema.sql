-- 1. Crie o usuário do dono em Supabase Authentication > Users.
-- 2. Copie o UUID desse usuário e substitua COLE_O_UUID_DO_DONO no INSERT final.
create table if not exists public.admin_users (
 id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.messages (
 id bigint generated always as identity primary key,
 name text not null,
 email text not null,
 message text not null,
 replied boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.featured_projects (
 repo_name text primary key
);

alter table public.admin_users enable row level security;
alter table public.messages enable row level security;
alter table public.featured_projects enable row level security;

-- Recriar as políticas permite executar este arquivo novamente sem erro.
drop policy if exists "read own admin record" on public.admin_users;
drop policy if exists "owner read messages" on public.messages;
drop policy if exists "owner update messages" on public.messages;
drop policy if exists "public read featured" on public.featured_projects;
drop policy if exists "owner create featured" on public.featured_projects;
drop policy if exists "owner remove featured" on public.featured_projects;

create policy "read own admin record" on public.admin_users
 for select to authenticated using (id = auth.uid());

create policy "owner read messages" on public.messages
 for select to authenticated
 using (exists (select 1 from public.admin_users where id = auth.uid()));
create policy "owner update messages" on public.messages
 for update to authenticated
 using (exists (select 1 from public.admin_users where id = auth.uid()))
 with check (exists (select 1 from public.admin_users where id = auth.uid()));

create policy "public read featured" on public.featured_projects
 for select to anon, authenticated using (true);
create policy "owner create featured" on public.featured_projects
 for insert to authenticated
 with check (exists (select 1 from public.admin_users where id = auth.uid()));
create policy "owner remove featured" on public.featured_projects
 for delete to authenticated
 using (exists (select 1 from public.admin_users where id = auth.uid()));

-- Execute depois de criar o usuário e substituir pelo UUID real dele.
insert into public.admin_users (id)
values ('COLE_O_UUID_DO_DONO')
on conflict (id) do nothing;
-- A API /api/contact insere mensagens usando service_role no servidor.
-- Não crie política de INSERT público para a tabela messages.
