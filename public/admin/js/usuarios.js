import { guardDashboard, subscribeAuthRedirect, logout } from '/shared/js/auth.js';
import {
  renderSidebarNav,
  setupAdminChrome,
  escapeHtml,
  formatDate,
  roleBadgeClass,
  showToast,
} from './admin-shared.js';

let allRows = [];
let rpcAvailable = true;

async function loadProfiles(supabase) {
  const rpc = await supabase.rpc('admin_profiles_list');
  if (!rpc.error) {
    rpcAvailable = true;
    return Array.isArray(rpc.data) ? rpc.data : [];
  }

  rpcAvailable = false;
  const fb = await supabase
    .from('profiles')
    .select('id, full_name, role, tenant_id, created_at, tenants(name)')
    .order('created_at', { ascending: false });

  if (fb.error) throw fb.error;
  return (fb.data || []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    role: p.role,
    tenant_id: p.tenant_id,
    tenant_name: p.tenants && p.tenants.name ? p.tenants.name : null,
    email: '',
    created_at: p.created_at,
  }));
}

function renderTable(filterRole) {
  const tb = document.getElementById('tbody-usuarios');
  const hint = document.getElementById('email-hint');
  if (hint) {
    hint.classList.toggle('hidden', rpcAvailable);
  }

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
  subscribeAuthRedirect(ctx.supabase);

  const errEl = document.getElementById('err');
  const toast = document.getElementById('toast');

  try {
    allRows = await loadProfiles(ctx.supabase);
    document.getElementById('filter-role')?.addEventListener('change', (e) => {
      renderTable(e.target.value);
    });
    renderTable('all');
  } catch (e) {
    const msg = e?.message || 'Error al cargar usuarios';
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    }
    showToast(toast, msg, 'error');
  }
}

main();
