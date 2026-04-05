/** Tarifas mensuales estimadas por plan (USD) */
export const PLAN_FEES_USD = { basic: 10, pro: 20 };

/**
 * @param {string} active - 'dashboard' | 'talleres' | 'usuarios'
 * @param {string} displayName
 */
export function renderSidebarNav(active, displayName) {
  const item = (key, href, iconSvg, label, disabled) => {
    const isOn = active === key;
    const base =
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors';
    const on = isOn
      ? 'bg-blue-600/25 text-blue-300 ring-1 ring-blue-500/40'
      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white';
    const dis = disabled ? ' cursor-not-allowed opacity-45 pointer-events-none' : '';
    return `
      <a href="${href}" class="${base} ${on}${dis}" data-nav="${key}" aria-current="${isOn ? 'page' : 'false'}">
        ${iconSvg}
        <span class="sidebar-label truncate">${label}</span>
      </a>`;
  };

  const icons = {
    grid: `<svg class="h-5 w-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`,
    building: `<svg class="h-5 w-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
    users: `<svg class="h-5 w-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    card: `<svg class="h-5 w-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`,
    clipboard: `<svg class="h-5 w-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
    cog: `<svg class="h-5 w-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    logout: `<svg class="h-5 w-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>`,
    wrench: `<svg class="h-5 w-5 shrink-0 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>`,
  };

  return `
    <div class="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800/80 px-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700">${icons.wrench}</div>
      <div class="min-w-0 leading-tight">
        <p class="truncate font-semibold text-white">Taller360</p>
        <p class="text-xs text-slate-500">Super Admin</p>
      </div>
    </div>
    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      ${item('dashboard', '/admin/dashboard.html', icons.grid, 'Dashboard', false)}
      ${item('talleres', '/admin/talleres.html', icons.building, 'Talleres', false)}
      ${item('usuarios', '/admin/usuarios.html', icons.users, 'Usuarios', false)}
      ${item('billing', '#', icons.card, 'Planes & Facturación', true)}
      ${item('audit', '#', icons.clipboard, 'Auditoría', true)}
      ${item('settings', '#', icons.cog, 'Configuración', true)}
    </nav>
    <div class="border-t border-slate-800/80 p-3">
      <p class="mb-2 truncate px-1 text-xs text-slate-500 sidebar-label" title="${escapeHtml(displayName)}">${escapeHtml(displayName)}</p>
      <button type="button" id="btn-admin-logout" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-rose-500/15 hover:text-rose-300">
        ${icons.logout}
        <span class="sidebar-label">Cerrar sesión</span>
      </button>
    </div>`;
}

export function escapeHtml(s) {
  if (s == null || s === '') return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-VE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatMoneyUSD(n) {
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(n);
}

/**
 * @param {string} status
 */
export function statusBadgeClass(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'active') return 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30';
  if (s === 'suspended') return 'bg-red-500/20 text-red-300 ring-1 ring-red-500/30';
  if (s === 'pending') return 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/25';
  return 'bg-slate-600/30 text-slate-300 ring-1 ring-slate-500/30';
}

export function statusLabel(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'active') return 'Activo';
  if (s === 'suspended') return 'Suspendido';
  if (s === 'pending') return 'Pendiente';
  return status || '—';
}

export function roleBadgeClass(role) {
  const r = String(role || '');
  if (r === 'SUPERADMIN') return 'bg-violet-500/20 text-violet-200 ring-violet-500/30';
  if (r === 'OWNER') return 'bg-blue-500/20 text-blue-200 ring-blue-500/30';
  if (r === 'CLIENT') return 'bg-teal-500/20 text-teal-200 ring-teal-500/30';
  return 'bg-slate-600/30 text-slate-300';
}

/**
 * Sidebar móvil + colapsar etiquetas
 */
export function setupAdminChrome() {
  const sidebar = document.getElementById('admin-sidebar');
  const backdrop = document.getElementById('admin-sidebar-backdrop');
  const openBtn = document.getElementById('btn-sidebar-open');
  const closeBtn = document.getElementById('btn-sidebar-close');

  function open() {
    sidebar?.classList.remove('-translate-x-full');
    backdrop?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
  function close() {
    sidebar?.classList.add('-translate-x-full');
    backdrop?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) close();
  });

}

export function showToast(el, message, variant) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden', 'bg-rose-500/20', 'text-rose-200', 'bg-emerald-500/20', 'text-emerald-200');
  if (variant === 'error') {
    el.classList.add('bg-rose-500/20', 'text-rose-200');
  } else {
    el.classList.add('bg-emerald-500/20', 'text-emerald-200');
  }
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 5000);
}
