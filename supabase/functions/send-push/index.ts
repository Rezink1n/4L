// ============================================================================
// Fase 2 (OPCIONAL): notificaciones push reales, con la app cerrada.
//
// Esta Edge Function NO se ejecuta ni se despliega automáticamente: es
// código de referencia, listo para usar, pero requiere varios pasos MANUALES
// que se explican abajo. Sin esos pasos, la app funciona igualmente con el
// recordatorio local de la Fase 1 (ver js/notificaciones.js).
//
// ----------------------------------------------------------------------------
// PASOS MANUALES NECESARIOS (hacerlos en este orden):
// ----------------------------------------------------------------------------
// 1. Generar un par de claves VAPID (una vez, no cambian):
//      npx web-push generate-vapid-keys
//    Esto da una clave pública y una privada.
//
// 2. Guardar la clave privada (y el "asunto", un mailto: o URL de contacto)
//    como secrets de la función, NUNCA en el código ni en el repo:
//      supabase secrets set VAPID_PRIVATE_KEY=xxxx VAPID_PUBLIC_KEY=xxxx VAPID_SUBJECT=mailto:tu@correo.com
//
// 3. Poner la clave PÚBLICA (no la privada) también en el cliente, para que
//    el navegador pueda suscribirse. Como es pública, puede ir en config.js
//    junto a SUPABASE_URL / SUPABASE_ANON_KEY.
//
// 4. En el navegador, suscribir al usuario (código de referencia, no activo
//    por defecto, pensado para añadirlo en ajustes.js cuando se quiera
//    habilitar esta fase):
//
//      const registro = await navigator.serviceWorker.ready;
//      const suscripcion = await registro.pushManager.subscribe({
//        userVisibleOnly: true,
//        applicationServerKey: VAPID_PUBLIC_KEY, // convertida a Uint8Array
//      });
//      // Guardar suscripcion.endpoint / .keys.p256dh / .keys.auth en la
//      // tabla push_subscriptions (ver supabase/schema.sql) asociada a auth.uid().
//
// 5. Desplegar esta función:
//      supabase functions deploy send-push
//
// 6. Programarla para que se ejecute periódicamente (p. ej. cada 15 min,
//    para comprobar qué usuarios tienen su "hora de recordatorio" en ese
//    tramo) usando pg_cron + pg_net desde SQL:
//
//      select cron.schedule(
//        'recordatorios-push',
//        '*/15 * * * *',
//        $$
//        select net.http_post(
//          url := 'https://TU-PROYECTO.supabase.co/functions/v1/send-push',
//          headers := jsonb_build_object(
//            'Authorization', 'Bearer ' || 'TU_SERVICE_ROLE_KEY_O_ANON_KEY',
//            'Content-Type', 'application/json'
//          )
//        );
//        $$
//      );
//
//    (pg_cron y pg_net son extensiones de Supabase que se activan desde
//    Database > Extensions en el panel del proyecto).
// ============================================================================

// @ts-nocheck — esta función usa imports npm: propios del runtime de Deno de
// Supabase Edge Functions; no se ejecuta en el navegador ni en Node.
import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT')!;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  // service_role: esta función corre en el servidor, nunca en el cliente,
  // así que aquí SÍ es correcto usar una clave con privilegios elevados.
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async () => {
  const ahora = new Date();
  const horaActual = ahora.toISOString().slice(11, 16); // 'HH:MM'

  // Usuarios cuyo recordatorio está activo y cuya hora coincide con la
  // ventana de ejecución actual (ajustar la comparación según la frecuencia
  // del cron: aquí se asume una comprobación cada 15 minutos).
  const { data: recordatorios, error } = await supabaseAdmin
    .from('reminder_settings')
    .select('user_id, hour')
    .eq('active', true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const usuariosAAvisar = (recordatorios || []).filter((r) => r.hour?.slice(0, 5) === horaActual);

  let enviados = 0;
  for (const usuario of usuariosAAvisar) {
    const { data: suscripciones } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', usuario.user_id);

    for (const suscripcion of suscripciones || []) {
      try {
        await webpush.sendNotification(
          {
            endpoint: suscripcion.endpoint,
            keys: { p256dh: suscripcion.p256dh, auth: suscripcion.auth_key },
          },
          JSON.stringify({ titulo: '¡Hora de repasar! 📚', cuerpo: 'Tienes vocabulario pendiente en 4L.' })
        );
        enviados++;
      } catch (err) {
        // Un endpoint caducado devuelve 410: lo borramos para no reintentarlo.
        if (err?.statusCode === 410) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', suscripcion.id);
        }
      }
    }
  }

  return new Response(JSON.stringify({ enviados }), { headers: { 'Content-Type': 'application/json' } });
});
