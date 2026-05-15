create extension if not exists pgcrypto;

create table if not exists public.sticker_feed (
  id uuid primary key default gen_random_uuid(),
  sticker_id text not null,
  tipo text not null check (tipo in ('tem_repetida', 'precisa')),
  nome text not null check (char_length(trim(nome)) >= 2),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,15}$'),
  casa_lote text not null check (char_length(trim(casa_lote)) >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sticker_feed_sticker_whatsapp_key unique (sticker_id, whatsapp)
);

create index if not exists sticker_feed_sticker_id_idx
  on public.sticker_feed (sticker_id);

create index if not exists sticker_feed_tipo_idx
  on public.sticker_feed (tipo);

create or replace function public.set_sticker_feed_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_sticker_feed_updated_at on public.sticker_feed;

create trigger set_sticker_feed_updated_at
before update on public.sticker_feed
for each row
execute function public.set_sticker_feed_updated_at();

alter table public.sticker_feed enable row level security;

comment on table public.sticker_feed is
  'Feed publico do MVP de troca de figurinhas. O app usa Server Actions com service role key no servidor.';
