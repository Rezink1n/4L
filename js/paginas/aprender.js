// Lógica de "Aprender": alfabeto/pronunciación y gramática básica por idioma.
import { supabase } from '../supabaseClient.js';
import { exigirSesionYAjustes, aplicarTemaGuardado, escaparHtml } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { obtenerIdiomas } from '../api/idiomas.js';
import { obtenerGuia } from '../api/guias.js';
import { t } from '../i18n.js';

aplicarTemaGuardado();
const ajustes = await exigirSesionYAjustes(supabase);
if (ajustes) {
  await iniciarNavegacion('aprender.html');

  const selectIdioma = document.getElementById('campo-idioma-guia');
  const tabsTipo = document.getElementById('tabs-tipo-guia');
  const zonaGuia = document.getElementById('zona-guia');

  let tipoActual = 'alfabeto';

  async function pintarSelectorIdioma() {
    const idiomas = (await obtenerIdiomas()).sort((a, b) => a.sort_order - b.sort_order);
    selectIdioma.innerHTML = idiomas
      .map((idioma) => `<option value="${idioma.code}">${escaparHtml(idioma.native_name)}</option>`)
      .join('');
    // Empezamos mostrando un idioma que el usuario esté aprendiendo activamente,
    // si tiene alguno; si no, el primero de la lista.
    const idiomaInicial = idiomas.find((i) => ajustes.active_languages.includes(i.code)) || idiomas[0];
    selectIdioma.value = idiomaInicial?.code;
  }

  async function cargarGuia() {
    zonaGuia.innerHTML = `
      <div class="estado">
        <span class="estado__icono girando">⏳</span>
        <p>${t('aprender_cargando')}</p>
      </div>`;
    try {
      const items = await obtenerGuia(selectIdioma.value, tipoActual);
      if (items.length === 0) {
        zonaGuia.innerHTML = `
          <div class="estado">
            <span class="estado__icono">📭</span>
            <p>${t('aprender_sin_contenido')}</p>
          </div>`;
        return;
      }
      zonaGuia.innerHTML = items
        .map(
          (item) => `
        <article class="tarjeta" style="margin-bottom: var(--espacio-md);">
          <div class="tarjeta__termino-es">${escaparHtml(item.titulo)}</div>
          <p style="margin-top: var(--espacio-sm);">${escaparHtml(item.explicacion)}</p>
          ${item.ejemplo ? `<p class="campo__ayuda"><em>${escaparHtml(item.ejemplo)}</em></p>` : ''}
        </article>`
        )
        .join('');
    } catch (error) {
      console.error(error);
      zonaGuia.innerHTML = `
        <div class="estado estado--error">
          <span class="estado__icono">⚠️</span>
          <p>${t('aprender_error')}</p>
        </div>`;
    }
  }

  selectIdioma.addEventListener('change', cargarGuia);
  tabsTipo.addEventListener('click', (evento) => {
    const chip = evento.target.closest('.chip-filtro');
    if (!chip) return;
    tabsTipo.querySelectorAll('.chip-filtro').forEach((c) => c.classList.remove('activo'));
    chip.classList.add('activo');
    tipoActual = chip.dataset.tipo;
    cargarGuia();
  });

  await pintarSelectorIdioma();
  cargarGuia();
}
