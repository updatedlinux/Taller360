const { httpError } = require('../middlewares/errorHandler');
const { assertNoDbError } = require('../utils/supabaseHelpers');

/**
 * @param {import('express').Request} req
 * @returns {string}
 */
function tenantId(req) {
  const id = req.user && req.user.tenant_id;
  if (!id) {
    throw httpError(400, 'tenant_id no disponible en el perfil');
  }
  return id;
}

/**
 * GET /api/taller/clients
 */
async function list(req, res) {
  const tid = tenantId(req);
  const data = assertNoDbError(
    await req.sb.from('clients').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
  );
  res.json({ ok: true, data: data != null ? data : [] });
}

/**
 * GET /api/taller/clients/:id
 */
async function getById(req, res) {
  const tid = tenantId(req);
  const data = assertNoDbError(
    await req.sb.from('clients').select('*').eq('id', req.params.id).eq('tenant_id', tid).single(),
    { notFoundMessage: 'Cliente no encontrado en su taller' },
  );
  res.json({ ok: true, data });
}

/**
 * POST /api/taller/clients
 */
async function create(req, res) {
  const tid = tenantId(req);
  const { name, email, phone } = req.body || {};
  if (!name) {
    throw httpError(400, 'name es obligatorio');
  }
  const data = assertNoDbError(
    await req.sb
      .from('clients')
      .insert({ tenant_id: tid, name, email: email || null, phone: phone || null })
      .select('*')
      .single(),
  );
  res.status(201).json({ ok: true, data });
}

/**
 * PUT /api/taller/clients/:id
 */
async function update(req, res) {
  const tid = tenantId(req);
  const { name, email, phone } = req.body || {};
  const patch = {};
  if (name !== undefined) patch.name = name;
  if (email !== undefined) patch.email = email;
  if (phone !== undefined) patch.phone = phone;
  if (Object.keys(patch).length === 0) {
    throw httpError(400, 'Nada que actualizar');
  }
  const data = assertNoDbError(
    await req.sb.from('clients').update(patch).eq('id', req.params.id).eq('tenant_id', tid).select('*').single(),
    { notFoundMessage: 'Cliente no encontrado en su taller' },
  );
  res.json({ ok: true, data });
}

/**
 * DELETE /api/taller/clients/:id
 */
async function remove(req, res) {
  const tid = tenantId(req);
  assertNoDbError(
    await req.sb.from('clients').delete().eq('id', req.params.id).eq('tenant_id', tid).select('id').single(),
    { notFoundMessage: 'Cliente no encontrado en su taller' },
  );
  res.status(204).send();
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
