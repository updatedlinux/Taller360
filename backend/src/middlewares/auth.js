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
      .select('id, tenant_id, full_name, role, client_id')
      .eq('id', authUser.id)
      .single();

    if (profileResult.error || !profileResult.data) {
      throw httpError(403, 'Perfil no encontrado. Contacte al administrador.');
    }

    const p = profileResult.data;
    req.accessToken = token;
    req.authUser = authUser;
    req.profile = p;
    req.user = {
      id: p.id,
      tenant_id: p.tenant_id,
      full_name: p.full_name,
      role: p.role,
      client_id: p.client_id,
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
