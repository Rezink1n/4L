// Lógica de la página de acceso: alterna entre "iniciar sesión" y
// "registrarse", y gestiona también el enlace mágico.
import { supabase } from '../supabaseClient.js';
import { registrarse, iniciarSesion, enviarEnlaceMagico, traducirErrorAuth } from '../auth.js';
import { aplicarTemaGuardado } from '../utils.js';
import { t, aplicarTraducciones } from '../i18n.js';

aplicarTemaGuardado();
aplicarTraducciones(document);

// Si ya hay sesión activa, no tiene sentido quedarse en el login.
const {
  data: { session },
} = await supabase.auth.getSession();
if (session) {
  window.location.href = 'index.html';
}

let modoRegistro = false;

const formulario = document.getElementById('formulario-auth');
const botonEnviar = document.getElementById('boton-enviar');
const enlaceCambiarModo = document.getElementById('enlace-cambiar-modo');
const botonMagico = document.getElementById('boton-magico');
const zonaMensaje = document.getElementById('zona-mensaje');

function mostrarMensaje(texto, tipo = 'error') {
  zonaMensaje.innerHTML = `<div class="aviso aviso--${tipo}">${texto}</div>`;
}

function limpiarMensaje() {
  zonaMensaje.innerHTML = '';
}

enlaceCambiarModo.addEventListener('click', (evento) => {
  evento.preventDefault();
  modoRegistro = !modoRegistro;
  botonEnviar.textContent = modoRegistro ? t('login_boton_crear') : t('login_boton_iniciar');
  enlaceCambiarModo.textContent = modoRegistro ? t('login_enlace_a_login') : t('login_enlace_a_registro');
  limpiarMensaje();
});

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limpiarMensaje();
  const email = document.getElementById('campo-email').value.trim();
  const password = document.getElementById('campo-password').value;

  botonEnviar.disabled = true;
  botonEnviar.textContent = t('login_momento');
  try {
    if (modoRegistro) {
      await registrarse(email, password);
      mostrarMensaje(t('login_mensaje_cuenta_creada'), 'exito');
    } else {
      await iniciarSesion(email, password);
      window.location.href = 'index.html';
    }
  } catch (error) {
    mostrarMensaje(traducirErrorAuth(error));
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = modoRegistro ? t('login_boton_crear') : t('login_boton_iniciar');
  }
});

botonMagico.addEventListener('click', async () => {
  limpiarMensaje();
  const email = document.getElementById('campo-email').value.trim();
  if (!email) {
    mostrarMensaje(t('login_error_sin_email'));
    return;
  }
  botonMagico.disabled = true;
  try {
    await enviarEnlaceMagico(email);
    mostrarMensaje(t('login_mensaje_enlace_enviado'), 'exito');
  } catch (error) {
    mostrarMensaje(traducirErrorAuth(error));
  } finally {
    botonMagico.disabled = false;
  }
});
