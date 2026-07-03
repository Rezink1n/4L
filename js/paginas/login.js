// Lógica de la página de acceso: alterna entre "iniciar sesión" y
// "registrarse", y gestiona también el enlace mágico.
import { supabase } from '../supabaseClient.js';
import { registrarse, iniciarSesion, enviarEnlaceMagico, traducirErrorAuth } from '../auth.js';
import { aplicarTemaGuardado } from '../utils.js';

aplicarTemaGuardado();

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
  botonEnviar.textContent = modoRegistro ? 'Crear cuenta' : 'Iniciar sesión';
  enlaceCambiarModo.textContent = modoRegistro
    ? '¿Ya tienes cuenta? Inicia sesión'
    : '¿No tienes cuenta? Regístrate';
  limpiarMensaje();
});

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limpiarMensaje();
  const email = document.getElementById('campo-email').value.trim();
  const password = document.getElementById('campo-password').value;

  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Un momento…';
  try {
    if (modoRegistro) {
      await registrarse(email, password);
      mostrarMensaje('Cuenta creada. Revisa tu correo si Supabase pide confirmación.', 'exito');
    } else {
      await iniciarSesion(email, password);
      window.location.href = 'index.html';
    }
  } catch (error) {
    mostrarMensaje(traducirErrorAuth(error));
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = modoRegistro ? 'Crear cuenta' : 'Iniciar sesión';
  }
});

botonMagico.addEventListener('click', async () => {
  limpiarMensaje();
  const email = document.getElementById('campo-email').value.trim();
  if (!email) {
    mostrarMensaje('Escribe primero tu correo electrónico.');
    return;
  }
  botonMagico.disabled = true;
  try {
    await enviarEnlaceMagico(email);
    mostrarMensaje('Te hemos enviado un enlace a tu correo. Ábrelo desde este dispositivo.', 'exito');
  } catch (error) {
    mostrarMensaje(traducirErrorAuth(error));
  } finally {
    botonMagico.disabled = false;
  }
});
