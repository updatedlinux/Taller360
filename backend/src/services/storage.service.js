const { assertNoDbError } = require('../utils/supabaseHelpers');

/**
 * @param {string} tenantId
 * @param {string} vehicleId
 * @param {string} originalName
 * @returns {string}
 */
function buildVehicleObjectPath(tenantId, vehicleId, originalName) {
  const safe = String(originalName || 'foto').replace(/[^a-zA-Z0-9._-]/g, '_');
  const stamp = Date.now();
  return `${tenantId}/${vehicleId}/${stamp}-${safe}`;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 * @param {string} vehicleId
 * @param {string} objectPath
 */
async function appendVehiclePhotoPath(sb, vehicleId, objectPath) {
  const row = assertNoDbError(await sb.from('vehicles').select('photos').eq('id', vehicleId).single());
  const photos = Array.isArray(row && row.photos) ? row.photos : [];
  const next = photos.concat(objectPath);
  assertNoDbError(await sb.from('vehicles').update({ photos: next }).eq('id', vehicleId));
  return next;
}

module.exports = { buildVehicleObjectPath, appendVehiclePhotoPath };
