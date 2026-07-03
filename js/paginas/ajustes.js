// Lógica de "Ajustes": recordatorio local, permiso de notificaciones y tema.
import { supabase } from '../supabaseClient.js';
import { exigirSesion, aplicarTemaGuardado, guardarTema, mostrarTostada } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { obtenerRecordatorio, guardarRecordatorio } from '../api/recordatorios.js';
import { pedirPermisoNotificaciones, permisoConcedido, guardarCacheLocal } from '../notificaciones.js';

aplicarTemaGuardado();
await exigirSesion(supabase);
await iniciarNavegacion('ajustes.html');

const campoHora = document.getElementById('campo-hora-recordatorio');
const campoActivo = document.getElementById('campo-activo-recordatorio');
const campoTema = document.getElementById('campo-tema');
const botonGuardar = document.getElementById('boton-guardar-recordatorio');
const zonaAvisoPermiso = document.getElementById('zona-aviso-permiso');

campoTema.value = localStorage.getItem('tema') || 'auto';
campoTema.addEventListener('change', () => guardarTema(campoTema.value));

function actualizarAvisoPermiso() {
  if (!('Notification' in window)) {
    zonaAvisoPermiso.innerHTML = `<div class="aviso aviso--error">Tu navegador no admite notificaciones.</div>`;
    campoActivo.disabled = true;
    return;
  }
  if (!permisoConcedido()) {
    zonaAvisoPermiso.innerHTML = `<div class="aviso aviso--info">Necesitamos tu permiso para poder avisarte. Se pedirá al guardar.</div>`;
  } else {
    zonaAvisoPermiso.innerHTML = '';
  }
}

async function cargar() {
  actualizarAvisoPermiso();
  try {
    const recordatorio = await obtenerRecordatorio();
    if (recordatorio) {
      campoHora.value = recordatorio.hour?.slice(0, 5) || '20:00';
      campoActivo.checked = recordatorio.active;
      guardarCacheLocal({ hora: campoHora.value, activo: recordatorio.active });
    }
  } catch (error) {
    console.error(error);
    mostrarTostada('No se pudo cargar tu recordatorio guardado.');
  }
}

botonGuardar.addEventListener('click', async () => {
  const hora = campoHora.value;
  const activo = campoActivo.checked;

  if (activo && !permisoConcedido()) {
    try {
      const permiso = await pedirPermisoNotificaciones();
      if (permiso !== 'granted') {
        mostrarTostada('No has concedido permiso: el recordatorio no podrá avisarte.');
      }
    } catch (error) {
      mostrarTostada(error.message);
    }
  }

  botonGuardar.disabled = true;
  try {
    await guardarRecordatorio({ hora, activo });
    guardarCacheLocal({ hora, activo });
    actualizarAvisoPermiso();
    mostrarTostada('Ajustes guardados.');
  } catch (error) {
    console.error(error);
    mostrarTostada('No se pudieron guardar los ajustes.');
  } finally {
    botonGuardar.disabled = false;
  }
});

cargar();
