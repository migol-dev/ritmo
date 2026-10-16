import React from 'react';
import { EnrichedHabit } from '../../types/habit.types';

interface StreaksRecordViewProps {
  habits: EnrichedHabit[];
  onInspect: (id: string) => void;
  tokens: {
    hairline: string;
    hairlineDivider: string;
    surfaceElevated: string;
    surfaceHover: string;
    inkMuted: string;
    accentPrimary: string;
  };
}

export const StreaksRecordView: React.FC<StreaksRecordViewProps> = ({
  habits,
  onInspect,
  tokens
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="font-display-serif text-2xl tracking-[-0.03em]">
          Rachas Activas vs. Récord
        </h2>
        <p className={`text-xs ${tokens.inkMuted}`}>
          Racha activa en marcha comparada con la mejor marca histórica
        </p>
      </div>

      <div className={`divide-y ${tokens.hairlineDivider} border-y ${tokens.hairline}`}>
        {[...habits]
          .sort((a, b) => b.metrics.currentStreak - a.metrics.currentStreak)
          .map((h) => {
            const maxScale = Math.max(14, ...habits.map((item) => item.metrics.peakStreak));
            const activeWidth = Math.max(4, Math.round((h.metrics.currentStreak / maxScale) * 100));
            const peakWidth = Math.max(6, Math.round((h.metrics.peakStreak / maxScale) * 100));

            return (
              <div
                key={h.id}
                onClick={() => onInspect(h.id)}
                className={`py-3 px-1 cursor-pointer ${tokens.surfaceHover} active:scale-[0.98] transition-all duration-150 space-y-1.5`}
              >
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-medium truncate">{h.name}</span>
                  <div className="font-mono-metric text-[11px] shrink-0 flex items-center gap-2">
                    <span className="font-semibold" style={{ color: tokens.accentPrimary }}>
                      {h.metrics.currentStreak}d
                    </span>
                    <span className={tokens.inkMuted}>/ récord {h.metrics.peakStreak}d</span>
                  </div>
                </div>

                {/* Barra de doble horizonte */}
                <div
                  className={`w-full h-2 ${tokens.surfaceElevated} relative overflow-hidden rounded-[2px] border ${tokens.hairline}`}
                >
                  <div style={{ width: `${peakWidth}%` }} className="absolute inset-y-0 left-0 bg-current opacity-20" />
                  <div
                    style={{
                      width: `${activeWidth}%`,
                      backgroundColor: tokens.accentPrimary
                    }}
                    className="absolute inset-y-0 left-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
