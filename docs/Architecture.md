# Diagramas de Arquitectura Domain-First

## 1. ESTRUCTURA POR MODULOS

```
┌─────────────────────────────────────────────────────────────────┐
│                         app/ (Next.js)                          │
│  Paginas thin-wrapper que importan desde los modulos            │
│                                                                  │
│  helpdesks/page  queue/page  area/helpdesks/page  admin/page   │
└───────┬──────────────┬──────────────┬──────────────┬────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐
│  helpdesk/   │ │ auth/    │ │ catalog/ │ │   department/    │
│              │ │          │ │          │ │                  │
│ domain/      │ │ api/     │ │ api/     │ │ api/             │
│  transitions │ │ provider │ │ state/   │ │ state/           │
│ api/         │ │ types    │ │  types   │ │ hooks/           │
│ state/       │ │          │ │  cat-red │ │ types            │
│ hooks/       │ │          │ │  svc-red │ │                  │
│ components/  │ │          │ │ hooks/   │ │                  │
│  HDTable     │ │          │ │  cat-cac │ │                  │
│  HDBadge     │ │          │ │  svc-cac │ │                  │
│  Stepper     │ │          │ │ types    │ │                  │
│  Comments    │ │          │ │          │ │                  │
│  Attachments │ │          │ │          │ │                  │
│  AssignModal │ │          │ │          │ │                  │
│  ResolveModal│ │          │ │          │ │                  │
│ types        │ │          │ │          │ │                  │
└──────┬───────┘ └─────┬────┘ └─────┬────┘ └────────┬─────────┘
       │               │           │                │
       └───────────────┴─────┬─────┴────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    shared/       │
                    │                  │
                    │ api/client.ts    │
                    │ components/      │
                    │   Modal.tsx      │
                    │   Sidebar.tsx    │
                    │ types.ts         │
                    └──────────────────┘
```

## 2. ANATOMIA DE UN MODULO (helpdesk/)

```
┌─────────────────────────────────────────────────────────────┐
│                      helpdesk/                               │
│                                                              │
│  ┌─────────────────────┐    ┌────────────────────────────┐  │
│  │ domain/             │    │ types.ts                   │  │
│  │                     │    │                            │  │
│  │ transitions.ts      │    │ HelpDesk, HDComment,       │  │
│  │  canTransition()    │    │ HDAttachment, Estado,      │  │
│  │  getValidTransit()  │    │ Prioridad, Origen,         │  │
│  │                     │    │ TipoAdjunto                │  │
│  │                     │    │                            │  │
│  │                     │    │ ESTADO_LABELS,             │  │
│  │                     │    │ PRIORIDAD_LABELS,          │  │
│  │                     │    │ ORIGEN_LABELS              │  │
│  └──────────┬──────────┘    └─────────────┬──────────────┘  │
│             │ usa tipos de                │                  │
│             └─────────────────────────────┘                  │
│                                                              │
│  ┌─────────────────────┐    ┌────────────────────────────┐  │
│  │ api/                │    │ state/                     │  │
│  │                     │    │                            │  │
│  │ helpdesk.api.ts     │    │ reducer.ts                 │  │
│  │  getHelpDesks()     │    │  LOAD_START                │  │
│  │  getHelpDesk()      │    │  LOAD_SUCCESS              │  │
│  │  createHelpDesk()   │    │  LOAD_ERROR                │  │
│  │  changeStatus()     │    │  SET_FILTER                │  │
│  │  assignHelpDesk()   │    │  UPDATE_ITEM               │  │
│  │  resolveHelpDesk()  │    │  REMOVE_ITEM               │  │
│  │  uploadAttachment() │    │                            │  │
│  │  addUrlAttachment() │    │ initial-state.ts           │  │
│  │  deleteAttachment() │    │ types.ts                   │  │
│  │  getComments()      │    │                            │  │
│  │  addComment()       │    │                            │  │
│  └──────────┬──────────┘    └─────────────┬──────────────┘  │
│             │               │ usa                            │
│             ▼               ▼                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ hooks/                                                   ││
│  │                                                          ││
│  │ use-helpdesk-list.ts                                     ││
│  │  state        → del reducer                              ││
│  │  load()       → llama api, dispatch LOAD_SUCCESS         ││
│  │  setFilter()  → dispatch SET_FILTER, auto-reload         ││
│  │  resetFilters → dispatch RESET_FILTERS                   ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ components/                                              ││
│  │                                                          ││
│  │ HDTable.tsx         → Lista de tickets con links         ││
│  │ HDBadge.tsx         → EstadoBadge, PrioridadBadge       ││
│  │ StatusStepper.tsx   → Progreso visual del estado         ││
│  │ CommentThread.tsx   → Cargar, mostrar, agregar comments  ││
│  │ AttachmentUploader  → Subir archivos y URLs              ││
│  │ AssignModal.tsx     → Asignar tecnico                    ││
│  │ ResolveModal.tsx    → Resolver ticket con descripcion    ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  index.ts  → Re-exporta la API publica del modulo           │
└─────────────────────────────────────────────────────────────┘
```

## 3. FLUJO: CREAR UN HELPDESK

```
Usuario en app/(dashboard)/helpdesks/new/page.tsx
        │
        │  Carga formulario
        │  ┌────────────────────────────────────────────┐
        │  │ import { createHelpDesk }                  │
        │  │   from '@/lib/helpdesk'                    │
        │  │ import { useDepartmentList }               │
        │  │   from '@/lib/department'                  │
        │  │ import { getDepartmentServices }           │
        │  │   from '@/lib/catalog'                     │
        │  └────────────────────────────────────────────┘
        │
        ├─► useDepartmentList().load()
        │   └─► department/api/department.api.ts
        │       └─► apiClient.request('/departments/')
        │
        ├─► getDepartmentServices(deptId)
        │   └─► catalog/api/catalog.api.ts
        │       └─► apiClient.request('/departments/{id}/services/')
        │
        ├─► handleSubmit()
        │   └─► helpdesk/api/helpdesk.api.ts
        │       └─► apiClient.request('/helpdesks/', POST)
        │
        └─► router.push('/helpdesks')
```

## 4. FLUJO: CAMBIAR ESTADO (REGLA DE NEGOCIO)

```
Pagina: queue/[id]/page.tsx
        │
        │  import { getValidTransitions, changeStatus }
        │    from '@/lib/helpdesk'
        │
        ├─► getValidTransitions(hd.estado)
        │   │
        │   │  helpdesk/domain/transitions.ts
        │   │  ┌──────────────────────────────────────────┐
        │   │  │ VALID_TRANSITIONS = {                    │
        │   │  │   abierto:     [en_progreso]             │
        │   │  │   en_progreso: [en_espera, resuelto]     │
        │   │  │   en_espera:   [en_progreso, resuelto]   │
        │   │  │   resuelto:    [cerrado]                 │
        │   │  │   cerrado:     []                        │
        │   │  │ }                                        │
        │   │  └──────────────────────────────────────────┘
        │   │
        │   └─► Retorna ['en_progreso'] (si estado = abierto)
        │       → Solo renderiza esos botones
        │
        ├─► Usuario click "En Progreso"
        │   └─► changeStatus(hd.id, 'en_progreso')
        │       └─► apiClient.request('/helpdesks/{id}/status/', PATCH)
        │
        └─► reload()
```

## 5. DEPENDENCIAS ENTRE MODULOS

```
                    ┌──────────┐
                    │ shared/  │
                    │          │
                    │ client   │  Todos dependen de shared
                    │ Modal    │
                    │ Sidebar  │
                    └──────────┘
                      ▲  ▲  ▲
          ┌───────────┘  │  └───────────┐
          │              │              │
    ┌─────┴────┐   ┌─────┴────┐   ┌────┴─────┐
    │ helpdesk │   │  auth/   │   │department│
    │          │   │          │   │          │
    └──────────┘   └──────────┘   └──────────┘
          ▲                            ▲
          │                            │
    ┌─────┴────┐                       │
    │ catalog/ │───────────────────────┘
    └──────────┘

Reglas de dependencia:
  - Todos los modulos pueden importar de shared/
  - auth/ no importa de ningun otro modulo
  - helpdesk/ no importa de department/ ni catalog/ directamente
    (las paginas en app/ orquestan entre modulos)
  - catalog/ puede importar tipos de department/ (relacion padre)
  - NINGUN modulo importa de app/
```

## 6. CONTEXTOS DE DOMINIO

```
┌─────────────────────────────────────────────────────────────┐
│                    HELP DESK SYSTEM                         │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │ HELPDESK         │
    │                  │  Ciclo de vida de tickets
    │ Entidades:       │  ├─ Crear ticket
    │  HelpDesk        │  ├─ Cambiar estado
    │  HDComment       │  ├─ Asignar tecnico
    │  HDAttachment    │  ├─ Resolver ticket
    │                  │  ├─ Agregar comentarios
    │ Conceptos:       │  └─ Adjuntar archivos
    │  Estado          │
    │  Prioridad       │
    │  Origen          │
    └──────────────────┘

    ┌──────────────────┐
    │ AUTH             │
    │                  │  Sesion y acceso
    │ Entidades:       │  ├─ Login
    │  AuthUser        │  ├─ Logout
    │                  │  ├─ Persistencia de sesion
    │ Conceptos:       │  └─ Redireccion por rol
    │  Role            │
    │  ROLE_HOME       │
    └──────────────────┘

    ┌──────────────────┐
    │ DEPARTMENT       │
    │                  │  Gestion de departamentos
    │ Entidades:       │  ├─ Crear departamento
    │  Department      │  ├─ Editar departamento
    │                  │  └─ Activar/desactivar
    └──────────────────┘

    ┌──────────────────┐
    │ CATALOG          │
    │                  │  Catalogo de servicios
    │ Entidades:       │  ├─ Crear categoria
    │  ServiceCategory │  ├─ Crear servicio
    │  Service         │  ├─ Editar servicio
    │                  │  └─ Activar/desactivar servicio
    └──────────────────┘

Comunicacion entre contextos:
  Las paginas en app/ son los orquestadores.
  No hay acoplamiento directo entre modulos.

  Ejemplo: helpdesks/new necesita departamentos y servicios
  → La PAGINA importa de helpdesk/, department/ y catalog/
  → Los modulos NO se conocen entre si
```

## 7. TESTING POR MODULO

```
┌─────────────────────────────────────────────────────────────┐
│ helpdesk/domain/__tests__/ (Unitarios, 0 dependencias)      │
│                                                              │
│  transitions.test.ts                                        │
│   canTransition('abierto', 'en_progreso') → true            │
│   canTransition('cerrado', 'abierto') → false               │
│   getValidTransitions('abierto') → ['en_progreso']          │
│   getValidTransitions('cerrado') → []                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ helpdesk/api/__tests__/ (Mock de fetch/client)              │
│                                                              │
│  helpdesk.api.test.ts                                       │
│   getHelpDesks() → GET /helpdesks/ con params               │
│   createHelpDesk() → POST /helpdesks/                       │
│   changeStatus() → PATCH /helpdesks/{id}/status/            │
│   assignHelpDesk() → PATCH /helpdesks/{id}/assign/          │
│   resolveHelpDesk() → PATCH /helpdesks/{id}/resolve/        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ helpdesk/hooks/__tests__/ (renderHook)                      │
│                                                              │
│  use-helpdesk-list.test.ts                                  │
│   setFilter() actualiza estado y recarga                    │
│   load() despacha LOAD_SUCCESS con datos                    │
│   resetFilters() limpia filtros y recarga                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ helpdesk/components/__tests__/ (render + interact)          │
│                                                              │
│  HDTable.test.tsx                                           │
│   Renderiza filas por cada helpdesk                         │
│   Click en fila navega a detalle                            │
│                                                              │
│  StatusStepper.test.tsx                                     │
│   Muestra paso correcto segun estado                        │
└─────────────────────────────────────────────────────────────┘
```

## 8. FLUJO DE DATOS COMPLETO

```
PAGINA (app/)          HOOK (lib/*/hooks)      API (lib/*/api)      SERVER
    │                       │                      │                   │
    │ useHelpDeskList()     │                      │                   │
    ├──────────────────────►│                      │                   │
    │                       │ load()               │                   │
    │                       ├─────────────────────►│                   │
    │                       │                      │ GET /helpdesks/   │
    │                       │                      ├──────────────────►│
    │                       │                      │                   │
    │                       │                      │◄──────────────────┤
    │                       │                      │ { results, count }│
    │                       │◄─────────────────────┤                   │
    │                       │ dispatch(LOAD_SUCCESS)                   │
    │                       │                      │                   │
    │◄──────────────────────┤                      │                   │
    │ state.items           │                      │                   │
    │ state.loading         │                      │                   │
    │                       │                      │                   │
    │ setFilter('estado',   │                      │                   │
    │   'abierto')          │                      │                   │
    ├──────────────────────►│                      │                   │
    │                       │ dispatch(SET_FILTER)  │                   │
    │                       │ → useEffect → load() │                   │
    │                       ├─────────────────────►│                   │
    │                       │                      │ GET /helpdesks/   │
    │                       │                      │  ?estado=abierto  │
    │                       │                      ├──────────────────►│
    │                       │                      │◄──────────────────┤
    │                       │◄─────────────────────┤                   │
    │◄──────────────────────┤                      │                   │
    │ re-render con filtro  │                      │                   │
```

---

## Resumen

| Concepto | Donde vive | Ejemplo |
|----------|-----------|---------|
| **Reglas de negocio** | `modulo/domain/` | canTransition(), getValidTransitions() |
| **Tipos del dominio** | `modulo/types.ts` | HelpDesk, Estado, Department |
| **Llamadas HTTP** | `modulo/api/` | getHelpDesks(), createDepartment() |
| **Estado (reducer)** | `modulo/state/` | helpDeskListReducer |
| **Hooks** | `modulo/hooks/` | useHelpDeskList(), useCategoryCache() |
| **Componentes** | `modulo/components/` | HDTable, StatusStepper |
| **Infraestructura compartida** | `shared/` | ApiClient, Modal |
| **Rutas y paginas** | `app/` | Next.js pages (thin wrappers) |
