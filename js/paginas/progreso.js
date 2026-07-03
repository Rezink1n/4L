// Lógica de la página "Mi progreso": calcula y pinta el panel de estadísticas.
import { supabase } from '../supabaseClient.js';
import { exigirSesion, aplicarTemaGuardado } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { crearPanelProgreso } from '../componentes/panelProgreso.js';
import { obtenerIdiomasAprendibles } from '../api/idiomas.js';
import { obtenerTerminos } from '../api/terminos.js';
import { obtenerProgreso, calcularEstadisticas } from '../api/progreso.js';

aplicarTemaGuardado();
await exigirSesion(supabase);
await iniciarNavegacion('progreso.html');

const zonaProgreso = document.getElementById('zona-progreso');

try {
  const [idiomasAprendibles, terminos, progreso] = await Promise.all([
    obtenerIdiomasAprendibles(),
    obtenerTerminos(),
    obtenerProgreso(),
  ]);

  const estadisticas = calcularEstadisticas(terminos, progreso);
  zonaProgreso.innerHTML = '';
  zonaProgreso.appendChild(crearPanelProgreso(estadisticas, idiomasAprendibles));
} catch (error) {
  console.error(error);
  zonaProgreso.innerHTML = `
    <div class="estado estado--error">
      <span class="estado__icono">⚠️</span>
      <p>No se pudo calcular tu progreso. Inténtalo de nuevo más tarde.</p>
    </div>`;
}
