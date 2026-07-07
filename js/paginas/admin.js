// Lógica del panel de administración: listado de usuarios y cambio de rol.
// Solo accesible para admin/moderador (el propio backend impide que un
// "estudiante" llame a admin_listar_usuarios: ver supabase/schema.sql).
import { supabase } from '../supabaseClient.js';
import { exigirSesionYAjustes, aplicarTemaGuardado, mostrarTostada, escaparHtml } from '../utils.js';
import { iniciarNavegacion } from '../componentes/navegacion.js';
import { obtenerMiRol } from '../api/roles.js';
import { listarUsuarios, actualizarRolUsuario } from '../api/admin.js';
import { t } from '../i18n.js';

aplicarTemaGuardado();
const ajustes = await exigirSesionYAjustes(supabase);
if (ajustes) {
  const miRol = await obtenerMiRol();
  const zonaAdmin = document.getElementById('zona-admin');

  if (miRol !== 'admin' && miRol !== 'moderador') {
    zonaAdmin.innerHTML = `
      <div class="estado estado--error">
        <span class="estado__icono">🚫</span>
        <p>${t('admin_no_autorizado')}</p>
      </div>`;
    await iniciarNavegacion('admin.html');
  } else {
    await iniciarNavegacion('admin.html');
    const puedeEditarRoles = miRol === 'admin';

    function formatearFecha(iso) {
      if (!iso) return t('admin_nunca');
      return new Date(iso).toLocaleDateString();
    }

    async function cargarUsuarios() {
      try {
        const usuarios = await listarUsuarios();
        zonaAdmin.innerHTML = `
          <div class="tabla-admin-wrap">
            <table class="tabla-admin">
              <thead>
                <tr>
                  <th></th>
                  <th>${t('admin_col_usuario')}</th>
                  <th>${t('admin_col_email')}</th>
                  <th>${t('admin_col_rol')}</th>
                  <th>${t('admin_col_plan')}</th>
                  <th>${t('admin_col_alta')}</th>
                  <th>${t('admin_col_ultima_entrada')}</th>
                </tr>
              </thead>
              <tbody>
                ${usuarios
                  .map(
                    (usuario) => `
                  <tr data-user-id="${usuario.user_id}">
                    <td>${usuario.avatar_url ? `<img src="${usuario.avatar_url}" alt="" />` : '👤'}</td>
                    <td>${escaparHtml(usuario.display_name || '—')}</td>
                    <td>${escaparHtml(usuario.email)}</td>
                    <td>
                      ${
                        puedeEditarRoles
                          ? `<select class="select-rol">
                              <option value="estudiante" ${usuario.role === 'estudiante' ? 'selected' : ''}>estudiante</option>
                              <option value="moderador" ${usuario.role === 'moderador' ? 'selected' : ''}>moderador</option>
                              <option value="admin" ${usuario.role === 'admin' ? 'selected' : ''}>admin</option>
                            </select>`
                          : escaparHtml(usuario.role)
                      }
                    </td>
                    <td>${escaparHtml(usuario.plan)} (${escaparHtml(usuario.estado_plan)})</td>
                    <td>${formatearFecha(usuario.created_at)}</td>
                    <td>${formatearFecha(usuario.last_sign_in_at)}</td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>`;

        if (puedeEditarRoles) {
          zonaAdmin.querySelectorAll('.select-rol').forEach((select) => {
            select.addEventListener('change', async () => {
              const fila = select.closest('tr');
              const userId = fila.dataset.userId;
              select.disabled = true;
              try {
                await actualizarRolUsuario(userId, select.value);
                mostrarTostada(t('admin_toast_rol_actualizado'));
              } catch (error) {
                console.error(error);
                mostrarTostada(t('admin_toast_error_rol'));
              } finally {
                select.disabled = false;
              }
            });
          });
        }
      } catch (error) {
        console.error(error);
        zonaAdmin.innerHTML = `
          <div class="estado estado--error">
            <span class="estado__icono">⚠️</span>
            <p>${t('admin_error_cargar')}</p>
          </div>`;
      }
    }

    cargarUsuarios();
  }
}
