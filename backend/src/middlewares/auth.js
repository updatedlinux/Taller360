const { supabase, createUserClient } = require('../config/supabase');
const { httpError } = require('./errorHandler');
const { assertNoAuthError } = require('../utils/supabaseHelpers');

/**
 * Verifica Authorization: Bearer con supabase.auth.getUser(token).
 * Expone req.user (incl. tenant_id) y req.profile (mismo perfil, compatibilidad).
 * @type {import('express').RequestHandler}
 */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw httpError(401, 'Token requerido');
    }
    const token = header.slice(7).trim();
    if (!token) {
      throw httpError(401, 'Token vacío');
    }

    const userResult = await supabase.auth.getUser(token);
    assertNoAuthError(userResult, 401);
    const authUser = userResult.data.user;
    if (!authUser) {
      throw httpError(401, 'Sesión inválida o expirada');
    }

    const sb = createUserClient(token);
    const profileResult = await sb
      .from('profiles')
      .select('id, tenant_id, full_name, role, created_at')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileResult.error || !profileResult.data) {
      throw httpError(403, 'Perfil no encontrado. Contacte al administrador.');
    }

    const p = profileResult.data;
    let resolvedClientId = null;
    if (p.role === 'CLIENT' && p.tenant_id && authUser.email) {
      const email = String(authUser.email).trim();
      const clientRes = await sb
        .from('clients')
        .select('id')
        .eq('tenant_id', p.tenant_id)
        .eq('email', email)
        .maybeSingle();
      if (!clientRes.error && clientRes.data) {
        resolvedClientId = clientRes.data.id;
      }
    }

    req.accessToken = token;
    req.authUser = authUser;
    req.profile = Object.assign({}, p, { client_id: resolvedClientId });
    req.user = {
      id: p.id,
      tenant_id: p.tenant_id,
      full_name: p.full_name,
      role: p.role,
      client_id: resolvedClientId,
    };
    req.sb = sb;
    next();
  } catch (e) {
    next(e);
  }
}

/**
 * @param {string[]} roles
 * @returns {import('express').RequestHandler}
 */
function requireRoles(...roles) {
  return (req, res, next) => {
    const u = req.user || req.profile;
    if (!u) {
      next(httpError(401, 'No autenticado'));
      return;
    }
    if (!roles.includes(u.role)) {
      next(httpError(403, 'No autorizado para este recurso'));
      return;
    }
    next();
  };
}

module.exports = { requireAuth, requireRoles };
