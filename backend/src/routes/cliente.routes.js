const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../middlewares/errorHandler');
const { assertNoDbError, createSignedUrlOrNull } = require('../utils/supabaseHelpers');

const router = Router();

router.get(
  '/vehicles',
  asyncHandler(async (req, res) => {
    if (!req.profile.client_id) {
      throw httpError(400, 'Su cuenta no está vinculada a un cliente del taller');
    }
    const data = assertNoDbError(
      await req.sb.from('vehicles').select('*').order('created_at', { ascending: false }),
    );
    const list = data != null ? data : [];
    const withUrls = await Promise.all(
      list.map(async (v) => {
        const signed = await Promise.all(
          (v.photos || []).map(async (p) => {
            const url = await createSignedUrlOrNull(req.sb, p, 3600);
            return { path: p, signedUrl: url };
          }),
        );
        return Object.assign({}, v, { photoUrls: signed });
      }),
    );
    res.json({ ok: true, data: withUrls });
  }),
);

router.get(
  '/vehicles/:vehicleId/work-orders',
  asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;
    assertNoDbError(
      await req.sb.from('vehicles').select('id, plate').eq('id', vehicleId).single(),
      { notFoundMessage: 'Vehículo no encontrado' },
    );
    const data = assertNoDbError(
      await req.sb
        .from('work_orders')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false }),
    );
    res.json({ ok: true, data: data != null ? data : [] });
  }),
);

module.exports = router;
