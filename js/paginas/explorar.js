// Lógica de la página "Explorar": filtros por nivel/origen/categoría,
// búsqueda y renderizado de la rejilla de tarjetas de término, agrupadas por
// categoría.
import { supabase } from '../supabaseClient.js';
import { exigirSesionYAjustes, aplicarTemaGuardado } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { crearTarjetaTermino } from '../componentes/tarjetaTermino.js';
import { obtenerIdiomas } from '../api/idiomas.js';
import { obtenerTerminos } from '../api/terminos.js';
import { obtenerProgreso, marcarProgreso, construirMapaProgreso } from '../api/progreso.js';
import { t, nombreCategoria } from '../i18n.js';

// Orden preferido para mostrar las categorías; cualquier categoría que no
// aparezca aquí (p. ej. una categoría propia inventada por el usuario) se
// añade al final, por orden alfabético.
const ORDEN_CATEGORIAS = [
  'saludos', 'presentaciones', 'numeros', 'familia', 'colores', 'comida', 'verbos',
  'tiempo_fechas', 'cuerpo', 'lugares', 'transporte', 'animales', 'frases_utiles',
  'ropa', 'casa', 'clima', 'adjetivos', 'trabajo', 'salud', 'tecnologia', 'compras',
  'emociones', 'mis_palabras', 'general',
];

function ordenarCategorias(categorias) {
  return [...categorias].sort((a, b) => {
    const posA = ORDEN_CATEGORIAS.indexOf(a);
    const posB = ORDEN_CATEGORIAS.indexOf(b);
    if (posA === -1 && posB === -1) return a.localeCompare(b);
    if (posA === -1) return 1;
    if (posB === -1) return -1;
    return posA - posB;
  });
}

aplicarTemaGuardado();
const ajustes = await exigirSesionYAjustes(supabase);
if (ajustes) {
  await iniciarNavegacion('index.html');

  const zonaResultados = document.getElementById('zona-resultados');
  const campoBusqueda = document.getElementById('campo-busqueda');
  const filtrosCategoria = document.getElementById('filtros-categoria');

  let terminos = [];
  let mapaProgreso = new Map();
  const idiomaBase = ajustes.primary_language;
  let idiomasAprendibles = [];

  let filtroNivel = '';
  let filtroOrigen = 'todos';
  let filtroCategoria = '';
  let textoBusqueda = '';

  async function cargarTodo() {
    try {
      const [idiomas, listaTerminos, progreso] = await Promise.all([
        obtenerIdiomas(),
        obtenerTerminos(),
        obtenerProgreso(),
      ]);
      idiomasAprendibles = idiomas
        .filter((i) => ajustes.active_languages.includes(i.code))
        .sort((a, b) => a.sort_order - b.sort_order);
      terminos = listaTerminos;
      mapaProgreso = construirMapaProgreso(progreso);
      pintarChipsCategoria();
      renderizar();
    } catch (error) {
      console.error(error);
      zonaResultados.innerHTML = `
        <div class="estado estado--error">
          <span class="estado__icono">⚠️</span>
          <p>${t('explorar_error')}</p>
        </div>`;
    }
  }

  function pintarChipsCategoria() {
    const categorias = ordenarCategorias([...new Set(terminos.map((term) => term.category))]);
    const chipTodas = filtrosCategoria.querySelector('[data-categoria=""]');
    filtrosCategoria.innerHTML = '';
    filtrosCategoria.appendChild(chipTodas);
    for (const categoria of categorias) {
      const chip = document.createElement('button');
      chip.className = 'chip-filtro';
      chip.dataset.categoria = categoria;
      chip.textContent = nombreCategoria(categoria);
      filtrosCategoria.appendChild(chip);
    }
  }

  function terminoCoincideBusqueda(termino, texto) {
    if (!texto) return true;
    const normalizado = texto.toLowerCase();
    if ((termino.category || '').toLowerCase().includes(normalizado)) return true;
    return termino.translations.some((trad) => trad.text.toLowerCase().includes(normalizado));
  }

  function renderizar() {
    const filtrados = terminos.filter((termino) => {
      if (filtroNivel && termino.level !== filtroNivel) return false;
      if (filtroOrigen === 'oficial' && !termino.is_official) return false;
      if (filtroOrigen === 'propio' && termino.is_official) return false;
      if (filtroCategoria && termino.category !== filtroCategoria) return false;
      if (!terminoCoincideBusqueda(termino, textoBusqueda)) return false;
      return true;
    });

    if (filtrados.length === 0) {
      zonaResultados.innerHTML = `
        <div class="estado">
          <span class="estado__icono">🔍</span>
          <p>${t('explorar_sin_resultados')}</p>
        </div>`;
      return;
    }

    const porCategoria = new Map();
    for (const termino of filtrados) {
      if (!porCategoria.has(termino.category)) porCategoria.set(termino.category, []);
      porCategoria.get(termino.category).push(termino);
    }

    zonaResultados.innerHTML = '';
    for (const categoria of ordenarCategorias([...porCategoria.keys()])) {
      const seccion = document.createElement('section');
      seccion.style.marginBottom = 'var(--espacio-lg)';

      const titulo = document.createElement('h2');
      titulo.style.fontSize = '1.05rem';
      titulo.style.marginBottom = 'var(--espacio-sm)';
      titulo.textContent = nombreCategoria(categoria);
      seccion.appendChild(titulo);

      const rejilla = document.createElement('div');
      rejilla.className = 'rejilla-terminos';
      for (const termino of porCategoria.get(categoria)) {
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
      seccion.appendChild(rejilla);
      zonaResultados.appendChild(seccion);
    }
  }

  // --- Filtros de nivel, origen y categoría (chips de un solo valor por grupo) ---
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
  configurarGrupoFiltros('filtros-categoria', 'categoria', (valor) => (filtroCategoria = valor));

  let temporizadorBusqueda;
  campoBusqueda.addEventListener('input', (evento) => {
    clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = setTimeout(() => {
      textoBusqueda = evento.target.value.trim();
      renderizar();
    }, 200);
  });

  cargarTodo();
}
