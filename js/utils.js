// Utilidades pequeñas compartidas por toda la aplicación.

/**
 * Muestra un mensaje flotante ("tostada") temporal en la parte inferior.
 * Crea el elemento la primera vez que se usa y lo reutiliza después.
 */
export function mostrarTostada(mensaje, duracionMs = 2600) {
  let tostada = document.querySelector('.tostada');
  if (!tostada) {
    tostada = document.createElement('div');
    tostada.className = 'tostada';
    document.body.appendChild(tostada);
  }
  tostada.textContent = mensaje;
  tostada.classList.add('visible');
  clearTimeout(tostada._temporizador);
  tostada._temporizador = setTimeout(() => {
    tostada.classList.remove('visible');
  }, duracionMs);
}

/** Evita llamadas repetidas mientras el usuario sigue escribiendo/interactuando. */
export function debounce(fn, esperaMs = 250) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), esperaMs);
  };
}

/** Escapa texto antes de insertarlo como HTML, para evitar inyecciones XSS. */
export function escaparHtml(texto = '') {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/** Lee/escribe el tema (claro/oscuro/auto) guardado en localStorage y lo aplica al <html>. */
export function aplicarTemaGuardado() {
  const tema = localStorage.getItem('tema') || 'auto';
  if (tema === 'auto') {
    document.documentElement.removeAttribute('data-tema');
  } else {
    document.documentElement.setAttribute('data-tema', tema);
  }
  return tema;
}

export function guardarTema(tema) {
  localStorage.setItem('tema', tema);
  aplicarTemaGuardado();
}

/** Redirige a login.html si no hay sesión activa. Se usa al cargar cada página protegida. */
export async function exigirSesion(supabase) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}
