const { PrismaClient } = require('@prisma/client');

/** @type {import('@prisma/client').PrismaClient | undefined} */
let prisma;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

module.exports = { getPrisma };
