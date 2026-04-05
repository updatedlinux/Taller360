const { httpError } = require('../middlewares/errorHandler');
const { assertNoDbError, assertNoStorageError } = require('../utils/supabaseHelpers');
const { buildVehicleObjectPath, appendVehiclePhotoPath } = require('../services/storage.service');

function tenantId(req) {
  const id = req.user && req.user.tenant_id;
  if (!id) {
    throw httpError(400, 'tenant_id no disponible en el perfil');
  }
  return id;
}

/**
 * Comprueba que el cliente pertenezca al mismo tenant.
 */
async function assertClientInTenant(sb, clientId, tid) {
  assertNoDbError(
    await sb.from('clients').select('id').eq('id', clientId).eq('tenant_id', tid).single(),
    { notFoundMessage: 'Cliente no pertenece a este taller' },
  );
}

/**
 * GET /api/taller/vehicles
 */
async function list(req, res) {
  const tid = tenantId(req);
  const data = assertNoDbError(
    await req.sb.from('vehicles').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
  );
  res.json({ ok: true, data: data != null ? data : [] });
}

/**
 * GET /api/taller/vehicles/:id
 */
async function getById(req, res) {
  const tid = tenantId(req);
  const data = assertNoDbError(
    await req.sb.from('vehicles').select('*').eq('id', req.params.id).eq('tenant_id', tid).single(),
    { notFoundMessage: 'Vehículo no encontrado en su taller' },
  );
  res.json({ ok: true, data });
}

/**
 * POST /api/taller/vehicles
 */
async function create(req, res) {
  const tid = tenantId(req);
  const { client_id, plate, brand, model, year, km } = req.body || {};
  if (!client_id || !plate) {
    throw httpError(400, 'client_id y plate son obligatorios');
  }
  await assertClientInTenant(req.sb, client_id, tid);
  const data = assertNoDbError(
    await req.sb
      .from('vehicles')
      .insert({
        tenant_id: tid,
        client_id,
        plate,
        brand: brand || null,
        model: model || null,
        year: year != null ? year : null,
        km: km != null ? km : null,
        photos: [],
      })
      .select('*')
      .single(),
  );
  res.status(201).json({ ok: true, data });
}

/**
 * PUT /api/taller/vehicles/:id
 */
async function update(req, res) {
  const tid = tenantId(req);
  const { client_id, plate, brand, model, year, km } = req.body || {};
  const patch = {};
  if (client_id !== undefined) patch.client_id = client_id;
  if (plate !== undefined) patch.plate = plate;
  if (brand !== undefined) patch.brand = brand;
  if (model !== undefined) patch.model = model;
  if (year !== undefined) patch.year = year;
  if (km !== undefined) patch.km = km;
  if (Object.keys(patch).length === 0) {
    throw httpError(400, 'Nada que actualizar');
  }
  if (patch.client_id != null) {
    await assertClientInTenant(req.sb, patch.client_id, tid);
  }
  const data = assertNoDbError(
    await req.sb.from('vehicles').update(patch).eq('id', req.params.id).eq('tenant_id', tid).select('*').single(),
    { notFoundMessage: 'Vehículo no encontrado en su taller' },
  );
  res.json({ ok: true, data });
}

/**
 * DELETE /api/taller/vehicles/:id
 */
async function remove(req, res) {
  const tid = tenantId(req);
  assertNoDbError(
    await req.sb.from('vehicles').delete().eq('id', req.params.id).eq('tenant_id', tid).select('id').single(),
    { notFoundMessage: 'Vehículo no encontrado en su taller' },
  );
  res.status(204).send();
}

/**
 * POST /api/taller/vehicles/:vehicleId/photos
 */
async function uploadPhoto(req, res) {
  const tid = tenantId(req);
  const { vehicleId } = req.params;
  const file = req.file;
  if (!file || !file.buffer) {
    throw httpError(400, 'Archivo requerido (campo multipart "photo")');
  }

  assertNoDbError(
    await req.sb
      .from('vehicles')
      .select('id, tenant_id')
      .eq('id', vehicleId)
      .eq('tenant_id', tid)
      .single(),
    { notFoundMessage: 'Vehículo no encontrado en su taller' },
  );

  const objectPath = buildVehicleObjectPath(tid, vehicleId, file.originalname);
  const up = await req.sb.storage.from('vehicles').upload(objectPath, file.buffer, {
    contentType: file.mimetype || 'application/octet-stream',
    upsert: false,
  });
  assertNoStorageError(up);

  const photos = await appendVehiclePhotoPath(req.sb, vehicleId, objectPath);

  const signed = await req.sb.storage.from('vehicles').createSignedUrl(objectPath, 3600);
  assertNoStorageError(signed);

  res.status(201).json({
    ok: true,
    path: objectPath,
    photos,
    signedUrl: signed.data && signed.data.signedUrl ? signed.data.signedUrl : null,
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
