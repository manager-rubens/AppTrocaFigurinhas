alter table public.sticker_feed
  add column if not exists user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'sticker_feed_user_id_fkey'
      and conrelid = 'public.sticker_feed'::regclass
  ) then
    alter table public.sticker_feed
      add constraint sticker_feed_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'sticker_feed_sticker_whatsapp_key'
      and conrelid = 'public.sticker_feed'::regclass
  ) then
    alter table public.sticker_feed
      drop constraint sticker_feed_sticker_whatsapp_key;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'sticker_feed_sticker_user_key'
      and conrelid = 'public.sticker_feed'::regclass
  ) then
    alter table public.sticker_feed
      add constraint sticker_feed_sticker_user_key unique (sticker_id, user_id);
  end if;
end
$$;

create index if not exists sticker_feed_user_id_idx
  on public.sticker_feed (user_id);

comment on column public.sticker_feed.user_id is
  'Usuario Supabase Auth dono do registro. Substitui a posse por WhatsApp no MVP com login.';
