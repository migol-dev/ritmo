# Ritmo

### Estudio de Hábitos y Cadencia Cognitiva

> Un cuaderno de estudio conductual **local-first**, diseñado como una pieza editorial artesanal: canvas antes que cajas, tipografía serif medida, microfísica táctil y un observatorio analítico de cuatro lentes.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white&style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

---

## Tabla de contenidos

- [Qué es Ritmo](#qué-es-ritmo)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Flujo de datos local-first](#flujo-de-datos-local-first)
- [Inicio rápido](#inicio-rápido)
- [Scripts disponibles](#scripts-disponibles)
- [Referencia de la API](#referencia-de-la-api)
- [Atajos de teclado](#atajos-de-teclado)
- [Licencia](#licencia)

---

## Qué es Ritmo

**Ritmo** es un gestor de hábitos que trata el seguimiento conductual como un acto editorial, no como un panel de métricas genérico. Registra rituales diarios, visualiza patrones en el tiempo y analiza tu cadencia cognitiva a través de un observatorio con cuatro lentes analíticas.

Su premisa central es la **persistencia determinista en disco**: la aplicación vive en tu máquina, tus datos se guardan en un archivo JSON local y, si el backend no está disponible, el frontend continúa operando de forma autónoma desde `localStorage` sin perder un solo registro.

---

## Características

| Área | Descripción |
| :--- | :--- |
| **Matriz semanal** | Tabla de-boxed con columnas de 7 días, celdas táctiles y acciones reveladas en hover |
| **Sellado rápido** | Franja de foco para completar toda la jornada de hoy con un solo gesto |
| **Observatorio analítico** | Cuatro lentes: cadencia semanal, rachas vs. récord histórico, matriz de densidad de 28 días y distribución de cronotipo |
| **Paleta de comandos** | Modal elástico invocado con `Ctrl/⌘ + K` y búsqueda instantánea sobre todos los rituales |
| **Inspector de hábito** | Ficha técnica lateral con física de drawer (curva Apple `cubic-bezier(0.32, 0.72, 0, 1)`) |
| **Doble tema curado** | *Warm Editorial* (alabastro cálido) e *Interactive Studio* (obsidiana), sin colores genéricos de framework |
| **Física auditiva** | Retroalimentación sonora sintetizada en hardware vía Web Audio API, sin archivos de audio |
| **Respaldo y exportación** | Exportación a `.CSV`, respaldo completo y restauración desde la API local |
| **Resiliencia offline** | Persistencia dual: archivo JSON en disco + caché del navegador con sincronización optimista |

---

## Stack tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Interfaz** | React 18 + TypeScript 5.7 | Componentes desacoplados por dominio y tipado estricto |
| **Estilos** | Tailwind CSS 3 + PostCSS | Tokens curados, sin plantillas genéricas |
| **Tipografía** | Instrument Serif, Plus Jakarta Sans, JetBrains Mono | Pairing editorial; datos numéricos tabulares obligatorios |
| **Iconografía** | Lucide React (`strokeWidth={1.5}`) | Glifos compactos y proporcionados |
| **Audio** | Web Audio API | Sintetizador acústico en hardware (singleton `AudioContext`) |
| **Bundler** | Vite 6 | HMR sub-segundo y proxy `/api` integrado |
| **Backend** | Node.js + Express 4 + `tsx` | API REST local ligera para persistencia en disco |
| **Almacenamiento** | JSON en disco + `localStorage` | Determinismo total, cero dependencias de nube |

---

## Arquitectura

Separación estricta de capas: la UI solo presenta y despacha eventos; los hooks de dominio orquestan el estado; la capa de servicios gestiona la persistencia; el backend local garantiza el guardado en disco.

<details>
<summary><strong>Desplegar radiografía completa de directorios</strong></summary>

```
Gestor de habitos/
├── src/                                # Frontend modular
│   ├── main.tsx                        # Punto de montaje de React DOM
│   ├── App.tsx                         # Orquestador principal de la vista
│   ├── components/
│   │   ├── layout/                     # Header, ledger de telemetría, velo de desenfoque
│   │   ├── habits/                     # Tabla, filas, sellado rápido, formulario inline, filtros
│   │   ├── observatory/                # Escenario analítico de 4 lentes
│   │   ├── modals/                     # Paleta de comandos y drawer inspector
│   │   └── ui/                         # Spotlight, toasts, dropdown de búsqueda
│   ├── hooks/                          # useHabits, useTactileAudio, useMouseCoordinates
│   ├── services/                       # Fachada offline-first, cliente HTTP, localStorage
│   ├── types/                          # Contratos TypeScript del dominio
│   ├── utils/                          # Fechas, métricas y exportación CSV
│   └── constants/                      # Semilla de hábitos y tokens de diseño
│
└── server/                             # Backend local Express
    ├── src/
    │   ├── index.ts                    # Arranque del servidor (puerto 3001)
    │   ├── app.ts                      # Middlewares y montaje de rutas
    │   ├── config/                     # Variables de entorno
    │   ├── controllers/                # Hábitos, telemetría y respaldo
    │   ├── routes/                     # Definición REST bajo /api
    │   ├── services/                   # Motor de disco y semilla canónica
    │   ├── models/                     # Esquemas del dominio
    │   └── middlewares/                # Manejo centralizado de errores
    └── data/                           # Base de datos local en JSON (generada en runtime)
```

</details>

---

## Flujo de datos local-first

1. **Lectura instantánea** — Al abrir la app, el repositorio lee de inmediato el caché de `localStorage` (carga en 0 ms) y, en paralelo, consulta `GET /api/habits` al backend local para sincronizar.
2. **Mutaciones optimistas** — Al sellar un día, editar o crear un ritual, la UI responde en menos de 1 ms y persiste en segundo plano contra la API.
3. **Resiliencia offline** — Si el backend no está corriendo, la aplicación lo detecta y opera de forma autónoma en el navegador, reconciliando al reconectar.

---

## Inicio rápido

### Requisitos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/migol-dev/ritmo.git
cd ritmo

# Instalar dependencias
npm install

# Crear el archivo de entorno a partir de la plantilla
cp .env.template .env
```

### Desarrollo

```bash
npm run dev
```

Esto inicia concurrentemente:

| Servicio | URL |
| :--- | :--- |
| Frontend (Vite) | http://localhost:5173 |
| Backend local (Express) | http://localhost:3001 |

### Producción

```bash
npm run build
npm run preview
```

---

## Scripts disponibles

| Script | Descripción |
| :--- | :--- |
| `npm run dev` | Frontend y backend en paralelo con salida etiquetada |
| `npm run dev:frontend` | Solo el servidor de Vite |
| `npm run dev:backend` | Solo el backend Express (`tsx`) |
| `npm run build` | Compilación optimizada del frontend |
| `npm run preview` | Sirve la compilación de producción localmente |
| `npm run start:server` | Arranca el backend sin modo desarrollo |

---

## Referencia de la API

Base URL: `http://localhost:3001/api`

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Estado del servicio y versión |
| `GET` | `/habits` | Lista completa de rituales |
| `GET` | `/habits/:id` | Detalle de un ritual |
| `POST` | `/habits` | Crea un ritual |
| `PUT` | `/habits/:id` | Actualiza un ritual |
| `DELETE` | `/habits/:id` | Elimina un ritual |
| `POST` | `/habits/:id/toggle` | Sella o desmarca un día |
| `POST` | `/habits/sync-all` | Sincroniza el estado completo |
| `GET` | `/telemetry/summary` | Métricas agregadas del periodo |
| `GET` | `/backup/export` | Exporta el respaldo completo |
| `POST` | `/backup/import` | Restaura desde un respaldo |
| `POST` | `/backup/reset` | Restablece la semilla canónica |

---

## Atajos de teclado

| Atajo | Acción |
| :--- | :--- |
| `Ctrl / ⌘ + K` | Abrir o cerrar la paleta de comandos |
| `Esc` | Cerrar modales, menús y el inspector lateral |
| `Enter` | Confirmar el formulario inline de nuevo ritual |

---

## Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más información.

Copyright (c) 2026 MIGUEL DE JESUS GARCIA VILLALPANDO
