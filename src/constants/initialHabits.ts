import { Habit } from '../types/habit.types';
import { formatDateISO, addDays, ANCHOR_TODAY } from '../utils/date.utils';

export function createInitialHabits(): Habit[] {
  const buildLog = (daysAgoArray: number[]): Record<string, boolean> => {
    const record: Record<string, boolean> = {};
    daysAgoArray.forEach((ago) => {
      record[formatDateISO(addDays(ANCHOR_TODAY, -ago))] = true;
    });
    return record;
  };

  return [
    {
      id: 'rit-01',
      code: '01',
      name: 'Escritura matutina sin pantallas (45 min)',
      discipline: 'Enfoque',
      cadenceTarget: 6,
      timeCue: '06:45',
      period: 'Mañana',
      protocol: 'Cuaderno analógico de 80g sobre el escritorio la noche anterior. Teléfono en modo avión en otra habitación hasta las 08:00.',
      history: buildLog([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 23, 24])
    },
    {
      id: 'rit-02',
      code: '02',
      name: 'Entrenamiento de sobrecarga & movilidad articular',
      discipline: 'Cuerpo',
      cadenceTarget: 5,
      timeCue: '08:15',
      period: 'Mañana',
      protocol: '45 min de fuerza con progresión doble + 10 min de descompresión lumbar y rotación torácica.',
      history: buildLog([0, 1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19, 20, 22, 24, 25])
    },
    {
      id: 'rit-03',
      code: '03',
      name: 'Hidratación mineralizada (2.4L + electrolitos)',
      discipline: 'Cuerpo',
      cadenceTarget: 7,
      timeCue: 'Todo el día',
      period: 'Mañana',
      protocol: '650 ml con una pizca de sal marina integral al levantarse antes del primer café.',
      history: buildLog([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26])
    },
    {
      id: 'rit-04',
      code: '04',
      name: 'Lectura técnica y ensayo largo (30 páginas)',
      discipline: 'Mente',
      cadenceTarget: 6,
      timeCue: '14:30',
      period: 'Tarde',
      protocol: 'Subrayado con lápiz grafito 2B. Ficha de síntesis de tres axiomas en el índice temático.',
      history: buildLog([1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24])
    },
    {
      id: 'rit-05',
      code: '05',
      name: 'Bloque de código profundo sin mensajería',
      discipline: 'Enfoque',
      cadenceTarget: 5,
      timeCue: '10:00',
      period: 'Mañana',
      protocol: 'Temporizador de 100 minutos en hardware. Slack cerrado y notificaciones en silencio absoluto.',
      history: buildLog([0, 1, 2, 3, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 20, 21, 22])
    },
    {
      id: 'rit-06',
      code: '06',
      name: 'Cierre analógico y luz tenue (<2700K)',
      discipline: 'Descanso',
      cadenceTarget: 7,
      timeCue: '22:15',
      period: 'Noche',
      protocol: 'Dejar el teléfono en el recibidor a las 22:00. Anotar las 3 intenciones capitales del día siguiente.',
      history: buildLog([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 19, 21, 22, 23])
    }
  ];
}
