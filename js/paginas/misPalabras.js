// Lógica de "Mis palabras": alta, edición y borrado de vocabulario propio.
import { supabase } from '../supabaseClient.js';
import { exigirSesion, aplicarTemaGuardado, mostrarTostada } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { crearTarjetaTermino } from '../componentes/tarjetaTermino.js';
import { obtenerIdiomas, obtenerIdiomasAprendibles } from '../api/idiomas.js';
import {
  obtenerTerminos,
  crearTerminoPropio,
  actualizarTraduccionesTermino,
  actualizarNivelCategoria,
  borrarTermino,
} from '../api/terminos.js';
import { obtenerProgreso, marcarProgreso, construirMapaProgreso } from '../api/progreso.js';

aplicarTemaGuardado();
await exigirSesion(supabase);
await iniciarNavegacion('mis-palabras.html');

const zonaMisTerminos = document.getElementById('zona-mis-terminos');
const formulario = document.getElementById('formulario-termino');
const botonGuardar = document.getElementById('boton-guardar-termino');
const botonCancelar = document.getElementById('boton-cancelar-edicion');
const campoEditandoId = document.getElementById('campo-editando-id');

let idiomaBase = 'es';
let idiomasAprendibles = [];
let mapaProgreso = new Map();

function leerCampos() {
  return {
    nivel: document.getElementById('campo-nivel').value,
    categoria: document.getElementById('campo-categoria').value.trim(),
    traducciones: {
      es: document.getElementById('campo-texto-es').value,
      fr: document.getElementById('campo-texto-fr').value,
      pt: document.getElementById('campo-texto-pt').value,
      it: document.getElementById('campo-texto-it').value,
    },
  };
}

function limpiarFormulario() {
  formulario.reset();
  campoEditandoId.value = '';
  botonGuardar.textContent = 'Añadir palabra';
  botonCancelar.classList.add('oculto');
}

function cargarEnFormulario(termino) {
  campoEditandoId.value = termino.id;
  document.getElementById('campo-nivel').value = termino.level;
  document.getElementById('campo-categoria').value = termino.category || '';
  const porIdioma = new Map(termino.translations.map((t) => [t.language_code, t.text]));
  document.getElementById('campo-texto-es').value = porIdioma.get('es') || '';
  document.getElementById('campo-texto-fr').value = porIdioma.get('fr') || '';
  document.getElementById('campo-texto-pt').value = porIdioma.get('pt') || '';
  document.getElementById('campo-texto-it').value = porIdioma.get('it') || '';
  botonGuardar.textContent = 'Guardar cambios';
  botonCancelar.classList.remove('oculto');
  formulario.scrollIntoView({ behavior: 'smooth' });
}

botonCancelar.addEventListener('click', limpiarFormulario);

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const { nivel, categoria, traducciones } = leerCampos();
  if (!traducciones.es.trim()) {
    mostrarTostada('El texto en español es obligatorio.');
    return;
  }

  botonGuardar.disabled = true;
  try {
    if (campoEditandoId.value) {
      await actualizarNivelCategoria(campoEditandoId.value, { nivel, categoria });
      await actualizarTraduccionesTermino(campoEditandoId.value, traducciones);
      mostrarTostada('Palabra actualizada.');
    } else {
      await crearTerminoPropio({ nivel, categoria, traducciones });
      mostrarTostada('Palabra añadida.');
    }
    limpiarFormulario();
    await cargarMisTerminos();
  } catch (error) {
    console.error(error);
    mostrarTostada('No se pudo guardar la palabra.');
  } finally {
    botonGuardar.disabled = false;
  }
});

async function cargarMisTerminos() {
  try {
    const [idiomas, aprendibles, terminos, progreso] = await Promise.all([
      obtenerIdiomas(),
      obtenerIdiomasAprendibles(),
      obtenerTerminos({ soloPropios: true }),
      obtenerProgreso(),
    ]);
    idiomaBase = idiomas.find((i) => !i.is_learnable)?.code || 'es';
    idiomasAprendibles = aprendibles;
    mapaProgreso = construirMapaProgreso(progreso);
    renderizarLista(terminos);
  } catch (error) {
    console.error(error);
    zonaMisTerminos.innerHTML = `
      <div class="estado estado--error">
        <span class="estado__icono">⚠️</span>
        <p>No se pudieron cargar tus palabras.</p>
      </div>`;
  }
}

function renderizarLista(terminos) {
  if (terminos.length === 0) {
    zonaMisTerminos.innerHTML = `
      <div class="estado">
        <span class="estado__icono">✏️</span>
        <p>Todavía no has añadido ninguna palabra propia.</p>
      </div>`;
    return;
  }

  const rejilla = document.createElement('div');
  rejilla.className = 'rejilla-terminos';
  for (const termino of terminos) {
    rejilla.appendChild(
      crearTarjetaTermino(termino, {
        idiomaBase,
        idiomasAprendibles,
        mapaProgreso,
        alCambiarProgreso: async (terminoId, idioma, aprendido) => {
          await marcarProgreso(terminoId, idioma, aprendido);
          mapaProgreso.set(`${terminoId}:${idioma ?? 'completo'}`, aprendido);
        },
        alEditar: cargarEnFormulario,
        alBorrar: async (terminoId) => {
          if (!confirm('¿Seguro que quieres borrar esta palabra?')) return;
          try {
            await borrarTermino(terminoId);
            mostrarTostada('Palabra borrada.');
            await cargarMisTerminos();
          } catch (error) {
            console.error(error);
            mostrarTostada('No se pudo borrar la palabra.');
          }
        },
      })
    );
  }
  zonaMisTerminos.innerHTML = '';
  zonaMisTerminos.appendChild(rejilla);
}

cargarMisTerminos();
