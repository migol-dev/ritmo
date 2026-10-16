import React from 'react';
import { EnrichedHabit } from '../../types/habit.types';
import { TelemetrySummary } from '../../types/telemetry.types';
import { addDays, formatDateISO, MONTH_SHORT, ANCHOR_TODAY } from '../../utils/date.utils';

interface DensityMatrix28ViewProps {
  habits: EnrichedHabit[];
  telemetry: TelemetrySummary;
  tokens: {
    hairline: string;
    surfaceElevated: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const DensityMatrix28View: React.FC<DensityMatrix28ViewProps> = ({
  habits,
  telemetry,
  tokens
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="font-display-serif text-2xl tracking-[-0.03em]">
          Huella de Densidad (28 Días)
        </h2>
        <p className={`text-xs ${tokens.inkMuted}`}>
          Matriz de intensidad diaria acumulada en las últimas 4 semanas
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1.5 font-mono-metric">
        {Array.from({ length: 28 }, (_, idx) => {
          const daysAgo = 27 - idx;
          const d = addDays(ANCHOR_TODAY, -daysAgo);
          const iso = formatDateISO(d);
          const doneCount = habits.filter((h) => !!h.history[iso]).length;
          const ratio = telemetry.total > 0 ? doneCount / telemetry.total : 0;

          let cellBg = tokens.surfaceElevated;
          let cellText = tokens.inkMuted;
          if (ratio >= 0.85) {
            cellBg = tokens.accentForest;
            cellText = '#FAF8F5';
          } else if (ratio >= 0.5) {
            cellBg = `${tokens.accentForest}90`;
            cellText = '#FAF8F5';
          } else if (ratio > 0) {
            cellBg = `${tokens.accentPrimary}35`;
            cellText = tokens.accentPrimary;
          }

          return (
            <div
              key={iso}
              title={`${d.getDate()} ${MONTH_SHORT[d.getMonth()]}: ${doneCount}/${telemetry.total} rituales sellados`}
              style={{
                backgroundColor: ratio > 0 ? cellBg : undefined,
                color: ratio > 0 ? cellText : undefined
              }}
              className={`h-10 rounded-[3px] border ${tokens.hairline} flex flex-col items-center justify-center text-[11px] transition-transform duration-150 hover:scale-110 active:scale-95 ${
                ratio === 0 ? tokens.surfaceElevated : ''
              } ${daysAgo === 0 ? 'ring-1' : ''}`}
            >
              <span className="font-semibold">{String(d.getDate()).padStart(2, '0')}</span>
              <span className="text-[9px] opacity-80">
                {doneCount}/{telemetry.total}
              </span>
            </div>
          );
        })}
      </div>

      <div className={`flex items-center justify-between text-[11px] font-mono-metric ${tokens.inkMuted} pt-2 border-t ${tokens.hairline}`}>
        <span>17 sep</span>
        <div className="flex items-center gap-1.5">
          <span>0%</span>
          <span className={`w-2.5 h-2.5 inline-block border ${tokens.hairline} ${tokens.surfaceElevated}`} />
          <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: `${tokens.accentPrimary}35` }} />
          <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: `${tokens.accentForest}90` }} />
          <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: tokens.accentForest }} />
          <span>100%</span>
        </div>
        <span>14 oct</span>
      </div>
    </div>
  );
};
