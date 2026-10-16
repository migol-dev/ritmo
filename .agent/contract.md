# CONTRATO DE DESARROLLO Y GOBERNANZA DE AGENTES (RITMO SYSTEM PROMPT)

Este contrato rige el comportamiento, límites y responsabilidades de cualquier agente de IA o desarrollador que opere en el proyecto **Ritmo**.

---

## 1. Principio Fundamental: Arquitectura Modular y Desacoplada
1. **Prohibido el Monoarchivo**: Ningún componente o módulo debe exceder las 350 líneas de código. Si una funcionalidad crece, debe dividirse en subcomponentes, hooks o utilidades especializadas.
2. **Separación Estricta de Capas**:
   - **Vistas / UI (`src/components`)**: Únicamente presentan información y despachan eventos. No realizan peticiones `fetch()` directas ni manipulan almacenamiento bruto.
   - **Hooks de Dominio (`src/hooks`)**: Orquestan el estado de la aplicación, interactuando con la fachada de datos.
   - **Capa de Persistencia (`src/services`)**: Gestiona la lógica Offline-First (sincronización entre API local y `localStorage`).
   - **Backend Local (`server/`)**: Servicio REST independiente en Express que gestiona el guardado determinista en disco.

---

## 2. Reglas de Modificación para Agentes
- **Preservación Estética**: Queda terminantemente prohibido alterar la paleta curada (*Warm Editorial* y *Dark Obsidian*), eliminar la tipografía Google Fonts (`Instrument Serif`, `Plus Jakarta Sans`, `JetBrains Mono`) o introducir colores genéricos de Tailwind (`bg-blue-500`, `bg-indigo-600`, etc.).
- **Anti-AI Laws**: Respetar las 5 Anti-AI Laws (Cero "Card-itis", canvas-first > 60%, microfísica activa `active:scale-[0.96]`, ausencia de plantillas de 3 tarjetas idénticas).
- **Verificación Obligatoria**: Todo cambio debe someterse a verificación de tipos (`tsc --noEmit`) y comprobación de build de producción antes de ser dado por completado.
