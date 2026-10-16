# Reglas de Arquitectura de Ritmo

Este documento define la arquitectura técnica, las responsabilidades de cada capa y el flujo de datos unidireccional de **Ritmo**.

---

## 1. Patrón Arquitectónico: Local-First Dual Repository

Ritmo opera bajo una arquitectura **Local-First Resiliente**:
1. **Prioridad Inmediata**: La interfaz de usuario nunca se bloquea por peticiones de red. Las operaciones son optimistas y se reflejan al instante en la memoria de React.
2. **Capa de Persistencia Dual (`src/services/repository.ts`)**:
   - Guarda y lee primero del caché local (`localStorage`).
   - Sincroniza asíncronamente con el backend local (`http://localhost:3001/api/habits`).
   - Si el backend local no está corriendo, la aplicación continúa funcionando al 100% en modo standalone offline.
3. **Backend Local Determinista (`server/`)**:
   - Expone endpoints REST puros en Express.
   - Escribe atómicamente el estado en el disco local (`server/data/ritmo-store.json`).
   - Provee capacidades de respaldo y restauración.

---

## 2. Mapa de Capas del Frontend (`src/`)

```
Vistas / UI (Components)
        │
        ▼ (Consume solo hooks)
Hooks de Fachada (`useHabits`, `useTactileAudio`, `useMouseCoordinates`)
        │
        ▼ (Consume servicios)
Repositorio Local-First (`repository.ts`)
       ╱ ╲
      ╱   ╲
     ▼     ▼
LocalStorage   Backend REST API (Express)
                      │
                      ▼
               Disco Local (JSON)
```

### Reglas de Importación:
- Un componente de UI **NUNCA** debe importar `fetch` o llamar a `api.service.ts` directamente. Debe consumir `useHabits`.
- Las funciones de utilidad (`src/utils/`) deben ser puras, deterministas y libres de efectos secundarios.
- Los tipos e interfaces (`src/types/`) son la única fuente de verdad para los modelos de datos.
