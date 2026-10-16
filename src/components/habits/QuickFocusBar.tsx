import React from 'react';
import { Check } from 'lucide-react';
import { EnrichedHabit } from '../../types/habit.types';

interface QuickFocusBarProps {
  habits: EnrichedHabit[];
  onToggleToday: (habitId: string) => void;
  isDark: boolean;
  tokens: {
    hairline: string;
    surfaceElevated: string;
    accentPrimary: string;
    accentForest: string;
  };
}

export const QuickFocusBar: React.FC<QuickFocusBarProps> = ({
  habits,
  onToggleToday,
  isDark,
  tokens
}) => {
  return (
    <div
      className={`p-3.5 border ${tokens.hairline} rounded-[6px] ${tokens.surfaceElevated} flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: tokens.accentPrimary }}
        />
        <span className="text-xs font-medium">
          Sellado veloz para hoy (<span className="font-mono-metric">Mié 14 oct</span>):
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {habits.map((h) => {
          const done = h.metrics.completedToday;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => onToggleToday(h.id)}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs border transition-all duration-200 active:scale-[0.92] ${
                done
                  ? 'text-[#FAF8F5] border-transparent font-medium shadow-sm'
                  : `${isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'} ${tokens.hairline} hover:border-[#C86446]`
              }`}
              style={{
                backgroundColor: done ? tokens.accentForest : undefined
              }}
              title={`Alternar hoy: ${h.name}`}
            >
              <span className="font-mono-metric text-[10px] opacity-65">{h.code}</span>
              <span className={`max-w-[130px] truncate ${done ? 'line-through opacity-85' : ''}`}>
                {h.name.split('(')[0].trim()}
              </span>
              {done ? (
                <Check size={11} strokeWidth={2.4} className="animate-check-pop" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
