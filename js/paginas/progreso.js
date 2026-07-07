// Lógica de la página "Mi progreso": calcula y pinta el panel de estadísticas.
import { supabase } from '../supabaseClient.js';
import { exigirSesionYAjustes, aplicarTemaGuardado } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { crearPanelProgreso } from '../componentes/panelProgreso.js';
import { obtenerIdiomas } from '../api/idiomas.js';
import { obtenerTerminos } from '../api/terminos.js';
import { obtenerProgreso, calcularEstadisticas } from '../api/progreso.js';
import { t } from '../i18n.js';

aplicarTemaGuardado();
const ajustes = await exigirSesionYAjustes(supabase);
if (ajustes) {
  await iniciarNavegacion('progreso.html');

  const zonaProgreso = document.getElementById('zona-progreso');

  try {
    const [idiomas, terminos, progreso] = await Promise.all([
      obtenerIdiomas(),
      obtenerTerminos(),
      obtenerProgreso(),
    ]);

    const idiomasAprendibles = idiomas
      .filter((i) => ajustes.active_languages.includes(i.code))
      .sort((a, b) => a.sort_order - b.sort_order);

    const estadisticas = calcularEstadisticas(terminos, progreso, ajustes.primary_language, ajustes.active_languages);
    zonaProgreso.innerHTML = '';
    zonaProgreso.appendChild(crearPanelProgreso(estadisticas, idiomasAprendibles));
  } catch (error) {
    console.error(error);
    zonaProgreso.innerHTML = `
      <div class="estado estado--error">
        <span class="estado__icono">⚠️</span>
        <p>${t('progreso_error')}</p>
      </div>`;
  }
}
