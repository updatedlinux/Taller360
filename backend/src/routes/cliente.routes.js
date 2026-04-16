const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../middlewares/errorHandler');
const { getPrisma } = require('../lib/prisma');
const { parsePhotos } = require('../services/storage.service');
const { clientOut, vehicleOut, workOrderOut } = require('../utils/dto');

const router = Router();

router.get(
  '/me',
  asyncHandler(async (req, res) => {
    const prisma = getPrisma();
    const email = String(req.authUser.email || '').trim().toLowerCase();
    const tenantId = req.profile.tenant_id;
    if (!tenantId) {
      throw httpError(400, 'Tu perfil no tiene taller asignado.');
    }
    const row = await prisma.client.findFirst({
      where: { tenantId, email },
    });
    if (!row) {
      throw httpError(404, 'No encontramos tu ficha de cliente en el taller.');
    }
    res.json({ ok: true, data: clientOut(row) });
  }),
);

router.get(
  '/vehicles',
  asyncHandler(async (req, res) => {
    if (!req.profile.client_id) {
      throw httpError(400, 'Su cuenta no está vinculada a un cliente del taller');
    }
    const prisma = getPrisma();
    const list = await prisma.vehicle.findMany({
      where: {
        tenantId: req.profile.tenant_id,
        clientId: req.profile.client_id,
      },
      orderBy: { createdAt: 'desc' },
    });

    const withUrls = list.map((v) => {
      const photos = parsePhotos(v.photos);
      const photoUrls = photos.map((p) => ({
        path: p,
        signedUrl: `/api/media/vehicle-photo?path=${encodeURIComponent(p)}`,
      }));
      return Object.assign(vehicleOut(v), {
        photos,
        photoUrls,
      });
    });

    res.json({ ok: true, data: withUrls });
  }),
);

router.get(
  '/vehicles/:vehicleId/work-orders',
  asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;
    if (!req.profile.client_id) {
      throw httpError(400, 'Su cuenta no está vinculada a un cliente del taller');
    }
    const prisma = getPrisma();

    const v = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        tenantId: req.profile.tenant_id,
        clientId: req.profile.client_id,
      },
      select: { id: true, plate: true },
    });
    if (!v) {
      throw httpError(404, 'Vehículo no encontrado');
    }

    const rows = await prisma.workOrder.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ ok: true, data: rows.map(workOrderOut) });
  }),
);

module.exports = router;
