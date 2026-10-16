import React from 'react';
import { Discipline } from '../../types/habit.types';
import { DISCIPLINES } from '../../constants/themeTokens';

interface DisciplineFilterPillProps {
  activeDiscipline: 'Todas' | Discipline;
  onSelectDiscipline: (discipline: 'Todas' | Discipline) => void;
  isDark: boolean;
  tokens: {
    hairline: string;
    surfaceElevated: string;
    inkMuted: string;
  };
}

export const DisciplineFilterPill: React.FC<DisciplineFilterPillProps> = ({
  activeDiscipline,
  onSelectDiscipline,
  isDark,
  tokens
}) => {
  const activeIndex = DISCIPLINES.indexOf(activeDiscipline);

  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono-metric text-[11px] uppercase tracking-wider ${tokens.inkMuted} mr-1`}>
        [01 // FILTRO]
      </span>

      {/* Contenedor relativo con pastilla deslizante animada */}
      <div
        className={`relative inline-flex items-center p-0.5 border ${tokens.hairline} rounded-[6px] ${tokens.surfaceElevated}`}
      >
        {/* Pastilla flotante con física fluida */}
        <div
          className="absolute inset-y-0.5 rounded-[4px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
          style={{
            left: '2px',
            width: 'calc((100% - 4px) / 5)',
            transform: `translateX(calc(${activeIndex} * 100%))`,
            backgroundColor: isDark ? '#08090A' : '#FAF8F5'
          }}
        />

        {DISCIPLINES.map((disc) => {
          const active = activeDiscipline === disc;
          return (
            <button
              key={disc}
              type="button"
              onClick={() => onSelectDiscipline(disc)}
              className={`relative z-10 px-2.5 py-1 text-xs font-medium rounded-[4px] transition-colors duration-200 active:scale-[0.96] ${
                active ? (isDark ? 'text-[#F7F8F8]' : 'text-[#191918]') : `${tokens.inkMuted} hover:text-current`
              }`}
            >
              {disc}
            </button>
          );
        })}
      </div>
    </div>
  );
};
