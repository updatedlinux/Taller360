import { getSupabase } from './supabase-client.js';

export const LOGIN_URL = '/auth/login.html';

export const ROLE_DASHBOARD = {
  SUPERADMIN: '/admin/dashboard.html',
  OWNER: '/taller/dashboard.html',
  CLIENT: '/cliente/dashboard.html',
};

/** @param {string} role */
export function getDashboardPathForRole(role) {
  return ROLE_DASHBOARD[role] || null;
}

/**
 * Mensajes amigables para errores de login (Supabase Auth).
 * @param {{ message?: string; status?: number }} error
 */
export function mapLoginErrorMessage(error) {
  const m = error && (error.message || String(error));
  if (!m) {
    return 'No pudimos iniciar sesión. Intenta de nuevo.';
  }
  const lower = m.toLowerCase();
  if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Debes confirmar tu correo antes de entrar.';
  }
  if (lower.includes('too many requests')) {
    return 'Demasiados intentos. Espera unos minutos.';
  }
  if (lower.includes('network')) {
    return 'Error de red. Comprueba tu conexión.';
  }
  if (
    lower.includes('failed to fetch') ||
    lower === 'failed to fetch' ||
    lower.includes('load failed') ||
    lower.includes('networkerror')
  ) {
    return 'No pudimos conectar con el servicio de autenticación. Revisa SUPABASE_URL y la clave pública en config.js, tu red y la configuración del proyecto en Supabase.';
  }
  return m;
}

export const PROFILE_MISSING_MESSAGE =
  'Tu cuenta no tiene perfil en el sistema. Contacta al administrador del taller o a Arsys Intela. Se cerrará la sesión.';

/**
 * Cierra sesión Supabase y redirige al login.
 */
export async function logout() {
  try {
    const sb = getSupabase();
    await sb.auth.signOut();
  } catch {
    /* ignore */
  }
  window.location.replace(LOGIN_URL);
}

/**
 * Obtiene fila de public.profiles del usuario (RLS: solo la propia).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId - auth.users.id (ej. session.user.id)
 */
export async function fetchMyProfile(supabase, userId) {
  if (!userId) {
    return {
      profile: null,
      error: Object.assign(new Error('Falta el id de usuario para cargar el perfil.'), { code: 'MISSING_USER_ID' }),
    };
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('id, tenant_id, full_name, role, created_at')
    .eq('id', userId)
    .single();
  return { profile: data, error };
}

/**
 * Contexto de autenticación: sesión + perfil.
 * Si hay sesión pero no perfil → signOut y reason `no_profile`.
 */
export async function getAuthContext() {
  const supabase = getSupabase();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    return { ok: false, reason: 'session_error', supabase, sessionError };
  }
  if (!session || !session.access_token) {
    return { ok: false, reason: 'no_session', supabase };
  }

  const { profile, error: profileError } = await fetchMyProfile(supabase, session.user.id);

  if (profileError) {
    await supabase.auth.signOut();
    return { ok: false, reason: 'profile_fetch_error', supabase, profileError };
  }
  if (!profile) {
    await supabase.auth.signOut();
    return { ok: false, reason: 'no_profile', supabase };
  }

  return {
    ok: true,
    supabase,
    session,
    accessToken: session.access_token,
    profile,
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
 * Login: signInWithPassword + perfil + redirección.
 * @returns {Promise<{ ok: true, redirect: string } | { ok: false, message: string }>}
 */
export async function signInAndRedirectByRole(email, password) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    console.error('[Taller360 login] getSupabase falló', e);
    return {
      ok: false,
      message: e && e.message ? e.message : 'No se pudo inicializar el cliente de autenticación.',
    };
  }

  let signInResult;
  try {
    signInResult = await supabase.auth.signInWithPassword({ email, password });
  } catch (e) {
    console.error('[Taller360 login] signInWithPassword excepción', e);
    return { ok: false, message: mapLoginErrorMessage(e) };
  }

  console.log('[Taller360 login] signInWithPassword respuesta', {
    ok: !signInResult.error,
    errorMessage: signInResult.error ? signInResult.error.message : null,
  });

  if (signInResult.error) {
    return { ok: false, message: mapLoginErrorMessage(signInResult.error) };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return { ok: false, message: 'No se pudo obtener la sesión. Intenta de nuevo.' };
  }

  const { profile, error: pErr } = await fetchMyProfile(supabase, session.user.id);
  console.log('[Taller360 login] consulta profiles', {
    hasProfile: !!profile,
    profileRole: profile ? profile.role : null,
    profileError: pErr ? pErr.message : null,
  });

  if (pErr || !profile) {
    await supabase.auth.signOut();
    return { ok: false, message: PROFILE_MISSING_MESSAGE };
  }

  const redirect = getDashboardPathForRole(profile.role);
  if (!redirect) {
    await supabase.auth.signOut();
    return { ok: false, message: 'Tu rol no tiene portal asignado.' };
  }

  return { ok: true, redirect };
}

/**
 * Protege una página de dashboard: sesión, perfil y rol permitido.
 * Redirige a login o al dashboard correcto si el rol no coincide.
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
 * Escucha cierre de sesión y sesión inválida.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export function subscribeAuthRedirect(supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      window.location.replace(LOGIN_URL);
    }
  });
}

/**
 * Datos demo para KPIs del taller si la API falla.
 */
export function getOwnerDashboardMock() {
  return {
    clients: [],
    vehicles: [],
    orders: [],
    mock: true,
  };
}

/**
 * OWNER: clientes, vehículos y órdenes del tenant (API). Fallback mock.
 */
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

/**
 * CLIENT: fila en public.clients (por email de Auth + tenant del perfil) + vehículos vía API.
 */
export async function loadClientPortalData(ctx) {
  const { apiJson } = await import('./api.js');
  const email = (ctx.session && ctx.session.user && ctx.session.user.email && String(ctx.session.user.email).trim()) || '';
  if (!email) {
    throw new Error('No pudimos obtener el correo de tu cuenta.');
  }
  if (!ctx.profile.tenant_id) {
    throw new Error('Tu perfil no tiene taller asignado.');
  }
  const { data: clientRow, error } = await ctx.supabase
    .from('clients')
    .select('*')
    .eq('tenant_id', ctx.profile.tenant_id)
    .eq('email', email)
    .maybeSingle();
  if (error) {
    throw new Error(error.message || 'No se pudo cargar tu ficha de cliente.');
  }
  if (!clientRow) {
    throw new Error('No encontramos tu ficha de cliente en el taller. Contacta al dueño.');
  }
  let vehiclesPayload;
  try {
    vehiclesPayload = await apiJson('/api/cliente/vehicles', ctx.accessToken);
  } catch (e) {
    if (e.status === 401) {
      await logout();
      return null;
    }
    throw e;
  }
  return {
    clientRow,
    vehicles: vehiclesPayload.data || [],
  };
}

/**
 * SUPERADMIN: resumen + lista global de tenants.
 */
export async function loadSuperAdminData(accessToken) {
  const { apiJson } = await import('./api.js');
  try {
    const dash = await apiJson('/api/admin/dashboard', accessToken);
    const tenants = await apiJson('/api/admin/tenants', accessToken);
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
