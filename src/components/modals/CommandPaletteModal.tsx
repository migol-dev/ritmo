import React, { useState, useEffect, useRef } from 'react';
import { Command, RotateCcw } from 'lucide-react';
import { EnrichedHabit } from '../../types/habit.types';
import { ThemeMode } from '../../types/telemetry.types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: EnrichedHabit[];
  onToggleHabitToday: (id: string) => void;
  onToggleAllToday: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onExportCSV: () => void;
  onResetDefaults: () => void;
  todayISO: string;
  tokens: {
    hairline: string;
    hairlineDivider: string;
    surfaceElevated: string;
    surfaceHover: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  habits,
  onToggleHabitToday,
  onToggleAllToday,
  onToggleTheme,
  onExportCSV,
  onResetDefaults,
  tokens
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredHabits = habits.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-md font-ui-sans transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg ${tokens.surfaceElevated} border ${tokens.hairline} rounded-[6px] shadow-2xl overflow-hidden animate-modal-in`}
      >
        <div className={`flex items-center gap-2.5 px-4 py-3 border-b ${tokens.hairline}`}>
          <Command size={15} strokeWidth={1.75} style={{ color: tokens.accentPrimary }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe para buscar un ritual o ejecutar una acción..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
          <kbd className={`font-mono-metric text-[10px] px-1.5 py-0.5 border ${tokens.hairline} rounded`}>
            ESC
          </kbd>
        </div>

        <div className={`max-h-80 overflow-y-auto divide-y ${tokens.hairlineDivider} text-xs`}>
          {/* Alternar estado de hoy */}
          <div className="p-2 space-y-1">
            <span className={`px-2 py-1 font-mono-metric text-[10px] uppercase ${tokens.inkMuted} block`}>
              ALTERNAR ESTADO DE HOY (MIÉ 14 OCT)
            </span>
            {filteredHabits.map((h, idx) => (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  onToggleHabitToday(h.id);
                  onClose();
                }}
                style={{
                  animation: `slideInUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) backwards`,
                  animationDelay: `${idx * 22}ms`
                }}
                className={`w-full px-2.5 py-2 rounded-[4px] flex items-center justify-between ${tokens.surfaceHover} text-left active:scale-[0.98] hover:translate-x-1 transition-all duration-150`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono-metric text-[10px] opacity-60">{h.code}</span>
                  <span className="truncate">{h.name}</span>
                </div>
                <span
                  className="font-mono-metric text-[10px] font-medium"
                  style={{
                    color: h.metrics.completedToday ? tokens.accentForest : tokens.accentPrimary
                  }}
                >
                  {h.metrics.completedToday ? 'DESMARCAR HOY' : 'SELLAR HOY'}
                </span>
              </button>
            ))}
          </div>

          {/* Operaciones de sistema */}
          <div className="p-2 space-y-1">
            <span className={`px-2 py-1 font-mono-metric text-[10px] uppercase ${tokens.inkMuted} block`}>
              OPERACIONES DE SISTEMA
            </span>
            <button
              type="button"
              onClick={() => {
                onToggleAllToday();
                onClose();
              }}
              className={`w-full px-2.5 py-2 rounded-[4px] flex items-center justify-between ${tokens.surfaceHover} hover:translate-x-1 transition-all duration-150 active:scale-[0.98]`}
            >
              <span>Sellar o reiniciar todos los rituales de la jornada</span>
              <span className="font-mono-metric text-[10px]">ACCIÓN</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleTheme();
                onClose();
              }}
              className={`w-full px-2.5 py-2 rounded-[4px] flex items-center justify-between ${tokens.surfaceHover} hover:translate-x-1 transition-all duration-150 active:scale-[0.98]`}
            >
              <span>Conmutar lienzo Alabastro / Obsidiana</span>
              <span className="font-mono-metric text-[10px]">TEMA</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onExportCSV();
                onClose();
              }}
              className={`w-full px-2.5 py-2 rounded-[4px] flex items-center justify-between ${tokens.surfaceHover} hover:translate-x-1 transition-all duration-150 active:scale-[0.98]`}
            >
              <span>Exportar bitácora estructurada (.CSV)</span>
              <span className="font-mono-metric text-[10px]">DATOS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onResetDefaults();
                onClose();
              }}
              className={`w-full px-2.5 py-2 rounded-[4px] flex items-center justify-between ${tokens.surfaceHover} text-[#C86446] hover:translate-x-1 transition-all duration-150 active:scale-[0.98]`}
            >
              <span>Restaurar datos canónicos de demostración</span>
              <RotateCcw size={12} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
