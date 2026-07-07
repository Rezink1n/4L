// Barra de navegación común a todas las páginas + arranque de tareas
// transversales (Service Worker, comprobación de recordatorios locales).
import { supabase } from '../supabaseClient.js';
import { cerrarSesion } from '../auth.js';
import { registrarServiceWorker, comprobarYNotificarSiToca, intentarSincroniaPeriodica } from '../notificaciones.js';
import { obtenerMiRol } from '../api/roles.js';
import { obtenerMiPerfil } from '../api/perfil.js';
import { escaparHtml } from '../utils.js';
import { t, aplicarTraducciones } from '../i18n.js';

function enlaces() {
  return [
    { href: 'index.html', icono: '📖', clave: 'nav_explorar' },
    { href: 'aprender.html', icono: '🔤', clave: 'nav_aprender' },
    { href: 'progreso.html', icono: '📊', clave: 'nav_progreso' },
    { href: 'mis-palabras.html', icono: '✏️', clave: 'nav_mispalabras' },
    { href: 'ajustes.html', icono: '⚙️', clave: 'nav_ajustes' },
  ];
}

/**
 * Pinta la barra de navegación dentro de <nav id="nav-app">, traduce el resto
 * de la página (data-i18n) y arranca las tareas de fondo (Service Worker,
 * recordatorio local). Se llama una vez por página, justo después de
 * comprobar que hay sesión activa y ajustes de idioma cargados.
 */
export async function iniciarNavegacion(paginaActual) {
  const nav = document.getElementById('nav-app');
  if (nav) {
    nav.innerHTML = enlaces()
      .map(
        (enlace) => `
      <a href="${enlace.href}" class="nav-app__enlace ${enlace.href === paginaActual ? 'activo' : ''}">
        <span>${enlace.icono}</span>
        <span>${t(enlace.clave)}</span>
      </a>`
      )
      .join('');

    const [
      {
        data: { user },
      },
      rol,
      perfil,
    ] = await Promise.all([supabase.auth.getUser(), obtenerMiRol().catch(() => 'estudiante'), obtenerMiPerfil().catch(() => null)]);

    if (rol === 'admin' || rol === 'moderador') {
      const enlaceAdmin = document.createElement('a');
      enlaceAdmin.href = 'admin.html';
      enlaceAdmin.className = `nav-app__enlace ${paginaActual === 'admin.html' ? 'activo' : ''}`;
      enlaceAdmin.innerHTML = `<span>🛠️</span><span>Admin</span>`;
      nav.appendChild(enlaceAdmin);
    }

    const infoUsuario = document.createElement('div');
    infoUsuario.className = 'nav-app__usuario';
    const avatar = perfil?.avatar_url
      ? `<img src="${perfil.avatar_url}" alt="" style="width:28px;height:28px;border-radius:999px;object-fit:cover;" />`
      : '👤';
    infoUsuario.innerHTML = `
      <a href="perfil.html" class="flex gap-sm" style="align-items:center; text-decoration:none; color:inherit;">
        ${avatar}
        <span>${escaparHtml(perfil?.display_name || user?.email || '')}</span>
      </a>
      <button class="boton boton--secundario" id="boton-cerrar-sesion" style="padding:6px 12px;">${t('nav_salir')}</button>
    `;
    nav.appendChild(infoUsuario);
    infoUsuario.querySelector('#boton-cerrar-sesion').addEventListener('click', cerrarSesion);
  }

  aplicarTraducciones(document);

  registrarServiceWorker().then(() => intentarSincroniaPeriodica());
  comprobarYNotificarSiToca();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') comprobarYNotificarSiToca();
  });
}
