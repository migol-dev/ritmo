import React from 'react';
import { TelemetrySummary, DailyBreakdownItem } from '../../types/telemetry.types';
import { EnrichedHabit } from '../../types/habit.types';

interface WeeklyCadenceViewProps {
  telemetry: TelemetrySummary;
  selectedDayISO: string;
  selectedDayDetails: DailyBreakdownItem;
  onSelectDayISO: (iso: string) => void;
  habits: EnrichedHabit[];
  onToggleHabitDay: (habitId: string, isoDate: string) => void;
  isDark: boolean;
  tokens: {
    hairline: string;
    surfaceElevated: string;
    surfaceHover: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const WeeklyCadenceView: React.FC<WeeklyCadenceViewProps> = ({
  telemetry,
  selectedDayISO,
  selectedDayDetails,
  onSelectDayISO,
  habits,
  onToggleHabitDay,
  isDark,
  tokens
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-display-serif text-2xl tracking-[-0.03em]">
            Curva de Cadencia Semanal
          </h2>
          <p className={`text-xs ${tokens.inkMuted}`}>
            Haz clic o sobrevuela una barra para ver el desglose
          </p>
        </div>
        <div className="text-right font-mono-metric">
          <span className="text-lg font-semibold tabular-nums" style={{ color: tokens.accentPrimary }}>
            {selectedDayDetails?.pct}%
          </span>
          <span className={`block text-[10px] ${tokens.inkMuted}`}>
            {selectedDayDetails?.shortLabel} {selectedDayDetails?.dayNum}
          </span>
        </div>
      </div>

      {/* Escenario de Gráfico de Barras con Umbral del 80% */}
      <div
        className={`relative h-48 pt-7 pb-3 px-3 border ${tokens.hairline} rounded-[6px] ${tokens.surfaceElevated} flex flex-col justify-between`}
      >
        {/* Línea de umbral del 80% */}
        <div
          className="absolute inset-x-3 border-t border-dashed pointer-events-none flex justify-end"
          style={{
            bottom: '78%',
            borderColor: `${tokens.accentPrimary}60`
          }}
        >
          <span className="font-mono-metric text-[9px] -mt-3 px-1" style={{ color: tokens.accentPrimary }}>
            UMBRAL 80%
          </span>
        </div>

        {/* 7 Columnas de barras interactivas */}
        <div className="relative z-10 grid grid-cols-7 gap-2 h-full items-end">
          {telemetry.dailyBreakdown.map((item) => {
            const isSelected = item.iso === selectedDayISO;
            const barHeight = Math.max(8, item.pct);
            return (
              <button
                key={item.iso}
                type="button"
                onClick={() => onSelectDayISO(item.iso)}
                onMouseEnter={() => onSelectDayISO(item.iso)}
                className="group flex flex-col items-center justify-end h-full focus:outline-none"
              >
                <span
                  className={`font-mono-metric text-[10px] mb-1 tabular-nums transition-opacity ${
                    isSelected ? 'opacity-100 font-semibold' : 'opacity-60 group-hover:opacity-100'
                  }`}
                  style={{ color: isSelected ? tokens.accentPrimary : undefined }}
                >
                  {item.count}/{item.total}
                </span>

                <div
                  className={`w-full max-w-[32px] h-28 rounded-[3px] p-0.5 flex items-end transition-all duration-200 ${
                    isSelected ? 'bg-black/5 dark:bg-white/5' : isDark ? 'bg-[#08090A]' : 'bg-[#EAE6DF]'
                  }`}
                  style={{
                    outline: isSelected ? `2px solid ${tokens.accentPrimary}` : undefined
                  }}
                >
                  <div
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor:
                        item.pct === 100
                          ? tokens.accentForest
                          : item.isToday || isSelected
                          ? tokens.accentPrimary
                          : isDark
                          ? '#8A8F98'
                          : '#191918'
                    }}
                    className="w-full rounded-[2px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>

                <span
                  className={`mt-2 font-mono-metric text-[10px] uppercase transition-colors ${
                    isSelected ? 'font-semibold underline' : item.isToday ? 'underline' : tokens.inkMuted
                  }`}
                  style={{ color: isSelected || item.isToday ? tokens.accentPrimary : undefined }}
                >
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desglose Contextual del Día Seleccionado */}
      <div className={`pt-3 border-t ${tokens.hairline} space-y-2`}>
        <div className="flex items-center justify-between font-mono-metric text-[11px]">
          <span className="uppercase tracking-wider">
            DESGLOSE · {selectedDayDetails?.shortLabel} {selectedDayDetails?.dayNum} {selectedDayDetails?.monthShort}
          </span>
          <span className={tokens.inkMuted}>
            {selectedDayDetails?.count} de {selectedDayDetails?.total} sellados
          </span>
        </div>

        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {habits.map((h) => {
            const doneOnSelected = !!h.history[selectedDayDetails.iso];
            return (
              <div
                key={h.id}
                onClick={() => onToggleHabitDay(h.id, selectedDayDetails.iso)}
                className={`cursor-pointer px-2.5 py-1.5 rounded-[4px] border ${tokens.hairline} flex items-center justify-between text-xs ${tokens.surfaceHover} active:scale-[0.98] transition-all duration-150`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-transform hover:scale-125"
                    style={{
                      backgroundColor: doneOnSelected ? tokens.accentForest : `${tokens.accentPrimary}40`
                    }}
                  />
                  <span className={`truncate ${doneOnSelected ? '' : tokens.inkMuted}`}>
                    {h.name}
                  </span>
                </div>
                <span
                  className="font-mono-metric text-[10px] uppercase ml-2 shrink-0 font-medium"
                  style={{ color: doneOnSelected ? tokens.accentForest : undefined }}
                >
                  {doneOnSelected ? 'SELLADO' : 'PENDIENTE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
