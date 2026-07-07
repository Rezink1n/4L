// Lógica de "Ajustes": idiomas, recordatorio local, permiso de notificaciones y tema.
import { supabase } from '../supabaseClient.js';
import { exigirSesionYAjustes, aplicarTemaGuardado, guardarTema, mostrarTostada, escaparHtml } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { obtenerRecordatorio, guardarRecordatorio } from '../api/recordatorios.js';
import { pedirPermisoNotificaciones, permisoConcedido, guardarCacheLocal } from '../notificaciones.js';
import { obtenerIdiomas, obtenerVariantes, agruparVariantesPorIdioma } from '../api/idiomas.js';
import { guardarAjustesUsuario, guardarVariantesVoz } from '../api/ajustesUsuario.js';
import { t, establecerIdiomaInterfaz } from '../i18n.js';

aplicarTemaGuardado();
const ajustesActuales = await exigirSesionYAjustes(supabase);
if (ajustesActuales) {
  await iniciarNavegacion('ajustes.html');

  // --- Idiomas ---
  const selectPrincipal = document.getElementById('campo-idioma-principal');
  const listaActivos = document.getElementById('lista-idiomas-activos');
  const botonGuardarIdiomas = document.getElementById('boton-guardar-idiomas');

  function renderizarActivos(idiomas) {
    const principal = selectPrincipal.value;
    listaActivos.innerHTML = idiomas
      .filter((idioma) => idioma.code !== principal)
      .map(
        (idioma) => `
      <label class="interruptor">
        <input type="checkbox" class="check-idioma-activo" value="${idioma.code}" ${
          ajustesActuales.active_languages.includes(idioma.code) ? 'checked' : ''
        } />
        <span>${escaparHtml(idioma.native_name)}</span>
      </label>`
      )
      .join('');
  }

  async function pintarIdiomas() {
    const idiomas = (await obtenerIdiomas()).sort((a, b) => a.sort_order - b.sort_order);
    selectPrincipal.innerHTML = idiomas
      .map((idioma) => `<option value="${idioma.code}">${escaparHtml(idioma.native_name)}</option>`)
      .join('');
    selectPrincipal.value = ajustesActuales.primary_language;
    renderizarActivos(idiomas);
    selectPrincipal.addEventListener('change', () => renderizarActivos(idiomas));
  }

  botonGuardarIdiomas.addEventListener('click', async () => {
    const idiomaPrincipal = selectPrincipal.value;
    const idiomasActivos = [...listaActivos.querySelectorAll('.check-idioma-activo:checked')].map(
      (input) => input.value
    );
    if (idiomasActivos.length === 0) {
      mostrarTostada(t('ajustes_error_ningun_idioma'));
      return;
    }
    botonGuardarIdiomas.disabled = true;
    try {
      await guardarAjustesUsuario({ idiomaPrincipal, idiomasActivos });
      establecerIdiomaInterfaz(idiomaPrincipal);
      mostrarTostada(t('ajustes_toast_idiomas_guardados'));
      // Recargamos para que toda la página (nav, textos, tarjetas) reflejen
      // el nuevo idioma principal y los nuevos idiomas activos.
      setTimeout(() => window.location.reload(), 600);
    } catch (error) {
      console.error(error);
      mostrarTostada(t('ajustes_toast_error_guardar'));
    } finally {
      botonGuardarIdiomas.disabled = false;
    }
  });

  // --- Variantes de pronunciación (solo idiomas con más de una variante) ---
  const listaVariantes = document.getElementById('lista-variantes');
  const botonGuardarVariantes = document.getElementById('boton-guardar-variantes');
  const voiceVariantsActuales = ajustesActuales.voice_variants || {};

  async function pintarVariantes() {
    const [idiomas, variantes] = await Promise.all([obtenerIdiomas(), obtenerVariantes()]);
    const nombreIdioma = new Map(idiomas.map((i) => [i.code, i.native_name]));
    const variantesPorIdioma = agruparVariantesPorIdioma(variantes);
    const idiomasConVariantes = Object.entries(variantesPorIdioma).filter(([, lista]) => lista.length > 1);

    if (idiomasConVariantes.length === 0) {
      listaVariantes.innerHTML = '';
      botonGuardarVariantes.classList.add('oculto');
      return;
    }

    listaVariantes.innerHTML = idiomasConVariantes
      .map(([idiomaCodigo, variantesIdioma]) => {
        const seleccionada =
          voiceVariantsActuales[idiomaCodigo] || variantesIdioma.find((v) => v.is_default)?.variant_code;
        return `
        <div class="campo">
          <label for="campo-variante-${idiomaCodigo}">${escaparHtml(nombreIdioma.get(idiomaCodigo) || idiomaCodigo)}</label>
          <select id="campo-variante-${idiomaCodigo}" data-idioma="${idiomaCodigo}">
            ${variantesIdioma
              .map(
                (v) =>
                  `<option value="${v.variant_code}" ${v.variant_code === seleccionada ? 'selected' : ''}>${v.flag_emoji} ${escaparHtml(v.label)}</option>`
              )
              .join('')}
          </select>
        </div>`;
      })
      .join('');
  }

  botonGuardarVariantes.addEventListener('click', async () => {
    const voiceVariants = {};
    listaVariantes.querySelectorAll('select[data-idioma]').forEach((select) => {
      voiceVariants[select.dataset.idioma] = select.value;
    });
    botonGuardarVariantes.disabled = true;
    try {
      await guardarVariantesVoz(voiceVariants);
      mostrarTostada(t('ajustes_toast_variantes_guardadas'));
    } catch (error) {
      console.error(error);
      mostrarTostada(t('ajustes_toast_error_guardar'));
    } finally {
      botonGuardarVariantes.disabled = false;
    }
  });

  // --- Recordatorio y tema ---
  const campoHora = document.getElementById('campo-hora-recordatorio');
  const campoActivo = document.getElementById('campo-activo-recordatorio');
  const campoTema = document.getElementById('campo-tema');
  const botonGuardar = document.getElementById('boton-guardar-recordatorio');
  const zonaAvisoPermiso = document.getElementById('zona-aviso-permiso');

  campoTema.value = localStorage.getItem('tema') || 'auto';
  campoTema.addEventListener('change', () => guardarTema(campoTema.value));

  function actualizarAvisoPermiso() {
    if (!('Notification' in window)) {
      zonaAvisoPermiso.innerHTML = `<div class="aviso aviso--error">${t('ajustes_aviso_sin_notificaciones')}</div>`;
      campoActivo.disabled = true;
      return;
    }
    if (!permisoConcedido()) {
      zonaAvisoPermiso.innerHTML = `<div class="aviso aviso--info">${t('ajustes_aviso_pedir_permiso')}</div>`;
    } else {
      zonaAvisoPermiso.innerHTML = '';
    }
  }

  async function cargarRecordatorio() {
    actualizarAvisoPermiso();
    try {
      const recordatorio = await obtenerRecordatorio();
      if (recordatorio) {
        campoHora.value = recordatorio.hour?.slice(0, 5) || '20:00';
        campoActivo.checked = recordatorio.active;
        guardarCacheLocal({ hora: campoHora.value, activo: recordatorio.active });
      }
    } catch (error) {
      console.error(error);
      mostrarTostada(t('ajustes_toast_error_cargar'));
    }
  }

  botonGuardar.addEventListener('click', async () => {
    const hora = campoHora.value;
    const activo = campoActivo.checked;

    if (activo && !permisoConcedido()) {
      try {
        const permiso = await pedirPermisoNotificaciones();
        if (permiso !== 'granted') {
          mostrarTostada(t('ajustes_no_concedido'));
        }
      } catch (error) {
        mostrarTostada(error.message);
      }
    }

    botonGuardar.disabled = true;
    try {
      await guardarRecordatorio({ hora, activo });
      guardarCacheLocal({ hora, activo });
      actualizarAvisoPermiso();
      mostrarTostada(t('ajustes_toast_guardado'));
    } catch (error) {
      console.error(error);
      mostrarTostada(t('ajustes_toast_error_guardar'));
    } finally {
      botonGuardar.disabled = false;
    }
  });

  pintarIdiomas();
  pintarVariantes();
  cargarRecordatorio();
}
