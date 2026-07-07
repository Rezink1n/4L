// Pronunciación mediante la Web Speech API (window.speechSynthesis).
// No requiere backend ni claves: el propio navegador sintetiza la voz.
//
// Trabaja directamente con códigos de "locale" BCP-47 (p. ej. 'es-ES',
// 'pt-BR', 'en-US'), no con el código de idioma de 2 letras: así una misma
// palabra en español puede pronunciarse con acento de España o de
// Latinoamérica según la variante elegida por el usuario en Ajustes (ver
// js/api/idiomas.js -> obtenerVariantes() y js/componentes/tarjetaTermino.js).

// Locale por defecto cuando un idioma no tiene variantes registradas en
// "language_variants" (p. ej. un idioma nuevo añadido solo con datos).
const LOCALE_POR_DEFECTO = {
  es: 'es-ES',
  fr: 'fr-FR',
  pt: 'pt-PT',
  it: 'it-IT',
  en: 'en-GB',
  de: 'de-DE',
};

export function localePorDefecto(idioma) {
  return LOCALE_POR_DEFECTO[idioma] || idioma;
}

let vocesDisponibles = [];

function cargarVoces() {
  vocesDisponibles = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}

if ('speechSynthesis' in window) {
  cargarVoces();
  // En Chrome las voces se cargan de forma asíncrona tras el primer acceso.
  window.speechSynthesis.onvoiceschanged = cargarVoces;
}

/** Indica si el navegador tiene (o puede tener) una voz para ese locale BCP-47. */
export function hayVozDisponible(localeBcp47) {
  if (!('speechSynthesis' in window)) return false;
  if (!localeBcp47) return false;
  // Si el navegador todavía no reportó ninguna voz, asumimos que sí podrá
  // reproducir (algunos navegadores devuelven la lista vacía hasta el primer uso).
  if (vocesDisponibles.length === 0) return true;
  const idiomaBase = localeBcp47.split('-')[0];
  return vocesDisponibles.some((voz) => voz.lang.startsWith(idiomaBase));
}

/**
 * Reproduce el texto con la voz del locale indicado (p. ej. 'fr-FR', 'pt-BR').
 * Lanza un error si no hay soporte de síntesis de voz en el navegador.
 */
export function pronunciar(texto, localeBcp47) {
  if (!('speechSynthesis' in window)) {
    throw new Error('Este navegador no admite la síntesis de voz (Web Speech API).');
  }
  window.speechSynthesis.cancel(); // corta cualquier reproducción anterior
  const enunciado = new SpeechSynthesisUtterance(texto);
  enunciado.lang = localeBcp47;
  enunciado.rate = 0.95;
  window.speechSynthesis.speak(enunciado);
  return enunciado;
}

// ---------------------------------------------------------------------------
// Punto de extensión (futuro): audios pregrabados en Supabase Storage.
// Si algún día se quiere sustituir el TTS del navegador por grabaciones reales
// (mejor calidad, pronunciación nativa garantizada), la idea sería:
//
// 1. Subir los archivos .mp3 a un bucket público de Supabase Storage, con una
//    ruta predecible, p. ej. `audios/{variant_code}/{term_id}.mp3`.
// 2. Antes de usar el TTS, comprobar si existe el audio pregrabado:
//
//    const { data } = supabase.storage.from('audios').getPublicUrl(`${varianteCodigo}/${terminoId}.mp3`);
//    const audio = new Audio(data.publicUrl);
//    audio.play();
//
// 3. Si la petición falla (404), usar pronunciar() como alternativa (fallback).
//
// No se implementa ahora para no depender de tener los audios grabados.
// ---------------------------------------------------------------------------
