// Acceso a "terms" + "translations". Gracias a la relación por clave foránea
// (translations.term_id -> terms.id) Supabase puede "anidar" las traducciones
// en una sola consulta con select('*, translations(*)').
import { supabase } from '../supabaseClient.js';

/**
 * Lista términos filtrando por nivel y, opcionalmente, solo los propios.
 * Devuelve cada término con su array `translations` ya incluido.
 */
export async function obtenerTerminos({ nivel, soloPropios = false } = {}) {
  let consulta = supabase
    .from('terms')
    .select('*, translations(*)')
    .order('created_at', { ascending: true });

  if (nivel) {
    consulta = consulta.eq('level', nivel);
  }
  if (soloPropios) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    consulta = consulta.eq('owner_id', user.id);
  }

  const { data, error } = await consulta;
  if (error) throw error;
  return data;
}

/**
 * Crea un término propio del usuario junto con sus traducciones.
 * `traducciones` es un objeto { es: '...', fr: '...', pt: '...', it: '...' };
 * las claves con texto vacío no se guardan.
 */
export async function crearTerminoPropio({ nivel, categoria, traducciones }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: termino, error: errorTermino } = await supabase
    .from('terms')
    .insert({
      level: nivel,
      category: categoria || 'mis_palabras',
      is_official: false,
      owner_id: user.id,
    })
    .select()
    .single();
  if (errorTermino) throw errorTermino;

  const filas = Object.entries(traducciones)
    .filter(([, texto]) => texto && texto.trim() !== '')
    .map(([idioma, texto]) => ({ term_id: termino.id, language_code: idioma, text: texto.trim() }));

  if (filas.length > 0) {
    const { error: errorTrad } = await supabase.from('translations').insert(filas);
    if (errorTrad) throw errorTrad;
  }

  return termino;
}

/** Sustituye las traducciones de un término propio (borra y vuelve a insertar). */
export async function actualizarTraduccionesTermino(terminoId, traducciones) {
  const { error: errorBorrado } = await supabase
    .from('translations')
    .delete()
    .eq('term_id', terminoId);
  if (errorBorrado) throw errorBorrado;

  const filas = Object.entries(traducciones)
    .filter(([, texto]) => texto && texto.trim() !== '')
    .map(([idioma, texto]) => ({ term_id: terminoId, language_code: idioma, text: texto.trim() }));

  if (filas.length > 0) {
    const { error } = await supabase.from('translations').insert(filas);
    if (error) throw error;
  }
}

export async function actualizarNivelCategoria(terminoId, { nivel, categoria }) {
  const { error } = await supabase
    .from('terms')
    .update({ level: nivel, category: categoria })
    .eq('id', terminoId);
  if (error) throw error;
}

/** Borra un término propio. Las traducciones y el progreso asociados se
 * eliminan en cascada (ON DELETE CASCADE, ver supabase/schema.sql). */
export async function borrarTermino(terminoId) {
  const { error } = await supabase.from('terms').delete().eq('id', terminoId);
  if (error) throw error;
}
