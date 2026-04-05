import { guardDashboard, subscribeAuthRedirect, logout } from '/shared/js/auth.js';
import {
  renderSidebarNav,
  setupAdminChrome,
  escapeHtml,
  formatDate,
  formatMoneyUSD,
  statusBadgeClass,
  statusLabel,
  PLAN_FEES_USD,
} from './admin-shared.js';

async function loadMetrics(supabase) {
  const totalQ = supabase.from('tenants').select('*', { count: 'exact', head: true });
  const activeQ = supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const profilesQ = supabase.from('profiles').select('*', { count: 'exact', head: true });
  const activeRowsQ = supabase
    .from('tenants')
    .select('plan')
    .eq('status', 'active');

  const [totalR, activeR, profilesR, activeRowsR] = await Promise.all([totalQ, activeQ, profilesQ, activeRowsQ]);

  if (totalR.error) throw totalR.error;
  if (activeR.error) throw activeR.error;
  if (profilesR.error) throw profilesR.error;
  if (activeRowsR.error) throw activeRowsR.error;

  const totalTenants = totalR.count ?? 0;
  const activeTenants = activeR.count ?? 0;
  const totalProfiles = profilesR.count ?? 0;

  let mrr = 0;
  for (const row of activeRowsR.data || []) {
    const p = row.plan;
    mrr += PLAN_FEES_USD[p] ?? 0;
  }

  return { totalTenants, activeTenants, totalProfiles, mrr };
}

async function loadRecentTenants(supabase) {
  const { data, error } = await supabase
    .from('tenants')
    .select('id, name, rif, plan, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data || [];
}

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
  subscribeAuthRedirect(ctx.supabase);

  const errEl = document.getElementById('err');

  try {
    const m = await loadMetrics(ctx.supabase);
    document.getElementById('metric-total-tenants').textContent = m.totalTenants;
    document.getElementById('metric-active-tenants').textContent = m.activeTenants;
    document.getElementById('metric-profiles').textContent = m.totalProfiles;
    document.getElementById('metric-mrr').textContent = formatMoneyUSD(m.mrr);

    const recent = await loadRecentTenants(ctx.supabase);
    renderRecentTable(recent);
  } catch (e) {
    const msg = e?.message || 'Error al cargar el panel';
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    }
  }
}

main();
