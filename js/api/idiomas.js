// Acceso a la tabla "languages". Al no estar hardcodeados los idiomas en el
// código, añadir uno nuevo (p. ej. alemán) es solo cuestión de insertar una
// fila aquí y sus traducciones correspondientes: la interfaz se adapta sola.
import { supabase } from '../supabaseClient.js';

/** Todos los idiomas registrados, en el orden pensado para mostrarlos. */
export async function obtenerIdiomas() {
  const { data, error } = await supabase.from('languages').select('*').order('sort_order');
  if (error) throw error;
  return data;
}
