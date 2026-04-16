const { Router } = require('express');
const multer = require('multer');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../middlewares/errorHandler');
const { getPrisma } = require('../lib/prisma');
const { inventoryOut } = require('../utils/dto');

const clientsController = require('../controllers/clients.controller');
const vehiclesController = require('../controllers/vehicles.controller');
const workOrdersController = require('../controllers/workOrders.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

function tid(req) {
  const id = req.user && req.user.tenant_id;
  if (!id) {
    throw httpError(400, 'tenant_id no disponible en el perfil');
  }
  return id;
}

const router = Router();

router.get('/clients', asyncHandler(clientsController.list));
router.get('/clients/:id', asyncHandler(clientsController.getById));
router.post('/clients', asyncHandler(clientsController.create));
router.put('/clients/:id', asyncHandler(clientsController.update));
router.delete('/clients/:id', asyncHandler(clientsController.remove));

router.get('/vehicles', asyncHandler(vehiclesController.list));
router.get('/vehicles/:id', asyncHandler(vehiclesController.getById));
router.post('/vehicles', asyncHandler(vehiclesController.create));
router.put('/vehicles/:id', asyncHandler(vehiclesController.update));
router.delete('/vehicles/:id', asyncHandler(vehiclesController.remove));
router.post(
  '/vehicles/:vehicleId/photos',
  upload.single('photo'),
  asyncHandler(vehiclesController.uploadPhoto),
);

router.get('/work-orders', asyncHandler(workOrdersController.list));
router.get('/work-orders/:id', asyncHandler(workOrdersController.getById));
router.post('/work-orders', asyncHandler(workOrdersController.create));

router.get(
  '/inventory',
  asyncHandler(async (req, res) => {
    const prisma = getPrisma();
    const rows = await prisma.inventory.findMany({
      where: { tenantId: tid(req) },
      orderBy: { partName: 'asc' },
    });
    res.json({ ok: true, data: rows.map(inventoryOut) });
  }),
);

router.post(
  '/inventory',
  asyncHandler(async (req, res) => {
    const { part_name, stock, price } = req.body || {};
    if (!part_name) {
      throw httpError(400, 'part_name es obligatorio');
    }
    const prisma = getPrisma();
    const row = await prisma.inventory.create({
      data: {
        tenantId: tid(req),
        partName: part_name,
        stock: stock != null ? Number(stock) : 0,
        price: price != null ? Number(price) : 0,
      },
    });
    res.status(201).json({ ok: true, data: inventoryOut(row) });
  }),
);

module.exports = router;
