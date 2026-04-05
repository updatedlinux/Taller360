const { httpError } = require('../middlewares/errorHandler');
const { assertNoDbError } = require('../utils/supabaseHelpers');

function tenantId(req) {
  const id = req.user && req.user.tenant_id;
  if (!id) {
    throw httpError(400, 'tenant_id no disponible en el perfil');
  }
  return id;
}

const ALLOWED_STATUS = new Set(['RECEIVED', 'DIAGNOSING', 'REPAIRING', 'READY']);

/**
 * GET /api/taller/work-orders
 */
async function list(req, res) {
  const tid = tenantId(req);
  const data = assertNoDbError(
    await req.sb.from('work_orders').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
  );
  res.json({ ok: true, data: data != null ? data : [] });
}

/**
 * GET /api/taller/work-orders/:id
 */
async function getById(req, res) {
  const tid = tenantId(req);
  const data = assertNoDbError(
    await req.sb.from('work_orders').select('*').eq('id', req.params.id).eq('tenant_id', tid).single(),
    { notFoundMessage: 'Orden no encontrada en su taller' },
  );
  res.json({ ok: true, data });
}

/**
 * POST /api/taller/work-orders — orden básica (vehículo del mismo tenant).
 */
async function create(req, res) {
  const tid = tenantId(req);
  const { vehicle_id, description, status, total_cost } = req.body || {};
  if (!vehicle_id) {
    throw httpError(400, 'vehicle_id es obligatorio');
  }

  assertNoDbError(
    await req.sb.from('vehicles').select('id').eq('id', vehicle_id).eq('tenant_id', tid).single(),
    { notFoundMessage: 'Vehículo no pertenece a este taller' },
  );

  let st = status || 'RECEIVED';
  if (!ALLOWED_STATUS.has(st)) {
    throw httpError(400, 'status inválido');
  }

  const data = assertNoDbError(
    await req.sb
      .from('work_orders')
      .insert({
        tenant_id: tid,
        vehicle_id,
        description: description || null,
        status: st,
        total_cost: total_cost != null ? total_cost : 0,
      })
      .select('*')
      .single(),
  );
  res.status(201).json({ ok: true, data });
}

module.exports = {
  list,
  getById,
  create,
};
