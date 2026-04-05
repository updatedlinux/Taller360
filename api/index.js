/**
 * Entrada serverless para Vercel: expone la app Express (sin app.listen).
 */
const app = require('../backend/src/app');

module.exports = app;
