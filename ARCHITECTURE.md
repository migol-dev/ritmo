# Infraestructura y Arquitectura del Proyecto: Ritmo

**Ritmo** es un cuaderno de estudio conductual y gestor de cadencia cognitiva diseñado con una arquitectura **Local-First**, estética editorial artesanal y microfísica táctil.

---

## 1. Stack Tecnológico

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Tailwind CSS | Interfaz reactiva, de-boxed, con microfísica activa |
| **Iconografía** | Lucide Icons (`strokeWidth={1.5}`) | Glyphs visuales compactos y proporcionados |
| **Tipografía** | Instrument Serif, Plus Jakarta Sans, JetBrains Mono | Pairing editorial y datos numéricos tabulares |
| **Física Auditiva** | Web Audio API (Sintetizador acústico en hardware) | Pulso de retroalimentación sonora sin archivos pesados |
| **Bundler & Dev** | Vite 6, PostCSS, Autoprefixer | Compilación instantánea y HMR sub-segundo |
| **Backend Local** | Node.js, Express, TypeScript (`tsx`) | Servidor REST local ligero para persistencia en disco |
| **Almacenamiento** | Disco Local (`server/data/ritmo-store.json`) + LocalStorage | Persistencia dual determinista Offline-First |

---

## 2. Radiografía de Directorios y Carpetas

```
Gestor de habitos/
├── .agent/                             # Contratos, reglas y bitácora de tareas de agentes
│   ├── contract.md                     # Contrato del sistema (System Prompt de desarrollo)
│   ├── task.md                         # Registro y checklist de tareas activas
│   └── rules/                          # Reglas especializadas
│       ├── architecture.md             # Reglas arquitectónicas y flujo de datos
│       └── design_system.md            # Guía de tokens de diseño y 5 Anti-AI Laws
├── .agentignore                        # Exclusiones para indexación de agentes
├── .env                                # Variables de entorno activas locales
├── .env.template                       # Plantilla documentada de variables de entorno
├── .gitignore                          # Exclusiones de control de versiones Git
├── ARCHITECTURE.md                     # Este documento: infraestructura completa
├── package.json                        # Scripts unificados y dependencias (Frontend + Backend)
├── tsconfig.json                       # Configuración base de TypeScript
├── vite.config.ts                      # Configuración de Vite con proxy /api
├── tailwind.config.js                  # Configuración de Tailwind CSS
├── postcss.config.js                   # Configuración de PostCSS
├── index.html                          # Punto de entrada HTML
│
├── src/                                # CÓDIGO FUENTE DEL FRONTEND MODULAR
│   ├── main.tsx                        # Punto de montaje de React DOM
│   ├── index.css                       # Estilos globales y directivas Tailwind
│   ├── App.tsx                         # Orquestador principal de la vista
│   │
│   ├── components/                     # Componentes divididos por dominio
│   │   ├── layout/                     # Estructura y navegación
│   │   │   ├── Header.tsx              # Barra superior con scrubber de semanas y atajos
│   │   │   ├── TelemetryLedger.tsx     # Libro mayor de 4 métricas directamente en canvas
│   │   │   └── ProgressiveBlurVeil.tsx # Velo de desenfoque gradual sensible al cursor
│   │   ├── habits/                     # Dominio de hábitos y matriz de registro
│   │   │   ├── HabitsTable.tsx         # Tabla de-boxed con columnas de 7 días
│   │   │   ├── HabitRow.tsx            # Fila de ritual con celdas táctiles y acciones en hover
│   │   │   ├── QuickFocusBar.tsx       # Franja de sellado rápido para la jornada de hoy
│   │   │   ├── InlineHabitForm.tsx     # Formulario rápido para añadir nuevos rituales (↵ Enter)
│   │   │   └── DisciplineFilterPill.tsx# Segmentador con píldora deslizante animada
│   │   ├── observatory/                # Escenario analítico de 4 lentes
│   │   │   ├── ObservatoryStage.tsx    # Contenedor y conmutador deslizante de 4 lentes
│   │   │   ├── WeeklyCadenceView.tsx   # Gráfico de barras interactivo con umbral del 80%
│   │   │   ├── StreaksRecordView.tsx   # Comparativa de doble horizonte: rachas vs. récord
│   │   │   ├── DensityMatrix28View.tsx # Matriz de calor de 28 días estilo GitHub
│   │   │   └── ChronotypeView.tsx      # Distribución horaria (Mañana, Tarde, Noche)
│   │   ├── modals/                     # Modales y paneles deslizantes
│   │   │   ├── CommandPaletteModal.tsx # Paleta ⌘K elástica con búsqueda instantánea
│   │   │   └── HabitInspectorDrawer.tsx# Ficha técnica lateral (física Vaul/Apple)
│   │   └── ui/                         # Primitivas visuales y micro-interacciones
│   │       ├── SpotlightBackground.tsx # Halo radial que acompaña las coordenadas del ratón
│   │       ├── StatusToast.tsx         # Notificaciones emergentes discretas
│   │       └── SearchDropdownMenu.tsx  # Menú rápido flotante bajo el botón de búsqueda
│   │
│   ├── hooks/                          # Lógica reactiva desacoplada
│   │   ├── useHabits.ts                # Hook maestro de hábitos, filtros, métricas y mutaciones
│   │   ├── useTactileAudio.ts          # Síntesis acústica táctil con AudioContext singleton
│   │   ├── useMouseCoordinates.ts      # Captura de coordenadas del ratón (--mouse-x, --mouse-y)
│   │   └── useOutsideClick.ts          # Hook para detectar clics exteriores y cerrar menús
│   │
│   ├── services/                       # Servicios de datos y persistencia
│   │   ├── repository.ts               # Fachada Offline-First (combina REST API + LocalStorage)
│   │   ├── api.service.ts              # Cliente HTTP para comunicación con el backend local
│   │   └── local-storage.service.ts    # Adaptador de persistencia en localStorage del navegador
│   │
│   ├── types/                          # Contratos y tipados TypeScript
│   │   ├── habit.types.ts              # Habit, HabitMetrics, Discipline, Period
│   │   └── telemetry.types.ts          # DailyTelemetry, LensMode, ThemeMode
│   │
│   ├── utils/                          # Funciones puras de utilidad
│   │   ├── date.utils.ts               # Fechas ISO, semanas, anclas temporales
│   │   ├── metrics.utils.ts            # Cálculo de rachas, récords históricos y tasas 28d
│   │   └── csv.utils.ts                # Generador y descargador de archivos .CSV
│   │
│   └── constants/                      # Constantes del sistema
│       ├── initialHabits.ts            # Datos iniciales realistas de referencia
│       └── themeTokens.ts              # Tokens de diseño Warm Editorial y Dark Obsidian
│
└── server/                             # BACKEND LOCAL EN NODE.JS + EXPRESS
    ├── src/
    │   ├── index.ts                    # Arranque del servidor Express (puerto 3001)
    │   ├── app.ts                      # Middlewares (CORS, JSON, Logger) y montaje de rutas
    │   ├── config/                     # Variables de entorno y constantes del servidor
    │   │   └── env.ts
    │   ├── controllers/                # Controladores de peticiones
    │   │   ├── habits.controller.ts    # Operaciones CRUD y alternancia de días
    │   │   ├── telemetry.controller.ts # Resúmenes y métricas agregadas
    │   │   └── backup.controller.ts    # Respaldo, exportación y restauración
    │   ├── routes/                     # Definición de rutas REST (/api)
    │   │   ├── habits.routes.ts
    │   │   ├── telemetry.routes.ts
    │   │   ├── backup.routes.ts
    │   │   └── index.ts
    │   ├── services/                   # Lógica de negocio y persistencia en disco
    │   │   ├── storage.service.ts      # Motor de lectura y escritura en archivo local
    │   │   └── seed.service.ts         # Generador de datos iniciales
    │   ├── models/                     # Modelos y esquemas de validación
    │   │   └── habit.model.ts
    │   └── middlewares/                # Manejadores de error
    │       └── errorHandler.ts
    └── data/                           # Almacenamiento local en disco
        └── ritmo-store.json            # Base de datos local persistida en formato JSON
```

---

## 3. Flujo de Datos y Persistencia Local-First

1. **Lectura inicial**: Al abrir la app, `repository.ts` lee inmediatamente del caché de `localStorage` para garantizar carga instantánea (0ms). Simultáneamente, consulta asíncronamente `GET /api/habits` en el backend local. Si el backend responde, sincroniza el estado en memoria.
2. **Mutaciones optimistas**: Al sellar un día, editar un hábito o agregar uno nuevo, la UI responde en <1ms actualizando el estado de React y guardando en `localStorage`. En segundo plano, emite una petición `PUT`/`POST` al backend local para persistir en `server/data/ritmo-store.json`.
3. **Resiliencia Offline**: Si el backend local no está corriendo, la app detecta automáticamente la desconexión y opera de forma autónoma en el navegador.

---

## 4. Comandos de Ejecución

- **`npm run dev`**: Inicia concurrentemente el servidor Vite (`http://localhost:5173/`) y el Backend Local (`http://localhost:3001/`).
- **`npm run dev:frontend`**: Inicia únicamente el frontend Vite.
- **`npm run dev:backend`**: Inicia únicamente el backend local Express.
- **`npm run build`**: Compila y optimiza el frontend para producción.
