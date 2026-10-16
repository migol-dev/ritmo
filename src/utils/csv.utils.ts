import { EnrichedHabit } from '../types/habit.types';

export function exportHabitsToCSV(habits: EnrichedHabit[], anchorDateISO: string): void {
  const headers = [
    'Indice',
    'Ritual',
    'Disciplina',
    'Horario',
    'Fase',
    'Meta_Semanal',
    'Racha_Activa_Dias',
    'Record_Dias',
    'Tasa_28d',
    'Protocolo'
  ];

  const rows = habits.map((h) => [
    h.code,
    `"${h.name.replace(/"/g, '""')}"`,
    h.discipline,
    h.timeCue,
    h.period,
    h.metrics.target,
    h.metrics.currentStreak,
    h.metrics.peakStreak,
    `${h.metrics.rate28}%`,
    `"${h.protocol.replace(/"/g, '""')}"`
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ritmo-bitacora-${anchorDateISO}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
