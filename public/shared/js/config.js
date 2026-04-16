/** Base URL de la API (mismo origen por defecto). */
window.TALLER360 = Object.assign({}, window.TALLER360 || {}, {
  API_BASE: (window.TALLER360 && window.TALLER360.API_BASE) || '',
});
;(function () {
  if (typeof window === 'undefined') return;
  var b = String(window.TALLER360.API_BASE || '').trim();
  if (!b) window.TALLER360.API_BASE = window.location.origin;
})();
