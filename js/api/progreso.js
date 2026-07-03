// Acceso a "user_progress". El guardado usa una función de base de datos
// (RPC) llamada marcar_progreso en lugar de un upsert directo desde el
// cliente: así evitamos la complejidad de dos índices únicos parciales
// distintos (uno para "idioma concreto" y otro para "término completo",
// donde language_code es NULL) directamente en SQL. Ver supabase/schema.sql.
import { supabase } from '../supabaseClient.js';

/** Todo el progreso del usuario autenticado, tal cual, para calcular estadísticas. */
export async function obtenerProgreso() {
  const { data, error } = await supabase.from('user_progress').select('*');
  if (error) throw error;
  return data;
}

/**
 * Marca (o desmarca) el progreso de un término.
 * @param {string} terminoId
 * @param {string|null} idioma - código de idioma, o null para "término completo"
 * @param {boolean} aprendido
 */
export async function marcarProgreso(terminoId, idioma, aprendido) {
  const { error } = await supabase.rpc('marcar_progreso', {
    p_term_id: terminoId,
    p_language_code: idioma,
    p_learned: aprendido,
  });
  if (error) throw error;
}

/**
 * Construye un mapa "term_id:idioma" -> aprendido (bool) a partir de las
 * filas crudas de user_progress. La clave "term_id:completo" representa el
 * término entero (language_code NULL). La usan tanto el panel de progreso
 * como la tarjeta de término, para no repetir esta transformación dos veces.
 */
export function construirMapaProgreso(progreso) {
  const mapa = new Map();
  for (const fila of progreso) {
    mapa.set(`${fila.term_id}:${fila.language_code ?? 'completo'}`, fila.learned);
  }
  return mapa;
}

/**
 * Calcula el porcentaje aprendido por idioma y por nivel a partir de la
 * lista de términos (con sus traducciones) y las filas de progreso.
 */
export function calcularEstadisticas(terminos, progreso) {
  const progresoPorClave = construirMapaProgreso(progreso);

  const porNivel = {};
  for (const termino of terminos) {
    const nivel = termino.level;
    porNivel[nivel] = porNivel[nivel] || {};

    for (const trad of termino.translations) {
      if (trad.language_code === 'es') continue; // el español no se "aprende"
      const idioma = trad.language_code;
      porNivel[nivel][idioma] = porNivel[nivel][idioma] || { total: 0, aprendidos: 0 };
      porNivel[nivel][idioma].total += 1;
      if (progresoPorClave.get(`${termino.id}:${idioma}`)) {
        porNivel[nivel][idioma].aprendidos += 1;
      }
    }
  }

  return porNivel;
}
