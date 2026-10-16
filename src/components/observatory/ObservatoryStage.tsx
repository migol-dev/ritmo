import React from 'react';
import { LensMode, TelemetrySummary, DailyBreakdownItem } from '../../types/telemetry.types';
import { EnrichedHabit } from '../../types/habit.types';
import { LENS_LIST } from '../../constants/themeTokens';
import { WeeklyCadenceView } from './WeeklyCadenceView';
import { StreaksRecordView } from './StreaksRecordView';
import { DensityMatrix28View } from './DensityMatrix28View';
import { ChronotypeView } from './ChronotypeView';

interface ObservatoryStageProps {
  analyticalLens: LensMode;
  onSelectLens: (lens: LensMode) => void;
  telemetry: TelemetrySummary;
  selectedDayISO: string;
  selectedDayDetails: DailyBreakdownItem;
  onSelectDayISO: (iso: string) => void;
  habits: EnrichedHabit[];
  onToggleHabitDay: (habitId: string, isoDate: string) => void;
  onInspect: (id: string) => void;
  isDark: boolean;
  tokens: {
    hairline: string;
    hairlineDivider: string;
    surfaceElevated: string;
    surfaceHover: string;
    subtleStage: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const ObservatoryStage: React.FC<ObservatoryStageProps> = ({
  analyticalLens,
  onSelectLens,
  telemetry,
  selectedDayISO,
  selectedDayDetails,
  onSelectDayISO,
  habits,
  onToggleHabitDay,
  onInspect,
  isDark,
  tokens
}) => {
  const activeIndex = LENS_LIST.indexOf(analyticalLens);

  return (
    <aside className="lg:col-span-4 py-6 lg:pl-8 space-y-6">
      <div className="lg:sticky lg:top-20 space-y-6">
        {/* Encabezado y Selector con pastilla deslizante */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`font-mono-metric text-[11px] uppercase tracking-wider ${tokens.inkMuted}`}>
              [02 // OBSERVATORIO ANALÍTICO]
            </span>
            <span
              className="font-mono-metric text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: tokens.accentPrimary }}
            >
              INTERACTIVO
            </span>
          </div>

          <div
            className={`relative grid grid-cols-4 border ${tokens.hairline} rounded-[5px] p-0.5 ${tokens.surfaceElevated} font-mono-metric text-[10px] overflow-hidden`}
          >
            {/* Pastilla indicadora animada */}
            <div
              className="absolute inset-y-0.5 rounded-[3px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{
                left: '2px',
                width: 'calc((100% - 4px) / 4)',
                transform: `translateX(calc(${activeIndex} * 100%))`,
                backgroundColor: isDark ? '#08090A' : '#FAF8F5'
              }}
            />

            <button
              type="button"
              onClick={() => onSelectLens('cadence')}
              className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                analyticalLens === 'cadence'
                  ? isDark ? 'text-[#F7F8F8] font-semibold' : 'text-[#191918] font-semibold'
                  : `${tokens.inkMuted} hover:text-current`
              }`}
            >
              SEMANA
            </button>
            <button
              type="button"
              onClick={() => onSelectLens('streaks')}
              className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                analyticalLens === 'streaks'
                  ? isDark ? 'text-[#F7F8F8] font-semibold' : 'text-[#191918] font-semibold'
                  : `${tokens.inkMuted} hover:text-current`
              }`}
            >
              RACHAS
            </button>
            <button
              type="button"
              onClick={() => onSelectLens('matrix28')}
              className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                analyticalLens === 'matrix28'
                  ? isDark ? 'text-[#F7F8F8] font-semibold' : 'text-[#191918] font-semibold'
                  : `${tokens.inkMuted} hover:text-current`
              }`}
            >
              28 DÍAS
            </button>
            <button
              type="button"
              onClick={() => onSelectLens('chronotype')}
              className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                analyticalLens === 'chronotype'
                  ? isDark ? 'text-[#F7F8F8] font-semibold' : 'text-[#191918] font-semibold'
                  : `${tokens.inkMuted} hover:text-current`
              }`}
            >
              CRONO
            </button>
          </div>
        </div>

        {/* Lentes Condicionales */}
        {analyticalLens === 'cadence' && (
          <WeeklyCadenceView
            telemetry={telemetry}
            selectedDayISO={selectedDayISO}
            selectedDayDetails={selectedDayDetails}
            onSelectDayISO={onSelectDayISO}
            habits={habits}
            onToggleHabitDay={onToggleHabitDay}
            isDark={isDark}
            tokens={tokens}
          />
        )}

        {analyticalLens === 'streaks' && (
          <StreaksRecordView habits={habits} onInspect={onInspect} tokens={tokens} />
        )}

        {analyticalLens === 'matrix28' && (
          <DensityMatrix28View habits={habits} telemetry={telemetry} tokens={tokens} />
        )}

        {analyticalLens === 'chronotype' && (
          <ChronotypeView habits={habits} tokens={tokens} />
        )}

        {/* Axioma Editorial de Continuidad */}
        <div className={`p-3.5 border ${tokens.hairline} rounded-[4px] space-y-1`}>
          <div
            className="flex items-center justify-between text-[11px] font-mono-metric"
            style={{ color: tokens.accentPrimary }}
          >
            <span>REGLA FUNDAMENTAL</span>
            <span>MÁXIMO 2 DÍAS</span>
          </div>
          <p className={`text-xs ${tokens.inkMuted} leading-relaxed`}>
            Nunca permitas dos días en blanco seguidos en un hábito pilar. Un tropiezo es un accidente; dos es el
            nacimiento de un nuevo hábito opuesto.
          </p>
        </div>
      </div>
    </aside>
  );
};
