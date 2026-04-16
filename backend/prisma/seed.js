/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = String(process.env.SEED_SUPERADMIN_EMAIL || 'admin@local.test').toLowerCase();
  const password = process.env.SEED_SUPERADMIN_PASSWORD || 'CambiarLuego123!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('[seed] Usuario ya existe:', email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, passwordHash },
    });
    await tx.profile.create({
      data: {
        id: user.id,
        tenantId: null,
        fullName: 'Super Admin',
        role: 'SUPERADMIN',
      },
    });
  });

  console.log('[seed] SUPERADMIN creado:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
