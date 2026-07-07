// Acceso al rol del usuario (admin/moderador/estudiante). El alta con rol
// "estudiante" por defecto la crea un trigger en la base de datos al
// registrarse (ver supabase/schema.sql), así que aquí solo se lee.
import { supabase } from '../supabaseClient.js';

export async function obtenerMiRol() {
  const { data, error } = await supabase.from('user_roles').select('role').maybeSingle();
  if (error) throw error;
  return data?.role || 'estudiante';
}
