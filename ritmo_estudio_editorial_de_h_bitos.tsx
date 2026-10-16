import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check,
  Plus,
  Flame,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Command,
  SlidersHorizontal,
  X,
  Trash2,
  Copy,
  Download,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  CornerDownLeft,
  Calendar,
  Activity,
  RotateCcw,
  Search,
  Clock,
  Target,
  Layers,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Compass,
  BookOpen,
  Coffee,
  Dumbbell,
  Brain,
  MoonStar
} from 'lucide-react';

// Fecha ancla realista de referencia: Miércoles 14 de octubre de 2026
const ANCHOR_TODAY = new Date(2026, 9, 14);

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, amount: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function getMondayOfWeek(baseDate: Date, weekOffset: number = 0): Date {
  const day = baseDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(baseDate, diff + weekOffset * 7);
}

interface Habit {
  id: string;
  code?: string;
  name: string;
  discipline: 'Enfoque' | 'Cuerpo' | 'Mente' | 'Descanso';
  cadenceTarget: number;
  timeCue: string;
  period: 'Mañana' | 'Tarde' | 'Noche';
  protocol: string;
  history: Record<string, boolean>;
}

function createInitialHabits(): Habit[] {
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

// Síntesis acústica táctil vía Web Audio API (singleton seguro reutilizable)
let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtxClass) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtxClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function playTactileClick(type: 'check' | 'uncheck' | 'pop' = 'check', enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'check') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.055);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      osc.start(now);
      osc.stop(now + 0.065);
    } else if (type === 'uncheck') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(310, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      osc.start(now);
      osc.stop(now + 0.055);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.03);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch {
    // Silencio si el navegador bloquea audio antes de interacción directa
  }
}

interface HabitMetrics {
  currentStreak: number;
  peakStreak: number;
  weekCount: number;
  target: number;
  rate28: number;
  completedToday: boolean;
}

function computeHabitMetrics(habit: Habit, weekDays: { iso: string }[]): HabitMetrics {
  const todayISO = formatDateISO(ANCHOR_TODAY);
  const yesterdayISO = formatDateISO(addDays(ANCHOR_TODAY, -1));

  // Racha activa continua hacia atrás desde hoy (o ayer si hoy aún está pendiente)
  let currentStreak = 0;
  let cursor = new Date(ANCHOR_TODAY);
  if (!habit.history[todayISO] && habit.history[yesterdayISO]) {
    cursor = addDays(ANCHOR_TODAY, -1);
  }
  while (habit.history[formatDateISO(cursor)]) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  // Mejor racha en ventana de 45 días
  let peakStreak = currentStreak;
  let running = 0;
  for (let i = 45; i >= 0; i--) {
    const key = formatDateISO(addDays(ANCHOR_TODAY, -i));
    if (habit.history[key]) {
      running += 1;
      if (running > peakStreak) peakStreak = running;
    } else {
      running = 0;
    }
  }

  // Cumplimiento en la semana actualmente visible
  let weekCount = 0;
  weekDays.forEach((d) => {
    if (habit.history[d.iso]) weekCount += 1;
  });

  // Tasa de los últimos 28 días
  let last28Count = 0;
  for (let i = 0; i < 28; i++) {
    if (habit.history[formatDateISO(addDays(ANCHOR_TODAY, -i))]) {
      last28Count += 1;
    }
  }

  return {
    currentStreak,
    peakStreak,
    weekCount,
    target: habit.cadenceTarget || 7,
    rate28: Math.round((last28Count / 28) * 100),
    completedToday: !!habit.history[todayISO]
  };
}

export default function App() {
  const STORAGE_KEY = 'ritmo_estudio_editorial_v3';

  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.habits) && parsed.habits.length > 0) {
            return parsed.habits;
          }
        }
      } catch {
        // Fallback
      }
    }
    return createInitialHabits();
  });

  const [theme, setTheme] = useState<'paper' | 'obsidian'>('paper');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeDiscipline, setActiveDiscipline] = useState<'Todas' | 'Enfoque' | 'Cuerpo' | 'Mente' | 'Descanso'>('Todas');
  const [analyticalLens, setAnalyticalLens] = useState<'cadence' | 'streaks' | 'matrix28' | 'chronotype'>('cadence');
  const [selectedDayISO, setSelectedDayISO] = useState<string>(formatDateISO(ANCHOR_TODAY));
  const [inspectedHabitId, setInspectedHabitId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  // Estados de microinteracción, menú rápido y desenfoque sensible al cursor
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchMenuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Creación rápida inline
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDiscipline, setNewHabitDiscipline] = useState<'Enfoque' | 'Cuerpo' | 'Mente' | 'Descanso'>('Enfoque');
  const [newHabitTarget, setNewHabitTarget] = useState<number>(6);
  const [newHabitPeriod, setNewHabitPeriod] = useState<'Mañana' | 'Tarde' | 'Noche'>('Mañana');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const commandInputRef = useRef<HTMLInputElement>(null);
  const quickInputRef = useRef<HTMLInputElement>(null);

  const handleSearchMouseEnter = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setIsSearchActive(true);
  };

  const handleSearchMouseLeave = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearchActive(false);
    }, 280);
  };

  // Cierre de menú rápido al hacer clic/toque fuera en cualquier pantalla
  useEffect(() => {
    const handlePointerDownOutside = (e: PointerEvent) => {
      if (
        isSearchActive &&
        searchMenuRef.current &&
        !searchMenuRef.current.contains(e.target as Node)
      ) {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setIsSearchActive(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [isSearchActive]);

  // Cálculo de coordenadas relativas dentro de cada botón interactivo
  const handleButtonPointerMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-btn-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-btn-y', `${e.clientY - rect.top}px`);
  };

  // Listener global de puntero continuo (60fps en variables CSS sin re-render de React)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleGlobalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  };

  // Sincronización en LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits }));
    } catch {
      // Ignorar errores de cuota
    }
  }, [habits]);

  // Atajos globales de teclado (⌘K / Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCommandOpen(false);
        setIsSearchActive(false);
        setInspectedHabitId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (commandOpen && commandInputRef.current) {
      setTimeout(() => commandInputRef.current?.focus(), 40);
    }
  }, [commandOpen]);

  const notify = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const todayISO = formatDateISO(ANCHOR_TODAY);

  const weekDays = useMemo(() => {
    const monday = getMondayOfWeek(ANCHOR_TODAY, weekOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(monday, i);
      const iso = formatDateISO(d);
      return {
        date: d,
        iso,
        shortLabel: DAY_LABELS[i],
        dayNum: String(d.getDate()).padStart(2, '0'),
        monthShort: MONTH_SHORT[d.getMonth()],
        isToday: iso === todayISO,
        isFuture: d > ANCHOR_TODAY
      };
    });
  }, [weekOffset, todayISO]);

  useEffect(() => {
    const existsInWeek = weekDays.some((d) => d.iso === selectedDayISO);
    if (!existsInWeek) {
      const fallback = weekDays.find((d) => d.isToday) || weekDays[weekDays.length - 1];
      setSelectedDayISO(fallback.iso);
    }
  }, [weekDays, selectedDayISO]);

  const disciplines: Array<'Todas' | 'Enfoque' | 'Cuerpo' | 'Mente' | 'Descanso'> = [
    'Todas',
    'Enfoque',
    'Cuerpo',
    'Mente',
    'Descanso'
  ];

  const enrichedHabits = useMemo(() => {
    return habits.map((h, index) => ({
      ...h,
      code: String(index + 1).padStart(2, '0'),
      metrics: computeHabitMetrics(h, weekDays)
    }));
  }, [habits, weekDays]);

  const filteredHabits = useMemo(() => {
    if (activeDiscipline === 'Todas') return enrichedHabits;
    return enrichedHabits.filter((h) => h.discipline === activeDiscipline);
  }, [enrichedHabits, activeDiscipline]);

  // Telemetría global de rendimiento y disciplina
  const telemetry = useMemo(() => {
    const total = enrichedHabits.length;
    const doneToday = enrichedHabits.filter((h) => h.metrics.completedToday).length;
    const todayPct = total > 0 ? Math.round((doneToday / total) * 100) : 0;

    let totalWeekDone = 0;
    let totalWeekTarget = 0;
    let longestActiveStreak = 0;
    let longestStreakHabit = '—';

    enrichedHabits.forEach((h) => {
      totalWeekDone += h.metrics.weekCount;
      totalWeekTarget += h.metrics.target;
      if (h.metrics.currentStreak > longestActiveStreak) {
        longestActiveStreak = h.metrics.currentStreak;
        longestStreakHabit = h.name;
      }
    });

    const weeklyCadencePct =
      totalWeekTarget > 0 ? Math.min(100, Math.round((totalWeekDone / totalWeekTarget) * 100)) : 0;

    const dailyBreakdown = weekDays.map((d) => {
      const completedList = enrichedHabits.filter((h) => !!h.history[d.iso]);
      const count = completedList.length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        ...d,
        count,
        total,
        pct,
        completedList
      };
    });

    const perfectDays = dailyBreakdown.filter((d) => d.total > 0 && d.count === d.total).length;

    let sum28 = 0;
    enrichedHabits.forEach((h) => {
      sum28 += h.metrics.rate28;
    });
    const avgRate28 = total > 0 ? Math.round(sum28 / total) : 0;

    return {
      total,
      doneToday,
      todayPct,
      totalWeekDone,
      totalWeekTarget,
      weeklyCadencePct,
      longestActiveStreak,
      longestStreakHabit,
      dailyBreakdown,
      perfectDays,
      avgRate28
    };
  }, [enrichedHabits, weekDays]);

  const inspectedHabit = useMemo(
    () => enrichedHabits.find((h) => h.id === inspectedHabitId) || null,
    [enrichedHabits, inspectedHabitId]
  );

  const selectedDayDetails = useMemo(() => {
    return (
      telemetry.dailyBreakdown.find((d) => d.iso === selectedDayISO) ||
      telemetry.dailyBreakdown[0]
    );
  }, [telemetry.dailyBreakdown, selectedDayISO]);

  const toggleHabitDay = (habitId: string, isoDate: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const nextHistory = { ...h.history };
        if (nextHistory[isoDate]) {
          delete nextHistory[isoDate];
          playTactileClick('uncheck', soundEnabled);
        } else {
          nextHistory[isoDate] = true;
          playTactileClick('check', soundEnabled);
        }
        return { ...h, history: nextHistory };
      })
    );
  };

  const handleAddHabitInline = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newHabitName.trim();
    if (!clean) return;

    const created: Habit = {
      id: `rit-${Date.now()}`,
      name: clean,
      discipline: newHabitDiscipline,
      cadenceTarget: Number(newHabitTarget) || 6,
      timeCue: newHabitPeriod === 'Mañana' ? '08:00' : newHabitPeriod === 'Tarde' ? '15:30' : '21:00',
      period: newHabitPeriod,
      protocol: 'Definir disparador ambiental y criterio mínimo de victoria diaria.',
      history: { [todayISO]: true }
    };

    setHabits((prev) => [...prev, created]);
    setNewHabitName('');
    playTactileClick('check', soundEnabled);
    notify(`Ritual integrado y sellado para hoy: "${clean}"`);
  };

  const updateHabitField = (habitId: string, field: keyof Habit, value: unknown) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, [field]: value } : h))
    );
  };

  const duplicateHabit = (habit: Habit) => {
    const copy: Habit = {
      ...habit,
      id: `rit-${Date.now()}`,
      name: `${habit.name} (Copia)`,
      history: { ...habit.history }
    };
    setHabits((prev) => [...prev, copy]);
    playTactileClick('pop', soundEnabled);
    notify(`Ritual duplicado: "${copy.name}"`);
  };

  const deleteHabit = (habitId: string) => {
    const target = habits.find((h) => h.id === habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    if (inspectedHabitId === habitId) setInspectedHabitId(null);
    playTactileClick('uncheck', soundEnabled);
    if (target) notify(`Ritual archivado: "${target.name}"`);
  };

  const toggleAllToday = () => {
    const allDone = enrichedHabits.every((h) => h.metrics.completedToday);
    setHabits((prev) =>
      prev.map((h) => {
        const nextHistory = { ...h.history };
        if (allDone) {
          delete nextHistory[todayISO];
        } else {
          nextHistory[todayISO] = true;
        }
        return { ...h, history: nextHistory };
      })
    );
    playTactileClick(allDone ? 'uncheck' : 'check', soundEnabled);
    notify(allDone ? 'Registros de hoy reiniciados a pendiente' : 'Todos los rituales de hoy sellados');
  };

  const exportCSV = () => {
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
    const rows = enrichedHabits.map((h) => [
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
    link.setAttribute('download', `ritmo-bitacora-${todayISO}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playTactileClick('pop', soundEnabled);
    notify(`Exportados ${enrichedHabits.length} rituales en .CSV`);
  };

  const isDark = theme === 'obsidian';

  // Paleta a medida según Arquetipo Warm Editorial / Dark Obsidian Gallery
  const tokens = {
    canvas: isDark ? 'bg-[#08090A] text-[#F7F8F8]' : 'bg-[#FAF8F5] text-[#191918]',
    surfaceElevated: isDark ? 'bg-[#141416]' : 'bg-[#F2EFE9]',
    surfaceHover: isDark ? 'hover:bg-[#1C1D21]' : 'hover:bg-[#EAE6DF]',
    rowSelected: isDark ? 'bg-[#1C1D21]' : 'bg-[#F2EFE9]',
    hairline: isDark ? 'border-white/[0.08]' : 'border-[#E4E0D8]',
    hairlineDivider: isDark ? 'divide-white/[0.08]' : 'divide-[#E4E0D8]',
    inkMuted: isDark ? 'text-[#8A8F98]' : 'text-[#6E6A63]',
    accentPrimary: isDark ? '#FF4F00' : '#C86446',
    accentForest: isDark ? '#3B6E56' : '#2D4F3E',
    subtleStage: isDark ? 'bg-[#0F1012]' : 'bg-[#F7F5F0]'
  };

  // Índices para píldoras deslizantes animadas
  const activeDisciplineIdx = disciplines.indexOf(activeDiscipline);
  const lensList = ['cadence', 'streaks', 'matrix28', 'chronotype'] as const;
  const activeLensIdx = lensList.indexOf(analyticalLens);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleGlobalMouseMove}
      className={`min-h-screen ${tokens.canvas} relative transition-colors duration-300 selection:bg-[#C86446] selection:text-[#FAF8F5] overflow-x-hidden`}
    >
      {/* ✦ SPOTLIGHT RADIAL REACTIVO AL CURSOR DEL USUARIO */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: isDark
            ? `radial-gradient(700px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), rgba(255, 79, 0, 0.05), transparent 75%)`
            : `radial-gradient(700px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), rgba(200, 100, 70, 0.05), transparent 75%)`
        }}
      />

      {/* ✦ VELO DE DESENFOQUE PROGRESIVO SENSIBLE AL CURSOR EN HOVER DEL BUSCADOR */}
      <div
        className={`fixed inset-0 top-14 pointer-events-none z-20 transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] ${
          isSearchActive && !commandOpen
            ? 'backdrop-blur-[12px] opacity-100'
            : 'backdrop-blur-none opacity-0'
        }`}
        style={{
          WebkitBackdropFilter: isSearchActive && !commandOpen ? 'blur(12px)' : undefined,
          backdropFilter: isSearchActive && !commandOpen ? 'blur(12px)' : undefined,
          WebkitMaskImage:
            isSearchActive && !commandOpen
              ? `radial-gradient(circle 900px at var(--mouse-x, 75vw) var(--mouse-y, 30px), black 0%, rgba(0, 0, 0, 0.75) 35%, rgba(0, 0, 0, 0.15) 70%, transparent 100%)`
              : undefined,
          maskImage:
            isSearchActive && !commandOpen
              ? `radial-gradient(circle 900px at var(--mouse-x, 75vw) var(--mouse-y, 30px), black 0%, rgba(0, 0, 0, 0.75) 35%, rgba(0, 0, 0, 0.15) 70%, transparent 100%)`
              : undefined,
          background: isSearchActive
            ? isDark
              ? `radial-gradient(900px circle at var(--mouse-x, 75vw) var(--mouse-y, 30px), rgba(255, 79, 0, 0.08) 0%, rgba(8, 9, 10, 0.6) 80%)`
              : `radial-gradient(900px circle at var(--mouse-x, 75vw) var(--mouse-y, 30px), rgba(200, 100, 70, 0.08) 0%, rgba(25, 25, 24, 0.25) 80%)`
            : undefined
        }}
      />

      {/* ✦ INYECCIÓN DE TIPOGRAFÍA CURADA Y ANIMACIONES AVANZADAS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .font-display-serif {
          font-family: 'Instrument Serif', Georgia, serif;
        }
        .font-ui-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-mono-metric {
          font-family: 'JetBrains Mono', monospace;
          font-variant-numeric: tabular-nums;
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }

        /* Microfísica de checkmark con rebote */
        @keyframes checkPop {
          0% {
            transform: scale(0.6) rotate(-14deg);
            opacity: 0;
          }
          65% {
            transform: scale(1.18) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        /* Animación elástica de escala para la paleta de comandos ⌘K */
        @keyframes modalScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          65% {
            opacity: 1;
            transform: scale(1.018) translateY(-2px);
          }
          85% {
            transform: scale(0.995) translateY(1px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes dropdownFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes drawerSlideIn {
          0% {
            transform: translateX(100%);
            opacity: 0.7;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-check-pop {
          animation: checkPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .animate-modal-in {
          animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-dropdown-in {
          animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-drawer-in {
          animation: drawerSlideIn 0.36s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
      `}</style>

      {/* ✦ MASTHEAD SUPERIOR ARQUITECTÓNICO (HAIRLINE 1PX, SIN CARD-ITIS) */}
      <header
        className={`sticky top-0 z-30 border-b ${tokens.hairline} ${
          isDark ? 'bg-[#08090A]/90' : 'bg-[#FAF8F5]/90'
        } backdrop-blur-md font-ui-sans transition-colors duration-300`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          {/* Identidad de Marca & Coordenada de Bitácora */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 group cursor-default">
              <span
                className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-150"
                style={{ backgroundColor: tokens.accentPrimary }}
              />
              <span className="font-display-serif text-2xl tracking-[-0.035em] leading-none select-none">
                Ritmo
              </span>
              <span
                className={`font-mono-metric text-[10px] uppercase tracking-[0.12em] px-1.5 py-0.5 border ${tokens.hairline} ${tokens.inkMuted} transition-colors group-hover:border-current`}
              >
                CADENCIA v3.0
              </span>
            </div>
            <span
              className={`hidden md:inline-block text-xs ${tokens.inkMuted} border-l ${tokens.hairline} pl-4 font-mono-metric`}
            >
              Mié 14 oct 2026 · Semana 42
            </span>
          </div>

          {/* Controles de Superficie, Atajos y Scrubber Semanal */}
          <div className="flex items-center gap-2">
            {/* Scrubber de Semanas con Navegación Compacta */}
            <div
              className={`hidden sm:flex items-center border ${tokens.hairline} rounded-[4px] overflow-hidden font-mono-metric text-xs`}
            >
              <button
                onClick={() => {
                  setWeekOffset((w) => w - 1);
                  playTactileClick('pop', soundEnabled);
                }}
                className={`px-2 py-1.5 ${tokens.surfaceHover} active:scale-[0.92] transition-transform duration-120`}
                title="Semana anterior"
              >
                <ChevronLeft size={13} strokeWidth={1.5} />
              </button>
              <span className="px-3 py-1 select-none text-[11px] font-medium">
                {weekDays[0].dayNum} {weekDays[0].monthShort} — {weekDays[6].dayNum} {weekDays[6].monthShort}
              </span>
              <button
                onClick={() => {
                  setWeekOffset((w) => Math.min(0, w + 1));
                  playTactileClick('pop', soundEnabled);
                }}
                disabled={weekOffset >= 0}
                className={`px-2 py-1.5 ${tokens.surfaceHover} disabled:opacity-25 active:scale-[0.92] transition-transform duration-120`}
                title="Semana siguiente"
              >
                <ChevronRight size={13} strokeWidth={1.5} />
              </button>
            </div>

            {/* BOTÓN DE BÚSQUEDA INTERACTIVO CON DESENFOQUE GRADUAL Y MENÚ ANIMADO */}
            <div
              ref={searchMenuRef}
              className="relative"
              onMouseEnter={handleSearchMouseEnter}
              onMouseLeave={handleSearchMouseLeave}
            >
              <button
                onMouseMove={handleButtonPointerMove}
                onClick={() => {
                  setCommandOpen(true);
                  setIsSearchActive(false);
                  playTactileClick('pop', soundEnabled);
                }}
                className={`group relative flex items-center gap-2 px-3 py-1.5 text-xs border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.96] transition-all duration-200 overflow-hidden`}
              >
                {/* Resplandor focal reactivo a coordenadas del cursor dentro del botón */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(75px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}25 0%, transparent 70%)`
                  }}
                />

                <Search
                  size={13}
                  strokeWidth={1.75}
                  className="transition-transform duration-200 group-hover:scale-110 relative z-10"
                  style={{ color: tokens.accentPrimary }}
                />
                <span className={`hidden sm:inline ${tokens.inkMuted} group-hover:text-current transition-colors relative z-10`}>
                  Buscar o alternar...
                </span>
                <kbd
                  className={`font-mono-metric text-[10px] px-1 py-0.5 ${tokens.surfaceElevated} border ${tokens.hairline} rounded-[2px] transition-colors group-hover:border-current relative z-10`}
                >
                  ⌘K
                </kbd>
              </button>

              {/* ✦ MENÚ DESPLEGABLE ANIMADO CON PUENTE ANTI-PARPADEO Y REVELACIÓN RÁPIDA */}
              {isSearchActive && !commandOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-80 sm:w-96 ${tokens.surfaceElevated} border ${tokens.hairline} rounded-[6px] shadow-2xl z-50 p-3 animate-dropdown-in font-ui-sans overflow-hidden before:absolute before:-top-3 before:inset-x-0 before:h-3 before:content-['']`}
                  style={{
                    boxShadow: isDark
                      ? '0 20px 40px -15px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)'
                      : '0 20px 40px -15px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Encabezado del menú y acceso a paleta */}
                  <div className={`pb-2.5 mb-2.5 border-b ${tokens.hairline} flex items-center justify-between`}>
                    <div className="flex items-center gap-1.5 font-mono-metric text-[10px] uppercase tracking-wider">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: tokens.accentPrimary }}
                      />
                      <span className={tokens.inkMuted}>MENÚ RÁPIDO DE COMANDO</span>
                    </div>
                    <kbd className={`font-mono-metric text-[10px] px-1 py-0.5 border ${tokens.hairline} rounded`}>
                      ⌘K
                    </kbd>
                  </div>

                  {/* Gatillo para abrir búsqueda completa con brillo reactivo */}
                  <button
                    onMouseMove={handleButtonPointerMove}
                    onClick={() => {
                      setCommandOpen(true);
                      setIsSearchActive(false);
                      playTactileClick('pop', soundEnabled);
                    }}
                    className={`group relative w-full flex items-center justify-between px-2.5 py-2 mb-2 rounded-[4px] border ${tokens.hairline} ${
                      isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'
                    } text-xs ${tokens.inkMuted} hover:text-current hover:border-current active:scale-[0.98] transition-all overflow-hidden`}
                  >
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      style={{
                        background: `radial-gradient(80px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}18 0%, transparent 70%)`
                      }}
                    />
                    <div className="flex items-center gap-2 relative z-10">
                      <Search size={12} strokeWidth={1.75} style={{ color: tokens.accentPrimary }} />
                      <span>Escribir consulta o ritual...</span>
                    </div>
                    <CornerDownLeft size={11} strokeWidth={1.5} className="relative z-10" />
                  </button>

                  {/* Accesos rápidos a los 3 primeros rituales */}
                  <div className="space-y-1 mb-2.5">
                    <span className={`font-mono-metric text-[9px] uppercase tracking-wider ${tokens.inkMuted} block px-1`}>
                      SELLADO VELOZ (HOY)
                    </span>
                    {enrichedHabits.slice(0, 3).map((h) => {
                      const done = h.metrics.completedToday;
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onMouseMove={handleButtonPointerMove}
                          onClick={() => toggleHabitDay(h.id, todayISO)}
                          className={`w-full relative px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-xs ${tokens.surfaceHover} active:scale-[0.97] transition-all group overflow-hidden text-left`}
                        >
                          <span
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                            style={{
                              background: `radial-gradient(60px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}20 0%, transparent 70%)`
                            }}
                          />
                          <div className="flex items-center gap-2 min-w-0 relative z-10">
                            <span className="font-mono-metric text-[10px] opacity-60">{h.code}</span>
                            <span className={`truncate max-w-[180px] ${done ? 'line-through opacity-70' : ''}`}>
                              {h.name}
                            </span>
                          </div>
                          <span
                            className={`w-5 h-5 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors relative z-10 ${
                              done
                                ? 'text-[#FAF8F5] border-transparent'
                                : `${tokens.hairline} ${isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'}`
                            }`}
                            style={{
                              backgroundColor: done ? tokens.accentForest : undefined
                            }}
                          >
                            {done && <Check size={11} strokeWidth={2.4} className="animate-check-pop" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Acciones del sistema de un solo clic */}
                  <div className={`pt-2 border-t ${tokens.hairline} space-y-1`}>
                    <button
                      onMouseMove={handleButtonPointerMove}
                      onClick={() => {
                        toggleAllToday();
                        setIsSearchActive(false);
                      }}
                      className={`group relative overflow-hidden w-full px-2 py-1.5 rounded-[4px] flex items-center justify-between text-xs ${tokens.surfaceHover} active:scale-[0.98] transition-all`}
                    >
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{
                          background: `radial-gradient(80px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}18 0%, transparent 70%)`
                        }}
                      />
                      <span className="relative z-10">Sellar o desmarcar todos hoy</span>
                      <span
                        className="font-mono-metric text-[10px] relative z-10 font-semibold"
                        style={{ color: tokens.accentPrimary }}
                      >
                        EJECUTAR
                      </span>
                    </button>
                    <button
                      onMouseMove={handleButtonPointerMove}
                      onClick={() => {
                        setTheme((t) => (t === 'paper' ? 'obsidian' : 'paper'));
                        playTactileClick('pop', soundEnabled);
                        setIsSearchActive(false);
                      }}
                      className={`group relative overflow-hidden w-full px-2 py-1.5 rounded-[4px] flex items-center justify-between text-xs ${tokens.surfaceHover} active:scale-[0.98] transition-all`}
                    >
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{
                          background: `radial-gradient(80px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}18 0%, transparent 70%)`
                        }}
                      />
                      <span className="relative z-10">Alternar lienzo ({isDark ? 'Alabastro' : 'Obsidiana'})</span>
                      <span className="font-mono-metric text-[10px] opacity-70 relative z-10">TEMA</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Alternar Pulso Acústico (Web Audio API) */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playTactileClick('pop', true);
              }}
              className={`p-1.5 border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.92] transition-transform duration-120`}
              title={soundEnabled ? 'Silenciar retroalimentación acústica' : 'Activar pulso acústico táctil'}
            >
              {soundEnabled ? (
                <Volume2 size={14} strokeWidth={1.5} />
              ) : (
                <VolumeX size={14} strokeWidth={1.5} className={tokens.inkMuted} />
              )}
            </button>

            {/* Selector de Arquetipo de Superficie (Alabastro / Obsidiana) */}
            <button
              onClick={() => {
                setTheme((t) => (t === 'paper' ? 'obsidian' : 'paper'));
                playTactileClick('pop', soundEnabled);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.92] hover:rotate-6 transition-all duration-150 font-mono-metric`}
              title="Alternar lienzo Alabastro Cálido / Obsidiana de Estudio"
            >
              {isDark ? <Sun size={13} strokeWidth={1.5} /> : <Moon size={13} strokeWidth={1.5} />}
              <span className="hidden md:inline text-[11px]">{isDark ? 'ALABASTRO' : 'OBSIDIANA'}</span>
            </button>

            {/* Exportar Bitácora en CSV */}
            <button
              onClick={exportCSV}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.96] transition-transform duration-120 font-mono-metric`}
              title="Exportar datos completos a archivo CSV"
            >
              <Download size={13} strokeWidth={1.5} />
              <span className="text-[11px]">.CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* ✦ LIENZO PRINCIPAL (CANVAS-FIRST > 60%, ZERO CARD-ITIS) */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 font-ui-sans relative z-10">
        {/* ENCABEZADO EDITORIAL & REGISTRO TELEMÉTRICO DE 1PX */}
        <section
          className={`py-8 sm:py-10 border-b ${tokens.hairline} grid grid-cols-1 lg:grid-cols-12 gap-8 items-end`}
        >
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

          {/* Libro Mayor Telemétrico (4 Columnas interactivas con resplandor focal y conmutación de lente) */}
          <div
            className={`lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 border-t sm:border-t-0 sm:border-l ${tokens.hairline} divide-y sm:divide-y-0 sm:divide-x ${tokens.hairlineDivider}`}
          >
            {/* Métrica 01: Hoy */}
            <button
              type="button"
              onMouseMove={handleButtonPointerMove}
              onClick={() => {
                setSelectedDayISO(todayISO);
                playTactileClick('pop', soundEnabled);
                notify('Vista calibrada en la jornada de hoy (14 oct)');
              }}
              className="group relative overflow-hidden text-left p-4 sm:px-5 space-y-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] active:scale-[0.98] transition-all duration-150 focus:outline-none"
              title="Clic para seleccionar y enfocar la jornada de hoy"
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(120px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentForest}20 0%, transparent 70%)`
                }}
              />
              <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block relative z-10`}>
                01 / HOY (14 OCT)
              </span>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums group-hover:translate-x-0.5 transition-transform">
                  {telemetry.doneToday}/{telemetry.total}
                </span>
                <span
                  className="font-mono-metric text-xs font-semibold"
                  style={{ color: tokens.accentForest }}
                >
                  {telemetry.todayPct}%
                </span>
              </div>
              <p className={`text-[11px] ${tokens.inkMuted} truncate relative z-10`}>
                {telemetry.todayPct === 100
                  ? 'Jornada sellada plenamente'
                  : `Pendientes: ${telemetry.total - telemetry.doneToday} bloques`}
              </p>
            </button>

            {/* Métrica 02: Racha Líder */}
            <button
              type="button"
              onMouseMove={handleButtonPointerMove}
              onClick={() => {
                setAnalyticalLens('streaks');
                playTactileClick('pop', soundEnabled);
                notify('Observatorio conmutado a: Rachas Activas vs. Récord');
              }}
              className="group relative overflow-hidden text-left p-4 sm:px-5 space-y-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] active:scale-[0.98] transition-all duration-150 focus:outline-none"
              title="Clic para conmutar al lente de Rachas Activas"
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(120px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}20 0%, transparent 70%)`
                }}
              />
              <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block relative z-10`}>
                02 / RACHA LÍDER
              </span>
              <div className="flex items-baseline gap-1.5 relative z-10">
                <span
                  className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums group-hover:translate-x-0.5 transition-transform"
                  style={{ color: tokens.accentPrimary }}
                >
                  {telemetry.longestActiveStreak}
                </span>
                <span className="font-mono-metric text-xs" style={{ color: tokens.accentPrimary }}>
                  días
                </span>
              </div>
              <p className={`text-[11px] ${tokens.inkMuted} truncate relative z-10`} title={telemetry.longestStreakHabit}>
                {telemetry.longestStreakHabit}
              </p>
            </button>

            {/* Métrica 03: Cadencia Semanal */}
            <button
              type="button"
              onMouseMove={handleButtonPointerMove}
              onClick={() => {
                setAnalyticalLens('cadence');
                playTactileClick('pop', soundEnabled);
                notify('Observatorio conmutado a: Curva de Cadencia Semanal');
              }}
              className="group relative overflow-hidden text-left p-4 sm:px-5 space-y-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] active:scale-[0.98] transition-all duration-150 focus:outline-none"
              title="Clic para conmutar al lente de Curva de Cadencia Semanal"
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(120px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}20 0%, transparent 70%)`
                }}
              />
              <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block relative z-10`}>
                03 / CADENCIA SEM.
              </span>
              <div className="flex items-baseline gap-1.5 relative z-10">
                <span className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums group-hover:translate-x-0.5 transition-transform">
                  {telemetry.weeklyCadencePct}%
                </span>
              </div>
              <p className={`text-[11px] ${tokens.inkMuted} font-mono-metric relative z-10`}>
                {telemetry.totalWeekDone} / {telemetry.totalWeekTarget} completados
              </p>
            </button>

            {/* Métrica 04: Puntuación 28d */}
            <button
              type="button"
              onMouseMove={handleButtonPointerMove}
              onClick={() => {
                setAnalyticalLens('matrix28');
                playTactileClick('pop', soundEnabled);
                notify('Observatorio conmutado a: Huella de Densidad (28 Días)');
              }}
              className="group relative overflow-hidden text-left p-4 sm:px-5 space-y-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] active:scale-[0.98] transition-all duration-150 focus:outline-none"
              title="Clic para conmutar a la Huella de 28 Días"
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(120px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentForest}20 0%, transparent 70%)`
                }}
              />
              <span className={`font-mono-metric text-[10px] uppercase tracking-wider ${tokens.inkMuted} block relative z-10`}>
                04 / DENSIDAD 28D
              </span>
              <div className="flex items-baseline gap-1.5 relative z-10">
                <span className="font-display-serif text-3xl sm:text-4xl tracking-tight tabular-nums group-hover:translate-x-0.5 transition-transform">
                  {telemetry.avgRate28}%
                </span>
                <span className={`font-mono-metric text-xs ${tokens.inkMuted}`}>histórico</span>
              </div>
              <p className={`text-[11px] ${tokens.inkMuted} relative z-10`}>
                {telemetry.perfectDays} días plenos en 7d
              </p>
            </button>
          </div>
        </section>

        {/* ✦ ARQUITECTURA ASIMÉTRICA EN ESCENARIOS (8 COLS : 4 COLS) */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 border-b ${tokens.hairline}`}>
          {/* ===================================================================
              STAGE IZQUIERDO (COL-SPAN-8): MATRIZ DE RITUALES Y ACCIÓN INMEDIATA
             =================================================================== */}
          <div className={`lg:col-span-8 lg:border-r ${tokens.hairline} py-6 lg:pr-8 space-y-6`}>
            {/* PÍLDORA DESLIZANTE ANIMADA PARA FILTROS DE DISCIPLINA */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`font-mono-metric text-[11px] uppercase tracking-wider ${tokens.inkMuted} mr-1`}>
                  [01 // FILTRO]
                </span>

                {/* Contenedor relativo con pastilla deslizante animada */}
                <div
                  className={`relative grid grid-cols-5 items-center p-0.5 border ${tokens.hairline} rounded-[6px] ${tokens.surfaceElevated}`}
                >
                  {/* Pastilla indicadora flotante con física fluida y alineación matemática perfecta */}
                  <div
                    className={`absolute inset-y-0.5 rounded-[4px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none border ${tokens.hairline}`}
                    style={{
                      left: '2px',
                      width: 'calc((100% - 4px) / 5)',
                      transform: `translateX(calc(${activeDisciplineIdx} * 100%))`,
                      backgroundColor: isDark ? '#08090A' : '#FAF8F5'
                    }}
                  />

                  {disciplines.map((disc) => {
                    const active = activeDiscipline === disc;
                    return (
                      <button
                        key={disc}
                        onClick={() => {
                          setActiveDiscipline(disc);
                          playTactileClick('pop', soundEnabled);
                        }}
                        className={`relative z-10 px-2 sm:px-3 py-1 text-xs font-medium text-center rounded-[4px] transition-colors duration-200 active:scale-[0.96] ${
                          active
                            ? isDark
                              ? 'text-[#F7F8F8] font-semibold'
                              : 'text-[#191918] font-semibold'
                            : `${tokens.inkMuted} hover:text-current`
                        }`}
                      >
                        {disc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botón Maestro para Sellar o Reiniciar Hoy con Resplandor Especular */}
              <div className="flex items-center gap-3">
                <button
                  onMouseMove={handleButtonPointerMove}
                  onClick={toggleAllToday}
                  className={`group relative overflow-hidden flex items-center gap-1.5 text-xs font-mono-metric px-3 py-1.5 border ${tokens.hairline} rounded-[4px] ${tokens.surfaceHover} active:scale-[0.95] transition-all duration-150`}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{
                      background: `radial-gradient(80px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}25 0%, transparent 70%)`
                    }}
                  />
                  <Check size={13} strokeWidth={1.75} className="relative z-10" />
                  <span className="relative z-10">
                    {telemetry.doneToday === telemetry.total && telemetry.total > 0
                      ? 'Desmarcar hoy'
                      : 'Sellar todos hoy'}
                  </span>
                </button>
              </div>
            </div>

            {/* FRANJA DE ACCIÓN RÁPIDA EN 3 SEGUNDOS (PUNTO FOCAL INICIAL) */}
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
                {enrichedHabits.map((h) => {
                  const done = h.metrics.completedToday;
                  return (
                    <button
                      key={h.id}
                      onMouseMove={handleButtonPointerMove}
                      onClick={() => toggleHabitDay(h.id, todayISO)}
                      className={`group relative overflow-hidden flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs border transition-all duration-200 active:scale-[0.92] ${
                        done
                          ? 'text-[#FAF8F5] border-transparent font-medium shadow-sm'
                          : `${isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'} ${tokens.hairline} hover:border-[#C86446]`
                      }`}
                      style={{
                        backgroundColor: done ? tokens.accentForest : undefined
                      }}
                      title={`Alternar hoy: ${h.name}`}
                    >
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{
                          background: `radial-gradient(55px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${
                            done ? 'rgba(255,255,255,0.2)' : `${tokens.accentPrimary}25`
                          } 0%, transparent 70%)`
                        }}
                      />
                      <span className="font-mono-metric text-[10px] opacity-65 relative z-10">{h.code}</span>
                      <span className={`max-w-[130px] truncate relative z-10 ${done ? 'line-through opacity-85' : ''}`}>
                        {h.name.split('(')[0].trim()}
                      </span>
                      {done ? (
                        <Check size={11} strokeWidth={2.4} className="animate-check-pop relative z-10" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30 group-hover:opacity-100 transition-opacity relative z-10" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TABLA DE-BOXED: MATRIZ DE CADENCIA CON CELDAS TÁCTILES */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr
                    className={`border-b ${tokens.hairline} font-mono-metric text-[11px] uppercase ${tokens.inkMuted}`}
                  >
                    <th className="py-2.5 pr-3 w-10 font-normal">ÍND</th>
                    <th className="py-2.5 px-2 font-normal">RITUAL / PROTOCOLO</th>
                    {weekDays.map((d) => {
                      const isSelected = d.iso === selectedDayISO;
                      return (
                        <th key={d.iso} className="py-2 px-1 text-center w-12 font-normal">
                          <button
                            onClick={() => {
                              setSelectedDayISO(d.iso);
                              playTactileClick('pop', soundEnabled);
                            }}
                            className={`w-full py-1.5 rounded-[4px] flex flex-col items-center transition-all duration-150 active:scale-[0.92] ${
                              d.isToday
                                ? 'text-[#FAF8F5] font-semibold shadow-sm'
                                : isSelected
                                ? `${tokens.surfaceElevated} text-current font-semibold border ${tokens.hairline}`
                                : tokens.surfaceHover
                            }`}
                            style={{
                              backgroundColor: d.isToday ? tokens.accentPrimary : undefined
                            }}
                            title={`Inspeccionar ${d.shortLabel} ${d.dayNum} en el gráfico analítico`}
                          >
                            <span className="text-[10px] tracking-tight">{d.shortLabel}</span>
                            <span className="text-xs mt-0.5 tabular-nums">{d.dayNum}</span>
                          </button>
                        </th>
                      );
                    })}
                    <th className="py-2.5 pl-3 pr-2 text-right font-normal w-24">CADENCIA</th>
                    <th className="py-2.5 pl-2 text-right font-normal w-20">RACHA</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tokens.hairlineDivider} text-sm`}>
                  {filteredHabits.map((habit) => {
                    const { currentStreak, weekCount, target } = habit.metrics;
                    const metTarget = weekCount >= target;
                    const isInspected = inspectedHabitId === habit.id;

                    return (
                      <tr
                        key={habit.id}
                        className={`group transition-colors duration-150 ${
                          isInspected ? tokens.rowSelected : tokens.surfaceHover
                        }`}
                      >
                        {/* Coordenada de Índice */}
                        <td className={`py-3.5 pr-3 font-mono-metric text-xs ${tokens.inkMuted} align-middle`}>
                          {habit.code}
                        </td>

                        {/* Título del Ritual + Divulgación Progresiva */}
                        <td className="py-3.5 px-2 align-middle">
                          <div className="flex items-center justify-between gap-2">
                            <div
                              onClick={() => {
                                setInspectedHabitId(habit.id);
                                playTactileClick('pop', soundEnabled);
                              }}
                              className="cursor-pointer min-w-0"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium leading-snug truncate max-w-[260px] sm:max-w-[320px] group-hover:underline transition-all">
                                  {habit.name}
                                </span>
                              </div>
                              <div
                                className={`flex items-center gap-2 mt-0.5 font-mono-metric text-[11px] ${tokens.inkMuted}`}
                              >
                                <span>{habit.discipline}</span>
                                <span>·</span>
                                <span>{habit.period}</span>
                                <span>·</span>
                                <span>{habit.timeCue}</span>
                              </div>
                            </div>

                            {/* Acciones contextuales reveladas en hover de fila */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 shrink-0">
                              <button
                                onClick={() => {
                                  setInspectedHabitId(habit.id);
                                  playTactileClick('pop', soundEnabled);
                                }}
                                className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceElevated} hover:border-[#C86446] text-xs flex items-center gap-1 font-mono-metric active:scale-[0.92] transition-transform`}
                                title="Abrir inspector de protocolo y calibración"
                              >
                                <SlidersHorizontal size={12} strokeWidth={1.5} />
                                <span className="hidden xl:inline text-[10px]">Ficha</span>
                              </button>
                              <button
                                onClick={() => duplicateHabit(habit)}
                                className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceElevated} hover:border-[#C86446] active:scale-[0.92] transition-transform`}
                                title="Duplicar ritual"
                              >
                                <Copy size={12} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => deleteHabit(habit.id)}
                                className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceElevated} hover:text-[#C86446] hover:border-[#C86446] active:scale-[0.92] transition-transform`}
                                title="Archivar ritual"
                              >
                                <Trash2 size={12} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 7 Celdas Táctiles de Registro Diario con Microfísica */}
                        {weekDays.map((d) => {
                          const checked = !!habit.history[d.iso];
                          const isSelectedCol = d.iso === selectedDayISO;
                          return (
                            <td
                              key={d.iso}
                              className={`py-2.5 px-1 text-center align-middle ${
                                isSelectedCol ? (isDark ? 'bg-white/[0.02]' : 'bg-black/[0.015]') : ''
                              }`}
                            >
                              <button
                                onClick={() => toggleHabitDay(habit.id, d.iso)}
                                className={`group/cell relative w-8 h-8 mx-auto rounded-[4px] flex items-center justify-center transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.88] hover:scale-105 ${
                                  checked
                                    ? 'text-[#FAF8F5] border border-transparent font-medium shadow-sm'
                                    : d.isToday
                                    ? `border ${tokens.hairline} ${tokens.surfaceElevated} hover:border-[#C86446]`
                                    : `border ${tokens.hairline} hover:border-current`
                                }`}
                                style={{
                                  backgroundColor: checked ? tokens.accentForest : undefined,
                                  borderColor: !checked && d.isToday ? tokens.accentPrimary : undefined
                                }}
                                title={`${habit.name} — ${d.shortLabel} ${d.dayNum} ${d.monthShort}`}
                              >
                                {checked ? (
                                  <Check size={14} strokeWidth={2.4} className="animate-check-pop" />
                                ) : (
                                  <>
                                    {d.isToday ? (
                                      <span
                                        className="w-1.5 h-1.5 rounded-full transition-opacity group-hover/cell:opacity-0"
                                        style={{ backgroundColor: tokens.accentPrimary }}
                                      />
                                    ) : null}
                                    <Check
                                      size={12}
                                      strokeWidth={2}
                                      className="opacity-0 group-hover/cell:opacity-35 transition-opacity absolute inset-auto pointer-events-none"
                                    />
                                  </>
                                )}
                              </button>
                            </td>
                          );
                        })}

                        {/* Ratio y Barra de Cadencia Semanal */}
                        <td className="py-3.5 pl-3 pr-2 text-right align-middle font-mono-metric">
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`text-xs ${
                                metTarget ? 'font-semibold' : tokens.inkMuted
                              }`}
                              style={{ color: metTarget ? tokens.accentForest : undefined }}
                            >
                              {weekCount}/{target} d
                            </span>
                            <div
                              className={`w-16 h-1.5 ${tokens.surfaceElevated} rounded-none overflow-hidden border ${tokens.hairline}`}
                            >
                              <div
                                style={{
                                  width: `${Math.min(100, Math.round((weekCount / target) * 100))}%`,
                                  backgroundColor: metTarget ? tokens.accentForest : tokens.accentPrimary
                                }}
                                className="h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                              />
                            </div>
                          </div>
                        </td>

                        {/* Racha Activa Continua */}
                        <td className="py-3.5 pl-2 text-right align-middle font-mono-metric">
                          <span
                            className={`inline-flex items-center justify-end gap-1 text-xs font-medium transition-transform group-hover:scale-105 ${
                              currentStreak > 0 ? '' : tokens.inkMuted
                            }`}
                            style={{ color: currentStreak > 0 ? tokens.accentPrimary : undefined }}
                          >
                            <Flame
                              size={13}
                              strokeWidth={1.75}
                              className={currentStreak > 0 ? 'fill-current opacity-70' : ''}
                            />
                            <span className="tabular-nums">{currentStreak}d</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* FORMULARIO INLINE PARA NUEVOS RITUALES (ACCESO CON TECLA ENTER) */}
            <form
              onSubmit={handleAddHabitInline}
              className={`pt-4 border-t ${tokens.hairline} flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5`}
            >
              <div
                className={`flex-1 flex items-center gap-2 px-3 py-2 border ${tokens.hairline} rounded-[4px] ${
                  isDark ? 'bg-[#0E0F11]' : 'bg-white/80'
                } focus-within:border-[#C86446] transition-colors`}
              >
                <Plus size={14} strokeWidth={1.75} className={tokens.inkMuted} />
                <input
                  ref={quickInputRef}
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Incorporar nuevo ritual al cuaderno (ej. Sesión de respiración 15 min)..."
                  className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-[#8A8F98]/70"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={newHabitDiscipline}
                  onChange={(e) =>
                    setNewHabitDiscipline(e.target.value as 'Enfoque' | 'Cuerpo' | 'Mente' | 'Descanso')
                  }
                  className={`px-2.5 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${tokens.surfaceElevated} focus:outline-none focus:border-[#C86446]`}
                >
                  <option value="Enfoque">Enfoque</option>
                  <option value="Cuerpo">Cuerpo</option>
                  <option value="Mente">Mente</option>
                  <option value="Descanso">Descanso</option>
                </select>

                <select
                  value={newHabitPeriod}
                  onChange={(e) =>
                    setNewHabitPeriod(e.target.value as 'Mañana' | 'Tarde' | 'Noche')
                  }
                  className={`px-2.5 py-2 text-xs font-mono-metric border ${tokens.hairline} rounded-[4px] ${tokens.surfaceElevated} focus:outline-none focus:border-[#C86446]`}
                >
                  <option value="Mañana">Mañana</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noche">Noche</option>
                </select>

                <select
                  value={newHabitTarget}
                  onChange={(e) => setNewHabitTarget(Number(e.target.value))}
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
                  onMouseMove={handleButtonPointerMove}
                  className="group relative overflow-hidden px-3.5 py-2 text-xs font-mono-metric uppercase tracking-wider bg-[#191918] text-[#FAF8F5] dark:bg-[#F7F8F8] dark:text-[#08090A] rounded-[4px] flex items-center gap-1.5 active:scale-[0.96] transition-transform duration-120 shrink-0 font-medium shadow-sm hover:opacity-95"
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{
                      background: `radial-gradient(60px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), rgba(255,255,255,0.18) 0%, transparent 70%)`
                    }}
                  />
                  <span className="relative z-10">Añadir</span>
                  <CornerDownLeft size={12} strokeWidth={1.75} className="relative z-10" />
                </button>
              </div>
            </form>
          </div>

          {/* ===================================================================
              STAGE DERECHO (COL-SPAN-4): ESCENARIO ANALÍTICO CON PÍLDORA DESLIZANTE
             =================================================================== */}
          <aside className="lg:col-span-4 py-6 lg:pl-8 space-y-6">
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Encabezado del Escenario y Selector de 4 Lentes con Píldora Deslizante */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`font-mono-metric text-[11px] uppercase tracking-wider ${tokens.inkMuted}`}>
                    [02 // OBSERVATORIO ANALÍTICO]
                  </span>
                  <span
                    className="font-mono-metric text-[10px] uppercase tracking-widest font-semibold"
                    style={{ color: tokens.accentPrimary }}
                  >
                    INTERACTIVO
                  </span>
                </div>

                {/* CONMUTADOR DE 4 LENTES CON PÍLDORA FLOTANTE DESLIZANTE */}
                <div
                  className={`relative grid grid-cols-4 border ${tokens.hairline} rounded-[5px] p-0.5 ${tokens.surfaceElevated} font-mono-metric text-[10px] overflow-hidden`}
                >
                  {/* Pastilla indicadora animada que se desliza con precisión milimétrica entre los 4 lentes */}
                  <div
                    className={`absolute inset-y-0.5 rounded-[3px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none border ${tokens.hairline}`}
                    style={{
                      left: '2px',
                      width: 'calc((100% - 4px) / 4)',
                      transform: `translateX(calc(${activeLensIdx} * 100%))`,
                      backgroundColor: isDark ? '#08090A' : '#FAF8F5'
                    }}
                  />

                  <button
                    onClick={() => {
                      setAnalyticalLens('cadence');
                      playTactileClick('pop', soundEnabled);
                    }}
                    className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                      analyticalLens === 'cadence'
                        ? isDark
                          ? 'text-[#F7F8F8] font-semibold'
                          : 'text-[#191918] font-semibold'
                        : `${tokens.inkMuted} hover:text-current`
                    }`}
                  >
                    SEMANA
                  </button>
                  <button
                    onClick={() => {
                      setAnalyticalLens('streaks');
                      playTactileClick('pop', soundEnabled);
                    }}
                    className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                      analyticalLens === 'streaks'
                        ? isDark
                          ? 'text-[#F7F8F8] font-semibold'
                          : 'text-[#191918] font-semibold'
                        : `${tokens.inkMuted} hover:text-current`
                    }`}
                  >
                    RACHAS
                  </button>
                  <button
                    onClick={() => {
                      setAnalyticalLens('matrix28');
                      playTactileClick('pop', soundEnabled);
                    }}
                    className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                      analyticalLens === 'matrix28'
                        ? isDark
                          ? 'text-[#F7F8F8] font-semibold'
                          : 'text-[#191918] font-semibold'
                        : `${tokens.inkMuted} hover:text-current`
                    }`}
                  >
                    28 DÍAS
                  </button>
                  <button
                    onClick={() => {
                      setAnalyticalLens('chronotype');
                      playTactileClick('pop', soundEnabled);
                    }}
                    className={`relative z-10 py-1.5 rounded-[3px] transition-colors duration-200 active:scale-[0.96] ${
                      analyticalLens === 'chronotype'
                        ? isDark
                          ? 'text-[#F7F8F8] font-semibold'
                          : 'text-[#191918] font-semibold'
                        : `${tokens.inkMuted} hover:text-current`
                    }`}
                  >
                    CRONO
                  </button>
                </div>
              </div>

              {/* LENTE 01: CURVA DE CADENCIA SEMANAL (COLUMNAS INTERACTIVAS) */}
              {analyticalLens === 'cadence' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h2 className="font-display-serif text-2xl tracking-[-0.03em]">
                        Curva de Cadencia Semanal
                      </h2>
                      <p className={`text-xs ${tokens.inkMuted}`}>
                        Haz clic o sobrevuela una barra para ver el desglose
                      </p>
                    </div>
                    <div className="text-right font-mono-metric">
                      <span
                        className="text-lg font-semibold tabular-nums"
                        style={{ color: tokens.accentPrimary }}
                      >
                        {selectedDayDetails?.pct}%
                      </span>
                      <span className={`block text-[10px] ${tokens.inkMuted}`}>
                        {selectedDayDetails?.shortLabel} {selectedDayDetails?.dayNum}
                      </span>
                    </div>
                  </div>

                  {/* Escenario de Gráfico de Barras con Umbral del 80% */}
                  <div
                    className={`relative h-48 pt-7 pb-3 px-3 border ${tokens.hairline} rounded-[6px] ${tokens.surfaceElevated} flex flex-col justify-between`}
                  >
                    {/* Línea de umbral del 80% */}
                    <div
                      className="absolute inset-x-3 border-t border-dashed pointer-events-none flex justify-end"
                      style={{
                        bottom: '78%',
                        borderColor: `${tokens.accentPrimary}60`
                      }}
                    >
                      <span
                        className="font-mono-metric text-[9px] -mt-3 px-1"
                        style={{ color: tokens.accentPrimary }}
                      >
                        UMBRAL 80%
                      </span>
                    </div>

                    {/* 7 Columnas de barras interactivas con físicas de transición */}
                    <div className="relative z-10 grid grid-cols-7 gap-2 h-full items-end">
                      {telemetry.dailyBreakdown.map((item) => {
                        const isSelected = item.iso === selectedDayISO;
                        const barHeight = Math.max(8, item.pct);
                        return (
                          <button
                            key={item.iso}
                            type="button"
                            onClick={() => {
                              setSelectedDayISO(item.iso);
                              playTactileClick('pop', soundEnabled);
                            }}
                            onMouseEnter={() => setSelectedDayISO(item.iso)}
                            className="group flex flex-col items-center justify-end h-full focus:outline-none"
                          >
                            <span
                              className={`font-mono-metric text-[10px] mb-1 tabular-nums transition-opacity ${
                                isSelected ? 'opacity-100 font-semibold' : 'opacity-60 group-hover:opacity-100'
                              }`}
                              style={{ color: isSelected ? tokens.accentPrimary : undefined }}
                            >
                              {item.count}/{item.total}
                            </span>

                            <div
                              className={`w-full max-w-[32px] h-28 rounded-[3px] p-0.5 flex items-end transition-all duration-200 ${
                                isSelected
                                  ? 'bg-black/5 dark:bg-white/5'
                                  : isDark
                                  ? 'bg-[#08090A]'
                                  : 'bg-[#EAE6DF]'
                              }`}
                              style={{
                                outline: isSelected ? `2px solid ${tokens.accentPrimary}` : undefined
                              }}
                            >
                              <div
                                style={{
                                  height: `${barHeight}%`,
                                  backgroundColor:
                                    item.pct === 100
                                      ? tokens.accentForest
                                      : item.isToday || isSelected
                                      ? tokens.accentPrimary
                                      : isDark
                                      ? '#8A8F98'
                                      : '#191918'
                                }}
                                className="w-full rounded-[2px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                              />
                            </div>

                            <span
                              className={`mt-2 font-mono-metric text-[10px] uppercase transition-colors ${
                                isSelected
                                  ? 'font-semibold underline'
                                  : item.isToday
                                  ? 'underline'
                                  : tokens.inkMuted
                              }`}
                              style={{ color: isSelected || item.isToday ? tokens.accentPrimary : undefined }}
                            >
                              {item.shortLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desglose Contextual del Día Seleccionado */}
                  <div className={`pt-3 border-t ${tokens.hairline} space-y-2`}>
                    <div className="flex items-center justify-between font-mono-metric text-[11px]">
                      <span className="uppercase tracking-wider">
                        DESGLOSE · {selectedDayDetails?.shortLabel} {selectedDayDetails?.dayNum}{' '}
                        {selectedDayDetails?.monthShort}
                      </span>
                      <span className={tokens.inkMuted}>
                        {selectedDayDetails?.count} de {selectedDayDetails?.total} sellados
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {enrichedHabits.map((h) => {
                        const doneOnSelected = !!h.history[selectedDayDetails.iso];
                        return (
                          <div
                            key={h.id}
                            onClick={() => toggleHabitDay(h.id, selectedDayDetails.iso)}
                            className={`cursor-pointer px-2.5 py-1.5 rounded-[4px] border ${tokens.hairline} flex items-center justify-between text-xs ${tokens.surfaceHover} active:scale-[0.98] transition-all duration-150`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2 h-2 rounded-full shrink-0 transition-transform hover:scale-125"
                                style={{
                                  backgroundColor: doneOnSelected ? tokens.accentForest : `${tokens.accentPrimary}40`
                                }}
                              />
                              <span className={`truncate ${doneOnSelected ? '' : tokens.inkMuted}`}>
                                {h.name}
                              </span>
                            </div>
                            <span
                              className="font-mono-metric text-[10px] uppercase ml-2 shrink-0 font-medium"
                              style={{ color: doneOnSelected ? tokens.accentForest : undefined }}
                            >
                              {doneOnSelected ? 'SELLADO' : 'PENDIENTE'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* LENTE 02: COMPARATIVA DE RACHAS VS. RÉCORD */}
              {analyticalLens === 'streaks' && (
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
                    {[...enrichedHabits]
                      .sort((a, b) => b.metrics.currentStreak - a.metrics.currentStreak)
                      .map((h) => {
                        const maxScale = Math.max(14, ...enrichedHabits.map((item) => item.metrics.peakStreak));
                        const activeWidth = Math.max(4, Math.round((h.metrics.currentStreak / maxScale) * 100));
                        const peakWidth = Math.max(6, Math.round((h.metrics.peakStreak / maxScale) * 100));

                        return (
                          <div
                            key={h.id}
                            onClick={() => {
                              setInspectedHabitId(h.id);
                              playTactileClick('pop', soundEnabled);
                            }}
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

                            {/* Barra de doble horizonte con física de estiramiento */}
                            <div
                              className={`w-full h-2 ${tokens.surfaceElevated} relative overflow-hidden rounded-[2px] border ${tokens.hairline}`}
                            >
                              <div
                                style={{ width: `${peakWidth}%` }}
                                className="absolute inset-y-0 left-0 bg-current opacity-20"
                              />
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
              )}

              {/* LENTE 03: HUELLA DE DENSIDAD DE 28 DÍAS (MATRIZ GITHUB-STYLE) */}
              {analyticalLens === 'matrix28' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h2 className="font-display-serif text-2xl tracking-[-0.03em]">
                      Huella de Densidad (28 Días)
                    </h2>
                    <p className={`text-xs ${tokens.inkMuted}`}>
                      Matriz de intensidad diaria acumulada en las últimas 4 semanas
                    </p>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 font-mono-metric">
                    {Array.from({ length: 28 }, (_, idx) => {
                      const daysAgo = 27 - idx;
                      const d = addDays(ANCHOR_TODAY, -daysAgo);
                      const iso = formatDateISO(d);
                      const doneCount = enrichedHabits.filter((h) => !!h.history[iso]).length;
                      const ratio = telemetry.total > 0 ? doneCount / telemetry.total : 0;

                      let cellBg = tokens.surfaceElevated;
                      let cellText = tokens.inkMuted;
                      if (ratio >= 0.85) {
                        cellBg = tokens.accentForest;
                        cellText = '#FAF8F5';
                      } else if (ratio >= 0.5) {
                        cellBg = `${tokens.accentForest}90`;
                        cellText = '#FAF8F5';
                      } else if (ratio > 0) {
                        cellBg = `${tokens.accentPrimary}35`;
                        cellText = tokens.accentPrimary;
                      }

                      return (
                        <div
                          key={iso}
                          title={`${d.getDate()} ${MONTH_SHORT[d.getMonth()]}: ${doneCount}/${telemetry.total} rituales sellados`}
                          style={{
                            backgroundColor: ratio > 0 ? cellBg : undefined,
                            color: ratio > 0 ? cellText : undefined
                          }}
                          className={`h-10 rounded-[3px] border ${tokens.hairline} flex flex-col items-center justify-center text-[11px] transition-transform duration-150 hover:scale-110 active:scale-95 ${
                            ratio === 0 ? tokens.surfaceElevated : ''
                          } ${daysAgo === 0 ? 'ring-1' : ''}`}
                        >
                          <span className="font-semibold">{String(d.getDate()).padStart(2, '0')}</span>
                          <span className="text-[9px] opacity-80">
                            {doneCount}/{telemetry.total}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`flex items-center justify-between text-[11px] font-mono-metric ${tokens.inkMuted} pt-2 border-t ${tokens.hairline}`}
                  >
                    <span>17 sep</span>
                    <div className="flex items-center gap-1.5">
                      <span>0%</span>
                      <span className={`w-2.5 h-2.5 inline-block border ${tokens.hairline} ${tokens.surfaceElevated}`} />
                      <span
                        className="w-2.5 h-2.5 inline-block"
                        style={{ backgroundColor: `${tokens.accentPrimary}35` }}
                      />
                      <span
                        className="w-2.5 h-2.5 inline-block"
                        style={{ backgroundColor: `${tokens.accentForest}90` }}
                      />
                      <span
                        className="w-2.5 h-2.5 inline-block"
                        style={{ backgroundColor: tokens.accentForest }}
                      />
                      <span>100%</span>
                    </div>
                    <span>14 oct</span>
                  </div>
                </div>
              )}

              {/* LENTE 04: CRONOTIPO Y DISTRIBUCIÓN HORARIA */}
              {analyticalLens === 'chronotype' && (
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
                      const periodHabits = enrichedHabits.filter((h) => h.period === period);
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
              )}

              {/* Axioma Editorial de Continuidad */}
              <div className={`p-3.5 border ${tokens.hairline} rounded-[4px] space-y-1`}>
                <div
                  className="flex items-center justify-between text-[11px] font-mono-metric"
                  style={{ color: tokens.accentPrimary }}
                >
                  <span>REGLA FUNDAMENTAL</span>
                  <span>MÁXIMO 2 DÍAS</span>
                </div>
                <p className={`text-xs ${tokens.inkMuted} leading-relaxed`}>
                  Nunca permitas dos días en blanco seguidos en un hábito pilar. Un tropiezo es un accidente; dos es el
                  nacimiento de un nuevo hábito opuesto.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ✦ DRAWER INSPECTOR CONTEXTUAL (FÍSICA VAUL / APPLE DECELERATION) */}
      {inspectedHabit && (
        <div
          onClick={() => {
            setInspectedHabitId(null);
            playTactileClick('pop', soundEnabled);
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
                      color: tokens.accentPrimary
                    }}
                  >
                    RITUAL #{inspectedHabit.code}
                  </span>
                  <span className={tokens.inkMuted}>{inspectedHabit.discipline}</span>
                </div>
                <button
                  onClick={() => {
                    setInspectedHabitId(null);
                    playTactileClick('pop', soundEnabled);
                  }}
                  className={`p-1.5 rounded-[4px] border ${tokens.hairline} ${tokens.surfaceHover} active:scale-[0.92] transition-transform`}
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
                  value={inspectedHabit.name}
                  onChange={(e) => updateHabitField(inspectedHabit.id, 'name', e.target.value)}
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
                    {inspectedHabit.metrics.currentStreak} d
                  </span>
                </div>
                <div className="p-3">
                  <span className={`font-mono-metric text-[10px] ${tokens.inkMuted} block`}>RÉCORD MÁX</span>
                  <span className="font-display-serif text-2xl tabular-nums">
                    {inspectedHabit.metrics.peakStreak} d
                  </span>
                </div>
                <div className="p-3">
                  <span className={`font-mono-metric text-[10px] ${tokens.inkMuted} block`}>TASA 28D</span>
                  <span className="font-display-serif text-2xl tabular-nums">
                    {inspectedHabit.metrics.rate28}%
                  </span>
                </div>
              </div>

              {/* Control Deslizante de Cadencia Semanal Objetivo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono-metric text-xs">
                  <span className={tokens.inkMuted}>CADENCIA SEMANAL OBJETIVO</span>
                  <span className="font-semibold" style={{ color: tokens.accentPrimary }}>
                    {inspectedHabit.cadenceTarget} días / semana
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={inspectedHabit.cadenceTarget}
                  onChange={(e) => updateHabitField(inspectedHabit.id, 'cadenceTarget', Number(e.target.value))}
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
                    value={inspectedHabit.discipline}
                    onChange={(e) => updateHabitField(inspectedHabit.id, 'discipline', e.target.value)}
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
                    value={inspectedHabit.period}
                    onChange={(e) => updateHabitField(inspectedHabit.id, 'period', e.target.value)}
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
                    value={inspectedHabit.timeCue}
                    onChange={(e) => updateHabitField(inspectedHabit.id, 'timeCue', e.target.value)}
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
                  value={inspectedHabit.protocol}
                  onChange={(e) => updateHabitField(inspectedHabit.id, 'protocol', e.target.value)}
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
                    const d = addDays(ANCHOR_TODAY, -ago);
                    const iso = formatDateISO(d);
                    const done = !!inspectedHabit.history[iso];
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => toggleHabitDay(inspectedHabit.id, iso)}
                        className={`h-8 rounded-[3px] border text-[11px] font-medium transition-transform active:scale-[0.88] ${
                          done
                            ? 'text-[#FAF8F5] border-transparent shadow-sm'
                            : `${tokens.hairline} ${isDark ? 'bg-[#08090A]' : 'bg-[#FAF8F5]'} ${tokens.inkMuted}`
                        }`}
                        style={{
                          backgroundColor: done ? tokens.accentForest : undefined
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
                onClick={() => deleteHabit(inspectedHabit.id)}
                className="flex items-center gap-1.5 text-xs font-mono-metric text-[#C86446] hover:underline active:scale-95 transition-transform"
              >
                <Trash2 size={13} strokeWidth={1.5} />
                <span>Archivar registro</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectedHabitId(null);
                  playTactileClick('pop', soundEnabled);
                }}
                className="px-4 py-2 text-xs font-mono-metric uppercase bg-[#191918] text-[#FAF8F5] dark:bg-[#F7F8F8] dark:text-[#08090A] rounded-[4px] font-semibold active:scale-[0.96] transition-transform duration-120 shadow-sm hover:opacity-90"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✦ PALETA DE COMANDOS OMNIPRESENTE ANIMADA (`⌘K` / `CTRL+K`) */}
      {commandOpen && (
        <div
          onClick={() => setCommandOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-md font-ui-sans transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg ${tokens.surfaceElevated} border ${tokens.hairline} rounded-[6px] shadow-2xl overflow-hidden animate-modal-in`}
            style={{
              boxShadow: isDark
                ? '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                : '0 25px 60px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className={`flex items-center gap-2.5 px-4 py-3 border-b ${tokens.hairline}`}>
              <Command size={15} strokeWidth={1.75} style={{ color: tokens.accentPrimary }} />
              <input
                ref={commandInputRef}
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Escribe para buscar un ritual o ejecutar una acción..."
                className="w-full bg-transparent text-sm focus:outline-none"
              />
              <kbd className={`font-mono-metric text-[10px] px-1.5 py-0.5 border ${tokens.hairline} rounded`}>
                ESC
              </kbd>
            </div>

            <div className={`max-h-80 overflow-y-auto divide-y ${tokens.hairlineDivider} text-xs`}>
              {/* Acciones de conmutación rápida sobre rituales filtrados */}
              {(() => {
                const query = commandQuery.toLowerCase().trim();
                const matchedHabits = enrichedHabits.filter(
                  (h) =>
                    h.name.toLowerCase().includes(query) ||
                    h.discipline.toLowerCase().includes(query) ||
                    h.period.toLowerCase().includes(query) ||
                    h.protocol.toLowerCase().includes(query)
                );

                const systemActions = [
                  {
                    id: 'act-toggle-all',
                    label: 'Sellar o reiniciar todos los rituales de la jornada',
                    tag: 'ACCIÓN',
                    keywords: 'sellar todos hoy desmarcar reset jornada',
                    run: () => toggleAllToday()
                  },
                  {
                    id: 'act-theme',
                    label: `Conmutar lienzo (${isDark ? 'Alabastro Cálido' : 'Obsidiana de Estudio'})`,
                    tag: 'TEMA',
                    keywords: 'tema oscuro claro obsidian paper alabastro modo noche',
                    run: () => {
                      setTheme((t) => (t === 'paper' ? 'obsidian' : 'paper'));
                      playTactileClick('pop', soundEnabled);
                    }
                  },
                  {
                    id: 'act-export',
                    label: 'Exportar bitácora estructurada (.CSV)',
                    tag: 'DATOS',
                    keywords: 'exportar descargar csv archivo datos hoja',
                    run: () => exportCSV()
                  },
                  {
                    id: 'act-reset',
                    label: 'Restaurar datos canónicos de demostración',
                    tag: 'REINICIO',
                    keywords: 'restaurar demo reset canónicos iniciales limpiar',
                    danger: true,
                    run: () => {
                      setHabits(createInitialHabits());
                      setWeekOffset(0);
                      notify('Cuaderno reestablecido a valores canónicos iniciales');
                    }
                  }
                ].filter(
                  (action) =>
                    !query ||
                    action.label.toLowerCase().includes(query) ||
                    action.keywords.toLowerCase().includes(query) ||
                    action.tag.toLowerCase().includes(query)
                );

                return (
                  <>
                    {matchedHabits.length > 0 && (
                      <div className="p-2 space-y-1">
                        <span className={`px-2 py-1 font-mono-metric text-[10px] uppercase ${tokens.inkMuted} block`}>
                          RITUALES REGISTRADOS ({matchedHabits.length})
                        </span>
                        {matchedHabits.map((h, idx) => (
                          <button
                            key={h.id}
                            type="button"
                            onMouseMove={handleButtonPointerMove}
                            onClick={() => {
                              toggleHabitDay(h.id, todayISO);
                              setCommandOpen(false);
                            }}
                            style={{
                              animation: `slideInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) backwards`,
                              animationDelay: `${idx * 24}ms`
                            }}
                            className={`group relative overflow-hidden w-full px-2.5 py-2 rounded-[4px] flex items-center justify-between ${tokens.surfaceHover} text-left active:scale-[0.98] hover:translate-x-1 transition-all duration-150`}
                          >
                            <span
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                              style={{
                                background: `radial-gradient(100px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}18 0%, transparent 70%)`
                              }}
                            />
                            <div className="flex items-center gap-2 min-w-0 relative z-10">
                              <span className="font-mono-metric text-[10px] opacity-60">{h.code}</span>
                              <span className="truncate">{h.name}</span>
                              <span className={`hidden sm:inline font-mono-metric text-[9px] px-1 py-0.5 border ${tokens.hairline} rounded`}>
                                {h.discipline}
                              </span>
                            </div>
                            <span
                              className="font-mono-metric text-[10px] font-medium shrink-0 relative z-10 ml-2"
                              style={{
                                color: h.metrics.completedToday ? tokens.accentForest : tokens.accentPrimary
                              }}
                            >
                              {h.metrics.completedToday ? 'DESMARCAR HOY' : 'SELLAR HOY'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {systemActions.length > 0 && (
                      <div className="p-2 space-y-1">
                        <span className={`px-2 py-1 font-mono-metric text-[10px] uppercase ${tokens.inkMuted} block`}>
                          OPERACIONES DE SISTEMA ({systemActions.length})
                        </span>
                        {systemActions.map((action, idx) => (
                          <button
                            key={action.id}
                            type="button"
                            onMouseMove={handleButtonPointerMove}
                            onClick={() => {
                              action.run();
                              setCommandOpen(false);
                            }}
                            style={{
                              animation: `slideInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) backwards`,
                              animationDelay: `${(matchedHabits.length + idx) * 24}ms`
                            }}
                            className={`group relative overflow-hidden w-full px-2.5 py-2 rounded-[4px] flex items-center justify-between ${tokens.surfaceHover} ${
                              action.danger ? 'text-[#C86446]' : ''
                            } hover:translate-x-1 transition-all duration-150 active:scale-[0.98] text-left`}
                          >
                            <span
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                              style={{
                                background: `radial-gradient(100px circle at var(--mouse-btn-x, 50%) var(--mouse-btn-y, 50%), ${tokens.accentPrimary}18 0%, transparent 70%)`
                              }}
                            />
                            <span className="relative z-10">{action.label}</span>
                            <span className="font-mono-metric text-[10px] relative z-10 font-semibold">{action.tag}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {matchedHabits.length === 0 && systemActions.length === 0 && (
                      <div className="p-8 text-center space-y-1.5">
                        <p className={`text-xs ${tokens.inkMuted}`}>
                          No se encontraron rituales ni comandos coincidentes con &ldquo;{commandQuery}&rdquo;.
                        </p>
                        <p className="font-mono-metric text-[10px] opacity-60">
                          Prueba buscando &ldquo;enfoque&rdquo;, &ldquo;cuerpo&rdquo;, &ldquo;csv&rdquo; o &ldquo;tema&rdquo;.
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ✦ NOTIFICACIÓN TOAST DISCRETA EN ESQUINA INFERIOR */}
      {statusBanner && (
        <div
          className={`fixed bottom-5 right-5 z-50 font-mono-metric text-xs px-3.5 py-2.5 rounded-[4px] bg-[#191918] text-[#FAF8F5] dark:bg-[#F7F8F8] dark:text-[#08090A] border shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200`}
          style={{ borderColor: tokens.accentPrimary }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: tokens.accentPrimary }}
          />
          <span>{statusBanner}</span>
        </div>
      )}
    </div>
  );
}