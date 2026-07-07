// Componente de tarjeta: muestra un término en el idioma principal del
// usuario junto a sus traducciones activas, con bandera de la variante de
// pronunciación, botón de audio, favorito y controles de progreso por idioma.
import { pronunciar, hayVozDisponible, localePorDefecto } from '../tts.js';
import { resolverVariante } from '../api/idiomas.js';
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
const BANDERA_DEFECTO = '🏳️';

/**
 * @param {object} termino - fila de "terms" con su array `translations`
 * @param {object} opciones
 * @param {string} opciones.idiomaBase - código del idioma principal del usuario
 * @param {Array} opciones.idiomasAprendibles - filas de "languages" activas, ordenadas
 * @param {Map} opciones.mapaProgreso - de construirMapaProgreso()
 * @param {object} [opciones.variantesPorIdioma] - de agruparVariantesPorIdioma()
 * @param {object} [opciones.voiceVariants] - preferencia guardada del usuario (user_settings.voice_variants)
 * @param {boolean} [opciones.esFavorito] - si el término ya está en favoritos
 * @param {(terminoId: string, idioma: string|null, aprendido: boolean) => Promise} opciones.alCambiarProgreso
 * @param {(terminoId: string, marcado: boolean) => Promise} [opciones.alAlternarFavorito]
 * @param {(termino: object) => void} [opciones.alEditar] - solo para términos propios
 * @param {(terminoId: string) => void} [opciones.alBorrar] - solo para términos propios
 */
export function crearTarjetaTermino(termino, opciones) {
  const {
    idiomaBase,
    idiomasAprendibles,
    mapaProgreso,
    variantesPorIdioma = {},
    voiceVariants = {},
    esFavorito = false,
    alCambiarProgreso,
    alAlternarFavorito,
    alEditar,
    alBorrar,
  } = opciones;

  function banderaYLocale(idioma) {
    const variante = resolverVariante(idioma, variantesPorIdioma, voiceVariants);
    return {
      bandera: variante?.flag_emoji || BANDERA_DEFECTO,
      locale: variante?.tts_locale || localePorDefecto(idioma),
    };
  }

  const traduccionesPorIdioma = new Map(termino.translations.map((trad) => [trad.language_code, trad.text]));
  const textoBase = traduccionesPorIdioma.get(idiomaBase) || '';
  const { bandera: banderaBase } = banderaYLocale(idiomaBase);

  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta';
  tarjeta.dataset.terminoId = termino.id;

  const completoAprendido = mapaProgreso.get(`${termino.id}:completo`) === true;

  tarjeta.innerHTML = `
    <div class="tarjeta__cabecera">
      <div>
        <div class="tarjeta__termino-es">
          <span class="tarjeta__bandera">${banderaBase}</span> ${escaparHtml(textoBase)}
        </div>
        <div class="tarjeta__categoria">${escaparHtml(nombreCategoria(termino.category || ''))}</div>
      </div>
      <div class="flex gap-sm">
        <button class="boton-icono boton-favorito ${esFavorito ? 'activo' : ''}" title="${t('tarjeta_title_favorito')}">
          ${esFavorito ? '⭐' : '☆'}
        </button>
        ${termino.is_official ? '' : `<span class="insignia-propio">${t('tarjeta_insignia_mia')}</span>`}
        <span class="insignia-nivel">${escaparHtml(termino.level)}</span>
      </div>
    </div>
    ${idiomasAprendibles
      .map((idioma) => {
        const texto = traduccionesPorIdioma.get(idioma.code);
        const aprendido = mapaProgreso.get(`${termino.id}:${idioma.code}`) === true;
        const { bandera, locale } = banderaYLocale(idioma.code);
        const sinVoz = texto && !hayVozDisponible(locale);
        const color = COLOR_IDIOMA[idioma.code] || COLOR_IDIOMA_DEFECTO;
        return `
        <div class="tarjeta__traduccion" data-idioma="${idioma.code}" data-locale="${locale}">
          <span class="tarjeta__idioma-punto" style="background-color:${color}"></span>
          <span class="tarjeta__bandera">${bandera}</span>
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
    const locale = fila.dataset.locale;
    const texto = traduccionesPorIdioma.get(idioma);
    const botonAudio = fila.querySelector('.boton-audio');
    botonAudio.addEventListener('click', () => {
      try {
        pronunciar(texto, locale);
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

  const botonFavorito = tarjeta.querySelector('.boton-favorito');
  botonFavorito.addEventListener('click', async () => {
    const marcarComoFavorito = !botonFavorito.classList.contains('activo');
    botonFavorito.disabled = true;
    try {
      await alAlternarFavorito?.(termino.id, marcarComoFavorito);
      botonFavorito.classList.toggle('activo', marcarComoFavorito);
      botonFavorito.textContent = marcarComoFavorito ? '⭐' : '☆';
    } catch (error) {
      console.error(error);
      mostrarTostada(t('mispalabras_toast_error_guardar'));
    } finally {
      botonFavorito.disabled = false;
    }
  });

  if (!termino.is_official) {
    tarjeta.querySelector('.boton-editar')?.addEventListener('click', () => alEditar?.(termino));
    tarjeta.querySelector('.boton-borrar')?.addEventListener('click', () => alBorrar?.(termino.id));
  }

  return tarjeta;
}
