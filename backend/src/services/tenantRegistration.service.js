const { getSupabaseService } = require('../config/supabase');
const { httpError } = require('../middlewares/errorHandler');
const { assertNoDbError } = require('../utils/supabaseHelpers');

/**
 * Registro de nuevo taller: Auth Admin + tenants + perfil OWNER.
 * Requiere SUPABASE_SERVICE_ROLE_KEY (cliente de servicio).
 */
async function registerNewWorkshop(input) {
  const svc = getSupabaseService();
  if (!svc) {
    throw httpError(503, 'Registro no disponible: configure SUPABASE_SERVICE_ROLE_KEY en el servidor');
  }
  const { email, password, workshopName, fullName, rif } = input;
  if (!email || !password || !workshopName || !fullName) {
    throw httpError(400, 'email, password, workshopName y fullName son obligatorios');
  }

  const created = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (created.error || !created.data || !created.data.user) {
    const msg = created.error ? created.error.message : 'No se pudo crear el usuario';
    throw httpError(400, msg);
  }

  const userId = created.data.user.id;

  let tenant;
  try {
    tenant = assertNoDbError(
      await svc
        .from('tenants')
        .insert({
          name: workshopName,
          rif: rif || null,
          owner_id: userId,
          plan: 'basic',
          status: 'active',
        })
        .select('id')
        .single(),
    );
  } catch (e) {
    await svc.auth.admin.deleteUser(userId);
    throw e;
  }

  try {
    assertNoDbError(
      await svc.from('profiles').insert({
        id: userId,
        tenant_id: tenant.id,
        full_name: fullName,
        role: 'OWNER',
      }),
    );
  } catch (e) {
    await svc.from('tenants').delete().eq('id', tenant.id);
    await svc.auth.admin.deleteUser(userId);
    throw e;
  }

  return { userId, tenantId: tenant.id };
}

module.exports = { registerNewWorkshop };
