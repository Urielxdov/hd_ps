# Help Desk UI

Frontend del sistema de mesa de ayuda. Construido con Next.js 16, React 19 y Tailwind CSS 4. Arquitectura modular por dominio en `lib/`.

---

## Stack técnico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16.2.3 | Framework (App Router) |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Tipos estáticos |
| Tailwind CSS | 4.x | Estilos |
| Lucide React | 1.8.0 | Iconos |

---

## Arquitectura

```
help_desk_ui/
├── app/                    # Páginas (Next.js App Router)
│   ├── login/              # Login público
│   └── (dashboard)/        # Rutas protegidas (requieren sesión)
│       ├── helpdesks/      # Gestión de tickets
│       ├── queue/          # Cola de tickets (técnicos)
│       ├── area/           # Vistas de área admin
│       └── admin/          # Panel super admin
└── lib/                    # Lógica de negocio y utilidades
    ├── auth/               # Autenticación y roles
    ├── helpdesk/           # Tickets e incidentes
    ├── catalog/            # Catálogo de servicios
    ├── sla/                # Configuración de SLA y colas
    ├── department/         # Departamentos
    ├── classify/           # Clasificación
    └── shared/             # Cliente HTTP, Sidebar, tipos comunes
```

Cada dominio en `lib/` sigue la misma estructura: `api/`, `hooks/`, `state/`, `components/`, `types.ts`, `index.ts`.

---

## Características

### 1. Autenticación y roles

| Archivo | Responsabilidad |
|---------|----------------|
| `lib/auth/provider.tsx` | Context provider — estado global de auth |
| `lib/auth/types.ts` | Tipos `Role`, `AuthUser`, jerarquía y rutas por rol |
| `lib/auth/api/auth.api.ts` | Llamadas HTTP al backend de auth |
| `lib/shared/api/client.ts` | Cliente HTTP — inyecta el Bearer token en cada request |
| `lib/shared/components/Sidebar.tsx` | UI del switcher de roles |

**Flujo de autenticación:**

1. El usuario hace login (`POST /api/auth/token/`) → el backend devuelve un JWT.
2. El token se guarda en `localStorage` bajo la clave `auth_token`.
3. Inmediatamente se llama `GET /api/auth/me/` para obtener `role` y `active_role` desde el servidor.
4. En cada recarga de la app se repite el paso 3 — el backend es la fuente de verdad.

**Jerarquía de roles** (de menor a mayor):

```
user  <  technician  <  area_admin  <  super_admin
```

**Cambio de rol (switch):**

Los usuarios con rango superior (`area_admin`, `super_admin`) pueden asumir un rol inferior para ver la app desde esa perspectiva.

Endpoint: `POST /api/auth/switch-role/`

```json
// Asumir rol inferior
{ "active_role": "technician" }

// Revertir al rol real
{ "active_role": null }

// Response
{ "token": "eyJ...", "role": "super_admin", "active_role": "technician" }
```

El override solo afecta el filtrado de datos y la vista — nunca los permisos de escritura (el backend usa siempre `real_role`).

**Hook `useAuth`:**

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

**Redirección por rol** (`ROLE_HOME` en `lib/auth/types.ts`):

| Rol | Ruta inicial |
|-----|-------------|
| `user` | `/helpdesks` |
| `technician` | `/queue` |
| `area_admin` | `/area/helpdesks` |
| `super_admin` | `/area/helpdesks` |

---

### 2. Gestión de tickets (Helpdesk)

Dominio principal. Un ticket representa una solicitud de soporte de un usuario final.

| Archivo | Responsabilidad |
|---------|----------------|
| `lib/helpdesk/types.ts` | Tipos completos del dominio |
| `lib/helpdesk/domain/transitions.ts` | Máquina de estados del ciclo de vida |
| `lib/helpdesk/api/helpdesk.api.ts` | CRUD de tickets |
| `lib/helpdesk/hooks/use-helpdesk.ts` | Estado de ticket individual |
| `lib/helpdesk/components/` | Componentes de UI |

**Ciclo de vida del ticket** (`Status`):

```
open → in_progress → on_hold → in_progress
                  ↘           ↘
                   resolved → closed
```

Reglas (`lib/helpdesk/domain/transitions.ts`):
- `open` solo puede pasar a `in_progress`
- `in_progress` puede ir a `on_hold` o `resolved`
- `on_hold` puede ir a `in_progress` o `resolved`
- `resolved` solo puede ir a `closed`
- `closed` es terminal

**Atributos clave de un ticket (`HelpDesk`):**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `folio` | `string` | ID legible (ej. `HD-2024-001`) |
| `status` | `Status` | Estado actual |
| `priority` | `Priority` | `low \| medium \| high \| critical` |
| `impact` | `Impact` | `individual \| area \| company` |
| `origin` | `Origin` | `error \| request \| inquiry \| maintenance` |
| `estimated_hours` | `number` | SLA estimado por el catálogo de servicios |
| `due_date` | `string?` | Fecha compromiso calculada por SLA |
| `requester_id` | `number` | Usuario solicitante |
| `assignee_id` | `number?` | Técnico asignado |
| `attachments` | `HDAttachment[]` | Archivos o URLs adjuntas |
| `comments` | `HDComment[]` | Comentarios (pueden ser internos — solo visibles para técnicos) |
| `incident_ref` | `IncidentRef?` | Referencia al incidente padre, si aplica |

**Visibilidad por rol** en `HelpDeskInfo`:

| Prop | Activo en rol | Descripción |
|------|--------------|-------------|
| `showRequester` | `technician`, `area_admin`, `super_admin` | Muestra el ID del solicitante |
| `showAssignee` | `user` | Muestra el técnico asignado |

---

### 3. Gestión de incidentes

Un incidente agrupa múltiples tickets del mismo servicio cuando el problema tiene alcance mayor.

| Archivo | Responsabilidad |
|---------|----------------|
| `lib/helpdesk/api/incident.api.ts` | `getIncidents`, `getIncident`, `createIncident`, `linkTickets` |
| `lib/helpdesk/hooks/use-incident.ts` | Estado de incidente individual con recarga |
| `lib/helpdesk/hooks/use-incident-list.ts` | Lista paginada con filtro por estado |
| `lib/helpdesk/components/IncidentMonitor.tsx` | Monitoreo de candidatos a incidente |
| `lib/helpdesk/components/CreateIncidentModal.tsx` | Formulario de creación manual |

**Monitor de incidentes (`IncidentMonitor`):**

Escanea servicios con tickets activos sin vincular. Si el conteo supera el umbral configurado en el SLA (`incident_threshold`), el servicio aparece como candidato. El admin puede crear el incidente desde ahí o ajustar el umbral.

**Tipos clave:**

- `MonitorCandidate` — servicio candidato con conteo de tickets activos no vinculados
- `MonitorResponse` — resultado del escaneo (umbral del sistema, total activos, lista de candidatos)
- `LinkedTicket` — referencia ligera a ticket hijo desde la perspectiva del incidente

---

### 4. Catálogo de servicios

Define los servicios que pueden generar tickets. Organizado por departamento y categoría.

| Archivo | Responsabilidad |
|---------|----------------|
| `lib/catalog/types.ts` | `ServiceCategory`, `Service` |
| `lib/catalog/api/catalog.api.ts` | Consultas de servicios |
| `lib/catalog/hooks/use-services-by-department.ts` | Servicios filtrados por departamento |
| `lib/catalog/hooks/use-category-cache.ts` | Cache de categorías |
| `lib/catalog/hooks/use-service-cache.ts` | Cache de servicios |

**`Service`:**

| Campo | Descripción |
|-------|-------------|
| `name` | Nombre del servicio |
| `estimated_hours` | Horas estimadas de resolución (se copia al ticket) |
| `impact` | Impacto por defecto (`individual \| area \| company`) |
| `client_close` | Si `true`, el usuario final puede cerrar el ticket al resolverse |
| `active` | Soft-delete — desactivar preserva historial de tickets |

---

### 5. SLA y cola de trabajo

Configura las políticas de nivel de servicio por departamento y gestiona la cola priorizada de tickets para técnicos.

| Archivo | Responsabilidad |
|---------|----------------|
| `lib/sla/types.ts` | `SLAConfig`, `ServiceQueueEntry`, `TechnicianProfile` |
| `app/(dashboard)/queue/` | Vista de cola para técnicos |

**`SLAConfig` (por departamento):**

| Campo | Descripción |
|-------|-------------|
| `max_load` | Máximo de tickets activos por técnico |
| `resolution_time` + `resolution_unit` | Tiempo máximo de resolución (`business_hours \| calendar_hours \| calendar_days`) |
| `overdue_weight` | Peso del factor vencimiento en el score de urgencia |
| `impact_weight` | Peso del impacto en el score |
| `priority_weight` | Peso de la prioridad en el score |
| `incident_threshold` | Tickets activos sin vincular que disparan candidato a incidente |

**`ServiceQueueEntry`:** ticket en cola con `urgency_score` calculado para priorización automática.

---

### 6. Departamentos

Estructura organizacional que agrupa técnicos y servicios.

| Archivo | Responsabilidad |
|---------|----------------|
| `lib/department/types.ts` | `Department` |
| `app/(dashboard)/admin/departments/` | Panel de administración |

`Department`: `id`, `name`, `description`, `active` (soft-delete), `created_at`.

---

## Getting Started

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> **Nota:** Este proyecto usa Next.js 16 con breaking changes respecto a versiones anteriores. Consultar `node_modules/next/dist/docs/` antes de modificar código relacionado con el framework.
