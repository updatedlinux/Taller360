const { httpError } = require('./errorHandler');

/**
 * /api/taller/* — solo OWNER; tenant_id desde req.user.tenant_id.
 * @type {import('express').RequestHandler}
 */
function requireTenantOwner(req, res, next) {
  if (!req.user) {
    next(httpError(401, 'No autenticado'));
    return;
  }
  if (req.user.role !== 'OWNER') {
    next(httpError(403, 'Solo dueños de taller pueden usar este portal'));
    return;
  }
  if (!req.user.tenant_id) {
    next(httpError(400, 'El usuario no tiene taller asociado'));
    return;
  }
  req.tenantId = req.user.tenant_id;
  next();
}

module.exports = { requireTenantOwner };
