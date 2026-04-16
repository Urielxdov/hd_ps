# Guia de Migracion: Estructura Anterior → Domain-First

Registro de la migracion realizada, con el mapeo archivo por archivo.

---

## Estructura Anterior

```
lib/
├── types.ts                       # Todos los tipos + constantes
├── api.ts                         # ApiClient con ~20 metodos
├── auth.tsx                       # AuthContext + Provider
├── helpdesk/
│   ├── types.ts                   # Tipos del reducer + HelpDesk
│   ├── initial-state.ts
│   ├── reducer.ts
│   └── use-helpdesk-list.ts
├── departaments/
│   ├── types.ts
│   ├── initial-state.ts
│   ├── reducer.ts
│   └── use-helpdesk-list.ts
├── categories/
│   ├── types.ts
│   ├── initial-state.ts
│   ├── reducer.ts
│   └── use-category-cache.ts
└── services/
    ├── types.ts
    ├── initial-state.ts
    ├── reducer.ts
    └── use-service-cache.ts

components/
├── Modal.tsx
├── Sidebar.tsx
├── HDTable.tsx
├── HDBadge.tsx
├── StatusStepper.tsx
├── CommentThread.tsx
├── AttachmentUploader.tsx
├── AssignModal.tsx
└── ResolveModal.tsx
```

---

## Estructura Nueva (Domain-First)

```
lib/
├── helpdesk/
│   ├── domain/
│   │   └── transitions.ts         # canTransition(), getValidTransitions()
│   ├── api/
│   │   └── helpdesk.api.ts        # Metodos HD extraidos de api.ts
│   ├── state/
│   │   ├── types.ts
│   │   ├── initial-state.ts
│   │   └── reducer.ts
│   ├── hooks/
│   │   └── use-helpdesk-list.ts
│   ├── components/
│   │   ├── HDTable.tsx
│   │   ├── HDBadge.tsx
│   │   ├── StatusStepper.tsx
│   │   ├── CommentThread.tsx
│   │   ├── AttachmentUploader.tsx
│   │   ├── AssignModal.tsx
│   │   └── ResolveModal.tsx
│   ├── types.ts                   # Estado, Prioridad, Origen, HelpDesk, HDComment...
│   └── index.ts
│
├── department/
│   ├── api/
│   │   └── department.api.ts
│   ├── state/
│   │   ├── types.ts
│   │   ├── initial-state.ts
│   │   └── reducer.ts
│   ├── hooks/
│   │   └── use-department-list.ts
│   ├── types.ts                   # Department
│   └── index.ts
│
├── catalog/
│   ├── api/
│   │   └── catalog.api.ts
│   ├── state/
│   │   ├── types.ts
│   │   ├── category-reducer.ts
│   │   └── service-reducer.ts
│   ├── hooks/
│   │   ├── use-category-cache.ts
│   │   └── use-service-cache.ts
│   ├── types.ts                   # ServiceCategory, Service
│   └── index.ts
│
├── auth/
│   ├── api/
│   │   └── auth.api.ts
│   ├── provider.tsx
│   ├── types.ts                   # AuthUser, Role, ROLE_HOME
│   └── index.ts
│
└── shared/
    ├── api/
    │   └── client.ts              # ApiClient base + ApiError + singleton apiClient
    ├── components/
    │   ├── Modal.tsx
    │   └── Sidebar.tsx
    └── types.ts                   # PaginatedResponse<T>
```

---

## Mapeo Archivo por Archivo

| Archivo anterior | Destino |
|---|---|
| `lib/types.ts` (Estado, Prioridad, Origen, TipoAdjunto, labels) | `lib/helpdesk/types.ts` |
| `lib/types.ts` (VALID_TRANSITIONS) | `lib/helpdesk/domain/transitions.ts` |
| `lib/types.ts` (HelpDesk, HDComment, HDAttachment) | `lib/helpdesk/types.ts` |
| `lib/types.ts` (Department) | `lib/department/types.ts` |
| `lib/types.ts` (ServiceCategory, Service) | `lib/catalog/types.ts` |
| `lib/types.ts` (AuthUser, Role) | `lib/auth/types.ts` |
| `lib/api.ts` (ApiClient clase base, ApiError) | `lib/shared/api/client.ts` |
| `lib/api.ts` (metodos helpdesk: getHelpDesks, createHelpDesk, changeStatus, assignHelpDesk, resolveHelpDesk, uploadAttachment, addUrlAttachment, deleteAttachment, getComments, addComment) | `lib/helpdesk/api/helpdesk.api.ts` |
| `lib/api.ts` (metodos department: getDepartments, createDepartment, updateDepartment) | `lib/department/api/department.api.ts` |
| `lib/api.ts` (metodos catalog: getDepartmentCategories, getDepartmentServices, createServiceCategory, updateServiceCategory, getCategoryServices, createService, updateService, toggleService) | `lib/catalog/api/catalog.api.ts` |
| `lib/api.ts` (metodo login) | `lib/auth/api/auth.api.ts` |
| `lib/auth.tsx` | `lib/auth/provider.tsx` |
| `lib/helpdesk/types.ts` (HelpDesk, PaginatedResponseHD, HelpDeskFilters, state/action types) | `lib/helpdesk/state/types.ts` |
| `lib/helpdesk/initial-state.ts` | `lib/helpdesk/state/initial-state.ts` |
| `lib/helpdesk/reducer.ts` | `lib/helpdesk/state/reducer.ts` |
| `lib/helpdesk/use-helpdesk-list.ts` | `lib/helpdesk/hooks/use-helpdesk-list.ts` |
| `lib/departaments/types.ts` | `lib/department/state/types.ts` |
| `lib/departaments/initial-state.ts` | `lib/department/state/initial-state.ts` |
| `lib/departaments/reducer.ts` | `lib/department/state/reducer.ts` |
| `lib/departaments/use-helpdesk-list.ts` | `lib/department/hooks/use-department-list.ts` |
| `lib/categories/types.ts` | `lib/catalog/state/types.ts` (merged) |
| `lib/categories/initial-state.ts` | `lib/catalog/state/category-reducer.ts` (inline) |
| `lib/categories/reducer.ts` | `lib/catalog/state/category-reducer.ts` |
| `lib/categories/use-category-cache.ts` | `lib/catalog/hooks/use-category-cache.ts` |
| `lib/services/types.ts` | `lib/catalog/state/types.ts` (merged) |
| `lib/services/initial-state.ts` | `lib/catalog/state/service-reducer.ts` (inline) |
| `lib/services/reducer.ts` | `lib/catalog/state/service-reducer.ts` |
| `lib/services/use-service-cache.ts` | `lib/catalog/hooks/use-service-cache.ts` |
| `components/Modal.tsx` | `lib/shared/components/Modal.tsx` |
| `components/Sidebar.tsx` | `lib/shared/components/Sidebar.tsx` |
| `components/HDTable.tsx` | `lib/helpdesk/components/HDTable.tsx` |
| `components/HDBadge.tsx` | `lib/helpdesk/components/HDBadge.tsx` |
| `components/StatusStepper.tsx` | `lib/helpdesk/components/StatusStepper.tsx` |
| `components/CommentThread.tsx` | `lib/helpdesk/components/CommentThread.tsx` |
| `components/AttachmentUploader.tsx` | `lib/helpdesk/components/AttachmentUploader.tsx` |
| `components/AssignModal.tsx` | `lib/helpdesk/components/AssignModal.tsx` |
| `components/ResolveModal.tsx` | `lib/helpdesk/components/ResolveModal.tsx` |

---

## Archivos Eliminados

- `lib/types.ts` — dividido en `helpdesk/types.ts`, `department/types.ts`, `catalog/types.ts`, `auth/types.ts`
- `lib/api.ts` — dividido en `helpdesk/api/`, `department/api/`, `catalog/api/`, `auth/api/`, `shared/api/`
- `lib/auth.tsx` — movido a `auth/provider.tsx`
- `lib/departaments/` — renombrado y reorganizado en `department/`
- `lib/categories/` — fusionado en `catalog/`
- `lib/services/` — fusionado en `catalog/`
- `components/` — distribuido entre `helpdesk/components/` y `shared/components/`

---

## Tipos Reales de las Interfaces

### helpdesk/types.ts

```typescript
type Estado = 'abierto' | 'en_progreso' | 'en_espera' | 'resuelto' | 'cerrado';
type Origen = 'error' | 'solicitud' | 'consulta' | 'mantenimiento';
type Prioridad = 'baja' | 'media' | 'alta' | 'critica';
type TipoAdjunto = 'archivo' | 'url';

interface HelpDesk {
  id: number;
  folio: string;
  solicitante_id: number | null;
  responsable_id: number | null;
  service: number;
  service_nombre: string;
  origen: Origen;
  prioridad: Prioridad;
  estado: Estado;
  descripcion_problema: string;
  descripcion_solucion: string | null;
  fecha_asignacion: string | null;
  fecha_compromiso: string | null;
  fecha_efectividad: string | null;
  tiempo_estimado: number;
  attachments: HDAttachment[];
  created_at: string;
  updated_at: string;
}

interface HDComment {
  id: number;
  autor_id: number | null;
  contenido: string;
  es_interno: boolean;
  created_at: string;
}

interface HDAttachment {
  id: number;
  tipo: TipoAdjunto;
  nombre: string;
  valor: string;
  created_at: string;
}
```

### department/types.ts

```typescript
interface Department {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  created_at: string;
}
```

### catalog/types.ts

```typescript
interface ServiceCategory {
  id: number;
  nombre: string;
  department: number;
  department_nombre: string;
  activo: boolean;
}

interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  category: number;
  category_nombre: string;
  tiempo_estimado_default: number;
  activo: boolean;
  created_at: string;
}
```

### auth/types.ts

```typescript
type Role = 'user' | 'technician' | 'area_admin' | 'super_admin';

interface AuthUser {
  user_id: number;
  role: Role;
  token: string;
}

const ROLE_HOME: Record<Role, string> = {
  user: '/helpdesks',
  technician: '/queue',
  area_admin: '/area/helpdesks',
  super_admin: '/area/helpdesks',
};
```

---

## Endpoints de la API

Base URL: configurada en `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080/api`)

### helpdesk/api/helpdesk.api.ts

| Funcion | Metodo | Endpoint |
|---|---|---|
| `getHelpDesks(params?)` | GET | `/helpdesks/` |
| `getHelpDesk(id)` | GET | `/helpdesks/{id}/` |
| `createHelpDesk(data)` | POST | `/helpdesks/` |
| `changeStatus(id, estado)` | PATCH | `/helpdesks/{id}/status/` |
| `assignHelpDesk(id, data)` | PATCH | `/helpdesks/{id}/assign/` |
| `resolveHelpDesk(id, descripcion_solucion)` | PATCH | `/helpdesks/{id}/resolve/` |
| `uploadAttachment(helpDeskId, file, nombre)` | POST | `/helpdesks/{id}/attachments/` |
| `addUrlAttachment(helpDeskId, nombre, url)` | POST | `/helpdesks/{id}/attachments/` |
| `deleteAttachment(helpDeskId, attachmentId)` | DELETE | `/helpdesks/{id}/attachments/{attId}/` |
| `getComments(helpDeskId)` | GET | `/helpdesks/{id}/comments/` |
| `addComment(helpDeskId, contenido, es_interno)` | POST | `/helpdesks/{id}/comments/` |

### department/api/department.api.ts

| Funcion | Metodo | Endpoint |
|---|---|---|
| `getDepartments(params?)` | GET | `/departments/` |
| `createDepartment(data)` | POST | `/departments/` |
| `updateDepartment(id, data)` | PUT | `/departments/{id}/` |

### catalog/api/catalog.api.ts

| Funcion | Metodo | Endpoint |
|---|---|---|
| `getDepartmentCategories(deptId)` | GET | `/departments/{id}/categories/` |
| `getDepartmentServices(deptId)` | GET | `/departments/{id}/services/` |
| `createServiceCategory(data)` | POST | `/service-categories/` |
| `updateServiceCategory(id, data)` | PUT | `/service-categories/{id}/` |
| `getCategoryServices(catId)` | GET | `/service-categories/{id}/services/` |
| `createService(data)` | POST | `/services/` |
| `updateService(id, data)` | PUT | `/services/{id}/` |
| `toggleService(id)` | PATCH | `/services/{id}/toggle/` |

### auth/api/auth.api.ts

| Funcion | Metodo | Endpoint |
|---|---|---|
| `login(userId: number, role: string)` | POST | `/auth/token/` |

---

## Transiciones de Estado Validas

```
abierto     → [en_progreso]
en_progreso → [en_espera, resuelto]
en_espera   → [en_progreso, resuelto]
resuelto    → [cerrado]
cerrado     → []  (estado terminal)
```
