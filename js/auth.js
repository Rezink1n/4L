// Funciones de autenticación: registro, inicio de sesión (contraseña y magic
// link) y cierre de sesión. Toda la lógica de Supabase Auth vive aquí para
// que las páginas solo tengan que llamar a estas funciones.
import { supabase } from './supabaseClient.js';
import { t } from './i18n.js';

export async function registrarse(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function iniciarSesion(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Envía un enlace mágico al correo. El usuario vuelve a la app ya autenticado. */
export async function enviarEnlaceMagico(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + '/index.html' },
  });
  if (error) throw error;
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = 'login.html';
}

export async function obtenerUsuarioActual() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Traduce los mensajes de error más comunes de Supabase Auth al idioma de la interfaz. */
export function traducirErrorAuth(error) {
  const mensaje = error?.message || '';
  if (mensaje.includes('Invalid login credentials')) {
    return t('error_credenciales');
  }
  if (mensaje.includes('User already registered')) {
    return t('error_ya_registrado');
  }
  if (mensaje.includes('Password should be at least')) {
    return t('error_password_corta');
  }
  if (mensaje.includes('Unable to validate email address')) {
    return t('error_email_invalido');
  }
  return t('error_generico');
}
