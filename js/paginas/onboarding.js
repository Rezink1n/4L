// Lógica de la página de onboarding: se muestra la primera vez que un
// usuario entra, para que elija su idioma principal y qué idiomas activos
// quiere aprender. Si ya lo había elegido antes, se salta directo a Explorar.
import { supabase } from '../supabaseClient.js';
import { exigirSesion, aplicarTemaGuardado, mostrarTostada, escaparHtml } from '../utils.js';
import { obtenerIdiomas } from '../api/idiomas.js';
import { obtenerAjustesUsuario, guardarAjustesUsuario } from '../api/ajustesUsuario.js';
import { t, aplicarTraducciones, establecerIdiomaInterfaz, detectarIdiomaNavegador } from '../i18n.js';

aplicarTemaGuardado();

const session = await exigirSesion(supabase);
if (session) {
  const ajustesExistentes = await obtenerAjustesUsuario();
  if (ajustesExistentes && ajustesExistentes.active_languages && ajustesExistentes.active_languages.length > 0) {
    window.location.href = 'index.html';
  } else {
    establecerIdiomaInterfaz(detectarIdiomaNavegador());
    aplicarTraducciones(document);

    const selectPrincipal = document.getElementById('campo-idioma-principal');
    const listaActivos = document.getElementById('lista-idiomas-activos');
    const formulario = document.getElementById('formulario-onboarding');
    const botonContinuar = document.getElementById('boton-continuar');
    const zonaMensaje = document.getElementById('zona-mensaje');

    function renderizarActivos(idiomas) {
      const principal = selectPrincipal.value;
      listaActivos.innerHTML = idiomas
        .filter((idioma) => idioma.code !== principal)
        .map(
          (idioma) => `
        <label class="interruptor">
          <input type="checkbox" class="check-idioma-activo" value="${idioma.code}" />
          <span>${escaparHtml(idioma.native_name)}</span>
        </label>`
        )
        .join('');
    }

    const idiomas = (await obtenerIdiomas()).sort((a, b) => a.sort_order - b.sort_order);
    selectPrincipal.innerHTML = idiomas
      .map((idioma) => `<option value="${idioma.code}">${escaparHtml(idioma.native_name)}</option>`)
      .join('');
    selectPrincipal.value = detectarIdiomaNavegador();
    renderizarActivos(idiomas);
    selectPrincipal.addEventListener('change', () => {
      establecerIdiomaInterfaz(selectPrincipal.value);
      aplicarTraducciones(document);
      renderizarActivos(idiomas);
    });

    formulario.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const idiomaPrincipal = selectPrincipal.value;
      const idiomasActivos = [...listaActivos.querySelectorAll('.check-idioma-activo:checked')].map(
        (input) => input.value
      );
      if (idiomasActivos.length === 0) {
        zonaMensaje.innerHTML = `<div class="aviso aviso--error">${t('onboarding_error_ningun_idioma')}</div>`;
        return;
      }
      botonContinuar.disabled = true;
      try {
        await guardarAjustesUsuario({ idiomaPrincipal, idiomasActivos });
        window.location.href = 'index.html';
      } catch (error) {
        console.error(error);
        mostrarTostada(t('error_generico'));
        botonContinuar.disabled = false;
      }
    });
  }
}
