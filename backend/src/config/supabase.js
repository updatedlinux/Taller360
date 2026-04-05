const { createClient } = require('@supabase/supabase-js');
const { env } = require('./env');

const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.key;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '[supabase] Faltan SUPABASE_URL o SUPABASE_KEY. Copia backend/.env.example a backend/.env y complétalo.',
  );
}

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

/**
 * Cliente principal de Supabase (clave publicable del .env).
 * Usar para validar JWT y como base; las peticiones con RLS usan createUserClient.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
const supabase = createClient(supabaseUrl, supabaseKey, clientOptions);

/**
 * Cliente con el JWT del usuario en Authorization (respeta RLS en PostgREST).
 * @param {string} accessToken
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
function createUserClient(accessToken) {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

let _serviceClient = null;

/**
 * Cliente con service role (solo si existe SUPABASE_SERVICE_ROLE_KEY).
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
function getSupabaseService() {
  if (!env.supabase.serviceRoleKey) {
    return null;
  }
  if (!_serviceClient) {
    _serviceClient = createClient(supabaseUrl, env.supabase.serviceRoleKey, clientOptions);
  }
  return _serviceClient;
}

module.exports = {
  supabase,
  createUserClient,
  getSupabaseService,
};
