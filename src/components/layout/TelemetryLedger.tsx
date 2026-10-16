import React from 'react';
import { TelemetrySummary, LensMode } from '../../types/telemetry.types';

interface TelemetryLedgerProps {
  telemetry: TelemetrySummary;
  weekOffset: number;
  tokens: {
    hairline: string;
    hairlineDivider: string;
    inkMuted: string;
    accentPrimary: string;
    accentForest: string;
  };
  onSelectLens: (lens: LensMode) => void;
}

export const TelemetryLedger: React.FC<TelemetryLedgerProps> = ({
  telemetry,
  weekOffset,
  tokens,
  onSelectLens
}) => {
  return (
    <section className={`py-8 sm:py-10 border-b ${tokens.hairline} grid grid-cols-1 lg:grid-cols-12 gap-8 items-end`}>
      {/* Manifiesto y Contexto Editorial */}
      <div className="lg:col-span-6 space-y-3">
        <div
          className="flex items-center gap-2 font-mono-metric text-[11px] uppercase tracking-[0.14em]"
          style={{ color: tokens.accentPrimary }}
        >
          <span>[00 // ESTUDIO DE CONTINUIDAD]</span>
          <span>·</span>
          <span>{weekOffset === 0 ? 'CICLO VIGENTE' : `DESFASE ${weekOffset} SEM`}</span>
        </div>
        <h1 className="font-display-serif text-4xl sm:text-5xl lg:text-[54px] tracking-[-0.035em] leading-[1.04] font-normal">
          La constancia no es intensidad; es{' '}
          <span className="italic" style={{ color: tokens.accentPrimary }}>
            no romper la cadena
          </span>{' '}
          hoy.
        </h1>
        <p className={`text-sm ${tokens.inkMuted} max-w-[58ch] leading-relaxed`}>
          Bitácora diaria de disciplina cognitiva y corporal. Sella tus rituales en un solo toque o despliega la
          ficha técnica para calibrar tu protocolo de ejecución.
        </p>
      </div>

      {/* Libro Mayor Telemétrico (4 Columnas interactivas en canvas) */}
      <div
        className={`lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 border-t sm:border-t-0 sm:border-l ${tokens.hairline} divide-y sm:divide-y-0 sm:divide-x ${tokens.hairlineDivider}`}
      >
        {/* Métrica 01: Hoy */}
        <button
          type="button"
          onClick={() => onSelectLens('cadence')}
          className="p-4 sm:px-5 space-y-1 text-left hover:bg-black/[0.015] dark:hover:bg-white/[0.015] active:scale-[0.98] transition-all duration-150 focus:outline-none"
        >
          <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block`}>
            01 / HOY (14 OCT)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums">
              {telemetry.doneToday}/{telemetry.total}
            </span>
            <span
              className="font-mono-metric text-xs font-semibold"
              style={{ color: tokens.accentForest }}
            >
              {telemetry.todayPct}%
            </span>
          </div>
          <p className={`text-[11px] ${tokens.inkMuted} truncate`}>
            {telemetry.todayPct === 100
              ? 'Jornada sellada plenamente'
              : `Pendientes: ${telemetry.total - telemetry.doneToday} bloques`}
          </p>
        </button>

        {/* Métrica 02: Racha Líder */}
        <button
          type="button"
          onClick={() => onSelectLens('streaks')}
          className="p-4 sm:px-5 space-y-1 text-left hover:bg-black/[0.015] dark:hover:bg-white/[0.015] active:scale-[0.98] transition-all duration-150 focus:outline-none"
        >
          <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block`}>
            02 / RACHA LÍDER
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums"
              style={{ color: tokens.accentPrimary }}
            >
              {telemetry.longestActiveStreak}
            </span>
            <span className="font-mono-metric text-xs" style={{ color: tokens.accentPrimary }}>
              días
            </span>
          </div>
          <p className={`text-[11px] ${tokens.inkMuted} truncate`} title={telemetry.longestStreakHabit}>
            {telemetry.longestStreakHabit}
          </p>
        </button>

        {/* Métrica 03: Cadencia Semanal */}
        <button
          type="button"
          onClick={() => onSelectLens('cadence')}
          className="p-4 sm:px-5 space-y-1 text-left hover:bg-black/[0.015] dark:hover:bg-white/[0.015] active:scale-[0.98] transition-all duration-150 focus:outline-none"
        >
          <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block`}>
            03 / CADENCIA SEM.
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums">
              {telemetry.weeklyCadencePct}%
            </span>
          </div>
          <p className={`text-[11px] ${tokens.inkMuted} font-mono-metric`}>
            {telemetry.totalWeekDone} / {telemetry.totalWeekTarget} completados
          </p>
        </button>

        {/* Métrica 04: Puntuación 28d */}
        <button
          type="button"
          onClick={() => onSelectLens('matrix28')}
          className="p-4 sm:px-5 space-y-1 text-left hover:bg-black/[0.015] dark:hover:bg-white/[0.015] active:scale-[0.98] transition-all duration-150 focus:outline-none"
        >
          <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block`}>
            04 / DENSIDAD 28D
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums">
              {telemetry.avgRate28}%
            </span>
            <span className={`font-mono-metric text-xs ${tokens.inkMuted}`}>histórico</span>
          </div>
          <p className={`text-[11px] ${tokens.inkMuted}`}>
            {telemetry.perfectDays} días plenos en 7d
          </p>
        </button>
      </div>
    </section>
  );
};
