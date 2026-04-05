// Versión fija para evitar cambios inesperados del CDN en Vercel/navegador (ESM).
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let _client = null;

function looksLikePlaceholder(url, key) {
  const u = String(url || '');
  const k = String(key || '');
  return (
    u.includes('TU-PROYECTO') ||
    u.includes('placeholder') ||
    k.includes('TU_CLAVE')
  );
}

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
  if (looksLikePlaceholder(cfg.SUPABASE_URL, key)) {
    console.warn(
      '[Taller360] SUPABASE_URL o SUPABASE_KEY parecen placeholders; el login fallará hasta configurarlos.'
    );
  }
  console.log('[Taller360 login] Creando cliente Supabase', {
    urlHost: (() => {
      try {
        return new URL(cfg.SUPABASE_URL).host;
      } catch {
        return '(URL inválida)';
      }
    })(),
    keyLength: key.length,
  });
  _client = createClient(cfg.SUPABASE_URL, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });
  console.log('[Taller360 login] Cliente Supabase listo (createClient OK)');
  return _client;
}
