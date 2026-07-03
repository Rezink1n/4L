-- ============================================================================
-- Esquema de base de datos para la app "4L" (aprendizaje multiidioma).
-- Ejecutar en el SQL Editor de Supabase, o con `supabase db push`.
--
-- Diseño clave: el idioma español NO es una columna especial de "terms", es
-- una fila más de "translations" (language_code = 'es'). Así, añadir un
-- idioma nuevo en el futuro (alemán, inglés...) es solo una fila en
-- "languages" + filas en "translations": no hace falta tocar este esquema.
-- ============================================================================

create extension if not exists "pgcrypto"; -- para gen_random_uuid()

-- ---------------------------------------------------------------------------
-- languages: catálogo de idiomas soportados
-- ---------------------------------------------------------------------------
create table if not exists public.languages (
  code         text primary key,        -- 'es', 'fr', 'pt', 'it'...
  name         text not null,           -- 'Francés'
  native_name  text,                    -- 'Français'
  is_learnable boolean not null default true, -- false para el idioma base (español)
  sort_order   integer not null default 0
);

-- ---------------------------------------------------------------------------
-- terms: la unidad de aprendizaje (un concepto), sin texto propio
-- ---------------------------------------------------------------------------
create table if not exists public.terms (
  id          uuid primary key default gen_random_uuid(),
  level       text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  category    text not null default 'general',
  is_official boolean not null default true,
  owner_id    uuid references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),

  -- El contenido oficial no tiene dueño; el contenido de usuario sí.
  -- Esto evita, a nivel de base de datos, que un usuario pueda marcar sus
  -- propias palabras como "oficiales" (RLS ya lo impide, esto es un cinturón
  -- de seguridad adicional).
  constraint terms_propiedad_coherente check (
    (owner_id is null and is_official = true) or
    (owner_id is not null and is_official = false)
  )
);

create index if not exists idx_terms_level_category on public.terms (level, category);
create index if not exists idx_terms_owner on public.terms (owner_id);

-- ---------------------------------------------------------------------------
-- translations: una fila por idioma y término (incluido el español)
-- ---------------------------------------------------------------------------
create table if not exists public.translations (
  id            uuid primary key default gen_random_uuid(),
  term_id       uuid not null references public.terms (id) on delete cascade,
  language_code text not null references public.languages (code),
  text          text not null,

  unique (term_id, language_code)
);

create index if not exists idx_translations_term on public.translations (term_id);
create index if not exists idx_translations_language on public.translations (language_code);

-- ---------------------------------------------------------------------------
-- user_progress: progreso granular (por idioma) o del término completo
-- ---------------------------------------------------------------------------
create table if not exists public.user_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  term_id       uuid not null references public.terms (id) on delete cascade,
  language_code text references public.languages (code), -- NULL = término completo
  learned       boolean not null default true,
  updated_at    timestamptz not null default now()
);

-- Un UNIQUE normal no basta: Postgres trata cada NULL como distinto, así que
-- se necesitan dos índices únicos PARCIALES para cubrir los dos casos
-- ("idioma concreto" y "término completo") sin permitir duplicados en ninguno.
create unique index if not exists uq_progreso_termino_completo
  on public.user_progress (user_id, term_id)
  where (language_code is null);

create unique index if not exists uq_progreso_por_idioma
  on public.user_progress (user_id, term_id, language_code)
  where (language_code is not null);

create index if not exists idx_progreso_usuario on public.user_progress (user_id);

-- ---------------------------------------------------------------------------
-- reminder_settings: preferencia de recordatorio local (Fase 1)
-- ---------------------------------------------------------------------------
create table if not exists public.reminder_settings (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  hour       time not null default '20:00',
  active     boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- push_subscriptions: suscripciones de Push real (Fase 2, opcional)
-- ---------------------------------------------------------------------------
create table if not exists public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth_key   text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.languages enable row level security;
alter table public.terms enable row level security;
alter table public.translations enable row level security;
alter table public.user_progress enable row level security;
alter table public.reminder_settings enable row level security;
alter table public.push_subscriptions enable row level security;

-- languages: catálogo público de solo lectura para cualquier usuario autenticado
create policy "languages: lectura publica"
  on public.languages for select
  to authenticated
  using (true);

-- terms: cada usuario ve el contenido oficial + el suyo propio;
-- solo puede crear/editar/borrar el suyo propio.
create policy "terms: lectura oficial o propia"
  on public.terms for select
  to authenticated
  using (is_official = true or owner_id = auth.uid());

create policy "terms: alta de terminos propios"
  on public.terms for insert
  to authenticated
  with check (owner_id = auth.uid() and is_official = false);

create policy "terms: edicion de terminos propios"
  on public.terms for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid() and is_official = false);

create policy "terms: borrado de terminos propios"
  on public.terms for delete
  to authenticated
  using (owner_id = auth.uid());

-- translations: visibles/editables según el término al que pertenecen
create policy "translations: lectura segun termino"
  on public.translations for select
  to authenticated
  using (
    exists (
      select 1 from public.terms t
      where t.id = translations.term_id
        and (t.is_official = true or t.owner_id = auth.uid())
    )
  );

create policy "translations: alta segun termino propio"
  on public.translations for insert
  to authenticated
  with check (
    exists (
      select 1 from public.terms t
      where t.id = translations.term_id and t.owner_id = auth.uid()
    )
  );

create policy "translations: edicion segun termino propio"
  on public.translations for update
  to authenticated
  using (
    exists (
      select 1 from public.terms t
      where t.id = translations.term_id and t.owner_id = auth.uid()
    )
  );

create policy "translations: borrado segun termino propio"
  on public.translations for delete
  to authenticated
  using (
    exists (
      select 1 from public.terms t
      where t.id = translations.term_id and t.owner_id = auth.uid()
    )
  );

-- user_progress, reminder_settings, push_subscriptions: solo el propio usuario
create policy "progreso: todo sobre lo propio"
  on public.user_progress for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "recordatorios: todo sobre lo propio"
  on public.reminder_settings for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "push: todo sobre lo propio"
  on public.push_subscriptions for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================================
-- Función auxiliar: marcar_progreso
--
-- Encapsula el "upsert" de user_progress. Se hace vía RPC (en lugar de un
-- upsert directo desde supabase-js) porque el cliente JS solo puede indicar
-- una lista de columnas para ON CONFLICT, y aquí hacen falta los DOS índices
-- únicos parciales de arriba, cada uno con su propio predicado WHERE. En SQL
-- puro sí se puede indicar ese predicado en la cláusula ON CONFLICT.
--
-- SECURITY INVOKER (el valor por defecto): la función se ejecuta con los
-- permisos y el auth.uid() de quien la llama, así que las políticas RLS de
-- arriba se siguen aplicando con normalidad.
-- ============================================================================
create or replace function public.marcar_progreso(
  p_term_id uuid,
  p_language_code text,
  p_learned boolean
) returns void
language plpgsql
security invoker
as $$
begin
  if p_language_code is null then
    insert into public.user_progress (user_id, term_id, language_code, learned, updated_at)
    values (auth.uid(), p_term_id, null, p_learned, now())
    on conflict (user_id, term_id) where (language_code is null)
    do update set learned = excluded.learned, updated_at = now();
  else
    insert into public.user_progress (user_id, term_id, language_code, learned, updated_at)
    values (auth.uid(), p_term_id, p_language_code, p_learned, now())
    on conflict (user_id, term_id, language_code) where (language_code is not null)
    do update set learned = excluded.learned, updated_at = now();
  end if;
end;
$$;

grant execute on function public.marcar_progreso(uuid, text, boolean) to authenticated;

-- ============================================================================
-- Idiomas iniciales. "es" es el idioma base (is_learnable = false): se
-- muestra siempre, pero no cuenta en las estadísticas de progreso.
-- Añadir un idioma nuevo en el futuro es tan simple como una fila más aquí.
-- ============================================================================
insert into public.languages (code, name, native_name, is_learnable, sort_order) values
  ('es', 'Español',   'Español',  false, 0),
  ('fr', 'Francés',   'Français', true,  1),
  ('pt', 'Portugués', 'Português', true, 2),
  ('it', 'Italiano',  'Italiano', true,  3)
on conflict (code) do nothing;
