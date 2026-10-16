import React from 'react';
import { Check, Flame, SlidersHorizontal, Copy, Trash2 } from 'lucide-react';
import { EnrichedHabit } from '../../types/habit.types';
import { WeekDay } from '../../types/telemetry.types';

interface HabitRowProps {
  habit: EnrichedHabit;
  weekDays: WeekDay[];
  selectedDayISO: string;
  isInspected: boolean;
  onInspect: (id: string) => void;
  onToggleDay: (habitId: string, isoDate: string) => void;
  onDuplicate: (habit: EnrichedHabit) => void;
  onDelete: (habitId: string) => void;
  isDark: boolean;
  tokens: {
    hairline: string;
    surfaceElevated: string;
    surfaceHover: string;
    rowSelected: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  weekDays,
  selectedDayISO,
  isInspected,
  onInspect,
  onToggleDay,
  onDuplicate,
  onDelete,
  isDark,
  tokens
}) => {
  const { currentStreak, weekCount, target } = habit.metrics;
  const metTarget = weekCount >= target;

  return (
    <tr
      className={`group transition-colors duration-150 ${
        isInspected ? tokens.rowSelected : tokens.surfaceHover
      }`}
    >
      {/* Coordenada de Índice */}
      <td className={`py-3.5 pr-3 font-mono-metric text-xs ${tokens.inkMuted} align-middle`}>
        {habit.code}
      </td>

      {/* Título del Ritual + Divulgación Progresiva */}
      <td className="py-3.5 px-2 align-middle">
        <div className="flex items-center justify-between gap-2">
          <div onClick={() => onInspect(habit.id)} className="cursor-pointer min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium leading-snug truncate max-w-[260px] sm:max-w-[320px] group-hover:underline transition-all">
                {habit.name}
              </span>
            </div>
            <div className={`flex items-center gap-2 mt-0.5 font-mono-metric text-[11px] ${tokens.inkMuted}`}>
              <span>{habit.discipline}</span>
              <span>·</span>
              <span>{habit.period}</span>
              <span>·</span>
              <span>{habit.timeCue}</span>
            </div>
          </div>

          {/* Acciones contextuales reveladas en hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 shrink-0">
            <button
              type="button"
              onClick={() => onInspect(habit.id)}
              className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceElevated} hover:border-[#C86446] text-xs flex items-center gap-1 font-mono-metric active:scale-[0.92] transition-transform`}
              title="Abrir inspector de protocolo y calibración"
            >
              <SlidersHorizontal size={12} strokeWidth={1.5} />
              <span className="hidden xl:inline text-[10px]">Ficha</span>
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(habit)}
              className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceElevated} hover:border-[#C86446] active:scale-[0.92] transition-transform`}
              title="Duplicar ritual"
            >
              <Copy size={12} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(habit.id)}
              className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceElevated} hover:text-[#C86446] hover:border-[#C86446] active:scale-[0.92] transition-transform`}
              title="Archivar ritual"
            >
              <Trash2 size={12} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </td>

      {/* 7 Celdas Táctiles de Registro Diario */}
      {weekDays.map((d) => {
        const checked = !!habit.history[d.iso];
        const isSelectedCol = d.iso === selectedDayISO;
        return (
          <td
            key={d.iso}
            className={`py-2.5 px-1 text-center align-middle ${
              isSelectedCol ? (isDark ? 'bg-white/[0.02]' : 'bg-black/[0.015]') : ''
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleDay(habit.id, d.iso)}
              className={`group/cell relative w-8 h-8 mx-auto rounded-[4px] flex items-center justify-center transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.88] ${
                checked
                  ? 'text-[#FAF8F5] border border-transparent font-medium shadow-sm'
                  : d.isToday
                  ? `border ${tokens.hairline} ${tokens.surfaceElevated} hover:border-[#C86446]`
                  : `border ${tokens.hairline} hover:border-current`
              }`}
              style={{
                backgroundColor: checked ? tokens.accentForest : undefined,
                borderColor: !checked && d.isToday ? tokens.accentPrimary : undefined
              }}
              title={`${habit.name} — ${d.shortLabel} ${d.dayNum} ${d.monthShort}`}
            >
              {checked ? (
                <Check size={14} strokeWidth={2.4} className="animate-check-pop" />
              ) : d.isToday ? (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tokens.accentPrimary }}
                />
              ) : (
                <Check
                  size={12}
                  strokeWidth={2}
                  className="opacity-0 group-hover/cell:opacity-30 transition-opacity"
                />
              )}
            </button>
          </td>
        );
      })}

      {/* Ratio y Barra de Cadencia Semanal */}
      <td className="py-3.5 pl-3 pr-2 text-right align-middle font-mono-metric">
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs ${metTarget ? 'font-semibold' : tokens.inkMuted}`}
            style={{ color: metTarget ? tokens.accentForest : undefined }}
          >
            {weekCount}/{target} d
          </span>
          <div className={`w-16 h-1.5 ${tokens.surfaceElevated} rounded-none overflow-hidden border ${tokens.hairline}`}>
            <div
              style={{
                width: `${Math.min(100, Math.round((weekCount / target) * 100))}%`,
                backgroundColor: metTarget ? tokens.accentForest : tokens.accentPrimary
              }}
              className="h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>
        </div>
      </td>

      {/* Racha Activa Continua */}
      <td className="py-3.5 pl-2 text-right align-middle font-mono-metric">
        <span
          className={`inline-flex items-center justify-end gap-1 text-xs font-medium transition-transform group-hover:scale-105 ${
            currentStreak > 0 ? '' : tokens.inkMuted
          }`}
          style={{ color: currentStreak > 0 ? tokens.accentPrimary : undefined }}
        >
          <Flame
            size={13}
            strokeWidth={1.75}
            className={currentStreak > 0 ? 'fill-current opacity-70' : ''}
          />
          <span className="tabular-nums">{currentStreak}d</span>
        </span>
      </td>
    </tr>
  );
};
