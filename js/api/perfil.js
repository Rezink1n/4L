// Acceso a "profiles" y a la foto de perfil (Supabase Storage, bucket "avatars").
import { supabase } from '../supabaseClient.js';

export async function obtenerMiPerfil() {
  const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
  if (error) throw error;
  return data;
}

export async function actualizarPerfil({ displayName, bio }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName, bio, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);
  if (error) throw error;
}

/**
 * Sube una foto de perfil al bucket "avatars", en la carpeta del propio
 * usuario (obligatorio por la política de Storage: solo puede escribir
 * dentro de "{user_id}/..."), y actualiza profiles.avatar_url con la URL
 * pública resultante.
 */
export async function subirAvatar(archivo) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const extension = archivo.name.split('.').pop();
  const ruta = `${user.id}/avatar.${extension}`;

  const { error: errorSubida } = await supabase.storage
    .from('avatars')
    .upload(ruta, archivo, { upsert: true, cacheControl: '3600' });
  if (errorSubida) throw errorSubida;

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(ruta);

  // Añadimos un parámetro para romper la caché del navegador tras re-subir.
  const avatarUrl = `${publicUrl}?t=${Date.now()}`;

  const { error: errorActualizar } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);
  if (errorActualizar) throw errorActualizar;

  return avatarUrl;
}
