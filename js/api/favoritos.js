// Acceso a "favoritos": términos que el usuario ha marcado con la estrella.
import { supabase } from '../supabaseClient.js';

/** Devuelve el conjunto (Set) de term_id marcados como favoritos por el usuario. */
export async function obtenerFavoritos() {
  const { data, error } = await supabase.from('favoritos').select('term_id');
  if (error) throw error;
  return new Set(data.map((fila) => fila.term_id));
}

export async function marcarFavorito(terminoId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from('favoritos').insert({ user_id: user.id, term_id: terminoId });
  if (error) throw error;
}

export async function quitarFavorito(terminoId) {
  const { error } = await supabase.from('favoritos').delete().eq('term_id', terminoId);
  if (error) throw error;
}
