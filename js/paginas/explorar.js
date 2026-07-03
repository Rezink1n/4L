// Lógica de la página "Explorar": filtros por nivel/origen, búsqueda y
// renderizado de la rejilla de tarjetas de término.
import { supabase } from '../supabaseClient.js';
import { exigirSesion, aplicarTemaGuardado } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { crearTarjetaTermino } from '../componentes/tarjetaTermino.js';
import { obtenerIdiomas, obtenerIdiomasAprendibles } from '../api/idiomas.js';
import { obtenerTerminos } from '../api/terminos.js';
import { obtenerProgreso, marcarProgreso, construirMapaProgreso } from '../api/progreso.js';

aplicarTemaGuardado();
await exigirSesion(supabase);
await iniciarNavegacion('index.html');

const zonaResultados = document.getElementById('zona-resultados');
const campoBusqueda = document.getElementById('campo-busqueda');

let terminos = [];
let mapaProgreso = new Map();
let idiomaBase = 'es';
let idiomasAprendibles = [];

let filtroNivel = '';
let filtroOrigen = 'todos';
let textoBusqueda = '';

async function cargarTodo() {
  try {
    const [idiomas, aprendibles, listaTerminos, progreso] = await Promise.all([
      obtenerIdiomas(),
      obtenerIdiomasAprendibles(),
      obtenerTerminos(),
      obtenerProgreso(),
    ]);
    idiomaBase = idiomas.find((i) => !i.is_learnable)?.code || 'es';
    idiomasAprendibles = aprendibles;
    terminos = listaTerminos;
    mapaProgreso = construirMapaProgreso(progreso);
    renderizar();
  } catch (error) {
    console.error(error);
    zonaResultados.innerHTML = `
      <div class="estado estado--error">
        <span class="estado__icono">⚠️</span>
        <p>No se pudo cargar el vocabulario. Comprueba tu conexión e inténtalo de nuevo.</p>
      </div>`;
  }
}

function terminoCoincideBusqueda(termino, texto) {
  if (!texto) return true;
  const normalizado = texto.toLowerCase();
  if ((termino.category || '').toLowerCase().includes(normalizado)) return true;
  return termino.translations.some((t) => t.text.toLowerCase().includes(normalizado));
}

function renderizar() {
  const filtrados = terminos.filter((termino) => {
    if (filtroNivel && termino.level !== filtroNivel) return false;
    if (filtroOrigen === 'oficial' && !termino.is_official) return false;
    if (filtroOrigen === 'propio' && termino.is_official) return false;
    if (!terminoCoincideBusqueda(termino, textoBusqueda)) return false;
    return true;
  });

  if (filtrados.length === 0) {
    zonaResultados.innerHTML = `
      <div class="estado">
        <span class="estado__icono">🔍</span>
        <p>No hay ningún término que coincida con estos filtros.</p>
      </div>`;
    return;
  }

  const rejilla = document.createElement('div');
  rejilla.className = 'rejilla-terminos';
  for (const termino of filtrados) {
    rejilla.appendChild(
      crearTarjetaTermino(termino, {
        idiomaBase,
        idiomasAprendibles,
        mapaProgreso,
        alCambiarProgreso: async (terminoId, idioma, aprendido) => {
          await marcarProgreso(terminoId, idioma, aprendido);
          mapaProgreso.set(`${terminoId}:${idioma ?? 'completo'}`, aprendido);
        },
      })
    );
  }
  zonaResultados.innerHTML = '';
  zonaResultados.appendChild(rejilla);
}

// --- Filtros de nivel y origen (chips de un solo valor por grupo) ---
function configurarGrupoFiltros(idGrupo, atributo, alSeleccionar) {
  const grupo = document.getElementById(idGrupo);
  grupo.addEventListener('click', (evento) => {
    const chip = evento.target.closest('.chip-filtro');
    if (!chip) return;
    grupo.querySelectorAll('.chip-filtro').forEach((c) => c.classList.remove('activo'));
    chip.classList.add('activo');
    alSeleccionar(chip.dataset[atributo]);
    renderizar();
  });
}

configurarGrupoFiltros('filtros-nivel', 'nivel', (valor) => (filtroNivel = valor));
configurarGrupoFiltros('filtros-origen', 'origen', (valor) => (filtroOrigen = valor));

let temporizadorBusqueda;
campoBusqueda.addEventListener('input', (evento) => {
  clearTimeout(temporizadorBusqueda);
  temporizadorBusqueda = setTimeout(() => {
    textoBusqueda = evento.target.value.trim();
    renderizar();
  }, 200);
});

cargarTodo();
