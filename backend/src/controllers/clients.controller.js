const { getPrisma } = require('../lib/prisma');
const { httpError } = require('../middlewares/errorHandler');
const { clientOut } = require('../utils/dto');

function tenantId(req) {
  const id = req.user && req.user.tenant_id;
  if (!id) {
    throw httpError(400, 'tenant_id no disponible en el perfil');
  }
  return id;
}

async function list(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const rows = await prisma.client.findMany({
    where: { tenantId: tid },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ ok: true, data: rows.map(clientOut) });
}

async function getById(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const row = await prisma.client.findFirst({
    where: { id: req.params.id, tenantId: tid },
  });
  if (!row) {
    throw httpError(404, 'Cliente no encontrado en su taller');
  }
  res.json({ ok: true, data: clientOut(row) });
}

async function create(req, res) {
  const tid = tenantId(req);
  const { name, email, phone } = req.body || {};
  if (!name) {
    throw httpError(400, 'name es obligatorio');
  }
  const prisma = getPrisma();
  const row = await prisma.client.create({
    data: {
      tenantId: tid,
      name,
      email: email != null ? String(email).trim().toLowerCase() : null,
      phone: phone || null,
    },
  });
  res.status(201).json({ ok: true, data: clientOut(row) });
}

async function update(req, res) {
  const tid = tenantId(req);
  const { name, email, phone } = req.body || {};
  const patch = {};
  if (name !== undefined) patch.name = name;
  if (email !== undefined) patch.email = email != null ? String(email).trim().toLowerCase() : null;
  if (phone !== undefined) patch.phone = phone;
  if (Object.keys(patch).length === 0) {
    throw httpError(400, 'Nada que actualizar');
  }
  const prisma = getPrisma();
  const row = await prisma.client.updateMany({
    where: { id: req.params.id, tenantId: tid },
    data: patch,
  });
  if (row.count === 0) {
    throw httpError(404, 'Cliente no encontrado en su taller');
  }
  const updated = await prisma.client.findFirst({
    where: { id: req.params.id, tenantId: tid },
  });
  res.json({ ok: true, data: clientOut(updated) });
}

async function remove(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const row = await prisma.client.deleteMany({
    where: { id: req.params.id, tenantId: tid },
  });
  if (row.count === 0) {
    throw httpError(404, 'Cliente no encontrado en su taller');
  }
  res.status(204).send();
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
