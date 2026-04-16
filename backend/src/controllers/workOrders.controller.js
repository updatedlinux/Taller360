const { getPrisma } = require('../lib/prisma');
const { httpError } = require('../middlewares/errorHandler');
const { workOrderOut } = require('../utils/dto');

function tenantId(req) {
  const id = req.user && req.user.tenant_id;
  if (!id) {
    throw httpError(400, 'tenant_id no disponible en el perfil');
  }
  return id;
}

const ALLOWED_STATUS = new Set(['RECEIVED', 'DIAGNOSING', 'REPAIRING', 'READY']);

async function list(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const rows = await prisma.workOrder.findMany({
    where: { tenantId: tid },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ ok: true, data: rows.map(workOrderOut) });
}

async function getById(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const row = await prisma.workOrder.findFirst({
    where: { id: req.params.id, tenantId: tid },
  });
  if (!row) {
    throw httpError(404, 'Orden no encontrada en su taller');
  }
  res.json({ ok: true, data: workOrderOut(row) });
}

async function create(req, res) {
  const tid = tenantId(req);
  const { vehicle_id, description, status, total_cost } = req.body || {};
  if (!vehicle_id) {
    throw httpError(400, 'vehicle_id es obligatorio');
  }

  const prisma = getPrisma();
  const veh = await prisma.vehicle.findFirst({
    where: { id: vehicle_id, tenantId: tid },
    select: { id: true },
  });
  if (!veh) {
    throw httpError(404, 'Vehículo no pertenece a este taller');
  }

  let st = status || 'RECEIVED';
  if (!ALLOWED_STATUS.has(st)) {
    throw httpError(400, 'status inválido');
  }

  const row = await prisma.workOrder.create({
    data: {
      tenantId: tid,
      vehicleId: vehicle_id,
      description: description || null,
      status: st,
      totalCost: total_cost != null ? Number(total_cost) : 0,
    },
  });
  res.status(201).json({ ok: true, data: workOrderOut(row) });
}

module.exports = {
  list,
  getById,
  create,
};
