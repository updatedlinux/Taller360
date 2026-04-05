const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

/** Clave publicable (anon / publishable). Compat: SUPABASE_ANON_KEY si aún existe. */
const supabaseKey =
  process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: supabaseKey,
    /** Solo servidor: Admin API y bypass RLS (opcional). */
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  corsOrigins: (process.env.CORS_ORIGIN || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};

if (!env.supabase.url || !env.supabase.key) {
  console.warn('[env] Defina SUPABASE_URL y SUPABASE_KEY en .env');
}

module.exports = { env };
