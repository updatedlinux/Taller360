export const LOGIN_URL = '/auth/login.html';

const TOKEN_KEY = 'taller360_access_token';

export const ROLE_DASHBOARD = {
  SUPERADMIN: '/admin/dashboard.html',
  OWNER: '/taller/dashboard.html',
  CLIENT: '/cliente/dashboard.html',
};

/** @param {string} role */
export function getDashboardPathForRole(role) {
  return ROLE_DASHBOARD[role] || null;
}

function apiBase() {
  const b = (window.TALLER360 && window.TALLER360.API_BASE) || '';
  return String(b).replace(/\/$/, '') || window.location.origin;
}

/**
 * @param {{ message?: string; status?: number }} error
 */
export function mapLoginErrorMessage(error) {
  const m = error && (error.message || String(error));
  if (!m) {
    return 'No pudimos iniciar sesión. Intenta de nuevo.';
  }
  const lower = m.toLowerCase();
  if (lower.includes('invalid') && lower.includes('credential')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (lower.includes('too many')) {
    return 'Demasiados intentos. Espera unos minutos.';
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Error de red. Comprueba tu conexión y que la API esté en marcha.';
  }
  return m;
}

export const PROFILE_MISSING_MESSAGE =
  'No hay perfil asociado a tu usuario. Contacte al administrador.';

/**
 * Cierra sesión y redirige al login.
 */
export async function logout() {
  try {
    await fetch(`${apiBase()}/api/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
  window.location.replace(LOGIN_URL);
}

/**
 * Contexto de autenticación: token + perfil vía API.
 */
export async function getAuthContext() {
  let token;
  try {
    token = sessionStorage.getItem(TOKEN_KEY);
  } catch {
    token = null;
  }
  if (!token) {
    return { ok: false, reason: 'no_session' };
  }

  const res = await fetch(`${apiBase()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (res.status === 401) {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    return { ok: false, reason: 'no_session' };
  }

  const json = await res.json().catch(() => null);
  if (!json || !json.ok || !json.profile) {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    return { ok: false, reason: 'no_profile' };
  }

  return {
    ok: true,
    accessToken: token,
    profile: json.profile,
    user: json.user,
  };
}

/**
 * Si ya hay sesión válida + perfil, redirige al dashboard del rol.
 * @returns {Promise<boolean>} true si redirigió
 */
export async function redirectIfAuthenticated() {
  const ctx = await getAuthContext();
  if (!ctx.ok) {
    return false;
  }
  const path = getDashboardPathForRole(ctx.profile.role);
  if (path) {
    window.location.replace(path);
    return true;
  }
  return false;
}

/**
 * Login contra API local + guardado de token + redirección.
 * @returns {Promise<{ ok: true, redirect: string } | { ok: false, message: string }>}
 */
export async function signInAndRedirectByRole(email, password) {
  let res;
  try {
    res = await fetch(`${apiBase()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    return { ok: false, message: mapLoginErrorMessage(e) };
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, message: json.error || mapLoginErrorMessage({ message: res.statusText }) };
  }
  if (!json.token || !json.profile) {
    return { ok: false, message: 'Respuesta de login inválida.' };
  }

  try {
    sessionStorage.setItem(TOKEN_KEY, json.token);
  } catch {
    /* ignore */
  }

  const redirect = getDashboardPathForRole(json.profile.role);
  if (!redirect) {
    await logout();
    return { ok: false, message: 'Tu rol no tiene portal asignado.' };
  }

  return { ok: true, redirect };
}

/**
 * Protege una página de dashboard: sesión, perfil y rol permitido.
 * @param {object} opts
 * @param {string[]} opts.allowedRoles
 * @returns {Promise<null | object>} null si hubo redirección
 */
export async function guardDashboard({ allowedRoles }) {
  const ctx = await getAuthContext();

  if (!ctx.ok) {
    if (ctx.reason === 'no_profile') {
      try {
        sessionStorage.setItem('taller360_auth_flash', PROFILE_MISSING_MESSAGE);
      } catch {
        /* ignore */
      }
    }
    window.location.replace(LOGIN_URL);
    return null;
  }

  if (!allowedRoles.includes(ctx.profile.role)) {
    const dest = getDashboardPathForRole(ctx.profile.role) || LOGIN_URL;
    window.location.replace(dest);
    return null;
  }

  return ctx;
}

/**
 * Reservado para futuros listeners de sesión; con JWT local no hay evento cross-tab estándar.
 * @param {unknown} _unused
 */
export function subscribeAuthRedirect(_unused) {
  /* no-op */
}

export function getOwnerDashboardMock() {
  return {
    clients: [],
    vehicles: [],
    orders: [],
    mock: true,
  };
}

export async function loadOwnerTenantData(accessToken) {
  const { apiJson } = await import('./api.js');
  try {
    const [rc, rv, ro] = await Promise.all([
      apiJson('/api/taller/clients', accessToken),
      apiJson('/api/taller/vehicles', accessToken),
      apiJson('/api/taller/work-orders', accessToken),
    ]);
    return {
      clients: rc.data || [],
      vehicles: rv.data || [],
      orders: ro.data || [],
      mock: false,
    };
  } catch (e) {
    if (e.status === 401) {
      await logout();
      return null;
    }
    return Object.assign(getOwnerDashboardMock(), { error: e });
  }
}

export async function loadClientPortalData(ctx) {
  const { apiJson } = await import('./api.js');
  try {
    const me = await apiJson('/api/cliente/me', ctx.accessToken);
    const vehiclesPayload = await apiJson('/api/cliente/vehicles', ctx.accessToken);
    return {
      clientRow: me.data,
      vehicles: vehiclesPayload.data || [],
    };
  } catch (e) {
    if (e.status === 401) {
      await logout();
      return null;
    }
    throw e;
  }
}

export async function loadSuperAdminData(accessToken) {
  const { apiJson } = await import('./api.js');
  try {
    const dash = await apiJson('/api/admin/dashboard', accessToken);
    const tenants = await apiJson('/api/admin/tenants?page=0&pageSize=500&status=all', accessToken);
    return {
      dashboard: dash.data,
      tenants: tenants.data || [],
    };
  } catch (e) {
    if (e.status === 401) {
      await logout();
      return null;
    }
    throw e;
  }
}
