// Lógica de "Mis palabras": alta, edición y borrado de vocabulario propio.
// Los campos de idioma se generan dinámicamente a partir del catálogo de
// "languages", así que añadir un idioma nuevo no requiere tocar este archivo.
import { supabase } from '../supabaseClient.js';
import { exigirSesionYAjustes, aplicarTemaGuardado, mostrarTostada, escaparHtml } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { crearTarjetaTermino } from '../componentes/tarjetaTermino.js';
import { obtenerIdiomas } from '../api/idiomas.js';
import {
  obtenerTerminos,
  crearTerminoPropio,
  actualizarTraduccionesTermino,
  actualizarNivelCategoria,
  borrarTermino,
} from '../api/terminos.js';
import { obtenerProgreso, marcarProgreso, construirMapaProgreso } from '../api/progreso.js';
import { t } from '../i18n.js';

aplicarTemaGuardado();
const ajustes = await exigirSesionYAjustes(supabase);
if (ajustes) {
  await iniciarNavegacion('mis-palabras.html');

  const zonaMisTerminos = document.getElementById('zona-mis-terminos');
  const formulario = document.getElementById('formulario-termino');
  const botonGuardar = document.getElementById('boton-guardar-termino');
  const botonCancelar = document.getElementById('boton-cancelar-edicion');
  const campoEditandoId = document.getElementById('campo-editando-id');
  const contenedorCamposIdiomas = document.getElementById('campos-idiomas');

  const idiomaBase = ajustes.primary_language;
  let idiomas = [];
  let idiomasAprendibles = [];
  let mapaProgreso = new Map();

  async function pintarCamposIdiomas() {
    idiomas = (await obtenerIdiomas()).sort((a, b) => a.sort_order - b.sort_order);
    contenedorCamposIdiomas.innerHTML = idiomas
      .map(
        (idioma) => `
      <div class="campo">
        <label for="campo-texto-${idioma.code}">${escaparHtml(idioma.native_name)}</label>
        <input
          type="text"
          id="campo-texto-${idioma.code}"
          ${idioma.code === idiomaBase ? 'required' : `placeholder="${t('mispalabras_placeholder_opcional')}"`}
        />
      </div>`
      )
      .join('');
  }

  function leerCampos() {
    const traducciones = {};
    for (const idioma of idiomas) {
      traducciones[idioma.code] = document.getElementById(`campo-texto-${idioma.code}`).value;
    }
    return {
      nivel: document.getElementById('campo-nivel').value,
      categoria: document.getElementById('campo-categoria').value.trim(),
      traducciones,
    };
  }

  function limpiarFormulario() {
    formulario.reset();
    campoEditandoId.value = '';
    botonGuardar.textContent = t('mispalabras_boton_anadir');
    botonCancelar.classList.add('oculto');
  }

  function cargarEnFormulario(termino) {
    campoEditandoId.value = termino.id;
    document.getElementById('campo-nivel').value = termino.level;
    document.getElementById('campo-categoria').value = termino.category || '';
    const porIdioma = new Map(termino.translations.map((trad) => [trad.language_code, trad.text]));
    for (const idioma of idiomas) {
      document.getElementById(`campo-texto-${idioma.code}`).value = porIdioma.get(idioma.code) || '';
    }
    botonGuardar.textContent = t('mispalabras_boton_guardar_cambios');
    botonCancelar.classList.remove('oculto');
    formulario.scrollIntoView({ behavior: 'smooth' });
  }

  botonCancelar.addEventListener('click', limpiarFormulario);

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const { nivel, categoria, traducciones } = leerCampos();
    if (!traducciones[idiomaBase]?.trim()) {
      const nombreBase = idiomas.find((i) => i.code === idiomaBase)?.native_name || idiomaBase;
      mostrarTostada(t('mispalabras_texto_obligatorio', { idioma: nombreBase }));
      return;
    }

    botonGuardar.disabled = true;
    try {
      if (campoEditandoId.value) {
        await actualizarNivelCategoria(campoEditandoId.value, { nivel, categoria });
        await actualizarTraduccionesTermino(campoEditandoId.value, traducciones);
        mostrarTostada(t('mispalabras_toast_actualizada'));
      } else {
        await crearTerminoPropio({ nivel, categoria, traducciones });
        mostrarTostada(t('mispalabras_toast_anadida'));
      }
      limpiarFormulario();
      await cargarMisTerminos();
    } catch (error) {
      console.error(error);
      mostrarTostada(t('mispalabras_toast_error_guardar'));
    } finally {
      botonGuardar.disabled = false;
    }
  });

  async function cargarMisTerminos() {
    try {
      const [aprendibles, terminos, progreso] = await Promise.all([
        obtenerIdiomas(),
        obtenerTerminos({ soloPropios: true }),
        obtenerProgreso(),
      ]);
      idiomasAprendibles = aprendibles
        .filter((i) => ajustes.active_languages.includes(i.code))
        .sort((a, b) => a.sort_order - b.sort_order);
      mapaProgreso = construirMapaProgreso(progreso);
      renderizarLista(terminos);
    } catch (error) {
      console.error(error);
      zonaMisTerminos.innerHTML = `
        <div class="estado estado--error">
          <span class="estado__icono">⚠️</span>
          <p>${t('mispalabras_error_carga')}</p>
        </div>`;
    }
  }

  function renderizarLista(terminos) {
    if (terminos.length === 0) {
      zonaMisTerminos.innerHTML = `
        <div class="estado">
          <span class="estado__icono">✏️</span>
          <p>${t('mispalabras_sin_palabras')}</p>
        </div>`;
      return;
    }

    const rejilla = document.createElement('div');
    rejilla.className = 'rejilla-terminos';
    for (const termino of terminos) {
      rejilla.appendChild(
        crearTarjetaTermino(termino, {
          idiomaBase,
          idiomasAprendibles,
          mapaProgreso,
          alCambiarProgreso: async (terminoId, idioma, aprendido) => {
            await marcarProgreso(terminoId, idioma, aprendido);
            mapaProgreso.set(`${terminoId}:${idioma ?? 'completo'}`, aprendido);
          },
          alEditar: cargarEnFormulario,
          alBorrar: async (terminoId) => {
            if (!confirm(t('mispalabras_confirmar_borrado'))) return;
            try {
              await borrarTermino(terminoId);
              mostrarTostada(t('mispalabras_toast_borrada'));
              await cargarMisTerminos();
            } catch (error) {
              console.error(error);
              mostrarTostada(t('mispalabras_toast_error_borrar'));
            }
          },
        })
      );
    }
    zonaMisTerminos.innerHTML = '';
    zonaMisTerminos.appendChild(rejilla);
  }

  await pintarCamposIdiomas();
  cargarMisTerminos();
}
