# Scripts (Taller360)

Uso solo en **entorno local** o CI con secretos. No se exponen al navegador.

## Datos iniciales (SQL Server + Prisma)

El usuario **SUPERADMIN** y el esquema se gestionan con Prisma:

- Migraciones: `npm run db:migrate` o `npm run db:deploy` (desde la raíz del repo).
- Seed del superadmin: `npm run db:seed` (variables opcionales `SEED_SUPERADMIN_EMAIL` y `SEED_SUPERADMIN_PASSWORD` en `backend/.env`).

Ver `backend/.env.example` y `backend/prisma/`.
