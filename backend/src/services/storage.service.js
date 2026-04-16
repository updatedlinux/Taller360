const fs = require('fs/promises');
const path = require('path');
const { getPrisma } = require('../lib/prisma');
const { httpError } = require('../middlewares/errorHandler');
const { env } = require('../config/env');

/**
 * @param {string} tenantId
 * @param {string} vehicleId
 * @param {string} originalName
 * @returns {string} ruta relativa tenantId/vehicleId/archivo
 */
function buildVehicleObjectPath(tenantId, vehicleId, originalName) {
  const safe = String(originalName || 'foto').replace(/[^a-zA-Z0-9._-]/g, '_');
  const stamp = Date.now();
  return `${tenantId}/${vehicleId}/${stamp}-${safe}`;
}

function parsePhotos(raw) {
  try {
    const j = JSON.parse(raw || '[]');
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

/**
 * @param {string} vehicleId
 * @param {string} objectPath
 */
async function appendVehiclePhotoPath(vehicleId, objectPath) {
  const prisma = getPrisma();
  const row = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { photos: true } });
  if (!row) {
    throw httpError(404, 'Vehículo no encontrado');
  }
  const photos = parsePhotos(row.photos).concat(objectPath);
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { photos: JSON.stringify(photos) },
  });
  return photos;
}

/**
 * Escribe buffer en disco bajo uploads/vehicles/...
 * @param {string} relativePath
 * @param {Buffer} buffer
 */
async function saveVehicleFile(relativePath, buffer) {
  const abs = path.join(env.uploadsDir, 'vehicles', relativePath);
  const dir = path.dirname(abs);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(abs, buffer);
}

/**
 * Ruta absoluta segura (sin ..)
 * @param {string} relativePath tenantId/vid/file
 */
function absoluteVehiclePath(relativePath) {
  const norm = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const abs = path.join(env.uploadsDir, 'vehicles', norm);
  const root = path.join(env.uploadsDir, 'vehicles');
  if (!abs.startsWith(root)) {
    throw httpError(400, 'Ruta inválida');
  }
  return abs;
}

module.exports = {
  buildVehicleObjectPath,
  appendVehiclePhotoPath,
  saveVehicleFile,
  absoluteVehiclePath,
  parsePhotos,
};
