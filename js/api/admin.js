// Acceso a las funciones RPC de administración (ver supabase/schema.sql).
// Ambas funciones comprueban en el servidor que quien llama ya es admin;
// si no lo es, Supabase devuelve un error ("No autorizado").
import { supabase } from '../supabaseClient.js';

export async function listarUsuarios() {
  const { data, error } = await supabase.rpc('admin_listar_usuarios');
  if (error) throw error;
  return data;
}

export async function actualizarRolUsuario(userId, role) {
  const { error } = await supabase.rpc('admin_actualizar_rol', { p_user_id: userId, p_role: role });
  if (error) throw error;
}
