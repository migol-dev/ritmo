import React from 'react';
import { EnrichedHabit } from '../../types/habit.types';
import { WeekDay } from '../../types/telemetry.types';
import { HabitRow } from './HabitRow';

interface HabitsTableProps {
  habits: EnrichedHabit[];
  weekDays: WeekDay[];
  selectedDayISO: string;
  onSelectDayISO: (iso: string) => void;
  inspectedHabitId: string | null;
  onInspect: (id: string) => void;
  onToggleDay: (habitId: string, isoDate: string) => void;
  onDuplicate: (habit: EnrichedHabit) => void;
  onDelete: (habitId: string) => void;
  isDark: boolean;
  tokens: {
    hairline: string;
    hairlineDivider: string;
    surfaceElevated: string;
    surfaceHover: string;
    rowSelected: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const HabitsTable: React.FC<HabitsTableProps> = ({
  habits,
  weekDays,
  selectedDayISO,
  onSelectDayISO,
  inspectedHabitId,
  onInspect,
  onToggleDay,
  onDuplicate,
  onDelete,
  isDark,
  tokens
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className={`border-b ${tokens.hairline} font-mono-metric text-[11px] uppercase ${tokens.inkMuted}`}>
            <th className="py-2.5 pr-3 w-10 font-normal">ÍND</th>
            <th className="py-2.5 px-2 font-normal">RITUAL / PROTOCOLO</th>
            {weekDays.map((d) => {
              const isSelected = d.iso === selectedDayISO;
              return (
                <th key={d.iso} className="py-2 px-1 text-center w-12 font-normal">
                  <button
                    type="button"
                    onClick={() => onSelectDayISO(d.iso)}
                    className={`w-full py-1.5 rounded-[4px] flex flex-col items-center transition-all duration-150 active:scale-[0.92] ${
                      d.isToday
                        ? 'text-[#FAF8F5] font-semibold shadow-sm'
                        : isSelected
                        ? `${tokens.surfaceElevated} text-current font-semibold border ${tokens.hairline}`
                        : tokens.surfaceHover
                    }`}
                    style={{
                      backgroundColor: d.isToday ? tokens.accentPrimary : undefined
                    }}
                    title={`Inspeccionar ${d.shortLabel} ${d.dayNum} en el gráfico analítico`}
                  >
                    <span className="text-[10px] tracking-tight">{d.shortLabel}</span>
                    <span className="text-xs mt-0.5 tabular-nums">{d.dayNum}</span>
                  </button>
                </th>
              );
            })}
            <th className="py-2.5 pl-3 pr-2 text-right font-normal w-24">CADENCIA</th>
            <th className="py-2.5 pl-2 text-right font-normal w-20">RACHA</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${tokens.hairlineDivider} text-sm`}>
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              weekDays={weekDays}
              selectedDayISO={selectedDayISO}
              isInspected={inspectedHabitId === habit.id}
              onInspect={onInspect}
              onToggleDay={onToggleDay}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              isDark={isDark}
              tokens={tokens}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
