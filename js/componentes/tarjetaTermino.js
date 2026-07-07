// Componente de tarjeta: muestra un término en el idioma principal del
// usuario junto a sus traducciones activas, con botón de audio y controles
// de progreso por idioma.
import { pronunciar, hayVozDisponible } from '../tts.js';
import { escaparHtml, mostrarTostada } from '../utils.js';
import { t, nombreCategoria } from '../i18n.js';

// Color del punto identificador de cada idioma. Cualquier idioma nuevo que no
// esté aquí (p. ej. uno añadido en el futuro) usa el color por defecto: no
// hace falta tocar CSS para añadir idiomas.
const COLOR_IDIOMA = {
  es: '#f59e0b',
  fr: '#2563eb',
  pt: '#16a34a',
  it: '#dc2626',
  en: '#0891b2',
  de: '#a16207',
};
const COLOR_IDIOMA_DEFECTO = '#94a3b8';

/**
 * @param {object} termino - fila de "terms" con su array `translations`
 * @param {object} opciones
 * @param {string} opciones.idiomaBase - código del idioma principal del usuario
 * @param {Array} opciones.idiomasAprendibles - filas de "languages" activas, ordenadas
 * @param {Map} opciones.mapaProgreso - de construirMapaProgreso()
 * @param {(terminoId: string, idioma: string|null, aprendido: boolean) => Promise} opciones.alCambiarProgreso
 * @param {(termino: object) => void} [opciones.alEditar] - solo para términos propios
 * @param {(terminoId: string) => void} [opciones.alBorrar] - solo para términos propios
 */
export function crearTarjetaTermino(termino, opciones) {
  const { idiomaBase, idiomasAprendibles, mapaProgreso, alCambiarProgreso, alEditar, alBorrar } =
    opciones;

  const traduccionesPorIdioma = new Map(termino.translations.map((trad) => [trad.language_code, trad.text]));
  const textoBase = traduccionesPorIdioma.get(idiomaBase) || '';

  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta';
  tarjeta.dataset.terminoId = termino.id;

  const completoAprendido = mapaProgreso.get(`${termino.id}:completo`) === true;

  tarjeta.innerHTML = `
    <div class="tarjeta__cabecera">
      <div>
        <div class="tarjeta__termino-es">${escaparHtml(textoBase)}</div>
        <div class="tarjeta__categoria">${escaparHtml(nombreCategoria(termino.category || ''))}</div>
      </div>
      <div class="flex gap-sm">
        ${termino.is_official ? '' : `<span class="insignia-propio">${t('tarjeta_insignia_mia')}</span>`}
        <span class="insignia-nivel">${escaparHtml(termino.level)}</span>
      </div>
    </div>
    ${idiomasAprendibles
      .map((idioma) => {
        const texto = traduccionesPorIdioma.get(idioma.code);
        const aprendido = mapaProgreso.get(`${termino.id}:${idioma.code}`) === true;
        const sinVoz = texto && !hayVozDisponible(idioma.code);
        const color = COLOR_IDIOMA[idioma.code] || COLOR_IDIOMA_DEFECTO;
        return `
        <div class="tarjeta__traduccion" data-idioma="${idioma.code}">
          <span class="tarjeta__idioma-punto" style="background-color:${color}"></span>
          <span class="tarjeta__texto-traduccion ${texto ? '' : 'tarjeta__texto-traduccion--vacio'}">
            ${texto ? escaparHtml(texto) : t('tarjeta_sin_traduccion')}
          </span>
          <button
            class="boton-icono boton-audio"
            title="${sinVoz ? t('tarjeta_title_sin_voz') : t('tarjeta_title_escuchar')}"
            ${texto ? '' : 'disabled'}
            ${sinVoz ? 'disabled' : ''}
          >🔊</button>
          <label class="interruptor" title="${escaparHtml(t('tarjeta_marcar_aprendido', { idioma: idioma.native_name }))}">
            <input type="checkbox" class="check-idioma" ${aprendido ? 'checked' : ''} ${texto ? '' : 'disabled'} />
          </label>
        </div>`;
      })
      .join('')}
    <div class="tarjeta__pie">
      <label class="interruptor">
        <input type="checkbox" class="check-completo" ${completoAprendido ? 'checked' : ''} />
        <span>${t('tarjeta_termino_completo')}</span>
      </label>
      ${
        termino.is_official
          ? ''
          : `<div class="tarjeta__acciones-propio">
               <button class="boton-icono boton-editar" title="${t('tarjeta_title_editar')}">✏️</button>
               <button class="boton-icono boton-borrar" title="${t('tarjeta_title_borrar')}">🗑️</button>
             </div>`
      }
    </div>
  `;

  // Botones de audio: uno por cada fila de idioma con texto.
  tarjeta.querySelectorAll('.tarjeta__traduccion').forEach((fila) => {
    const idioma = fila.dataset.idioma;
    const texto = traduccionesPorIdioma.get(idioma);
    const botonAudio = fila.querySelector('.boton-audio');
    botonAudio.addEventListener('click', () => {
      try {
        pronunciar(texto, idioma);
      } catch (error) {
        mostrarTostada(error.message);
      }
    });

    const checkIdioma = fila.querySelector('.check-idioma');
    checkIdioma.addEventListener('change', async (evento) => {
      const aprendido = evento.target.checked;
      checkIdioma.disabled = true;
      try {
        await alCambiarProgreso(termino.id, idioma, aprendido);
      } catch (error) {
        evento.target.checked = !aprendido; // revertir si falla el guardado
        mostrarTostada(t('mispalabras_toast_error_guardar'));
      } finally {
        checkIdioma.disabled = false;
      }
    });
  });

  const checkCompleto = tarjeta.querySelector('.check-completo');
  checkCompleto.addEventListener('change', async (evento) => {
    const aprendido = evento.target.checked;
    checkCompleto.disabled = true;
    try {
      await alCambiarProgreso(termino.id, null, aprendido);
    } catch (error) {
      evento.target.checked = !aprendido;
      mostrarTostada(t('mispalabras_toast_error_guardar'));
    } finally {
      checkCompleto.disabled = false;
    }
  });

  if (!termino.is_official) {
    tarjeta.querySelector('.boton-editar')?.addEventListener('click', () => alEditar?.(termino));
    tarjeta.querySelector('.boton-borrar')?.addEventListener('click', () => alBorrar?.(termino.id));
  }

  return tarjeta;
}
