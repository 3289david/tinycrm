-- Run this in your Supabase SQL editor.

-- Profiles (auto-created on signup)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  company_name text,
  stripe_account_id text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "users view own profile" on profiles
  for select using (auth.uid() = id);

create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

-- Clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  status text not null default 'lead'
    check (status in ('lead', 'working', 'done', 'archived')),
  notes text,
  last_contact_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table clients enable row level security;

create policy "users crud own clients" on clients
  for all using (auth.uid() = user_id);

create index if not exists clients_user_id_idx on clients(user_id);
create index if not exists clients_status_idx on clients(status);

-- Client tags
create table if not exists client_tags (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  tag text not null,
  unique(client_id, tag)
);

alter table client_tags enable row level security;

create policy "users crud own client tags" on client_tags
  for all using (
    exists (
      select 1 from clients
      where clients.id = client_tags.client_id
        and clients.user_id = auth.uid()
    )
  );

-- Timeline events
create table if not exists timeline_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table timeline_events enable row level security;

create policy "users crud own timeline events" on timeline_events
  for all using (auth.uid() = user_id);

create index if not exists timeline_events_client_idx on timeline_events(client_id);

-- Invoices (sent to clients for payment)
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  description text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  due_date date,
  paid_at timestamptz,
  created_at timestamptz default now()
);

alter table invoices enable row level security;

create policy "users crud own invoices" on invoices
  for all using (auth.uid() = user_id);

-- Allow public read on invoices by id (for payment page, anon access)
create policy "public read invoice by id" on invoices
  for select using (true);

create index if not exists invoices_user_id_idx on invoices(user_id);
create index if not exists invoices_client_id_idx on invoices(client_id);
create index if not exists invoices_status_idx on invoices(status);

-- Auto-update updated_at on clients
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_updated_at
  before update on clients
  for each row execute procedure update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
