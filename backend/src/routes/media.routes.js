const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const { getPrisma } = require('../lib/prisma');
const { absoluteVehiclePath } = require('../services/storage.service');

const router = Router();

router.get(
  '/vehicle-photo',
  requireAuth,
  asyncHandler(async (req, res) => {
    const rel = String(req.query.path || '');
    if (!rel || rel.includes('..')) {
      throw httpError(400, 'Ruta inválida');
    }
    const parts = rel.split('/').filter(Boolean);
    if (parts.length < 3) {
      throw httpError(400, 'Ruta inválida');
    }
    const [tid, vid] = parts;

    const prisma = getPrisma();
    const u = req.user;

    let allowed = false;
    if (u.role === 'SUPERADMIN') {
      allowed = true;
    } else if (u.role === 'OWNER' && u.tenant_id === tid) {
      allowed = true;
    } else if (u.role === 'CLIENT' && u.tenant_id === tid && u.client_id) {
      const v = await prisma.vehicle.findFirst({
        where: { id: vid, tenantId: tid, clientId: u.client_id },
        select: { id: true },
      });
      allowed = !!v;
    }

    if (!allowed) {
      throw httpError(403, 'No autorizado');
    }

    const abs = absoluteVehiclePath(rel);
    res.sendFile(abs, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(404).json({ ok: false, error: 'Archivo no encontrado' });
        }
      }
    });
  }),
);

module.exports = router;
