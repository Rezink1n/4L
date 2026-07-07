// Panel de progreso: una tarjeta por nivel (A1, A2, ...) con una barra por
// idioma mostrando el porcentaje de términos aprendidos.
import { escaparHtml } from '../utils.js';
import { t } from '../i18n.js';

/**
 * @param {object} estadisticas - salida de api/progreso.js -> calcularEstadisticas()
 * @param {Array} idiomasAprendibles - filas de "languages" (para nombre + orden)
 */
export function crearPanelProgreso(estadisticas, idiomasAprendibles) {
  const contenedor = document.createElement('div');
  const niveles = Object.keys(estadisticas).sort();

  if (niveles.length === 0) {
    contenedor.innerHTML = `
      <div class="estado">
        <span class="estado__icono">📭</span>
        <p>${t('progreso_sin_datos')}</p>
      </div>`;
    return contenedor;
  }

  contenedor.innerHTML = niveles
    .map((nivel) => {
      const porIdioma = estadisticas[nivel];
      const filas = idiomasAprendibles
        .filter((idioma) => porIdioma[idioma.code])
        .map((idioma) => {
          const { total, aprendidos } = porIdioma[idioma.code];
          const porcentaje = total > 0 ? Math.round((aprendidos / total) * 100) : 0;
          return `
          <div class="barra-progreso-fila">
            <div class="barra-progreso-fila__etiqueta">
              <span>${escaparHtml(idioma.native_name)}</span>
              <span>${aprendidos}/${total} · ${porcentaje}%</span>
            </div>
            <div class="barra-progreso-pista">
              <div class="barra-progreso-relleno" style="width:${porcentaje}%"></div>
            </div>
          </div>`;
        })
        .join('');

      return `
        <div class="tarjeta-progreso">
          <div class="tarjeta-progreso__titulo">${t('progreso_nivel')} ${escaparHtml(nivel)}</div>
          ${filas}
        </div>`;
    })
    .join('');

  return contenedor;
}
