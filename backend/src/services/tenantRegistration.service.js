const bcrypt = require('bcryptjs');
const { getPrisma } = require('../lib/prisma');
const { httpError } = require('../middlewares/errorHandler');

/**
 * Registro de nuevo taller: usuario local + tenant + perfil OWNER (transacción).
 */
async function registerNewWorkshop(input) {
  const { email, password, workshopName, fullName, rif } = input;
  if (!email || !password || !workshopName || !fullName) {
    throw httpError(400, 'email, password, workshopName y fullName son obligatorios');
  }

  const emailNorm = String(email).trim().toLowerCase();
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
  if (existing) {
    throw httpError(400, 'Ya existe una cuenta con ese correo.');
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: emailNorm,
        passwordHash,
      },
    });

    const tenant = await tx.tenant.create({
      data: {
        name: String(workshopName).trim(),
        rif: rif ? String(rif).trim() : null,
        plan: 'basic',
        status: 'active',
        ownerId: user.id,
      },
    });

    await tx.profile.create({
      data: {
        id: user.id,
        tenantId: tenant.id,
        fullName: String(fullName).trim(),
        role: 'OWNER',
      },
    });

    return { userId: user.id, tenantId: tenant.id };
  });

  return result;
}

module.exports = { registerNewWorkshop };
