# Sistema de Diseño y Reglas Frontend UI Craft

Documento de directrices estéticas y microfísicas obligatorias para Ritmo.

---

## 1. Arquetipos Curados y Tokens Hexadecimales

### A. Warm Editorial (Alabastro Cálido - Tema por defecto)
- **Canvas**: `#FAF8F5`
- **Surface**: `#F2EFE9`
- **Hover**: `#EAE6DF`
- **Primary Ink**: `#191918`
- **Muted Ink**: `#6E6A63`
- **Hairline Border**: `#E4E0D8` (1px sólido)
- **Accent Primary**: `#C86446` (Terracota)
- **Accent Forest**: `#2D4F3E` (Verde Botánico)

### B. Interactive Studio (Obsidiana)
- **Canvas**: `#08090A`
- **Surface**: `#141416`
- **Hover**: `#1C1D21`
- **Primary Ink**: `#F7F8F8`
- **Muted Ink**: `#8A8F98`
- **Hairline Border**: `rgba(255, 255, 255, 0.08)`
- **Accent Primary**: `#FF4F00` (Naranja Internacional)
- **Accent Forest**: `#3B6E56` (Verde Esmeralda)

---

## 2. Tipografía Inyectada
- **Display**: `'Instrument Serif'`, serif (itálica, tracking ajustado `-0.035em`).
- **UI Sans**: `'Plus Jakarta Sans'`, sans-serif.
- **Monospace & Datos**: `'JetBrains Mono'`, monospace con `tabular-nums` obligatorio.

---

## 3. Microfísica Táctil
- Botones estándar: `active:scale-[0.96] transition-transform duration-120`.
- Celdas de hábito: `active:scale-[0.88] transition-transform duration-150`.
- Drawer lateral: `transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]`.
- Modal / Popover: `animate-modal-in` con resorte armónico.
