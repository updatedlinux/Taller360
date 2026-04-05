# Scripts administrativos (Taller360)

Solo para **entorno local** o CI con secretos. **No** se sirven al navegador.

## `create-demo-users.js`

Crea en tu proyecto Supabase:

1. Tres usuarios en **Auth** (si no existen ya, por correo):
   - `admin@arsysintela.com`
   - `owner@taller360.com`
   - `cliente@taller360.com`
2. Sus filas en **`public.profiles`** (upsert por `id`).
3. Un **tenant** demo, **cliente**, **vehículo**, **dos órdenes** e **inventario** (mismos UUID que `database/seeds/001_demo_seed.sql`).

### Requisitos

- Variables en `backend/.env` o `.env` en la raíz:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (solo servidor; **nunca** en el frontend)

### Uso

```bash
# desde la raíz del repo (usa dependencias del package.json raíz)
npm install
node scripts/create-demo-users.js
```

Opcional: define `DEMO_USER_PASSWORD` en `.env` para la contraseña de los tres usuarios demo. Si no existe, el script usa una contraseña por defecto (mira la salida al final).

### Idempotencia

- **Auth:** busca por email antes de crear; si el usuario ya existe, reutiliza su UUID.
- **Tablas:** comprueba filas por `id` antes de insertar; `profiles` y `tenants` se actualizan con **upsert** / **update** cuando aplica.

### Seguridad

- La **service role** omite RLS; úsala solo en máquinas de confianza.
- Cambia las contraseñas demo antes de cualquier entorno compartido.
