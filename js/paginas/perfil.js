// Lógica de "Mi perfil": datos personales, foto y nivel por idioma.
import { supabase } from '../supabaseClient.js';
import { exigirSesionYAjustes, aplicarTemaGuardado, mostrarTostada, escaparHtml } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { obtenerMiPerfil, actualizarPerfil, subirAvatar } from '../api/perfil.js';
import { obtenerIdiomas } from '../api/idiomas.js';
import { obtenerTerminos } from '../api/terminos.js';
import { obtenerProgreso, calcularEstadisticas } from '../api/progreso.js';
import { t } from '../i18n.js';

aplicarTemaGuardado();
const ajustes = await exigirSesionYAjustes(supabase);
if (ajustes) {
  await iniciarNavegacion('perfil.html');

  const imagenAvatar = document.getElementById('imagen-avatar');
  const placeholderAvatar = document.getElementById('avatar-placeholder');
  const campoAvatar = document.getElementById('campo-avatar');
  const botonCambiarAvatar = document.getElementById('boton-cambiar-avatar');
  const formulario = document.getElementById('formulario-perfil');
  const campoNombre = document.getElementById('campo-nombre');
  const campoEmail = document.getElementById('campo-email');
  const campoBio = document.getElementById('campo-bio');
  const zonaNivelIdiomas = document.getElementById('zona-nivel-idiomas');

  function mostrarAvatar(url) {
    if (url) {
      imagenAvatar.src = url;
      imagenAvatar.classList.remove('oculto');
      placeholderAvatar.classList.add('oculto');
    } else {
      imagenAvatar.classList.add('oculto');
      placeholderAvatar.classList.remove('oculto');
    }
  }

  async function cargarPerfil() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    campoEmail.value = user?.email || '';

    const perfil = await obtenerMiPerfil();
    campoNombre.value = perfil?.display_name || '';
    campoBio.value = perfil?.bio || '';
    mostrarAvatar(perfil?.avatar_url);
  }

  botonCambiarAvatar.addEventListener('click', () => campoAvatar.click());
  campoAvatar.addEventListener('change', async () => {
    const archivo = campoAvatar.files[0];
    if (!archivo) return;
    botonCambiarAvatar.disabled = true;
    try {
      const url = await subirAvatar(archivo);
      mostrarAvatar(url);
    } catch (error) {
      console.error(error);
      mostrarTostada(t('perfil_toast_error_avatar'));
    } finally {
      botonCambiarAvatar.disabled = false;
    }
  });

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    try {
      await actualizarPerfil({ displayName: campoNombre.value.trim(), bio: campoBio.value.trim() });
      mostrarTostada(t('perfil_toast_guardado'));
    } catch (error) {
      console.error(error);
      mostrarTostada(t('perfil_toast_error_guardar'));
    } finally {
      boton.disabled = false;
    }
  });

  function nivelDesdeEstadisticas(estadisticas, idioma) {
    const a1 = estadisticas.A1?.[idioma];
    const a2 = estadisticas.A2?.[idioma];
    const pctA1 = a1 && a1.total > 0 ? a1.aprendidos / a1.total : 0;
    const pctA2 = a2 && a2.total > 0 ? a2.aprendidos / a2.total : 0;
    if (pctA1 < 0.3) return { etiqueta: t('perfil_nivel_principiante'), porcentaje: Math.round(pctA1 * 100) };
    if (pctA1 < 0.9) return { etiqueta: t('perfil_nivel_a1_progreso'), porcentaje: Math.round(pctA1 * 100) };
    if (pctA2 < 0.9) return { etiqueta: t('perfil_nivel_a2_progreso'), porcentaje: Math.round(pctA2 * 100) };
    return { etiqueta: t('perfil_nivel_a2_completado'), porcentaje: 100 };
  }

  async function cargarNivelIdiomas() {
    if (!ajustes.active_languages || ajustes.active_languages.length === 0) {
      zonaNivelIdiomas.innerHTML = `<div class="estado"><p>${t('perfil_nivel_sin_datos')}</p></div>`;
      return;
    }
    try {
      const [idiomas, terminos, progreso] = await Promise.all([
        obtenerIdiomas(),
        obtenerTerminos(),
        obtenerProgreso(),
      ]);
      const nombreIdioma = new Map(idiomas.map((i) => [i.code, i.native_name]));
      const estadisticas = calcularEstadisticas(terminos, progreso, ajustes.primary_language, ajustes.active_languages);

      zonaNivelIdiomas.innerHTML = ajustes.active_languages
        .map((idioma) => {
          const { etiqueta, porcentaje } = nivelDesdeEstadisticas(estadisticas, idioma);
          return `
          <div class="barra-progreso-fila">
            <div class="barra-progreso-fila__etiqueta">
              <span>${escaparHtml(nombreIdioma.get(idioma) || idioma)} · ${escaparHtml(etiqueta)}</span>
              <span>${porcentaje}%</span>
            </div>
            <div class="barra-progreso-pista">
              <div class="barra-progreso-relleno" style="width:${porcentaje}%"></div>
            </div>
          </div>`;
        })
        .join('');
    } catch (error) {
      console.error(error);
      zonaNivelIdiomas.innerHTML = `<div class="estado estado--error"><p>${t('aprender_error')}</p></div>`;
    }
  }

  await cargarPerfil();
  cargarNivelIdiomas();
}
