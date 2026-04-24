This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Autenticación y roles

### Archivos clave

| Archivo | Responsabilidad |
|---------|----------------|
| `lib/auth/provider.tsx` | Context provider — estado global de auth |
| `lib/auth/types.ts` | Tipos `Role`, `AuthUser`, jerarquía y rutas por rol |
| `lib/auth/api/auth.api.ts` | Llamadas HTTP al backend de auth |
| `lib/shared/api/client.ts` | Cliente HTTP — inyecta el Bearer token en cada request |
| `lib/shared/components/Sidebar.tsx` | UI del switcher de roles |

### Flujo de autenticación

1. El usuario hace login (`POST /api/auth/token/`) → el backend devuelve un JWT.
2. El token se guarda en `localStorage` bajo la clave `auth_token`.
3. Inmediatamente se llama `GET /api/auth/me/` para obtener `role` y `active_role` desde el servidor.
4. En cada recarga de la app se repite el paso 3 — el backend es la fuente de verdad.

### Cambio de rol (switch)

Los usuarios con rango superior (`area_admin`, `super_admin`) pueden asumir un rol inferior para ver la app desde esa perspectiva.

**Endpoint:** `POST /api/auth/switch-role/`

```json
// Request — asumir rol inferior
{ "active_role": "technician" }

// Request — revertir al rol real
{ "active_role": null }

// Response
{ "token": "eyJ...", "role": "super_admin", "active_role": "technician" }
```

El backend emite un nuevo JWT con el override encodeado. El frontend guarda ese token y actualiza `activeRole` en el contexto. Las clases de permiso del backend usan siempre `real_role`, por lo que el override solo afecta el filtrado de datos y la vista — nunca los permisos de escritura.

**Jerarquía de roles** (de menor a mayor):

```
user  <  technician  <  area_admin  <  super_admin
```

Un rol solo puede asumir los que están por debajo de él en la jerarquía.

### Hook `useAuth`

```ts
const { user, activeRole, switchRole, login, logout, loading } = useAuth();
```

| Campo / función | Tipo | Descripción |
|-----------------|------|-------------|
| `user` | `AuthUser \| null` | `{ user_id, role, token }` — rol real del usuario |
| `activeRole` | `Role \| null` | Rol efectivo actual (puede ser un override) |
| `switchRole(role)` | `(Role \| null) => Promise<void>` | Cambia el rol activo; `null` revierte al real |
| `login(userId, role)` | `Promise<void>` | Autentica y redirige según el rol |
| `logout()` | `void` | Limpia sesión y redirige a `/login` |
| `loading` | `boolean` | `true` mientras se verifica la sesión inicial |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
