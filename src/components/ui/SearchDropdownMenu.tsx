import React from 'react';
import { Search, Command, Check, Sparkles } from 'lucide-react';
import { EnrichedHabit } from '../../types/habit.types';

interface SearchDropdownMenuProps {
  isOpen: boolean;
  habits: EnrichedHabit[];
  accentColor: string;
  hairlineClass: string;
  surfaceClass: string;
  inkMutedClass: string;
  surfaceHoverClass: string;
  onOpenCommand: () => void;
  onToggleToday: (habitId: string) => void;
  todayISO: string;
}

export const SearchDropdownMenu: React.FC<SearchDropdownMenuProps> = ({
  isOpen,
  habits,
  accentColor,
  hairlineClass,
  surfaceClass,
  inkMutedClass,
  surfaceHoverClass,
  onOpenCommand,
  onToggleToday,
  todayISO
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 top-full mt-2 w-72 sm:w-80 ${surfaceClass} border ${hairlineClass} rounded-[6px] shadow-2xl p-2.5 z-40 animate-in fade-in zoom-in-95 duration-150 before:absolute before:-top-3 before:inset-x-0 before:h-3 before:content-['']`}
    >
      <div className={`flex items-center justify-between pb-2 border-b ${hairlineClass} text-[11px] font-mono-metric`}>
        <span className="uppercase tracking-wider flex items-center gap-1.5" style={{ color: accentColor }}>
          <Sparkles size={12} strokeWidth={1.5} />
          Acceso Rápido
        </span>
        <span className={inkMutedClass}>Pulsa ⌘K</span>
      </div>

      <div className="py-2 space-y-1">
        <span className={`text-[10px] font-mono-metric uppercase ${inkMutedClass} block px-1`}>
          Rituales de Hoy (14 oct)
        </span>
        {habits.slice(0, 3).map((h) => (
          <div
            key={h.id}
            onClick={() => onToggleToday(h.id)}
            className={`cursor-pointer px-2 py-1.5 rounded-[4px] flex items-center justify-between text-xs ${surfaceHoverClass} transition-colors`}
          >
            <span className="truncate pr-2">{h.name}</span>
            <span
              className={`w-5 h-5 rounded-[3px] border flex items-center justify-center shrink-0 ${
                h.metrics.completedToday ? 'bg-[#2D4F3E] text-white border-transparent' : hairlineClass
              }`}
            >
              {h.metrics.completedToday && <Check size={11} strokeWidth={2.4} />}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenCommand}
        className="w-full mt-1 py-1.5 px-2 bg-[#191918] text-[#FAF8F5] dark:bg-[#F7F8F8] dark:text-[#08090A] text-xs font-mono-metric uppercase tracking-wider rounded-[4px] flex items-center justify-center gap-1.5 active:scale-[0.96] transition-transform"
      >
        <Command size={12} strokeWidth={1.5} />
        <span>Abrir Paleta Completa</span>
      </button>
    </div>
  );
};
