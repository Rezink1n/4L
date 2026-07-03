// Service Worker mínimo.
//
// Su función principal en la Fase 1 es habilitar `registration.showNotification`
// y reaccionar a que el usuario pulse la notificación. También deja
// preparados los "ganchos" para Push real (Fase 2) y para Periodic Background
// Sync (mejora opcional, ver js/notificaciones.js).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(self.clients.claim());
});

// Al hacer clic en la notificación, enfoca una pestaña abierta o abre una nueva.
self.addEventListener('notificationclick', (evento) => {
  evento.notification.close();
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((listaClientes) => {
      for (const cliente of listaClientes) {
        if ('focus' in cliente) return cliente.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});

// --- Fase 2 (documentado, no activo por defecto) -----------------------
// Cuando se reciba un push real desde el servidor (ver
// supabase/functions/send-push/index.ts), este evento mostraría la
// notificación con los datos que envíe el servidor:
//
// self.addEventListener('push', (evento) => {
//   const datos = evento.data ? evento.data.json() : {};
//   evento.waitUntil(
//     self.registration.showNotification(datos.titulo || 'Recordatorio', {
//       body: datos.cuerpo || 'Toca para repasar tu vocabulario.',
//       icon: 'icons/icono.svg',
//     })
//   );
// });

// --- Periodic Background Sync (mejora opcional, soporte muy limitado) --
// self.addEventListener('periodicsync', (evento) => {
//   if (evento.tag === 'comprobar-recordatorio') {
//     // Aquí solo podríamos mostrar una notificación genérica: el Service
//     // Worker no tiene acceso directo a localStorage ni a la sesión de
//     // Supabase del documento, así que esta vía es limitada sin Push real.
//   }
// });
