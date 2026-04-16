/**
 * Serializa entidades Prisma al formato snake_case usado por el frontend estático.
 */

function num(d) {
  if (d === null || d === undefined) return d;
  return typeof d === 'object' && d !== null && typeof d.toNumber === 'function' ? d.toNumber() : Number(d);
}

function tenantOut(t) {
  if (!t) return t;
  return {
    id: t.id,
    name: t.name,
    rif: t.rif,
    plan: t.plan,
    status: t.status,
    owner_id: t.ownerId,
    phone: t.phone,
    address: t.address,
    owner_email: t.ownerEmail,
    created_at: t.createdAt,
  };
}

function profileOut(p, email) {
  if (!p) return p;
  return {
    id: p.id,
    tenant_id: p.tenantId,
    full_name: p.fullName,
    role: p.role,
    client_id: p.clientId,
    created_at: p.createdAt,
    email: email || '',
  };
}

function clientOut(c) {
  if (!c) return c;
  return {
    id: c.id,
    tenant_id: c.tenantId,
    name: c.name,
    email: c.email,
    phone: c.phone,
    created_at: c.createdAt,
  };
}

function vehicleOut(v, photoExtras) {
  if (!v) return v;
  const base = {
    id: v.id,
    tenant_id: v.tenantId,
    client_id: v.clientId,
    plate: v.plate,
    brand: v.brand,
    model: v.model,
    year: v.year,
    km: v.km,
    photos: v.photos,
    created_at: v.createdAt,
  };
  if (photoExtras) {
    return Object.assign(base, photoExtras);
  }
  return base;
}

function workOrderOut(w) {
  if (!w) return w;
  return {
    id: w.id,
    tenant_id: w.tenantId,
    vehicle_id: w.vehicleId,
    status: w.status,
    description: w.description,
    total_cost: num(w.totalCost),
    created_at: w.createdAt,
  };
}

function inventoryOut(i) {
  if (!i) return i;
  return {
    id: i.id,
    tenant_id: i.tenantId,
    part_name: i.partName,
    stock: num(i.stock),
    price: num(i.price),
    created_at: i.createdAt,
  };
}

module.exports = {
  num,
  tenantOut,
  profileOut,
  clientOut,
  vehicleOut,
  workOrderOut,
  inventoryOut,
};
