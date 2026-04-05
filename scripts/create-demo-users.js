#!/usr/bin/env node
/**
 * Script administrativo LOCAL (Node.js). No ejecutar en el navegador.
 * Usa SUPABASE_SERVICE_ROLE_KEY — nunca la incluyas en el frontend.
 *
 * Uso: node scripts/create-demo-users.js
 * Requiere: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (p. ej. en backend/.env)
 */

'use strict';

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || 'Taller360Demo!';

const EMAILS = {
  admin: 'admin@arsysintela.com',
  owner: 'owner@taller360.com',
  client: 'cliente@taller360.com',
};

/** Mismos UUID que database/seeds/001_demo_seed.sql para datos relacionados */
const IDS = {
  tenant: 'b2000000-0000-4000-8000-000000000001',
  client: 'c3000000-0000-4000-8000-000000000001',
  vehicle: 'd4000000-0000-4000-8000-000000000001',
  order1: 'e5000000-0000-4000-8000-000000000001',
  order2: 'e5000000-0000-4000-8000-000000000002',
  inv1: 'f6000000-0000-4000-8000-000000000001',
  inv2: 'f6000000-0000-4000-8000-000000000002',
};

function die(msg) {
  console.error('Error:', msg);
  process.exit(1);
}

async function findUserByEmail(admin, email) {
  const target = email.trim().toLowerCase();
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw error;
    }
    const found = data.users.find((u) => (u.email || '').toLowerCase() === target);
    if (found) {
      return found;
    }
    if (data.users.length < perPage) {
      return null;
    }
    page += 1;
  }
}

/**
 * Obtiene usuario existente o lo crea en Auth.
 * @returns {Promise<string>} user id (uuid)
 */
async function getOrCreateAuthUser(admin, email, fullName) {
  const existing = await findUserByEmail(admin, email);
  if (existing) {
    console.log(`  [Auth] Ya existe: ${email} → ${existing.id}`);
    return existing.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('already been registered') || msg.includes('already exists')) {
      const again = await findUserByEmail(admin, email);
      if (again) {
        console.log(`  [Auth] Ya registrado (race): ${email} → ${again.id}`);
        return again.id;
      }
    }
    throw error;
  }

  console.log(`  [Auth] Creado: ${email} → ${data.user.id}`);
  return data.user.id;
}

async function upsertProfile(admin, row) {
  const { error } = await admin.from('profiles').upsert(row, { onConflict: 'id' });
  if (error) {
    throw error;
  }
  console.log(`  [profiles] OK: ${row.id} (${row.role})`);
}

async function ensureTenant(admin, ownerId) {
  const { data: row, error: selErr } = await admin.from('tenants').select('id, owner_id').eq('id', IDS.tenant).maybeSingle();
  if (selErr) {
    throw selErr;
  }

  if (!row) {
    const { error } = await admin.from('tenants').insert({
      id: IDS.tenant,
      name: 'Taller Demo 360',
      rif: 'J-12345678-9',
      plan: 'pro',
      status: 'active',
      owner_id: ownerId,
    });
    if (error) {
      throw error;
    }
    console.log('  [tenants] Creado tenant demo');
    return;
  }

  if (row.owner_id !== ownerId) {
    const { error } = await admin.from('tenants').update({ owner_id: ownerId }).eq('id', IDS.tenant);
    if (error) {
      throw error;
    }
    console.log('  [tenants] Actualizado owner_id del tenant demo');
  } else {
    console.log('  [tenants] Tenant demo ya existía (sin cambios)');
  }
}

async function ensureClientRow(admin) {
  const { data: row } = await admin.from('clients').select('id').eq('id', IDS.client).maybeSingle();
  if (row) {
    console.log('  [clients] Fila demo ya existía');
    return;
  }
  const { error } = await admin.from('clients').insert({
    id: IDS.client,
    tenant_id: IDS.tenant,
    name: 'Cliente Demo',
    email: 'cliente.demo@example.com',
    phone: '+58 424-0000000',
  });
  if (error) {
    throw error;
  }
  console.log('  [clients] Creado cliente demo');
}

async function ensureVehicle(admin) {
  const { data: row } = await admin.from('vehicles').select('id').eq('id', IDS.vehicle).maybeSingle();
  if (row) {
    console.log('  [vehicles] Vehículo demo ya existía');
    return;
  }
  const { error } = await admin.from('vehicles').insert({
    id: IDS.vehicle,
    tenant_id: IDS.tenant,
    client_id: IDS.client,
    plate: 'AB123CD',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    km: 45000,
    photos: [],
  });
  if (error) {
    throw error;
  }
  console.log('  [vehicles] Creado vehículo demo');
}

async function ensureWorkOrders(admin) {
  for (const spec of [
    {
      id: IDS.order1,
      status: 'REPAIRING',
      description: 'Cambio de pastillas de freno',
      total_cost: 185.0,
    },
    {
      id: IDS.order2,
      status: 'READY',
      description: 'Cambio de aceite y filtro',
      total_cost: 65.5,
    },
  ]) {
    const { data: row } = await admin.from('work_orders').select('id').eq('id', spec.id).maybeSingle();
    if (row) {
      continue;
    }
    const { error } = await admin.from('work_orders').insert({
      id: spec.id,
      tenant_id: IDS.tenant,
      vehicle_id: IDS.vehicle,
      status: spec.status,
      description: spec.description,
      total_cost: spec.total_cost,
    });
    if (error) {
      throw error;
    }
    console.log(`  [work_orders] Creada orden ${spec.id.slice(0, 8)}…`);
  }
}

async function ensureInventory(admin) {
  const items = [
    { id: IDS.inv1, part_name: 'Filtro de aceite estándar', stock: 24, price: 12.5 },
    { id: IDS.inv2, part_name: 'Pastillas de freno delanteras', stock: 6, price: 85.0 },
  ];
  for (const it of items) {
    const { data: row } = await admin.from('inventory').select('id').eq('id', it.id).maybeSingle();
    if (row) {
      continue;
    }
    const { error } = await admin.from('inventory').insert({
      id: it.id,
      tenant_id: IDS.tenant,
      part_name: it.part_name,
      stock: it.stock,
      price: it.price,
    });
    if (error) {
      throw error;
    }
    console.log(`  [inventory] Creado: ${it.part_name}`);
  }
}

async function main() {
  if (!URL || !SERVICE_KEY) {
    die('Defina SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (recomendado: backend/.env en este repo).');
  }

  console.log('Taller360 — create-demo-users.js (solo Node, service role)\n');

  const admin = createClient(URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('1) Usuarios Auth (omitir si ya existen por email)\n');
  const adminId = await getOrCreateAuthUser(admin, EMAILS.admin, 'Admin Demo');
  const ownerId = await getOrCreateAuthUser(admin, EMAILS.owner, 'Dueño Demo');
  const clientUserId = await getOrCreateAuthUser(admin, EMAILS.client, 'Cliente Demo');

  console.log('\n2) Tenant demo (owner_id = dueño)\n');
  await ensureTenant(admin, ownerId);

  console.log('\n3) Cliente, vehículo, órdenes e inventario demo\n');
  await ensureClientRow(admin);
  await ensureVehicle(admin);
  await ensureWorkOrders(admin);
  await ensureInventory(admin);

  console.log('\n4) Perfiles public.profiles\n');
  await upsertProfile(admin, {
    id: adminId,
    tenant_id: null,
    full_name: 'Admin Demo',
    role: 'SUPERADMIN',
    client_id: null,
  });
  await upsertProfile(admin, {
    id: ownerId,
    tenant_id: IDS.tenant,
    full_name: 'Dueño Demo',
    role: 'OWNER',
    client_id: null,
  });
  await upsertProfile(admin, {
    id: clientUserId,
    tenant_id: IDS.tenant,
    full_name: 'Cliente Demo',
    role: 'CLIENT',
    client_id: IDS.client,
  });

  console.log('\nListo.\n');
  console.log('Credenciales demo (cámbialas en producción):');
  console.log(`  ${EMAILS.admin} / ${DEMO_PASSWORD}`);
  console.log(`  ${EMAILS.owner} / ${DEMO_PASSWORD}`);
  console.log(`  ${EMAILS.client} / ${DEMO_PASSWORD}`);
  console.log('\n(Si DEMO_USER_PASSWORD no está en .env, se usó la contraseña por defecto del script.)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
