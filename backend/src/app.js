const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { env } = require('./config/env');
const { errorHandler } = require('./middlewares/errorHandler');
const { requireAuth, requireRoles } = require('./middlewares/auth');
const { requireTenantOwner } = require('./middlewares/tenantScope');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const tallerRoutes = require('./routes/taller.routes');
const clienteRoutes = require('./routes/cliente.routes');
const mediaRoutes = require('./routes/media.routes');

const app = express();

const corsOrigin =
  env.corsOrigins.length === 0 || env.corsOrigins[0] === '*'
    ? true
    : env.corsOrigins;

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'taller360-api', env: env.nodeEnv, storage: 'sqlserver+prisma' });
});

app.get('/', (req, res) => {
  res.redirect('/auth/login.html');
});

app.use('/api/auth', authRoutes);

app.use('/api/media', mediaRoutes);

app.use('/api/admin', requireAuth, requireRoles('SUPERADMIN'), adminRoutes);
app.use('/api/taller', requireAuth, requireTenantOwner, tallerRoutes);
app.use('/api/cliente', requireAuth, requireRoles('CLIENT'), clienteRoutes);

const publicRoot = path.join(__dirname, '../../public');
app.use(express.static(publicRoot));

app.use(errorHandler);

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`Taller360 API en http://localhost:${env.port}`);
  });
}

module.exports = app;
