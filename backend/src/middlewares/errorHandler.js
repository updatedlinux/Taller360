/**
 * Manejo centralizado de errores Express.
 * @param {Error & { status?: number }} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(status).json({ ok: false, error: message });
}

/**
 * @param {number} status
 * @param {string} message
 * @returns {Error & { status: number }}
 */
function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

module.exports = { errorHandler, httpError };
