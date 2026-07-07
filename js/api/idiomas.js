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

/**
 * Variantes de pronunciación (acento) disponibles, p. ej. es-ES/es-419,
 * pt-PT/pt-BR, en-GB/en-US. El texto de la traducción es el mismo para
 * todas las variantes de un idioma; solo cambian la voz (tts_locale) y la
 * bandera mostrada en la tarjeta.
 */
export async function obtenerVariantes() {
  const { data, error } = await supabase.from('language_variants').select('*').order('sort_order');
  if (error) throw error;
  return data;
}

/** Agrupa las variantes por idioma: { es: [...], pt: [...], en: [...] }. */
export function agruparVariantesPorIdioma(variantes) {
  const mapa = {};
  for (const variante of variantes) {
    mapa[variante.language_code] = mapa[variante.language_code] || [];
    mapa[variante.language_code].push(variante);
  }
  return mapa;
}

/**
 * Resuelve qué variante usar para un idioma, según la preferencia guardada
 * del usuario (voiceVariants: { es: 'es-419', ... }), o si no hay preferencia
 * ni variantes registradas, cae a un valor por defecto razonable.
 */
export function resolverVariante(idioma, variantesPorIdioma, voiceVariants) {
  const disponibles = variantesPorIdioma[idioma];
  if (!disponibles || disponibles.length === 0) return null;
  const preferida = voiceVariants?.[idioma];
  return disponibles.find((v) => v.variant_code === preferida) || disponibles.find((v) => v.is_default) || disponibles[0];
}
