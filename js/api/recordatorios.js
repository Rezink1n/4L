// Acceso a "reminder_settings": la hora del día en la que el usuario quiere
// recibir el recordatorio de repaso, y si están activados o no.
import { supabase } from '../supabaseClient.js';

export async function obtenerRecordatorio() {
  const { data, error } = await supabase.from('reminder_settings').select('*').maybeSingle();
  if (error) throw error;
  return data; // null si el usuario todavía no ha configurado nada
}

export async function guardarRecordatorio({ hora, activo }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('reminder_settings')
    .upsert({ user_id: user.id, hour: hora, active: activo }, { onConflict: 'user_id' });
  if (error) throw error;
}
