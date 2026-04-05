-- =============================================================================
-- Taller360 — Pegar en SQL Editor de Supabase (PostgreSQL + RLS + Storage)
-- Orden: extensiones → tablas → funciones → RLS → bucket Storage → políticas
--
-- Primer SUPERADMIN:
--   1) Authentication → Users → Add user (correo / contraseña).
--   2) Copiar UUID del usuario y ejecutar:
--        INSERT INTO public.profiles (id, tenant_id, full_name, role)
--        VALUES ('<uuid-del-usuario>', NULL, 'Admin Arsys', 'SUPERADMIN');
--
-- Registro de talleres nuevos: usar el formulario /register-taller.html contra
-- POST /api/auth/register-taller (requiere SUPABASE_SERVICE_ROLE_KEY en Node).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rif text,
  plan text NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'pro')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  owner_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  phone text,
  address text,
  owner_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants (id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES public.tenants (id) ON DELETE SET NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('SUPERADMIN', 'OWNER', 'CLIENT')),
  client_id uuid REFERENCES public.clients (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_client_requires_tenant CHECK (
    client_id IS NULL OR tenant_id IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants (id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients (id) ON DELETE CASCADE,
  plate text NOT NULL,
  brand text,
  model text,
  year int,
  km int,
  photos text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_vehicles_tenant_plate UNIQUE (tenant_id, plate)
);

CREATE TABLE IF NOT EXISTS public.work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants (id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'RECEIVED'
    CHECK (status IN ('RECEIVED', 'DIAGNOSING', 'REPAIRING', 'READY')),
  description text,
  total_cost numeric(14, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants (id) ON DELETE CASCADE,
  part_name text NOT NULL,
  stock numeric(14, 4) NOT NULL DEFAULT 0,
  price numeric(14, 4) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_tenant ON public.clients (tenant_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_tenant ON public.vehicles (tenant_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_client ON public.vehicles (client_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_tenant ON public.work_orders (tenant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON public.inventory (tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant ON public.profiles (tenant_id);

-- ---------------------------------------------------------------------------
-- Funciones auxiliares (SECURITY DEFINER para RLS sin recursión)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'SUPERADMIN'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.role FROM public.profiles p WHERE p.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.tenant_id FROM public.profiles p WHERE p.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_client_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.client_id FROM public.profiles p
  WHERE p.id = auth.uid() AND p.role = 'CLIENT';
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- tenants
DROP POLICY IF EXISTS tenants_select ON public.tenants;
CREATE POLICY tenants_select ON public.tenants FOR SELECT TO authenticated
  USING (
    public.is_superadmin()
    OR owner_id = auth.uid()
    OR id = public.current_tenant_id()
  );

DROP POLICY IF EXISTS tenants_update ON public.tenants;
CREATE POLICY tenants_update ON public.tenants FOR UPDATE TO authenticated
  USING (public.is_superadmin() OR owner_id = auth.uid())
  WITH CHECK (public.is_superadmin() OR owner_id = auth.uid());

DROP POLICY IF EXISTS tenants_insert ON public.tenants;
CREATE POLICY tenants_insert ON public.tenants FOR INSERT TO authenticated
  WITH CHECK (public.is_superadmin() OR owner_id = auth.uid());

-- profiles
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_superadmin())
  WITH CHECK (id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS profiles_insert ON public.profiles;
CREATE POLICY profiles_insert ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() OR public.is_superadmin());

-- clients
DROP POLICY IF EXISTS clients_all_owner ON public.clients;
CREATE POLICY clients_all_owner ON public.clients FOR ALL TO authenticated
  USING (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
    OR (
      id = public.current_client_id()
      AND public.current_profile_role() = 'CLIENT'
    )
  )
  WITH CHECK (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  );

-- vehicles
DROP POLICY IF EXISTS vehicles_select ON public.vehicles;
CREATE POLICY vehicles_select ON public.vehicles FOR SELECT TO authenticated
  USING (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'CLIENT'
      AND client_id = public.current_client_id()
    )
  );

DROP POLICY IF EXISTS vehicles_write_owner ON public.vehicles;
CREATE POLICY vehicles_write_owner ON public.vehicles FOR INSERT TO authenticated
  WITH CHECK (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  );

DROP POLICY IF EXISTS vehicles_update_owner ON public.vehicles;
CREATE POLICY vehicles_update_owner ON public.vehicles FOR UPDATE TO authenticated
  USING (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  )
  WITH CHECK (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  );

DROP POLICY IF EXISTS vehicles_delete_owner ON public.vehicles;
CREATE POLICY vehicles_delete_owner ON public.vehicles FOR DELETE TO authenticated
  USING (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  );

-- work_orders
DROP POLICY IF EXISTS work_orders_select ON public.work_orders;
DROP POLICY IF EXISTS work_orders_write_owner ON public.work_orders;
DROP POLICY IF EXISTS work_orders_select_client ON public.work_orders;
DROP POLICY IF EXISTS work_orders_owner ON public.work_orders;

CREATE POLICY work_orders_select_client ON public.work_orders FOR SELECT TO authenticated
  USING (
    public.current_profile_role() = 'CLIENT'
    AND tenant_id = public.current_tenant_id()
    AND EXISTS (
      SELECT 1 FROM public.vehicles v
      WHERE v.id = work_orders.vehicle_id
        AND v.client_id = public.current_client_id()
    )
  );

CREATE POLICY work_orders_owner ON public.work_orders FOR ALL TO authenticated
  USING (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  )
  WITH CHECK (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  );

-- inventory (solo SUPERADMIN y OWNER del tenant)
DROP POLICY IF EXISTS inventory_all ON public.inventory;
CREATE POLICY inventory_all ON public.inventory FOR ALL TO authenticated
  USING (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  )
  WITH CHECK (
    public.is_superadmin()
    OR (
      tenant_id = public.current_tenant_id()
      AND public.current_profile_role() = 'OWNER'
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: fotos en vehicles/{tenant_id}/{vehicle_id}/...
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicles', 'vehicles', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS storage_vehicles_select ON storage.objects;
CREATE POLICY storage_vehicles_select ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'vehicles'
    AND (
      public.is_superadmin()
      OR (
        public.current_profile_role() = 'OWNER'
        AND split_part(name, '/', 1)::uuid = public.current_tenant_id()
      )
      OR (
        public.current_profile_role() = 'CLIENT'
        AND EXISTS (
          SELECT 1 FROM public.vehicles v
          WHERE v.tenant_id = split_part(name, '/', 1)::uuid
            AND v.id = split_part(name, '/', 2)::uuid
            AND v.client_id = public.current_client_id()
        )
      )
    )
  );

DROP POLICY IF EXISTS storage_vehicles_insert ON storage.objects;
CREATE POLICY storage_vehicles_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'vehicles'
    AND (
      public.is_superadmin()
      OR (
        public.current_profile_role() = 'OWNER'
        AND split_part(name, '/', 1)::uuid = public.current_tenant_id()
      )
    )
  );

DROP POLICY IF EXISTS storage_vehicles_update ON storage.objects;
CREATE POLICY storage_vehicles_update ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'vehicles'
    AND (
      public.is_superadmin()
      OR (
        public.current_profile_role() = 'OWNER'
        AND split_part(name, '/', 1)::uuid = public.current_tenant_id()
      )
    )
  );

DROP POLICY IF EXISTS storage_vehicles_delete ON storage.objects;
CREATE POLICY storage_vehicles_delete ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'vehicles'
    AND (
      public.is_superadmin()
      OR (
        public.current_profile_role() = 'OWNER'
        AND split_part(name, '/', 1)::uuid = public.current_tenant_id()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- RPC: listado de perfiles + email (panel SuperAdmin en el navegador)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_profiles_list()
RETURNS TABLE (
  id uuid,
  full_name text,
  role text,
  tenant_id uuid,
  tenant_name text,
  email text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT
    p.id,
    p.full_name,
    p.role,
    p.tenant_id,
    t.name AS tenant_name,
    COALESCE(u.email, '')::text AS email,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.tenants t ON t.id = p.tenant_id
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE EXISTS (
    SELECT 1
    FROM public.profiles pr
    WHERE pr.id = auth.uid()
      AND pr.role = 'SUPERADMIN'
  );
$$;

REVOKE ALL ON FUNCTION public.admin_profiles_list() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_profiles_list() TO authenticated;

-- ---------------------------------------------------------------------------
-- Primer SUPERADMIN (ejecutar manualmente tras crear el usuario en Auth)
-- Reemplaza :user_id por el UUID de auth.users
-- ---------------------------------------------------------------------------
-- INSERT INTO public.profiles (id, tenant_id, full_name, role)
-- VALUES ('00000000-0000-0000-0000-000000000000', NULL, 'Arsys Admin', 'SUPERADMIN');
