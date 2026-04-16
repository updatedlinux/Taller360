const { getPrisma } = require('../lib/prisma');

/**
 * Resuelve el vínculo cliente–cuenta por email dentro del tenant.
 * @param {{ role: string, tenantId: string | null, clientId: string | null }} profile
 * @param {string} emailNorm email en minúsculas
 */
async function resolveClientIdForUser(profile, emailNorm) {
  if (profile.role !== 'CLIENT' || !profile.tenantId || !emailNorm) {
    return profile.clientId;
  }
  if (profile.clientId) return profile.clientId;
  const prisma = getPrisma();
  const row = await prisma.client.findFirst({
    where: { tenantId: profile.tenantId, email: emailNorm },
    select: { id: true },
  });
  return row ? row.id : null;
}

module.exports = { resolveClientIdForUser };
