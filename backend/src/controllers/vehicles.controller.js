const { getPrisma } = require('../lib/prisma');
const { httpError } = require('../middlewares/errorHandler');
const {
  buildVehicleObjectPath,
  appendVehiclePhotoPath,
  saveVehicleFile,
  parsePhotos,
} = require('../services/storage.service');
const { vehicleOut } = require('../utils/dto');

function tenantId(req) {
  const id = req.user && req.user.tenant_id;
  if (!id) {
    throw httpError(400, 'tenant_id no disponible en el perfil');
  }
  return id;
}

async function assertClientInTenant(clientId, tid) {
  const prisma = getPrisma();
  const c = await prisma.client.findFirst({
    where: { id: clientId, tenantId: tid },
    select: { id: true },
  });
  if (!c) {
    throw httpError(404, 'Cliente no pertenece a este taller');
  }
}

function mapVehicle(v) {
  const photos = parsePhotos(v.photos);
  return Object.assign(vehicleOut(v), {
    photos,
  });
}

async function list(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const rows = await prisma.vehicle.findMany({
    where: { tenantId: tid },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ ok: true, data: rows.map(mapVehicle) });
}

async function getById(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const row = await prisma.vehicle.findFirst({
    where: { id: req.params.id, tenantId: tid },
  });
  if (!row) {
    throw httpError(404, 'Vehículo no encontrado en su taller');
  }
  res.json({ ok: true, data: mapVehicle(row) });
}

async function create(req, res) {
  const tid = tenantId(req);
  const { client_id, plate, brand, model, year, km } = req.body || {};
  if (!client_id || !plate) {
    throw httpError(400, 'client_id y plate son obligatorios');
  }
  await assertClientInTenant(client_id, tid);
  const prisma = getPrisma();
  const row = await prisma.vehicle.create({
    data: {
      tenantId: tid,
      clientId: client_id,
      plate: String(plate).trim(),
      brand: brand || null,
      model: model || null,
      year: year != null ? parseInt(year, 10) : null,
      km: km != null ? parseInt(km, 10) : null,
      photos: '[]',
    },
  });
  res.status(201).json({ ok: true, data: mapVehicle(row) });
}

async function update(req, res) {
  const tid = tenantId(req);
  const { client_id, plate, brand, model, year, km } = req.body || {};
  const patch = {};
  if (client_id !== undefined) patch.clientId = client_id;
  if (plate !== undefined) patch.plate = String(plate).trim();
  if (brand !== undefined) patch.brand = brand;
  if (model !== undefined) patch.model = model;
  if (year !== undefined) patch.year = year != null ? parseInt(year, 10) : null;
  if (km !== undefined) patch.km = km != null ? parseInt(km, 10) : null;
  if (Object.keys(patch).length === 0) {
    throw httpError(400, 'Nada que actualizar');
  }
  if (patch.clientId != null) {
    await assertClientInTenant(patch.clientId, tid);
  }
  const prisma = getPrisma();
  const updated = await prisma.vehicle.updateMany({
    where: { id: req.params.id, tenantId: tid },
    data: patch,
  });
  if (updated.count === 0) {
    throw httpError(404, 'Vehículo no encontrado en su taller');
  }
  const row = await prisma.vehicle.findFirst({
    where: { id: req.params.id, tenantId: tid },
  });
  res.json({ ok: true, data: mapVehicle(row) });
}

async function remove(req, res) {
  const tid = tenantId(req);
  const prisma = getPrisma();
  const row = await prisma.vehicle.deleteMany({
    where: { id: req.params.id, tenantId: tid },
  });
  if (row.count === 0) {
    throw httpError(404, 'Vehículo no encontrado en su taller');
  }
  res.status(204).send();
}

async function uploadPhoto(req, res) {
  const tid = tenantId(req);
  const { vehicleId } = req.params;
  const file = req.file;
  if (!file || !file.buffer) {
    throw httpError(400, 'Archivo requerido (campo multipart "photo")');
  }

  const prisma = getPrisma();
  const v = await prisma.vehicle.findFirst({
    where: { id: vehicleId, tenantId: tid },
    select: { id: true },
  });
  if (!v) {
    throw httpError(404, 'Vehículo no encontrado en su taller');
  }

  const objectPath = buildVehicleObjectPath(tid, vehicleId, file.originalname);
  await saveVehicleFile(objectPath, file.buffer);
  const photos = await appendVehiclePhotoPath(vehicleId, objectPath);

  const signedUrl = `/api/media/vehicle-photo?path=${encodeURIComponent(objectPath)}`;

  res.status(201).json({
    ok: true,
    path: objectPath,
    photos,
    signedUrl,
  });
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  uploadPhoto,
};
