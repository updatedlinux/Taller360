-- =============================================================================
-- Taller360 — Portal SuperAdmin (ejecutar en Supabase SQL Editor)
-- Idempotente: crea owner_id si no existe, luego pending + columnas extra + RPC.
-- =============================================================================

-- --- owner_id: algunos proyectos tienen tenants sin esta columna ----------------
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS owner_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'tenants'
      AND c.conname = 'tenants_owner_id_fkey'
  ) THEN
    ALTER TABLE public.tenants
      ADD CONSTRAINT tenants_owner_id_fkey
      FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Permitir talleres sin dueño vinculado (p. ej. status pending)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'owner_id'
  ) THEN
    ALTER TABLE public.tenants ALTER COLUMN owner_id DROP NOT NULL;
  END IF;
END $$;

-- --- Estado pending -----------------------------------------------------------
ALTER TABLE public.tenants DROP CONSTRAINT IF EXISTS tenants_status_check;
ALTER TABLE public.tenants ADD CONSTRAINT tenants_status_check
  CHECK (status IN ('active', 'suspended', 'pending'));

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS owner_email text;

COMMENT ON COLUMN public.tenants.owner_email IS 'Correo del dueño previsto (taller pending hasta vincular auth.users).';

-- --- RPC: listado de perfiles con email (solo si el caller es SUPERADMIN) -----
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
