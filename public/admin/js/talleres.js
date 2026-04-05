import { guardDashboard, subscribeAuthRedirect, logout } from '/shared/js/auth.js';
import {
  renderSidebarNav,
  setupAdminChrome,
  escapeHtml,
  formatDate,
  statusBadgeClass,
  statusLabel,
  showToast,
} from './admin-shared.js';

const PAGE_SIZE = 10;

function ilikeOrFilter(searchRaw) {
  const t = String(searchRaw || '')
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
  if (!t) return null;
  return `name.ilike.%${t}%,rif.ilike.%${t}%`;
}

let state = {
  page: 0,
  status: 'all',
  search: '',
  totalCount: 0,
};

let ctxRef = null;

function buildQuery(supabase) {
  let q = supabase.from('tenants').select('*', { count: 'exact' });
  if (state.status !== 'all') {
    q = q.eq('status', state.status);
  }
  const orF = ilikeOrFilter(state.search);
  if (orF) {
    q = q.or(orF);
  }
  const from = state.page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  return q.order('created_at', { ascending: false }).range(from, to);
}

async function refreshTable() {
  const supabase = ctxRef.supabase;
  const tb = document.getElementById('tbody-tenants');
  const meta = document.getElementById('pagination-meta');
  const errEl = document.getElementById('err');
  const toast = document.getElementById('toast');

  if (errEl) {
    errEl.classList.add('hidden');
    errEl.textContent = '';
  }

  const { data, error, count } = await buildQuery(supabase);
  if (error) {
    const msg = error.message || 'Error al cargar talleres';
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    }
    showToast(toast, msg, 'error');
    return;
  }

  state.totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(state.totalCount / PAGE_SIZE));
  if (state.page >= totalPages) {
    state.page = Math.max(0, totalPages - 1);
    return refreshTable();
  }

  if (meta) {
    const start = state.totalCount === 0 ? 0 : state.page * PAGE_SIZE + 1;
    const end = Math.min(state.totalCount, (state.page + 1) * PAGE_SIZE);
    meta.textContent = `${start}–${end} de ${state.totalCount}`;
  }

  const rows = data || [];
  if (!rows.length) {
    tb.innerHTML =
      '<tr><td colspan="7" class="px-4 py-10 text-center text-slate-500">No hay resultados con los filtros actuales.</td></tr>';
  } else {
    tb.innerHTML = rows
      .map(
        (t) => `
      <tr class="border-b border-slate-700/60 transition hover:bg-slate-800/40" data-tenant-id="${t.id}">
        <td class="px-4 py-3 font-medium text-slate-100">${escapeHtml(t.name)}</td>
        <td class="px-4 py-3 text-slate-400">${escapeHtml(t.rif || '—')}</td>
        <td class="px-4 py-3 text-slate-300">${escapeHtml(t.plan)}</td>
        <td class="px-4 py-3">
          <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(t.status)}">${escapeHtml(statusLabel(t.status))}</span>
        </td>
        <td class="px-4 py-3 text-xs text-slate-500">${escapeHtml(t.owner_email || '—')}</td>
        <td class="px-4 py-3 text-slate-400">${escapeHtml(formatDate(t.created_at))}</td>
        <td class="px-4 py-3 text-right">
          <div class="flex flex-wrap justify-end gap-1">
            <button type="button" class="rounded-lg bg-slate-700 px-2 py-1 text-xs font-medium text-white hover:bg-slate-600" data-action="view" data-id="${t.id}">Ver</button>
            ${
              t.status === 'active'
                ? `<button type="button" class="rounded-lg bg-amber-600/90 px-2 py-1 text-xs font-medium text-white hover:bg-amber-500" data-action="suspend" data-id="${t.id}">Suspender</button>`
                : `<button type="button" class="rounded-lg bg-emerald-600/90 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-500" data-action="activate" data-id="${t.id}">Activar</button>`
            }
          </div>
        </td>
      </tr>`,
      )
      .join('');
  }

  document.getElementById('btn-prev')?.toggleAttribute('disabled', state.page <= 0);
  document.getElementById('btn-next')?.toggleAttribute('disabled', state.page >= totalPages - 1);
}

function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
  document.getElementById(id)?.classList.add('flex');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('hidden');
  el.classList.remove('flex');
}

function fillDetailModal(t) {
  document.getElementById('detail-name').textContent = t.name || '—';
  document.getElementById('detail-rif').textContent = t.rif || '—';
  document.getElementById('detail-plan').textContent = t.plan || '—';
  document.getElementById('detail-status').textContent = statusLabel(t.status);
  document.getElementById('detail-owner-email').textContent = t.owner_email || '—';
  document.getElementById('detail-phone').textContent = t.phone || '—';
  document.getElementById('detail-address').textContent = t.address || '—';
  document.getElementById('detail-created').textContent = formatDate(t.created_at);
  document.getElementById('detail-id').textContent = t.id || '—';
  document.getElementById('detail-owner-id').textContent = t.owner_id || '—';
}

async function loadTenantById(supabase, id) {
  const { data, error } = await supabase.from('tenants').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

async function main() {
  const ctx = await guardDashboard({ allowedRoles: ['SUPERADMIN'] });
  if (!ctx) return;
  ctxRef = ctx;

  document.getElementById('sidebar-nav-mount').innerHTML = renderSidebarNav('talleres', ctx.profile.full_name);
  document.getElementById('header-user-name').textContent = ctx.profile.full_name;
  setupAdminChrome();
  document.getElementById('btn-admin-logout')?.addEventListener('click', () => logout());
  subscribeAuthRedirect(ctx.supabase);

  const toast = document.getElementById('toast');

  document.getElementById('btn-open-register')?.addEventListener('click', () => {
    document.getElementById('form-register-tenant')?.reset();
    openModal('modal-register');
  });
  document.getElementById('modal-register-cancel')?.addEventListener('click', () => closeModal('modal-register'));
  document.getElementById('modal-detail-close')?.addEventListener('click', () => closeModal('modal-detail'));

  document.getElementById('filter-status')?.addEventListener('change', (e) => {
    state.status = e.target.value;
    state.page = 0;
    refreshTable();
  });

  let searchTimer;
  document.getElementById('filter-search')?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.search = e.target.value;
      state.page = 0;
      refreshTable();
    }, 350);
  });

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    if (state.page > 0) {
      state.page -= 1;
      refreshTable();
    }
  });
  document.getElementById('btn-next')?.addEventListener('click', () => {
    state.page += 1;
    refreshTable();
  });

  document.getElementById('tbody-tenants')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (!id) return;

    if (action === 'view') {
      try {
        const row = await loadTenantById(ctx.supabase, id);
        if (!row) {
          showToast(toast, 'Taller no encontrado', 'error');
          return;
        }
        fillDetailModal(row);
        openModal('modal-detail');
      } catch (err) {
        showToast(toast, err.message || 'Error', 'error');
      }
      return;
    }

    if (action === 'suspend' || action === 'activate') {
      const status = action === 'suspend' ? 'suspended' : 'active';
      const { error } = await ctx.supabase.from('tenants').update({ status }).eq('id', id);
      if (error) {
        showToast(toast, error.message, 'error');
        return;
      }
      showToast(toast, 'Estado actualizado', 'ok');
      refreshTable();
    }
  });

  document.getElementById('form-register-tenant')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get('name') || '').trim();
    const rif = String(fd.get('rif') || '').trim() || null;
    const phone = String(fd.get('phone') || '').trim() || null;
    const owner_email = String(fd.get('owner_email') || '').trim() || null;
    const address = String(fd.get('address') || '').trim() || null;
    const plan = String(fd.get('plan') || 'basic');

    if (!name) {
      showToast(toast, 'El nombre del taller es obligatorio', 'error');
      return;
    }

    const payload = {
      name,
      rif,
      plan,
      status: 'pending',
      owner_id: null,
    };
    if (phone !== null) payload.phone = phone;
    if (owner_email !== null) payload.owner_email = owner_email;
    if (address !== null) payload.address = address;

    const { error } = await ctx.supabase.from('tenants').insert(payload);
    if (error) {
      showToast(toast, error.message || 'No se pudo registrar', 'error');
      return;
    }
    closeModal('modal-register');
    showToast(toast, 'Taller registrado como pendiente.', 'ok');
    state.page = 0;
    refreshTable();
  });

  await refreshTable();

  const viewId = new URLSearchParams(window.location.search).get('view');
  if (viewId) {
    try {
      const row = await loadTenantById(ctx.supabase, viewId);
      if (row) {
        fillDetailModal(row);
        openModal('modal-detail');
      }
    } catch {
      /* ignore */
    }
  }
}

main();
