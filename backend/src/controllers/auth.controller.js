const bcrypt = require('bcryptjs');
const { getPrisma } = require('../lib/prisma');
const { signAccessToken } = require('../services/authTokens.service');
const { httpError } = require('../middlewares/errorHandler');
const { registerNewWorkshop } = require('../services/tenantRegistration.service');
const { profileOut } = require('../utils/dto');
const { resolveClientIdForUser } = require('../services/userProfile.service');

/**
 * POST /api/auth/login
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw httpError(400, 'Correo y contraseña son obligatorios');
  }
  const emailNorm = String(email).trim().toLowerCase();
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { email: emailNorm },
    include: { profile: true },
  });
  if (!user || !user.profile) {
    throw httpError(401, 'Correo o contraseña incorrectos.');
  }
  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    throw httpError(401, 'Correo o contraseña incorrectos.');
  }

  const token = signAccessToken({ sub: user.id });
  const clientId = await resolveClientIdForUser(
    {
      role: user.profile.role,
      tenantId: user.profile.tenantId,
      clientId: user.profile.clientId,
    },
    emailNorm,
  );

  const profile = {
    id: user.profile.id,
    tenant_id: user.profile.tenantId,
    full_name: user.profile.fullName,
    role: user.profile.role,
    client_id: clientId,
    created_at: user.profile.createdAt,
  };

  const maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie('taller360_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge,
    path: '/',
  });

  res.json({
    ok: true,
    token,
    user: { id: user.id, email: user.email },
    profile,
  });
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  const u = req.authUser;
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: u.id },
    include: { profile: true },
  });
  if (!user || !user.profile) {
    throw httpError(403, 'Perfil no encontrado');
  }
  const emailNorm = String(user.email || '').trim().toLowerCase();
  const clientId = await resolveClientIdForUser(
    {
      role: user.profile.role,
      tenantId: user.profile.tenantId,
      clientId: user.profile.clientId,
    },
    emailNorm,
  );
  res.json({
    ok: true,
    user: { id: user.id, email: user.email },
    profile: profileOut(
      Object.assign({}, user.profile, { clientId }),
      user.email,
    ),
  });
}

/**
 * POST /api/auth/logout
 */
function logout(req, res) {
  res.clearCookie('taller360_token', { path: '/' });
  res.json({ ok: true });
}

/**
 * Registro público de taller
 */
async function registerTaller(req, res) {
  const { email, password, workshopName, fullName, rif } = req.body || {};
  const result = await registerNewWorkshop({ email, password, workshopName, fullName, rif });
  res.status(201).json({
    ok: true,
    message: 'Taller registrado. Inicie sesión con el correo indicado.',
    tenantId: result.tenantId,
    userId: result.userId,
  });
}

module.exports = { login, me, logout, registerTaller };
