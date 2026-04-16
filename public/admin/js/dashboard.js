import { guardDashboard, subscribeAuthRedirect, logout } from '/shared/js/auth.js';
import { apiJson } from '/shared/js/api.js';
import {
  renderSidebarNav,
  setupAdminChrome,
  escapeHtml,
  formatDate,
  formatMoneyUSD,
  statusBadgeClass,
  statusLabel,
} from './admin-shared.js';

function renderRecentTable(rows) {
  const tb = document.getElementById('tbody-recent');
  if (!tb) return;
  if (!rows.length) {
    tb.innerHTML =
      '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500">No hay talleres registrados.</td></tr>';
    return;
  }
  tb.innerHTML = rows
    .map(
      (t) => `
    <tr class="border-b border-slate-700/60 transition hover:bg-slate-800/40">
      <td class="px-4 py-3 font-medium text-slate-100">${escapeHtml(t.name)}</td>
      <td class="px-4 py-3 text-slate-400">${escapeHtml(t.rif || '—')}</td>
      <td class="px-4 py-3"><span class="rounded-md bg-slate-700/80 px-2 py-0.5 text-xs uppercase text-slate-200">${escapeHtml(t.plan)}</span></td>
      <td class="px-4 py-3">
        <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(t.status)}">${escapeHtml(statusLabel(t.status))}</span>
      </td>
      <td class="px-4 py-3 text-slate-400">${escapeHtml(formatDate(t.created_at))}</td>
      <td class="px-4 py-3 text-right">
        <a href="/admin/talleres.html?view=${encodeURIComponent(t.id)}" class="text-sm font-medium text-blue-400 hover:text-blue-300">Ver / Editar</a>
      </td>
    </tr>`,
    )
    .join('');
}

async function main() {
  const ctx = await guardDashboard({ allowedRoles: ['SUPERADMIN'] });
  if (!ctx) return;

  document.getElementById('sidebar-nav-mount').innerHTML = renderSidebarNav('dashboard', ctx.profile.full_name);
  document.getElementById('header-user-name').textContent = ctx.profile.full_name;
  setupAdminChrome();
  document.getElementById('btn-admin-logout')?.addEventListener('click', () => logout());
  subscribeAuthRedirect(null);

  const errEl = document.getElementById('err');

  try {
    const dash = await apiJson('/api/admin/dashboard', ctx.accessToken);
    const m = dash.data || {};
    document.getElementById('metric-total-tenants').textContent = m.tenantsTotal ?? '—';
    document.getElementById('metric-active-tenants').textContent = m.tenantsActive ?? '—';
    document.getElementById('metric-profiles').textContent = m.totalProfiles ?? '—';
    document.getElementById('metric-mrr').textContent = formatMoneyUSD(m.mrr ?? 0);

    const recentJson = await apiJson('/api/admin/dashboard/recent-tenants', ctx.accessToken);
    renderRecentTable(recentJson.data || []);
  } catch (e) {
    const msg = e?.message || 'Error al cargar el panel';
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    }
  }
}

main();
