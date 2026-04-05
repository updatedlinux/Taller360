const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { assertNoDbError } = require('../utils/supabaseHelpers');
const { httpError } = require('../middlewares/errorHandler');

const router = Router();

router.get(
  '/tenants',
  asyncHandler(async (req, res) => {
    const data = assertNoDbError(
      await req.sb.from('tenants').select('*').order('created_at', { ascending: false }),
    );
    res.json({ ok: true, data: data != null ? data : [] });
  }),
);

router.patch(
  '/tenants/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, plan, name, rif } = req.body || {};
    const patch = {};
    if (status !== undefined) patch.status = status;
    if (plan !== undefined) patch.plan = plan;
    if (name !== undefined) patch.name = name;
    if (rif !== undefined) patch.rif = rif;
    if (Object.keys(patch).length === 0) {
      throw httpError(400, 'Nada que actualizar');
    }
    const data = assertNoDbError(
      await req.sb.from('tenants').update(patch).eq('id', id).select('*').single(),
      { notFoundMessage: 'Taller no encontrado' },
    );
    res.json({ ok: true, data });
  }),
);

router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const r1 = await req.sb.from('tenants').select('*', { count: 'exact', head: true });
    assertNoDbError(r1);
    const r2 = await req.sb.from('tenants').select('*', { count: 'exact', head: true }).eq('status', 'active');
    assertNoDbError(r2);
    res.json({
      ok: true,
      data: {
        tenantsTotal: r1.count != null ? r1.count : 0,
        tenantsActive: r2.count != null ? r2.count : 0,
      },
    });
  }),
);

module.exports = router;
