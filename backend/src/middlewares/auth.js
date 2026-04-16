const { verifyAccessToken } = require('../services/authTokens.service');
const { resolveClientIdForUser } = require('../services/userProfile.service');
const { getPrisma } = require('../lib/prisma');
const { httpError } = require('./errorHandler');

function getBearerOrCookie(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const t = header.slice(7).trim();
    if (t) return t;
  }
  if (req.cookies && req.cookies.taller360_token) {
    return String(req.cookies.taller360_token);
  }
  return null;
}

/**
 * @type {import('express').RequestHandler}
 */
async function requireAuth(req, res, next) {
  try {
    const token = getBearerOrCookie(req);
    if (!token) {
      throw httpError(401, 'Token requerido');
    }
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      throw httpError(401, 'Sesión inválida o expirada');
    }
    const userId = decoded && decoded.sub;
    if (!userId) {
      throw httpError(401, 'Token inválido');
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user || !user.profile) {
      throw httpError(403, 'Perfil no encontrado. Contacte al administrador.');
    }

    const emailNorm = String(user.email || '').trim().toLowerCase();
    const clientId = await resolveClientIdForUser(
      {
        role: user.profile.role,
        tenantId: user.profile.tenantId,
        clientId: user.profile.clientId,
      },
      emailNorm,
    );

    req.accessToken = token;
    req.authUser = { id: user.id, email: user.email };
    req.profile = {
      id: user.profile.id,
      tenant_id: user.profile.tenantId,
      full_name: user.profile.fullName,
      role: user.profile.role,
      client_id: clientId,
      created_at: user.profile.createdAt,
    };
    req.user = Object.assign({}, req.profile);
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

module.exports = { requireAuth, requireRoles, getBearerOrCookie };
