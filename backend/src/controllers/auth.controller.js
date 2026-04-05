const { registerNewWorkshop } = require('../services/tenantRegistration.service');

/**
 * Registro público: crea usuario en Auth, fila en `tenants` y perfil OWNER vinculado al tenant.
 * No usa req.user (no hay sesión).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function registerTaller(req, res) {
  const { email, password, workshopName, fullName, rif } = req.body || {};
  const result = await registerNewWorkshop({ email, password, workshopName, fullName, rif });
  res.status(201).json({
    ok: true,
    message: 'Taller registrado. Inicie sesión con el correo indicado.',
    tenantId: result.tenantId,
    userId: result.userId,
  });
}

module.exports = { registerTaller };
