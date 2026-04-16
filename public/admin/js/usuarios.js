import { guardDashboard, subscribeAuthRedirect, logout } from '/shared/js/auth.js';
import { apiJson } from '/shared/js/api.js';
import {
  renderSidebarNav,
  setupAdminChrome,
  escapeHtml,
  formatDate,
  roleBadgeClass,
  showToast,
} from './admin-shared.js';

let allRows = [];

async function loadProfiles(accessToken) {
  const res = await apiJson('/api/admin/profiles', accessToken);
  return Array.isArray(res.data) ? res.data : [];
}

function renderTable(filterRole) {
  const tb = document.getElementById('tbody-usuarios');
  const rows = filterRole === 'all' ? allRows : allRows.filter((r) => r.role === filterRole);

  if (!rows.length) {
    tb.innerHTML =
      '<tr><td colspan="5" class="px-4 py-10 text-center text-slate-500">No hay usuarios con este filtro.</td></tr>';
    return;
  }

  tb.innerHTML = rows
    .map(
      (r) => `
    <tr class="border-b border-slate-700/60 transition hover:bg-slate-800/40">
      <td class="px-4 py-3 font-medium text-slate-100">${escapeHtml(r.full_name)}</td>
      <td class="px-4 py-3 text-slate-400">${escapeHtml(r.email || '—')}</td>
      <td class="px-4 py-3">
        <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${roleBadgeClass(r.role)}">${escapeHtml(r.role)}</span>
      </td>
      <td class="px-4 py-3 text-slate-400">${escapeHtml(r.tenant_name || '—')}</td>
      <td class="px-4 py-3 text-slate-500">${escapeHtml(formatDate(r.created_at))}</td>
    </tr>`,
    )
    .join('');
}

async function main() {
  const ctx = await guardDashboard({ allowedRoles: ['SUPERADMIN'] });
  if (!ctx) return;

  document.getElementById('sidebar-nav-mount').innerHTML = renderSidebarNav('usuarios', ctx.profile.full_name);
  document.getElementById('header-user-name').textContent = ctx.profile.full_name;
  setupAdminChrome();
  document.getElementById('btn-admin-logout')?.addEventListener('click', () => logout());
  subscribeAuthRedirect(null);

  const errEl = document.getElementById('err');
  const toast = document.getElementById('toast');

  try {
    allRows = await loadProfiles(ctx.accessToken);
    renderTable('all');
  } catch (e) {
    const msg = e?.message || 'Error al cargar usuarios';
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    }
    showToast(toast, msg, 'error');
  }

  document.getElementById('filter-role')?.addEventListener('change', (e) => {
    renderTable(e.target.value);
  });
}

main();
