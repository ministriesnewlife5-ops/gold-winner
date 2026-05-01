-- Supabase schema for Gold Winner Mother's Day microsite
-- Run in Supabase SQL editor

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 1000),
  template_id text not null check (char_length(template_id) between 1 and 80),
  delivery_address text not null check (char_length(delivery_address) between 1 and 500),
  phone_number text not null check (phone_number ~ '^[0-9]{10,15}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.order_images (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  image_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_images_order_id on public.order_images(order_id);

-- Optional row level security if you later expose client-side direct reads
alter table public.orders enable row level security;
alter table public.order_images enable row level security;

-- Deny anonymous direct reads by default; backend uses service role key
revoke all on public.orders from anon, authenticated;
revoke all on public.order_images from anon, authenticated;

-- Storage bucket (run once)
insert into storage.buckets (id, name, public)
values ('order-images', 'order-images', false)
on conflict (id) do nothing;

-- Storage access policies (optional if only service role is used)
drop policy if exists "service-role-storage-access" on storage.objects;
create policy "service-role-storage-access"
on storage.objects
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
