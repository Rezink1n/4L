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
  code         text primary key,        -- 'es', 'fr', 'pt', 'it', 'en', 'de'...
  name         text not null,           -- 'Francés' (nombre en español, uso interno)
  native_name  text,                    -- 'Français' (nombre nativo, se usa en toda la interfaz
                                         -- para no depender de traducir el nombre de cada idioma)
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
-- user_settings: preferencias de idioma por usuario
--  - primary_language: idioma principal, usado tanto para la interfaz como
--    para decidir qué traducción se muestra como "término principal" en las
--    tarjetas. Por defecto se detecta del navegador (navigator.language) la
--    primera vez, pero el usuario lo puede cambiar en Ajustes.
--  - active_languages: qué idiomas quiere aprender a la vez (subconjunto del
--    resto de idiomas). Empieza vacío: la app pide al usuario que elija al
--    menos uno la primera vez (pantalla de onboarding, ver onboarding.html).
-- ---------------------------------------------------------------------------
create table if not exists public.user_settings (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  primary_language text not null references public.languages (code) default 'es',
  active_languages text[] not null default '{}',
  updated_at       timestamptz not null default now()
);

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
alter table public.user_settings enable row level security;
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

create policy "ajustes_usuario: todo sobre lo propio"
  on public.user_settings for all
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
set search_path = public, pg_temp
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

-- Postgres concede EXECUTE de una función nueva a PUBLIC (todos los roles,
-- incluido "anon") por defecto. Lo revocamos y solo dejamos llamar la
-- función a usuarios autenticados.
revoke execute on function public.marcar_progreso(uuid, text, boolean) from public;
revoke execute on function public.marcar_progreso(uuid, text, boolean) from anon;
grant execute on function public.marcar_progreso(uuid, text, boolean) to authenticated;

-- ============================================================================
-- Idiomas iniciales. Cuál es el "idioma principal" ya no es un atributo fijo
-- del idioma (antes "is_learnable"): lo elige cada usuario en user_settings.
-- Añadir un idioma nuevo en el futuro es tan simple como una fila más aquí.
-- ============================================================================
insert into public.languages (code, name, native_name, sort_order) values
  ('es', 'Español',   'Español',   0),
  ('fr', 'Francés',   'Français',  1),
  ('pt', 'Portugués', 'Português', 2),
  ('it', 'Italiano',  'Italiano',  3),
  ('en', 'Inglés',    'English',   4),
  ('de', 'Alemán',    'Deutsch',   5)
on conflict (code) do nothing;

-- ============================================================================
-- Variantes de pronunciación (acento) por idioma. El texto de la traducción
-- es el mismo para todas las variantes de un idioma: solo cambian la voz TTS
-- (tts_locale, código BCP-47) y la bandera mostrada en la tarjeta.
-- ============================================================================
create table if not exists public.language_variants (
  id            uuid primary key default gen_random_uuid(),
  language_code text not null references public.languages (code),
  variant_code  text not null unique, -- 'es-ES', 'es-419', 'pt-PT', 'pt-BR', 'en-GB', 'en-US'...
  label         text not null,       -- 'España', 'Latinoamérica', 'Portugal', 'Brasil'...
  flag_emoji    text not null,
  tts_locale    text not null,       -- código BCP-47 real para speechSynthesis
  is_default    boolean not null default false,
  sort_order    integer not null default 0
);

create index if not exists idx_variantes_idioma on public.language_variants (language_code);

alter table public.language_variants enable row level security;

create policy "variantes: lectura publica"
  on public.language_variants for select
  to authenticated
  using (true);

insert into public.language_variants (language_code, variant_code, label, flag_emoji, tts_locale, is_default, sort_order) values
  ('es', 'es-ES',  'España',          '🇪🇸', 'es-ES', true,  0),
  ('es', 'es-419', 'Latinoamérica',   '🌎', 'es-MX', false, 1),
  ('pt', 'pt-PT',  'Portugal',        '🇵🇹', 'pt-PT', true,  0),
  ('pt', 'pt-BR',  'Brasil',          '🇧🇷', 'pt-BR', false, 1),
  ('en', 'en-GB',  'Reino Unido',     '🇬🇧', 'en-GB', true,  0),
  ('en', 'en-US',  'Estados Unidos',  '🇺🇸', 'en-US', false, 1),
  ('fr', 'fr-FR',  'Francia',         '🇫🇷', 'fr-FR', true,  0),
  ('it', 'it-IT',  'Italia',          '🇮🇹', 'it-IT', true,  0),
  ('de', 'de-DE',  'Alemania',        '🇩🇪', 'de-DE', true,  0)
on conflict (variant_code) do nothing;

-- Preferencia de variante por usuario: { "es": "es-ES", "pt": "pt-BR", ... }.
-- Si un idioma no aparece en el objeto, se usa la variante is_default.
alter table public.user_settings
  add column if not exists voice_variants jsonb not null default '{}'::jsonb;

-- ============================================================================
-- Contenido de referencia: alfabeto/pronunciación y gramática básica (A1-A2)
-- por idioma. Es contenido de solo lectura (como el vocabulario oficial): se
-- gestiona por migraciones, no desde la interfaz.
--
-- NOTA DE ALCANCE: la explicación está escrita en español (idioma "meta" de
-- estas guías), independientemente del idioma de interfaz del usuario. Una
-- traducción completa de las explicaciones a los 6 idiomas queda para una
-- futura ampliación (bastaría con añadir una columna/tabla adicional). El
-- contenido en sí vive en supabase/seed_guias_idioma.sql.
-- ============================================================================
create table if not exists public.guias_idioma (
  id            uuid primary key default gen_random_uuid(),
  language_code text not null references public.languages (code),
  tipo          text not null check (tipo in ('alfabeto', 'gramatica')),
  orden         integer not null default 0,
  titulo        text not null,
  explicacion   text not null,
  ejemplo       text,
  unique (language_code, tipo, orden)
);

create index if not exists idx_guias_idioma on public.guias_idioma (language_code, tipo, orden);

alter table public.guias_idioma enable row level security;

create policy "guias: lectura publica"
  on public.guias_idioma for select
  to authenticated
  using (true);

-- ============================================================================
-- Perfil del estudiante: nombre visible y foto (guardada en Storage).
-- ============================================================================
create table if not exists public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url   text,
  bio          text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuario ve y edita solo su propio perfil (el panel de admin usa una
-- función security definer aparte que no depende de estas políticas).
create policy "perfiles: todo sobre lo propio"
  on public.profiles for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Bucket de Storage para las fotos de perfil. Público de lectura por URL
-- directa (los buckets "public" sirven los objetos sin necesidad de política
-- de SELECT), pero solo el propio usuario puede subir/editar/borrar dentro
-- de su carpeta "{user_id}/...". A propósito NO se añade una política de
-- SELECT sobre storage.objects: eso permitiría listar todos los archivos del
-- bucket vía API, algo que no queremos (ver aviso "public_bucket_allows_listing"
-- del linter de seguridad de Supabase).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatares: subida propia"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatares: edicion propia"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatares: borrado propio"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================================
-- Favoritos: términos marcados con la estrella por el usuario.
-- ============================================================================
create table if not exists public.favoritos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  term_id    uuid not null references public.terms (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, term_id)
);

create index if not exists idx_favoritos_usuario on public.favoritos (user_id);

alter table public.favoritos enable row level security;

create policy "favoritos: todo sobre lo propio"
  on public.favoritos for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================================
-- Roles: admin, moderador, estudiante
-- ============================================================================
create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null check (role in ('admin', 'moderador', 'estudiante')) default 'estudiante',
  updated_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

-- Cada usuario puede leer (solo leer) su propio rol, para saber si debe ver
-- el enlace "Admin" en la navegación. Los cambios de rol solo se hacen desde
-- la función admin_actualizar_rol (más abajo), que valida que quien llama ya
-- sea admin.
create policy "roles: lectura propia"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================================
-- Suscripciones (placeholder para un futuro cobro real, p. ej. con Stripe).
-- Por ahora todos los usuarios están en el plan "gratis".
-- ============================================================================
create table if not exists public.subscriptions (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  plan       text not null default 'gratis',
  status     text not null default 'activa',
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "suscripciones: lectura propia"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================================
-- Alta automática: cuando se registra un usuario nuevo en Supabase Auth, se
-- le crean automáticamente su fila de rol (estudiante), perfil y suscripción
-- (gratis), para no tener que comprobar/crearlas a mano desde el cliente.
-- ============================================================================
create or replace function public.manejar_usuario_nuevo()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.user_roles (user_id, role) values (new.id, 'estudiante') on conflict (user_id) do nothing;
  insert into public.profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.subscriptions (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.manejar_usuario_nuevo();

-- manejar_usuario_nuevo() es solo para el trigger: nadie debería poder
-- llamarla directamente por RPC.
revoke execute on function public.manejar_usuario_nuevo() from public;
revoke execute on function public.manejar_usuario_nuevo() from authenticated;
revoke execute on function public.manejar_usuario_nuevo() from anon;

-- ============================================================================
-- Funciones de administración. SECURITY DEFINER: se ejecutan con privilegios
-- elevados (necesarios para leer auth.users, fuera del alcance normal de
-- PostgREST/RLS), pero cada una empieza comprobando que quien llama ya es
-- admin; si no lo es, lanzan una excepción y no devuelven nada.
-- ============================================================================
create or replace function public.admin_listar_usuarios()
returns table (
  user_id          uuid,
  email            text,
  created_at       timestamptz,
  last_sign_in_at  timestamptz,
  role             text,
  display_name     text,
  avatar_url       text,
  plan             text,
  estado_plan      text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin') then
    raise exception 'No autorizado';
  end if;

  return query
    select
      u.id,
      u.email::text,
      u.created_at,
      u.last_sign_in_at,
      coalesce(ur.role, 'estudiante'),
      p.display_name,
      p.avatar_url,
      coalesce(s.plan, 'gratis'),
      coalesce(s.status, 'activa')
    from auth.users u
    left join public.user_roles ur on ur.user_id = u.id
    left join public.profiles p on p.user_id = u.id
    left join public.subscriptions s on s.user_id = u.id
    order by u.created_at desc;
end;
$$;

revoke execute on function public.admin_listar_usuarios() from public;
revoke execute on function public.admin_listar_usuarios() from anon;
grant execute on function public.admin_listar_usuarios() to authenticated;

create or replace function public.admin_actualizar_rol(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin') then
    raise exception 'No autorizado';
  end if;
  if p_role not in ('admin', 'moderador', 'estudiante') then
    raise exception 'Rol no válido';
  end if;

  insert into public.user_roles (user_id, role, updated_at)
  values (p_user_id, p_role, now())
  on conflict (user_id) do update set role = excluded.role, updated_at = now();
end;
$$;

revoke execute on function public.admin_actualizar_rol(uuid, text) from public;
revoke execute on function public.admin_actualizar_rol(uuid, text) from anon;
grant execute on function public.admin_actualizar_rol(uuid, text) to authenticated;

-- ============================================================================
-- Backfill para bases de datos que ya tuvieran usuarios antes de crear el
-- trigger anterior. Ajusta el email de abajo, o quita esta última línea, si
-- despliegas este esquema desde cero en un proyecto nuevo.
-- ============================================================================
insert into public.user_roles (user_id, role)
select id, 'estudiante' from auth.users
on conflict (user_id) do nothing;

insert into public.profiles (user_id)
select id from auth.users
on conflict (user_id) do nothing;

insert into public.subscriptions (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- Descomenta y ajusta el email para convertir a un usuario en el primer admin:
-- update public.user_roles set role = 'admin', updated_at = now()
-- where user_id = (select id from auth.users where email = 'tu-correo@ejemplo.com');
