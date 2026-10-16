import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Habit } from '../../types/habit.types';
import { ThemeTokens } from '../../constants/themeTokens';
import { addDays, formatDateISO } from '../../utils/date.utils';

interface HabitInspectorDrawerProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateField: (id: string, field: keyof Habit, value: any) => void;
  onToggleDay: (id: string, dateIso: string) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
  tokens: ThemeTokens;
  anchorToday: Date;
  playTactileClick: (type: 'tick' | 'wood' | 'pop' | 'snap' | 'chime') => void;
}

export const HabitInspectorDrawer: React.FC<HabitInspectorDrawerProps> = ({
  habit,
  isOpen,
  onClose,
  onUpdateField,
  onToggleDay,
  onDelete,
  isDark,
  tokens,
  anchorToday,
  playTactileClick,
}) => {
  if (!isOpen || !habit) return null;

  return (
    <div
      onClick={() => {
        onClose();
        playTactileClick('pop');
      }}
      className="fixed inset-0 z-40 flex justify-end bg-black/45 backdrop-blur-[3px] font-ui-sans transition-all duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md h-full ${tokens.surfaceElevated} border-l ${tokens.hairline} p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-drawer-in`}
      >
        <div className="space-y-6">
          {/* Encabezado del Inspector */}
          <div className={`flex items-center justify-between pb-4 border-b ${tokens.hairline}`}>
            <div className="flex items-center gap-2 font-mono-metric text-xs">
              <span
                className="px-1.5 py-0.5 border"
                style={{
                  borderColor: tokens.accentPrimary,
                  color: tokens.accentPrimary,
                }}
              >
                RITUAL #{habit.code}
              </span>
              <span className={tokens.inkMuted}>{habit.discipline}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                playTactileClick('pop');
              }}
              className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceHover} active:scale-[0.92] transition-transform`}
              title="Cerrar inspector"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>

          {/* Nombre Editable */}
          <div className="space-y-1.5">
            <label className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted}`}>
              NOMBRE DEL RITUAL
            </label>
            <input
              type="text"
              value={habit.name}
              onChange={(e) => onUpdateField(habit.id, 'name', e.target.value)}
              className={`w-full px-3 py-2 text-base font-medium rounded-[4px] border ${tokens.hairline} ${
                isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'
              } focus:outline-none focus:border-[#C86446] transition-colors`}
            />
          </div>

          {/* Resumen Métrico dentro de la Ficha */}
          <div
            className={`grid grid-cols-3 border ${tokens.hairline} divide-x ${tokens.hairlineDivider} rounded-[4px] ${
              isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'
            }`}
          >
            <div className="p-3">
              <span className={`font-mono-metric text-[10px] ${tokens.inkMuted} block`}>RACHA ACTIVA</span>
              <span
                className="font-display-serif text-2xl tabular-nums font-semibold"
                style={{ color: tokens.accentPrimary }}
              >
                {habit.metrics.currentStreak} d
              </span>
            </div>
            <div className="p-3">
              <span className={`font-mono-metric text-[10px] ${tokens.inkMuted} block`}>RÉCORD MÁX</span>
              <span className="font-display-serif text-2xl tabular-nums">
                {habit.metrics.peakStreak} d
              </span>
            </div>
            <div className="p-3">
              <span className={`font-mono-metric text-[10px] ${tokens.inkMuted} block`}>TASA 28D</span>
              <span className="font-display-serif text-2xl tabular-nums">
                {habit.metrics.rate28}%
              </span>
            </div>
          </div>

          {/* Control Deslizante de Cadencia Semanal Objetivo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono-metric text-xs">
              <span className={tokens.inkMuted}>CADENCIA SEMANAL OBJETIVO</span>
              <span className="font-semibold" style={{ color: tokens.accentPrimary }}>
                {habit.cadenceTarget} días / semana
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              value={habit.cadenceTarget}
              onChange={(e) => onUpdateField(habit.id, 'cadenceTarget', Number(e.target.value))}
              className="w-full accent-[#C86446] cursor-pointer"
            />
            <div className={`flex justify-between font-mono-metric text-[10px] ${tokens.inkMuted}`}>
              <span>1d (Mínimo)</span>
              <span>4d (Consistente)</span>
              <span>7d (Diario estricto)</span>
            </div>
          </div>

          {/* Disciplina, Momento del Día y Horario */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className={`font-mono-metric text-[10px] uppercase ${tokens.inkMuted}`}>
                DISCIPLINA
              </label>
              <select
                value={habit.discipline}
                onChange={(e) => onUpdateField(habit.id, 'discipline', e.target.value)}
                className={`w-full px-2 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${
                  isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'
                }`}
              >
                <option value="Enfoque">Enfoque</option>
                <option value="Cuerpo">Cuerpo</option>
                <option value="Mente">Mente</option>
                <option value="Descanso">Descanso</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={`font-mono-metric text-[10px] uppercase ${tokens.inkMuted}`}>
                FASE
              </label>
              <select
                value={habit.period}
                onChange={(e) => onUpdateField(habit.id, 'period', e.target.value)}
                className={`w-full px-2 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${
                  isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'
                }`}
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={`font-mono-metric text-[10px] uppercase ${tokens.inkMuted}`}>
                HORA CUE
              </label>
              <input
                type="text"
                value={habit.timeCue}
                onChange={(e) => onUpdateField(habit.id, 'timeCue', e.target.value)}
                className={`w-full px-2 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${
                  isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'
                }`}
              />
            </div>
          </div>

          {/* Protocolo de Diseño Conductual */}
          <div className="space-y-1.5">
            <label className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted}`}>
              PROTOCOLO DE DISEÑO CONDUCTUAL
            </label>
            <textarea
              rows={3}
              value={habit.protocol}
              onChange={(e) => onUpdateField(habit.id, 'protocol', e.target.value)}
              className={`w-full p-3 text-xs leading-relaxed rounded-[4px] border ${tokens.hairline} ${
                isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'
              } focus:outline-none focus:border-[#C86446] transition-colors`}
            />
          </div>

          {/* Matriz Individual de 28 Días (Clic para rectificar días) */}
          <div className="space-y-2">
            <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block`}>
              HISTORIAL INDIVIDUAL 28 DÍAS (CLIC PARA RECTIFICAR)
            </span>
            <div className="grid grid-cols-7 gap-1.5 font-mono-metric">
              {Array.from({ length: 28 }, (_, idx) => {
                const ago = 27 - idx;
                const d = addDays(anchorToday, -ago);
                const iso = formatDateISO(d);
                const done = !!habit.history[iso];
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => onToggleDay(habit.id, iso)}
                    className={`h-8 rounded-[3px] border text-[11px] font-medium transition-transform active:scale-[0.88] ${
                      done
                        ? 'text-[#FAF8F5] border-transparent shadow-sm'
                        : `${tokens.hairline} ${isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'} ${tokens.inkMuted}`
                    }`}
                    style={{
                      backgroundColor: done ? tokens.accentForest : undefined,
                    }}
                  >
                    {String(d.getDate()).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Acciones Inferiores del Cajón */}
        <div className={`pt-4 border-t ${tokens.hairline} flex items-center justify-between`}>
          <button
            type="button"
            onClick={() => {
              onDelete(habit.id);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-mono-metric text-[#C86446] hover:underline active:scale-95 transition-transform"
          >
            <Trash2 size={13} strokeWidth={1.5} />
            <span>Archivar registro</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              playTactileClick('pop');
            }}
            className="px-4 py-2 text-xs font-mono-metric uppercase bg-[#191918] text-[#FAF8F5] dark:bg-[#F7F8F8] dark:text-[#08090A] rounded-[4px] font-semibold active:scale-[0.96] transition-transform duration-120 shadow-sm hover:opacity-90"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
