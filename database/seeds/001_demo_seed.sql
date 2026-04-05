-- =============================================================================
-- Taller360 — Datos demo (SQL Editor de Supabase)
-- NO crea filas en auth.users. Crea primero los 3 usuarios en Authentication.
--
-- ANTES DE EJECUTAR:
--   1) Authentication → Users → crear 3 usuarios (correo/contraseña).
--   2) Copiar el UUID de cada uno desde la lista de usuarios.
--   3) Reemplazar en TODO el archivo (buscar y reemplazar):
--        UUID_ADMIN_AQUI
--        UUID_OWNER_AQUI
--        UUID_CLIENTE_AQUI
--   4) El usuario OWNER debe ser el mismo UUID que owner_id del tenant.
--   5) El perfil CLIENT debe tener client_id apuntando al cliente demo.
-- =============================================================================

BEGIN;

-- Identificadores fijos del demo (no cambiar si quieres consistencia con el resto del seed)
-- tenant
-- b2000000-0000-4000-8000-000000000001
-- cliente
-- c3000000-0000-4000-8000-000000000001
-- vehículo
-- d4000000-0000-4000-8000-000000000001
-- órdenes
-- e5000000-0000-4000-8000-000000000001
-- e5000000-0000-4000-8000-000000000002
-- inventario (2 filas)
-- f6000000-0000-4000-8000-000000000001
-- f6000000-0000-4000-8000-000000000002

INSERT INTO public.tenants (id, name, rif, plan, status, owner_id)
VALUES (
  'b2000000-0000-4000-8000-000000000001',
  'Taller Demo 360',
  'J-12345678-9',
  'pro',
  'active',
  'UUID_OWNER_AQUI'::uuid
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.clients (id, tenant_id, name, email, phone)
VALUES (
  'c3000000-0000-4000-8000-000000000001',
  'b2000000-0000-4000-8000-000000000001',
  'Cliente Demo',
  'cliente.demo@example.com',
  '+58 424-0000000'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.vehicles (id, tenant_id, client_id, plate, brand, model, year, km, photos)
VALUES (
  'd4000000-0000-4000-8000-000000000001',
  'b2000000-0000-4000-8000-000000000001',
  'c3000000-0000-4000-8000-000000000001',
  'AB123CD',
  'Toyota',
  'Corolla',
  2020,
  45000,
  '{}'
)
ON CONFLICT (tenant_id, plate) DO NOTHING;

INSERT INTO public.work_orders (id, tenant_id, vehicle_id, status, description, total_cost)
VALUES
  (
    'e5000000-0000-4000-8000-000000000001',
    'b2000000-0000-4000-8000-000000000001',
    'd4000000-0000-4000-8000-000000000001',
    'REPAIRING',
    'Cambio de pastillas de freno',
    185.00
  ),
  (
    'e5000000-0000-4000-8000-000000000002',
    'b2000000-0000-4000-8000-000000000001',
    'd4000000-0000-4000-8000-000000000001',
    'READY',
    'Cambio de aceite y filtro',
    65.50
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventory (id, tenant_id, part_name, stock, price)
VALUES
  (
    'f6000000-0000-4000-8000-000000000001',
    'b2000000-0000-4000-8000-000000000001',
    'Filtro de aceite estándar',
    24,
    12.50
  ),
  (
    'f6000000-0000-4000-8000-000000000002',
    'b2000000-0000-4000-8000-000000000001',
    'Pastillas de freno delanteras',
    6,
    85.00
  )
ON CONFLICT (id) DO NOTHING;

-- Perfiles vinculados a auth.users (los UUID deben existir en Authentication)
INSERT INTO public.profiles (id, tenant_id, full_name, role, client_id)
VALUES
  (
    'UUID_ADMIN_AQUI'::uuid,
    NULL,
    'Admin Demo',
    'SUPERADMIN',
    NULL
  ),
  (
    'UUID_OWNER_AQUI'::uuid,
    'b2000000-0000-4000-8000-000000000001',
    'Dueño Demo',
    'OWNER',
    NULL
  ),
  (
    'UUID_CLIENTE_AQUI'::uuid,
    'b2000000-0000-4000-8000-000000000001',
    'Cliente Demo',
    'CLIENT',
    'c3000000-0000-4000-8000-000000000001'
  )
ON CONFLICT (id) DO UPDATE SET
  tenant_id = EXCLUDED.tenant_id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  client_id = EXCLUDED.client_id;

COMMIT;
