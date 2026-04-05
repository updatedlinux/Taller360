const { httpError } = require('../middlewares/errorHandler');

/**
 * @param {import('@supabase/supabase-js').PostgrestError | import('@supabase/storage-js').StorageError | null | undefined} err
 * @returns {number}
 */
function statusFromSupabaseError(err) {
  if (!err || !err.code) {
    return 500;
  }
  const c = String(err.code);
  if (c === 'PGRST116') return 404;
  if (c === '23505') return 409;
  if (c === '42501' || c === 'PGRST301') return 403;
  return 500;
}

/**
 * Lanza httpError si `result.error` está presente (tablas / RPC vía PostgREST).
 * @template T
 * @param {{ data: T; error: import('@supabase/supabase-js').PostgrestError | null }} result
 * @param {{ notFoundMessage?: string }} [opts]
 * @returns {T}
 */
function assertNoDbError(result, opts) {
  if (result.error) {
    const status = statusFromSupabaseError(result.error);
    let msg = result.error.message || 'Error en base de datos';
    if (result.error.details) {
      msg = `${msg} — ${result.error.details}`;
    }
    if (status === 404 && opts && opts.notFoundMessage) {
      msg = opts.notFoundMessage;
    }
    throw httpError(status, msg);
  }
  return result.data;
}

/**
 * @param {{ data: unknown; error: { message?: string } | null }} result
 * @param {number} [defaultStatus]
 */
function assertNoAuthError(result, defaultStatus) {
  const st = defaultStatus != null ? defaultStatus : 401;
  if (result.error) {
    throw httpError(st, result.error.message || 'Error de autenticación');
  }
}

/**
 * Storage (upload, signed URL, etc.).
 * @param {{ data: unknown; error: { message?: string } | null }} result
 */
function assertNoStorageError(result) {
  if (result.error) {
    throw httpError(500, result.error.message || 'Error en almacenamiento');
  }
}

/**
 * URL firmada sin tumbar toda la petición si falla un archivo.
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 * @param {string} path
 * @param {number} ttlSeconds
 * @returns {Promise<string | null>}
 */
async function createSignedUrlOrNull(sb, path, ttlSeconds) {
  const result = await sb.storage.from('vehicles').createSignedUrl(path, ttlSeconds);
  if (result.error || !result.data) {
    return null;
  }
  return result.data.signedUrl || null;
}

module.exports = {
  statusFromSupabaseError,
  assertNoDbError,
  assertNoAuthError,
  assertNoStorageError,
  createSignedUrlOrNull,
};
