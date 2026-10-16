import React, { useState, useRef } from 'react';
import { Plus, CornerDownLeft } from 'lucide-react';
import { Discipline, Period } from '../../types/habit.types';

interface InlineHabitFormProps {
  onAddHabit: (name: string, discipline: Discipline, cadenceTarget: number, period: Period) => void;
  isDark: boolean;
  tokens: {
    hairline: string;
    surfaceElevated: string;
    inkMuted: string;
  };
}

export const InlineHabitForm: React.FC<InlineHabitFormProps> = ({
  onAddHabit,
  isDark,
  tokens
}) => {
  const [name, setName] = useState('');
  const [discipline, setDiscipline] = useState<Discipline>('Enfoque');
  const [target, setTarget] = useState<number>(6);
  const [period, setPeriod] = useState<Period>('Mañana');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit(name, discipline, target, period);
    setName('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`pt-4 border-t ${tokens.hairline} flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5`}
    >
      <div
        className={`flex-1 flex items-center gap-2 px-3 py-2 border ${tokens.hairline} rounded-[4px] ${
          isDark ? 'bg-[#0E0F11]' : 'bg-white/80'
        } focus-within:border-[#C86446] transition-colors`}
      >
        <Plus size={14} strokeWidth={1.75} className={tokens.inkMuted} />
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Incorporar nuevo ritual al cuaderno (ej. Sesión de respiración 15 min)..."
          className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-[#8A8F98]/70"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value as Discipline)}
          className={`px-2.5 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${tokens.surfaceElevated} focus:outline-none focus:border-[#C86446]`}
        >
          <option value="Enfoque">Enfoque</option>
          <option value="Cuerpo">Cuerpo</option>
          <option value="Mente">Mente</option>
          <option value="Descanso">Descanso</option>
        </select>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className={`px-2.5 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${tokens.surfaceElevated} focus:outline-none focus:border-[#C86446]`}
        >
          <option value="Mañana">Mañana</option>
          <option value="Tarde">Tarde</option>
          <option value="Noche">Noche</option>
        </select>

        <select
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className={`px-2.5 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${tokens.surfaceElevated} focus:outline-none focus:border-[#C86446]`}
          title="Meta de días por semana"
        >
          <option value={7}>7 d/sem</option>
          <option value={6}>6 d/sem</option>
          <option value={5}>5 d/sem</option>
          <option value={4}>4 d/sem</option>
          <option value={3}>3 d/sem</option>
        </select>

        <button
          type="submit"
          className="px-3.5 py-2 text-xs font-mono-metric uppercase tracking-wider bg-[#191918] text-[#FAF8F5] dark:bg-[#F7F8F8] dark:text-[#08090A] rounded-[4px] flex items-center gap-1.5 active:scale-[0.96] transition-transform duration-120 shrink-0 font-medium shadow-sm hover:opacity-90"
        >
          <span>Añadir</span>
          <CornerDownLeft size={12} strokeWidth={1.75} />
        </button>
      </div>
    </form>
  );
};
