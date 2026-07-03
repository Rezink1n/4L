// Componente de tarjeta: muestra un término en español junto a sus
// traducciones, con botón de audio y controles de progreso por idioma.
import { pronunciar, hayVozDisponible } from '../tts.js';
import { escaparHtml, mostrarTostada } from '../utils.js';

/**
 * @param {object} termino - fila de "terms" con su array `translations`
 * @param {object} opciones
 * @param {string} opciones.idiomaBase - código del idioma de interfaz (normalmente 'es')
 * @param {Array} opciones.idiomasAprendibles - filas de "languages" a aprender, ordenadas
 * @param {Map} opciones.mapaProgreso - de construirMapaProgreso()
 * @param {(terminoId: string, idioma: string|null, aprendido: boolean) => Promise} opciones.alCambiarProgreso
 * @param {(termino: object) => void} [opciones.alEditar] - solo para términos propios
 * @param {(terminoId: string) => void} [opciones.alBorrar] - solo para términos propios
 */
export function crearTarjetaTermino(termino, opciones) {
  const { idiomaBase, idiomasAprendibles, mapaProgreso, alCambiarProgreso, alEditar, alBorrar } =
    opciones;

  const traduccionesPorIdioma = new Map(termino.translations.map((t) => [t.language_code, t.text]));
  const textoBase = traduccionesPorIdioma.get(idiomaBase) || '(sin texto)';

  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta';
  tarjeta.dataset.terminoId = termino.id;

  const completoAprendido = mapaProgreso.get(`${termino.id}:completo`) === true;

  tarjeta.innerHTML = `
    <div class="tarjeta__cabecera">
      <div>
        <div class="tarjeta__termino-es">${escaparHtml(textoBase)}</div>
        <div class="tarjeta__categoria">${escaparHtml(termino.category || '')}</div>
      </div>
      <div class="flex gap-sm">
        ${termino.is_official ? '' : '<span class="insignia-propio">Mía</span>'}
        <span class="insignia-nivel">${escaparHtml(termino.level)}</span>
      </div>
    </div>
    ${idiomasAprendibles
      .map((idioma) => {
        const texto = traduccionesPorIdioma.get(idioma.code);
        const aprendido = mapaProgreso.get(`${termino.id}:${idioma.code}`) === true;
        const sinVoz = texto && !hayVozDisponible(idioma.code);
        return `
        <div class="tarjeta__traduccion" data-idioma="${idioma.code}">
          <span class="tarjeta__idioma-punto tarjeta__idioma-punto--${idioma.code}"></span>
          <span class="tarjeta__texto-traduccion ${texto ? '' : 'tarjeta__texto-traduccion--vacio'}">
            ${texto ? escaparHtml(texto) : 'Sin traducción todavía'}
          </span>
          <button
            class="boton-icono boton-audio"
            title="${sinVoz ? 'No hay voz disponible para este idioma en tu navegador' : 'Escuchar pronunciación'}"
            ${texto ? '' : 'disabled'}
            ${sinVoz ? 'disabled' : ''}
          >🔊</button>
          <label class="interruptor" title="Marcar como aprendido en ${escaparHtml(idioma.name)}">
            <input type="checkbox" class="check-idioma" ${aprendido ? 'checked' : ''} ${texto ? '' : 'disabled'} />
          </label>
        </div>`;
      })
      .join('')}
    <div class="tarjeta__pie">
      <label class="interruptor">
        <input type="checkbox" class="check-completo" ${completoAprendido ? 'checked' : ''} />
        <span>Término completo aprendido</span>
      </label>
      ${
        termino.is_official
          ? ''
          : `<div class="tarjeta__acciones-propio">
               <button class="boton-icono boton-editar" title="Editar">✏️</button>
               <button class="boton-icono boton-borrar" title="Borrar">🗑️</button>
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
        mostrarTostada('No se pudo guardar el progreso.');
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
      mostrarTostada('No se pudo guardar el progreso.');
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
