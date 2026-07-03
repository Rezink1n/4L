// Pronunciación mediante la Web Speech API (window.speechSynthesis).
// No requiere backend ni claves: el propio navegador sintetiza la voz.

// Mapa de código de idioma de la app -> código BCP-47 que entiende el navegador.
const CODIGO_VOZ = {
  es: 'es-ES',
  fr: 'fr-FR',
  pt: 'pt-PT',
  it: 'it-IT',
};

let vocesDisponibles = [];

function cargarVoces() {
  vocesDisponibles = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}

if ('speechSynthesis' in window) {
  cargarVoces();
  // En Chrome las voces se cargan de forma asíncrona tras el primer acceso.
  window.speechSynthesis.onvoiceschanged = cargarVoces;
}

/** Indica si el navegador tiene (o puede tener) una voz para ese idioma. */
export function hayVozDisponible(idioma) {
  if (!('speechSynthesis' in window)) return false;
  const codigo = CODIGO_VOZ[idioma];
  if (!codigo) return false;
  // Si el navegador todavía no reportó ninguna voz, asumimos que sí podrá
  // reproducir (algunos navegadores devuelven la lista vacía hasta el primer uso).
  if (vocesDisponibles.length === 0) return true;
  return vocesDisponibles.some((voz) => voz.lang.startsWith(codigo.split('-')[0]));
}

/**
 * Reproduce el texto en el idioma indicado.
 * Lanza un error si no hay soporte de síntesis de voz en el navegador.
 */
export function pronunciar(texto, idioma) {
  if (!('speechSynthesis' in window)) {
    throw new Error('Este navegador no admite la síntesis de voz (Web Speech API).');
  }
  window.speechSynthesis.cancel(); // corta cualquier reproducción anterior
  const enunciado = new SpeechSynthesisUtterance(texto);
  enunciado.lang = CODIGO_VOZ[idioma] || idioma;
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
//    ruta predecible, p. ej. `audios/{idioma}/{term_id}.mp3`.
// 2. Antes de usar el TTS, comprobar si existe el audio pregrabado:
//
//    const { data } = supabase.storage.from('audios').getPublicUrl(`${idioma}/${terminoId}.mp3`);
//    const audio = new Audio(data.publicUrl);
//    audio.play();
//
// 3. Si la petición falla (404), usar pronunciar() como alternativa (fallback).
//
// No se implementa ahora para no depender de tener los audios grabados.
// ---------------------------------------------------------------------------
