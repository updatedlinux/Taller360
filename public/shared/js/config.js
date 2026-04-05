const SUPABASE_URL = 'https://yxxwfrjofcncarkhfjiu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_lpfOZWAM0iu8qe9hl5FnLQ_qTbn4xzh'

window.TALLER360 = Object.assign({}, window.TALLER360 || {}, {
  SUPABASE_URL,
  SUPABASE_KEY,
  API_BASE: (window.TALLER360 && window.TALLER360.API_BASE) || '',
})
;(function () {
  if (typeof window === 'undefined') return
  var b = String(window.TALLER360.API_BASE || '').trim()
  if (!b) window.TALLER360.API_BASE = window.location.origin
})()
