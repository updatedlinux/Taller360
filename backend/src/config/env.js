const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadsDir: path.resolve(__dirname, '../../uploads'),
  corsOrigins: (process.env.CORS_ORIGIN || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};

if (!env.databaseUrl) {
  console.warn('[env] Defina DATABASE_URL en backend/.env (SQL Server)');
}
if (!env.jwtSecret || env.jwtSecret.length < 16) {
  console.warn('[env] Defina JWT_SECRET seguro (>= 16 caracteres) en backend/.env');
}

module.exports = { env };
