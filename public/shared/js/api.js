/**
 * Peticiones a la API Express con Bearer (sesión Supabase).
 * @param {string} path
 * @param {string} accessToken
 * @param {RequestInit} [options]
 */
export async function apiJson(path, accessToken, options = {}) {
  const base = (window.TALLER360 && window.TALLER360.API_BASE) || '';
  const url = `${String(base).replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = Object.assign({ Authorization: `Bearer ${accessToken}` }, options.headers || {});
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const res = await fetch(url, Object.assign({}, options, { headers, body }));
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { ok: false, error: text || res.statusText };
  }
  if (!res.ok) {
    const err = new Error((json && json.error) || res.statusText);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}
