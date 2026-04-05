/**
 * Variables públicas del frontend (seguras en el navegador).
 * SUPABASE_URL y SUPABASE_KEY: mismos valores que el backend usa como URL de proyecto y clave anon/publicable.
 *
 * API_BASE: en Vercel deja '' para usar el mismo origen (API en /api/*). En local, si sirves HTML en otro
 * puerto que Express, pon por ejemplo 'http://localhost:3000'.
 */
window.TALLER360 = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_KEY: 'TU_CLAVE_PUBLICA',
  API_BASE: '',
};

(function () {
  if (typeof window === 'undefined') return;
  const c = window.TALLER360;
  const b = String(c.API_BASE || '').trim();
  if (!b) {
    c.API_BASE = window.location.origin;
  }
})();
