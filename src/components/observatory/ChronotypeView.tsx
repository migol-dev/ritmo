import React from 'react';
import { Coffee, Sun, MoonStar } from 'lucide-react';
import { EnrichedHabit } from '../../types/habit.types';

interface ChronotypeViewProps {
  habits: EnrichedHabit[];
  tokens: {
    hairline: string;
    surfaceElevated: string;
    subtleStage: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const ChronotypeView: React.FC<ChronotypeViewProps> = ({ habits, tokens }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="font-display-serif text-2xl tracking-[-0.03em]">
          Distribución por Fases del Día
        </h2>
        <p className={`text-xs ${tokens.inkMuted}`}>
          Balance de carga de atención según tus momentos de energía
        </p>
      </div>

      <div className="space-y-3 font-mono-metric">
        {(['Mañana', 'Tarde', 'Noche'] as const).map((period) => {
          const periodHabits = habits.filter((h) => h.period === period);
          const doneInPeriod = periodHabits.filter((h) => h.metrics.completedToday).length;
          const periodPct =
            periodHabits.length > 0 ? Math.round((doneInPeriod / periodHabits.length) * 100) : 0;

          return (
            <div
              key={period}
              className={`p-3 border ${tokens.hairline} rounded-[4px] ${tokens.surfaceElevated} space-y-2 hover:border-current transition-colors duration-200`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {period === 'Mañana' && <Coffee size={13} strokeWidth={1.5} />}
                  {period === 'Tarde' && <Sun size={13} strokeWidth={1.5} />}
                  {period === 'Noche' && <MoonStar size={13} strokeWidth={1.5} />}
                  <span className="font-semibold uppercase tracking-wider">{period}</span>
                </div>
                <span className="text-[11px] tabular-nums font-semibold">
                  {doneInPeriod}/{periodHabits.length} ({periodPct}%)
                </span>
              </div>

              <div className={`w-full h-1.5 ${tokens.subtleStage} rounded-none overflow-hidden`}>
                <div
                  style={{
                    width: `${periodPct}%`,
                    backgroundColor: periodPct === 100 ? tokens.accentForest : tokens.accentPrimary
                  }}
                  className="h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {periodHabits.map((h) => (
                  <span
                    key={h.id}
                    className={`text-[10px] px-1.5 py-0.5 rounded-[2px] border ${tokens.hairline} transition-transform hover:scale-105 ${
                      h.metrics.completedToday
                        ? 'bg-current text-white font-medium shadow-sm'
                        : tokens.inkMuted
                    }`}
                    style={{
                      backgroundColor: h.metrics.completedToday ? tokens.accentForest : undefined,
                      color: h.metrics.completedToday ? '#FAF8F5' : undefined
                    }}
                  >
                    {h.timeCue} {h.name.split('(')[0].trim()}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
