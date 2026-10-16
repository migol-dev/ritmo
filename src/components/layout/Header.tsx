import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Download
} from 'lucide-react';
import { WeekDay, ThemeMode } from '../../types/telemetry.types';
import { EnrichedHabit } from '../../types/habit.types';
import { SearchDropdownMenu } from '../ui/SearchDropdownMenu';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  weekOffset: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  weekDays: WeekDay[];
  onOpenCommand: () => void;
  onExportCSV: () => void;
  isSearchHovered: boolean;
  setIsSearchHovered: (val: boolean) => void;
  searchDropdownOpen: boolean;
  setSearchDropdownOpen: (val: boolean) => void;
  habits: EnrichedHabit[];
  onToggleHabitToday: (id: string) => void;
  todayISO: string;
  tokens: {
    hairline: string;
    surfaceElevated: string;
    surfaceHover: string;
    inkMuted: string;
    accentPrimary: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  weekOffset,
  onPrevWeek,
  onNextWeek,
  weekDays,
  onOpenCommand,
  onExportCSV,
  isSearchHovered,
  setIsSearchHovered,
  searchDropdownOpen,
  setSearchDropdownOpen,
  habits,
  onToggleHabitToday,
  todayISO,
  tokens
}) => {
  const isDark = theme === 'obsidian';
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se hace clic fuera
  useOutsideClick(searchContainerRef, () => {
    setSearchDropdownOpen(false);
    setIsSearchHovered(false);
  }, searchDropdownOpen);

  return (
    <header
      className={`sticky top-0 z-30 border-b ${tokens.hairline} ${
        isDark ? 'bg-[#08090A]/90' : 'bg-[#FAF8F5]/90'
      } backdrop-blur-md font-ui-sans transition-colors duration-300`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
        {/* Identidad de Marca & Coordenada de Bitácora */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group cursor-default">
            <span
              className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-150"
              style={{ backgroundColor: tokens.accentPrimary }}
            />
            <span className="font-display-serif text-2xl tracking-[-0.035em] leading-none select-none">
              Ritmo
            </span>
            <span
              className={`font-mono-metric text-[10px] uppercase tracking-[0.12em] px-1.5 py-0.5 border ${tokens.hairline} ${tokens.inkMuted} transition-colors group-hover:border-current`}
            >
              CADENCIA v3.0
            </span>
          </div>
          <span
            className={`hidden md:inline-block text-xs ${tokens.inkMuted} border-l ${tokens.hairline} pl-4 font-mono-metric`}
          >
            Mié 14 oct 2026 · Semana 42
          </span>
        </div>

        {/* Controles de Superficie, Atajos y Scrubber Semanal */}
        <div className="flex items-center gap-2">
          {/* Scrubber de Semanas con Navegación Compacta */}
          <div
            className={`hidden sm:flex items-center border ${tokens.hairline} rounded-[4px] overflow-hidden font-mono-metric text-xs`}
          >
            <button
              onClick={onPrevWeek}
              className={`px-2 py-1.5 ${tokens.surfaceHover} active:scale-[0.92] transition-transform duration-120`}
              title="Semana anterior"
            >
              <ChevronLeft size={13} strokeWidth={1.5} />
            </button>
            <span className="px-3 py-1 select-none text-[11px] font-medium">
              {weekDays[0].dayNum} {weekDays[0].monthShort} — {weekDays[6].dayNum} {weekDays[6].monthShort}
            </span>
            <button
              onClick={onNextWeek}
              disabled={weekOffset >= 0}
              className={`px-2 py-1.5 ${tokens.surfaceHover} disabled:opacity-25 active:scale-[0.92] transition-transform duration-120`}
              title="Semana siguiente"
            >
              <ChevronRight size={13} strokeWidth={1.5} />
            </button>
          </div>

          {/* BOTÓN DE BÚSQUEDA INTERACTIVO CON DESENFOQUE GRADUAL Y HALO */}
          <div ref={searchContainerRef} className="relative">
            <button
              onMouseEnter={() => {
                setIsSearchHovered(true);
                setSearchDropdownOpen(true);
              }}
              onClick={() => {
                onOpenCommand();
                setIsSearchHovered(false);
                setSearchDropdownOpen(false);
              }}
              className={`group relative flex items-center gap-2 px-3 py-1.5 text-xs border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.96] transition-all duration-200 overflow-hidden`}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${tokens.accentPrimary}18 0%, transparent 80%)`
                }}
              />

              <Search
                size={13}
                strokeWidth={1.75}
                className="transition-transform duration-200 group-hover:scale-110"
                style={{ color: tokens.accentPrimary }}
              />
              <span className={`hidden sm:inline ${tokens.inkMuted} group-hover:text-current transition-colors`}>
                Buscar o alternar...
              </span>
              <kbd
                className={`font-mono-metric text-[10px] px-1 py-0.5 ${tokens.surfaceElevated} border ${tokens.hairline} rounded-[2px] transition-colors group-hover:border-current`}
              >
                ⌘K
              </kbd>
            </button>

            {/* Menú rápido flotante */}
            <SearchDropdownMenu
              isOpen={searchDropdownOpen}
              habits={habits}
              accentColor={tokens.accentPrimary}
              hairlineClass={tokens.hairline}
              surfaceClass={tokens.surfaceElevated}
              inkMutedClass={tokens.inkMuted}
              surfaceHoverClass={tokens.surfaceHover}
              onOpenCommand={() => {
                setSearchDropdownOpen(false);
                setIsSearchHovered(false);
                onOpenCommand();
              }}
              onToggleToday={onToggleHabitToday}
              todayISO={todayISO}
            />
          </div>

          {/* Alternar Pulso Acústico (Web Audio API) */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.92] transition-transform duration-120`}
            title={soundEnabled ? 'Silenciar retroalimentación acústica' : 'Activar pulso acústico táctil'}
          >
            {soundEnabled ? (
              <Volume2 size={14} strokeWidth={1.5} />
            ) : (
              <VolumeX size={14} strokeWidth={1.5} className={tokens.inkMuted} />
            )}
          </button>

          {/* Selector de Arquetipo de Superficie (Alabastro / Obsidiana) */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.92] hover:rotate-6 transition-all duration-150 font-mono-metric`}
            title="Alternar lienzo Alabastro Cálido / Obsidiana de Estudio"
          >
            {isDark ? <Sun size={13} strokeWidth={1.5} /> : <Moon size={13} strokeWidth={1.5} />}
            <span className="hidden md:inline text-[11px]">{isDark ? 'ALABASTRO' : 'OBSIDIANA'}</span>
          </button>

          {/* Exportar Bitácora en CSV */}
          <button
            onClick={onExportCSV}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.96] transition-transform duration-120 font-mono-metric`}
            title="Exportar datos completos a archivo CSV"
          >
            <Download size={13} strokeWidth={1.5} />
            <span className="text-[11px]">.CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
