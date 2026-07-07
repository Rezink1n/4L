// Acceso a "user_settings": idioma principal (interfaz + término principal de
// las tarjetas) e idiomas activos (los que el usuario quiere aprender ahora).
import { supabase } from '../supabaseClient.js';

/** Devuelve null si el usuario todavía no ha pasado por el onboarding. */
export async function obtenerAjustesUsuario() {
  const { data, error } = await supabase.from('user_settings').select('*').maybeSingle();
  if (error) throw error;
  return data;
}

export async function guardarAjustesUsuario({ idiomaPrincipal, idiomasActivos }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('user_settings').upsert(
    {
      user_id: user.id,
      primary_language: idiomaPrincipal,
      active_languages: idiomasActivos,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}

/** Actualiza solo las variantes de pronunciación elegidas (es-ES/es-419, etc.). */
export async function guardarVariantesVoz(voiceVariants) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('user_settings')
    .update({ voice_variants: voiceVariants, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);
  if (error) throw error;
}
