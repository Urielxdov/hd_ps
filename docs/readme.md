# Arquitectura Domain-First - Help Desk System

Organizacion del proyecto **por modulo de dominio**, donde cada feature agrupa todo lo necesario (tipos, API, estado, componentes) en una sola carpeta. Similar al enfoque package-by-feature de Spring Boot moderno o NestJS modules.

## Tabla de Contenidos

- [Principios Clave](#principios-clave)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modulos de Dominio](#modulos-de-dominio)
- [Modulo Shared](#modulo-shared)
- [Integracion con Next.js](#integracion-con-nextjs)
- [Flujo de Datos](#flujo-de-datos)
- [Testing](#testing)

---

## Principios Clave

### 1. **Dominio primero, capas despues**
Cada modulo agrupa todo lo relacionado a un concepto de negocio. Para trabajar en "helpdesk" abres una sola carpeta.

### 2. **Cohesion alta, acoplamiento bajo**
Los archivos que cambian juntos viven juntos. Un cambio en helpdesk no deberia tocar department.

### 3. **Pragmatismo sobre purismo**
Usamos funciones puras y tipos TypeScript en lugar de clases con getters/setters. Aprovechamos React (hooks, context) en vez de reinventar DI containers.

### 4. **Next.js manda en las rutas**
La carpeta `app/` sigue siendo el punto de entrada de Next.js. Los modulos proveen la logica; las paginas la consumen.

### 5. **Testabilidad por modulo**
Cada modulo se puede testear aisladamente: dominio (unitario), API (mock HTTP), hooks (renderHook), componentes (render).

---

## Estructura del Proyecto

```
lib/
├── helpdesk/                      # Modulo: Gestion de tickets
│   ├── domain/
│   │   └── transitions.ts         # Reglas de transicion de estado
│   ├── api/
│   │   └── helpdesk.api.ts        # Llamadas HTTP de helpdesk
│   ├── state/
│   │   ├── types.ts               # Tipos del estado (reducer)
│   │   ├── initial-state.ts
│   │   └── reducer.ts
│   ├── hooks/
│   │   └── use-helpdesk-list.ts   # Hook de listado + filtros
│   ├── components/
│   │   ├── HDTable.tsx
│   │   ├── HDBadge.tsx
│   │   ├── StatusStepper.tsx
│   │   ├── CommentThread.tsx
│   │   ├── AttachmentUploader.tsx
│   │   ├── AssignModal.tsx
│   │   └── ResolveModal.tsx
│   ├── types.ts                   # Tipos del dominio (HelpDesk, Comment, etc.)
│   └── index.ts                   # Re-exports publicos del modulo
│
├── department/                    # Modulo: Departamentos
│   ├── api/
│   │   └── department.api.ts
│   ├── state/
│   │   ├── types.ts
│   │   ├── initial-state.ts
│   │   └── reducer.ts
│   ├── hooks/
│   │   └── use-department-list.ts
│   ├── types.ts
│   └── index.ts
│
├── catalog/                       # Modulo: Categorias + Servicios
│   ├── api/
│   │   └── catalog.api.ts
│   ├── state/
│   │   ├── types.ts
│   │   ├── category-reducer.ts
│   │   └── service-reducer.ts
│   ├── hooks/
│   │   ├── use-category-cache.ts
│   │   └── use-service-cache.ts
│   ├── types.ts
│   └── index.ts
│
├── auth/                          # Modulo: Autenticacion
│   ├── api/
│   │   └── auth.api.ts
│   ├── provider.tsx               # AuthContext + AuthProvider
│   ├── types.ts                   # AuthUser, Role
│   └── index.ts
│
└── shared/                        # Compartido entre modulos
    ├── api/
    │   └── client.ts              # HTTP base (token, headers, errores)
    ├── components/
    │   ├── Modal.tsx
    │   └── Sidebar.tsx
    └── types.ts                   # Tipos globales (paginacion, etc.)

app/                               # Next.js (sin cambio)
├── layout.tsx
├── page.tsx
├── login/page.tsx
└── (dashboard)/
    ├── layout.tsx
    ├── helpdesks/
    ├── queue/
    ├── area/
    └── admin/
```

---

## Modulos de Dominio

### helpdesk/

El modulo mas grande. Gestiona todo el ciclo de vida de un ticket.

```
helpdesk/
├── domain/
│   └── transitions.ts    ← canTransition(from, to): boolean
├── api/
│   └── helpdesk.api.ts   ← getHelpDesks(), createHelpDesk(), changeStatus()...
├── state/                ← Reducer para lista con filtros y paginacion
├── hooks/                ← useHelpDeskList() con auto-fetch y filtros
├── components/           ← Todo componente especifico de helpdesk
└── types.ts              ← HelpDesk, HDComment, HDAttachment, Estado, Prioridad
```

**Regla clave**: La logica de transiciones vive en `domain/transitions.ts`, no dispersa en las paginas. Cualquier pagina que necesite validar un cambio de estado importa desde aqui.

```typescript
// helpdesk/domain/transitions.ts
import type { Estado } from '../types';

const VALID_TRANSITIONS: Record<Estado, Estado[]> = {
  abierto: ['en_progreso'],
  en_progreso: ['en_espera', 'resuelto'],
  en_espera: ['en_progreso', 'resuelto'],
  resuelto: ['cerrado'],
  cerrado: [],
};

export function canTransition(from: Estado, to: Estado): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getValidTransitions(from: Estado): Estado[] {
  return VALID_TRANSITIONS[from] ?? [];
}
```

### department/

Gestion de departamentos (CRUD, activar/desactivar).

```
department/
├── api/                  ← getDepartments(), createDepartment(), updateDepartment()
├── state/                ← Reducer con filtros (activo, search)
├── hooks/                ← useDepartmentList()
└── types.ts              ← Department
```

### catalog/

Agrupa categorias y servicios porque comparten contexto (un servicio pertenece a una categoria que pertenece a un departamento).

```
catalog/
├── api/                  ← getDepartmentCategories(), getDepartmentServices(),
│                            getCategoryServices(), createService(), toggleService()...
├── state/
│   ├── types.ts          ← Tipos de ambos caches
│   ├── category-reducer  ← Cache por departmentId
│   └── service-reducer   ← Cache por categoryId
├── hooks/
│   ├── use-category-cache ← Lazy load por departamento
│   └── use-service-cache  ← Lazy load por categoria
└── types.ts              ← ServiceCategory, Service
```

### auth/

Autenticacion y sesion del usuario.

```
auth/
├── api/                  ← login(userId: number, role: string)
├── provider.tsx          ← AuthContext, AuthProvider, useAuth()
└── types.ts              ← AuthUser, Role, ROLE_HOME
```

---

## Modulo Shared

Contiene lo que cruza dominios y no pertenece a ningun modulo especifico.

```
shared/
├── api/client.ts         ← Clase ApiClient con token, headers, manejo de errores.
│                            Exporta singleton `apiClient` y clase `ApiError`.
├── components/
│   ├── Modal.tsx         ← Componente generico de modal
│   └── Sidebar.tsx       ← Navegacion global (usa roles de auth/)
└── types.ts              ← PaginatedResponse<T>
```

**Regla**: Si un componente o tipo solo lo usa un modulo, va en ese modulo. Solo sube a shared si lo usan 2+ modulos.

---

## Integracion con Next.js

Las paginas en `app/` son **thin wrappers** que importan desde los modulos:

```typescript
// app/(dashboard)/helpdesks/page.tsx
import { HDTable, useHelpDeskList } from '@/lib/helpdesk';

export default function MisHelpDesks() {
  const { state, setFilter } = useHelpDeskList();
  // ... render usando componentes del modulo
}
```

```typescript
// app/(dashboard)/queue/[id]/page.tsx
import {
  getHelpDesk, changeStatus, getValidTransitions,
  ESTADO_LABELS, CommentThread, AttachmentUploader, ResolveModal,
  type HelpDesk, type Estado,
} from '@/lib/helpdesk';

// La pagina no sabe las reglas, solo pregunta al dominio
const transitions = getValidTransitions(hd.estado);
```

Las paginas NO contienen:
- Logica de negocio (va en `module/domain/`)
- Llamadas directas a `apiClient` (va en `module/api/`)
- Definiciones de tipos (va en `module/types.ts`)

---

## Flujo de Datos

### Crear un HelpDesk

```
app/helpdesks/new/page.tsx
    │
    │ import { createHelpDesk } from '@/lib/helpdesk'
    │ import { useDepartmentList } from '@/lib/department'
    │ import { getDepartmentServices } from '@/lib/catalog'
    │
    ├─► Usuario llena formulario
    │   (departamento → servicio)
    │
    ├─► handleSubmit()
    │   └─► createHelpDesk({ service, origen, prioridad, descripcion_problema })
    │       └─► apiClient.request('/helpdesks/', { method: 'POST', ... })
    │
    └─► router.push('/helpdesks')
```

### Cambiar estado de un ticket

```
app/queue/[id]/page.tsx
    │
    │ import { getValidTransitions, changeStatus } from '@/lib/helpdesk'
    │
    ├─► getValidTransitions(hd.estado)
    │   └─► Muestra solo botones validos
    │
    ├─► onClick
    │   └─► changeStatus(hd.id, nuevoEstado)
    │       └─► apiClient.request('/helpdesks/{id}/status/', { method: 'PATCH', ... })
    │
    └─► reload()
```

---

## Testing

### Por modulo, no por capa

```
lib/helpdesk/
├── domain/__tests__/
│   └── transitions.test.ts      # canTransition(), getValidTransitions()
├── api/__tests__/
│   └── helpdesk.api.test.ts     # Mock HTTP, verifica endpoints
├── hooks/__tests__/
│   └── use-helpdesk-list.test.ts # renderHook, verifica estado
└── components/__tests__/
    ├── HDTable.test.tsx          # Render, click handlers
    └── StatusStepper.test.tsx    # Render correcto por estado
```

**Dominio** (unitario, sin dependencias):
```typescript
import { canTransition } from '../transitions';

test('abierto puede ir a en_progreso', () => {
  expect(canTransition('abierto', 'en_progreso')).toBe(true);
});

test('cerrado no puede cambiar de estado', () => {
  expect(canTransition('cerrado', 'abierto')).toBe(false);
});
```

**API** (mock del HTTP client):
```typescript
import { getHelpDesks } from '../helpdesk.api';

test('getHelpDesks envia filtros como query params', async () => {
  // mock fetch, verificar URL y params
});
```

**Hooks** (renderHook):
```typescript
import { renderHook, act } from '@testing-library/react';
import { useHelpDeskList } from '../use-helpdesk-list';

test('setFilter actualiza estado y recarga', async () => {
  const { result } = renderHook(() => useHelpDeskList());
  act(() => result.current.setFilter('estado', 'abierto'));
  expect(result.current.state.filters.estado).toBe('abierto');
});
```
