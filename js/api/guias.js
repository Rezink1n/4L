// Acceso a "guias_idioma": contenido de referencia (alfabeto/pronunciación y
// gramática básica) por idioma. Es contenido de solo lectura, igual que el
// vocabulario oficial.
import { supabase } from '../supabaseClient.js';

/** @param {string} languageCode @param {'alfabeto'|'gramatica'} tipo */
export async function obtenerGuia(languageCode, tipo) {
  const { data, error } = await supabase
    .from('guias_idioma')
    .select('*')
    .eq('language_code', languageCode)
    .eq('tipo', tipo)
    .order('orden');
  if (error) throw error;
  return data;
}
