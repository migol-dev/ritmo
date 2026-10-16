import React, { useState, useEffect } from 'react';
import { THEME_TOKENS } from './constants/themeTokens';
import { ANCHOR_TODAY } from './utils/date.utils';
import { useHabits } from './hooks/useHabits';
import { useTactileAudio } from './hooks/useTactileAudio';
import { useMouseCoordinates } from './hooks/useMouseCoordinates';

// Componentes de interfaz
import { SpotlightBackground } from './components/ui/SpotlightBackground';
import { ProgressiveBlurVeil } from './components/layout/ProgressiveBlurVeil';
import { Header } from './components/layout/Header';
import { TelemetryLedger } from './components/layout/TelemetryLedger';
import { DisciplineFilterPill } from './components/habits/DisciplineFilterPill';
import { QuickFocusBar } from './components/habits/QuickFocusBar';
import { HabitsTable } from './components/habits/HabitsTable';
import { InlineHabitForm } from './components/habits/InlineHabitForm';
import { ObservatoryStage } from './components/observatory/ObservatoryStage';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { HabitInspectorDrawer } from './components/modals/HabitInspectorDrawer';
import { StatusToast } from './components/ui/StatusToast';

export const App: React.FC = () => {
  const { soundEnabled, setSoundEnabled, playClick } = useTactileAudio();
  const {
    habits,
    filteredHabits,
    theme,
    setTheme,
    weekOffset,
    setWeekOffset,
    weekDays,
    todayISO,
    activeDiscipline,
    setActiveDiscipline,
    analyticalLens,
    setAnalyticalLens,
    selectedDayISO,
    setSelectedDayISO,
    selectedDayDetails,
    inspectedHabit,
    inspectedHabitId,
    setInspectedHabitId,
    telemetry,
    statusBanner,
    toggleHabitDay,
    addHabit,
    updateHabitField,
    duplicateHabit,
    deleteHabit,
    toggleAllToday,
    exportCSV,
    resetDefaults
  } = useHabits(playClick);

  const { containerRef, handleMouseMove } = useMouseCoordinates();

  // Estados de navegación contextual y modales
  const [commandOpen, setCommandOpen] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const isDark = theme === 'obsidian';
  const tokens = THEME_TOKENS[theme];

  // Atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K o Ctrl+K: Paleta de comandos
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
        playClick('pop');
      }
      // Escape: Cerrar modales abiertos
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setSearchDropdownOpen(false);
        setIsSearchHovered(false);
        setInspectedHabitId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playClick, setInspectedHabitId]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'paper' ? 'obsidian' : 'paper'));
    playClick('pop');
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
    playClick('pop');
  };

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
    playClick('pop');
  };

  const handleNextWeek = () => {
    if (weekOffset < 0) {
      setWeekOffset((prev) => prev + 1);
      playClick('pop');
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`min-h-screen ${tokens.canvas} selection:bg-[#C86446]/20 font-ui-sans relative transition-colors duration-300`}
    >
      {/* 1. Fondo radial reactivo al cursor */}
      <SpotlightBackground theme={theme} />

      {/* 2. Velo de desenfoque gradual dinámico */}
      <ProgressiveBlurVeil isVisible={isSearchHovered || searchDropdownOpen} />

      {/* 3. Encabezado arquitectónico con búsqueda y atajos */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        weekOffset={weekOffset}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        weekDays={weekDays}
        onOpenCommand={() => {
          setCommandOpen(true);
          playClick('pop');
        }}
        onExportCSV={exportCSV}
        isSearchHovered={isSearchHovered}
        setIsSearchHovered={setIsSearchHovered}
        searchDropdownOpen={searchDropdownOpen}
        setSearchDropdownOpen={setSearchDropdownOpen}
        habits={habits}
        onToggleHabitToday={(id) => toggleHabitDay(id, todayISO)}
        todayISO={todayISO}
        tokens={tokens}
      />

      {/* 4. Lienzo Principal (Canvas-First, Cero Card-itis) */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-6 pb-20">
        {/* Libro Mayor de Métricas y Manifiesto Editorial */}
        <TelemetryLedger
          telemetry={telemetry}
          weekOffset={weekOffset}
          tokens={tokens}
          onSelectLens={setAnalyticalLens}
        />

        {/* Barra de Filtros por Disciplina con Píldora Deslizante */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <DisciplineFilterPill
            activeDiscipline={activeDiscipline}
            onSelectDiscipline={(disc) => {
              setActiveDiscipline(disc);
              playClick('pop');
            }}
            isDark={isDark}
            tokens={tokens}
          />
          <div className="flex items-center gap-3 font-mono-metric text-xs">
            <span className={tokens.inkMuted}>
              {filteredHabits.length} de {habits.length} rituales activos
            </span>
          </div>
        </div>

        {/* Sellador Veloz del Día Vigente */}
        <QuickFocusBar
          habits={habits}
          onToggleToday={(id) => toggleHabitDay(id, todayISO)}
          isDark={isDark}
          tokens={tokens}
        />

        {/* Distribución Asimétrica 8:4 (Tabla de Hábitos + Observatorio Analítico) */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x ${tokens.hairlineDivider}`}>
          {/* Columna Izquierda: Tabla Maestra de Hábitos + Formulario en línea */}
          <section className="lg:col-span-8 space-y-4 py-6 pr-0 lg:pr-8">
            <HabitsTable
              habits={filteredHabits}
              weekDays={weekDays}
              selectedDayISO={selectedDayISO}
              onSelectDayISO={(iso) => {
                setSelectedDayISO(iso);
                playClick('pop');
              }}
              inspectedHabitId={inspectedHabitId}
              onInspect={(id) => {
                setInspectedHabitId(id);
                playClick('pop');
              }}
              onToggleDay={toggleHabitDay}
              onDuplicate={duplicateHabit}
              onDelete={deleteHabit}
              isDark={isDark}
              tokens={tokens}
            />

            <InlineHabitForm
              onAddHabit={addHabit}
              isDark={isDark}
              tokens={tokens}
            />
          </section>

          {/* Columna Derecha: Observatorio Analítico con 4 Lentes */}
          <ObservatoryStage
            analyticalLens={analyticalLens}
            onSelectLens={(lens) => {
              setAnalyticalLens(lens);
              playClick('pop');
            }}
            telemetry={telemetry}
            selectedDayISO={selectedDayISO}
            selectedDayDetails={selectedDayDetails}
            onSelectDayISO={(iso) => {
              setSelectedDayISO(iso);
              playClick('pop');
            }}
            habits={habits}
            onToggleHabitDay={toggleHabitDay}
            onInspect={(id) => {
              setInspectedHabitId(id);
              playClick('pop');
            }}
            isDark={isDark}
            tokens={tokens}
          />
        </div>
      </main>

      {/* 5. Ficha Contextual / Drawer Lateral con Física Apple/Vaul */}
      <HabitInspectorDrawer
        habit={inspectedHabit}
        isOpen={!!inspectedHabit}
        onClose={() => setInspectedHabitId(null)}
        onUpdateField={updateHabitField}
        onToggleDay={toggleHabitDay}
        onDelete={deleteHabit}
        isDark={isDark}
        tokens={tokens}
        anchorToday={ANCHOR_TODAY}
        playTactileClick={playClick}
      />

      {/* 6. Paleta de Comandos Omnipresente (⌘K) */}
      <CommandPaletteModal
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        habits={habits}
        onToggleHabitToday={(id) => toggleHabitDay(id, todayISO)}
        onToggleAllToday={toggleAllToday}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onExportCSV={exportCSV}
        onResetDefaults={resetDefaults}
        todayISO={todayISO}
        tokens={tokens}
      />

      {/* 7. Notificación Táctil de Estado */}
      <StatusToast message={statusBanner} accentColor={tokens.accentPrimary} />
    </div>
  );
};

export default App;
