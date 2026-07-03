// Recordatorios locales (Fase 1 del MVP): permiso de notificaciones +
// Service Worker + una comprobación por hora guardada en localStorage.
//
// LIMITACIÓN IMPORTANTE (léela antes de "arreglar" nada aquí):
// Los navegadores NO permiten programar temporizadores en segundo plano de
// forma fiable. Ni `setTimeout`, ni el Service Worker, pueden "despertar" el
// dispositivo a una hora exacta si la app está cerrada. Lo que hacemos es:
//
//   1. Guardar la hora elegida y si el recordatorio está activo (en Supabase,
//      para que viaje entre dispositivos, y en localStorage como caché rápida).
//   2. Cada vez que el usuario abre la app, o la pestaña vuelve a estar
//      visible, comprobamos si "ya ha pasado" la hora elegida y todavía no se
//      mostró el aviso hoy. Si es así, disparamos una notificación.
//
// Esto cubre el caso de uso real ("recuérdame repasar sobre las 20:00" y el
// usuario abre el móvil en algún momento del día), pero NO dispara la
// notificación si el usuario nunca abre la app. Para avisos de verdad estando
// la app completamente cerrada hace falta Push real con servidor (Fase 2,
// ver supabase/functions/send-push/index.ts y las notas en Ajustes).
//
// Chrome en escritorio soporta además la Periodic Background Sync API, que sí
// puede despertar al Service Worker sin abrir la app, pero solo si el sitio
// está instalado como PWA y el navegador decide que el "engagement" del
// usuario es suficiente: no es fiable como única solución, así que aquí se
// usa solo como mejora opcional silenciosa (ver intentarSincroniaPeriodica).

const CLAVE_LOCAL = 'recordatorio_local';

export async function pedirPermisoNotificaciones() {
  if (!('Notification' in window)) {
    throw new Error('Este navegador no admite notificaciones.');
  }
  const permiso = await Notification.requestPermission();
  return permiso; // 'granted' | 'denied' | 'default'
}

export function permisoConcedido() {
  return 'Notification' in window && Notification.permission === 'granted';
}

export async function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    // Ruta relativa: funciona tanto en la raíz del dominio como en un
    // subdirectorio de GitHub Pages (https://usuario.github.io/repo/).
    const registro = await navigator.serviceWorker.register('sw.js');
    return registro;
  } catch (error) {
    console.warn('No se pudo registrar el Service Worker:', error);
    return null;
  }
}

/** Guarda en localStorage la preferencia, para poder comprobarla sin red. */
export function guardarCacheLocal({ hora, activo }) {
  const anterior = leerCacheLocal();
  localStorage.setItem(
    CLAVE_LOCAL,
    JSON.stringify({ hora, activo, ultimoAvisoFecha: anterior?.ultimoAvisoFecha || null })
  );
}

function leerCacheLocal() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_LOCAL) || 'null');
  } catch {
    return null;
  }
}

/**
 * Comprueba si toca mostrar el recordatorio ahora mismo y, si es así, lo
 * muestra. Se debe llamar al cargar cualquier página y cuando la pestaña
 * vuelve a hacerse visible (ver componentes/navegacion.js).
 */
export async function comprobarYNotificarSiToca() {
  const config = leerCacheLocal();
  if (!config || !config.activo || !permisoConcedido()) return;

  const ahora = new Date();
  const hoyIso = ahora.toISOString().slice(0, 10);
  if (config.ultimoAvisoFecha === hoyIso) return; // ya se mostró hoy

  const [horaObjetivo, minutoObjetivo] = config.hora.split(':').map(Number);
  const objetivo = new Date(ahora);
  objetivo.setHours(horaObjetivo, minutoObjetivo, 0, 0);

  if (ahora >= objetivo) {
    await mostrarNotificacion();
    localStorage.setItem(
      CLAVE_LOCAL,
      JSON.stringify({ ...config, ultimoAvisoFecha: hoyIso })
    );
  }
}

async function mostrarNotificacion() {
  const titulo = '¡Hora de repasar! 📚';
  const opciones = {
    body: 'Dedica unos minutos a repasar tu vocabulario en Explorar.',
    icon: 'icons/icono.svg',
    tag: 'recordatorio-diario',
  };
  const registro = await navigator.serviceWorker?.getRegistration();
  if (registro) {
    registro.showNotification(titulo, opciones);
  } else {
    new Notification(titulo, opciones);
  }
}

/** Mejora opcional y silenciosa: si el navegador soporta Periodic Background
 * Sync y el sitio está instalado, intenta registrar una sincronización cada
 * ~12 horas para poder comprobar el recordatorio sin tener la app abierta.
 * Si no está disponible (la mayoría de navegadores), simplemente no hace nada. */
export async function intentarSincroniaPeriodica() {
  try {
    const registro = await navigator.serviceWorker?.getRegistration();
    if (!registro || !('periodicSync' in registro)) return;
    const estado = await navigator.permissions.query({ name: 'periodic-background-sync' });
    if (estado.state !== 'granted') return;
    await registro.periodicSync.register('comprobar-recordatorio', {
      minInterval: 12 * 60 * 60 * 1000,
    });
  } catch {
    // Silencioso a propósito: es una mejora "best effort", no una funcionalidad crítica.
  }
}
