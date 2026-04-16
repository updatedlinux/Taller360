const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../middlewares/errorHandler');
const { getPrisma } = require('../lib/prisma');
const { tenantOut } = require('../utils/dto');

const PLAN_FEES_USD = { basic: 10, pro: 20 };

const router = Router();

router.get(
  '/tenants',
  asyncHandler(async (req, res) => {
    const prisma = getPrisma();
    const page = Math.max(0, parseInt(req.query.page || '0', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '10', 10)));
    const status = req.query.status;
    const search = String(req.query.search || '').trim();

    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { rif: { contains: search } },
        { ownerEmail: { contains: search } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: page * pageSize,
        take: pageSize,
      }),
      prisma.tenant.count({ where }),
    ]);

    res.json({
      ok: true,
      data: rows.map(tenantOut),
      total,
      page,
      pageSize,
    });
  }),
);

router.get(
  '/tenants/:id',
  asyncHandler(async (req, res) => {
    const prisma = getPrisma();
    const row = await prisma.tenant.findUnique({ where: { id: req.params.id } });
    if (!row) {
      throw httpError(404, 'Taller no encontrado');
    }
    res.json({ ok: true, data: tenantOut(row) });
  }),
);

router.post(
  '/tenants',
  asyncHandler(async (req, res) => {
    const { name, rif, plan, status, phone, owner_email, address } = req.body || {};
    if (!name) {
      throw httpError(400, 'name es obligatorio');
    }
    const prisma = getPrisma();
    const row = await prisma.tenant.create({
      data: {
        name: String(name).trim(),
        rif: rif ? String(rif).trim() : null,
        plan: plan || 'basic',
        status: status || 'pending',
        ownerId: null,
        phone: phone ? String(phone).trim() : null,
        ownerEmail: owner_email ? String(owner_email).trim().toLowerCase() : null,
        address: address ? String(address).trim() : null,
      },
    });
    res.status(201).json({ ok: true, data: tenantOut(row) });
  }),
);

router.patch(
  '/tenants/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, plan, name, rif } = req.body || {};
    const patch = {};
    if (status !== undefined) patch.status = status;
    if (plan !== undefined) patch.plan = plan;
    if (name !== undefined) patch.name = name;
    if (rif !== undefined) patch.rif = rif;
    if (Object.keys(patch).length === 0) {
      throw httpError(400, 'Nada que actualizar');
    }
    const prisma = getPrisma();
    let row;
    try {
      row = await prisma.tenant.update({
        where: { id },
        data: patch,
      });
    } catch (e) {
      if (e && e.code === 'P2025') {
        throw httpError(404, 'Taller no encontrado');
      }
      throw e;
    }
    res.json({ ok: true, data: tenantOut(row) });
  }),
);

router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const prisma = getPrisma();
    const [tenantsTotal, tenantsActive, totalProfiles, activeRows] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { status: 'active' } }),
      prisma.profile.count(),
      prisma.tenant.findMany({
        where: { status: 'active' },
        select: { plan: true },
      }),
    ]);

    let mrr = 0;
    for (const row of activeRows) {
      mrr += PLAN_FEES_USD[row.plan] ?? 0;
    }

    res.json({
      ok: true,
      data: {
        tenantsTotal,
        tenantsActive,
        totalProfiles,
        mrr,
      },
    });
  }),
);

router.get(
  '/dashboard/recent-tenants',
  asyncHandler(async (req, res) => {
    const prisma = getPrisma();
    const rows = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.json({ ok: true, data: rows.map(tenantOut) });
  }),
);

router.get(
  '/profiles',
  asyncHandler(async (req, res) => {
    const prisma = getPrisma();
    const rows = await prisma.profile.findMany({
      include: {
        tenant: true,
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const data = rows.map((p) => ({
      id: p.id,
      full_name: p.fullName,
      role: p.role,
      tenant_id: p.tenantId,
      tenant_name: p.tenant ? p.tenant.name : null,
      email: p.user && p.user.email ? p.user.email : '',
      created_at: p.createdAt,
    }));
    res.json({ ok: true, data });
  }),
);

module.exports = router;
