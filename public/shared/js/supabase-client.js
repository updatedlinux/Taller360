import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let _client = null;

/**
 * Cliente Supabase único (clave publicable). Persiste sesión en localStorage.
 * No uses service_role en el navegador.
 */
export function getSupabase() {
  if (_client) {
    return _client;
  }
  const cfg = window.TALLER360;
  if (!cfg || !cfg.SUPABASE_URL) {
    throw new Error('Configura SUPABASE_URL en /shared/app-config.js');
  }
  const key = cfg.SUPABASE_KEY || cfg.SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Configura SUPABASE_KEY (clave publicable) en /shared/app-config.js');
  }
  _client = createClient(cfg.SUPABASE_URL, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });
  return _client;
}
