// Barra de navegación común a todas las páginas + arranque de tareas
// transversales (Service Worker, comprobación de recordatorios locales).
import { supabase } from '../supabaseClient.js';
import { cerrarSesion } from '../auth.js';
import { registrarServiceWorker, comprobarYNotificarSiToca, intentarSincroniaPeriodica } from '../notificaciones.js';

const ENLACES = [
  { href: 'index.html', icono: '📖', texto: 'Explorar' },
  { href: 'progreso.html', icono: '📊', texto: 'Mi progreso' },
  { href: 'mis-palabras.html', icono: '✏️', texto: 'Mis palabras' },
  { href: 'ajustes.html', icono: '⚙️', texto: 'Ajustes' },
];

/**
 * Pinta la barra de navegación dentro de <nav id="nav-app"> y arranca las
 * tareas de fondo (Service Worker, recordatorio local). Se llama una vez por
 * página, justo después de comprobar que hay sesión activa.
 */
export async function iniciarNavegacion(paginaActual) {
  const nav = document.getElementById('nav-app');
  if (nav) {
    nav.innerHTML = ENLACES.map(
      (enlace) => `
      <a href="${enlace.href}" class="nav-app__enlace ${enlace.href === paginaActual ? 'activo' : ''}">
        <span>${enlace.icono}</span>
        <span>${enlace.texto}</span>
      </a>`
    ).join('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const infoUsuario = document.createElement('div');
    infoUsuario.className = 'nav-app__usuario';
    infoUsuario.innerHTML = `
      <span>${user?.email ?? ''}</span>
      <button class="boton boton--secundario" id="boton-cerrar-sesion" style="padding:6px 12px;">Salir</button>
    `;
    nav.appendChild(infoUsuario);
    infoUsuario.querySelector('#boton-cerrar-sesion').addEventListener('click', cerrarSesion);
  }

  registrarServiceWorker().then(() => intentarSincroniaPeriodica());
  comprobarYNotificarSiToca();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') comprobarYNotificarSiToca();
  });
}
