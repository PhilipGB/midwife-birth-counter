import React, { useState, useEffect } from 'react';
import { useBirthTracker } from './hooks/useBirthTracker';
import { Board } from './components/Board';
import { StatsPanel } from './components/StatsPanel';
import { DeliveryModal } from './components/DeliveryModal';
import { ResetConfirmation } from './components/ResetConfirmation';
import { ClearSlotConfirmation } from './components/ClearSlotConfirmation';

function App() {
  const { state, actions } = useBirthTracker();
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const toggleTheme = () => {
    actions.setTheme(state.theme === 'light' ? 'dark' : 'light');
  };
  const [lastSavedIndex, setLastSavedIndex] = useState<number | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isClearOpen, setIsClearOpen] = useState(false);

  // Year range for the dropdowns
  const years = Array.from({ length: 21 }, (_, i) => (2020 + i).toString());

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.name && data.slots) {
          actions.setName(data.name);
          actions.setStartYear(data.startYear || '2025');
          actions.setEndYear(data.endYear || '2028');
          actions.setSlotsBulk(data.slots);
        }
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSlotSave = (index: number, updates: any) => {
    actions.updateSlot(index, updates);
    setLastSavedIndex(index);
    actions.triggerCelebration(
      state.totalCount +
        (updates.color !== 'empty' && state.slots[index].color === 'empty'
          ? 1
          : 0),
    );
    setActiveSlotIndex(null);
  };

  const handleClearSlot = () => {
    if (activeSlotIndex !== null) {
      actions.updateSlot(activeSlotIndex, { color: 'empty', date: '' });
      setLastSavedIndex(activeSlotIndex);
      setActiveSlotIndex(null);
    }
    setIsClearOpen(false);
  };

  return (
    <div className='min-h-screen bg-app-bg text-text-main font-sans selection:bg-pink-100 selection:text-pink-900 p-4 sm:p-8 md:p-12 flex items-center justify-center transition-colors duration-300'>
      <div className='fixed top-4 right-4 z-50'>
        <button
          onClick={toggleTheme}
          className='p-2 rounded-full bg-panel-bg/50 backdrop-blur-sm border border-panel-border text-text-muted hover:bg-panel-bg transition-all shadow-sm'
          aria-label='Toggle Night Shift'
        >
          {state.theme === 'light' ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='4' />
              <path d='M12 2v2' />
              <path d='M12 20v2' />
              <path d='m4.93 4.93 1.41 1.41' />
              <path d='m17.66 17.66 1.41 1.41' />
              <path d='M2 12h2' />
              <path d='M20 12h2' />
              <path d='m6.34 17.66-1.41 1.41' />
              <path d='m19.07 4.93-1.41 1.41' />
            </svg>
          )}
        </button>
      </div>
      <div className='flex flex-col lg:flex-row gap-12 items-start justify-center w-full max-w-6xl'>
        <Board
          name={state.name}
          setName={actions.setName}
          startYear={state.startYear}
          setStartYear={actions.setStartYear}
          endYear={state.endYear}
          setEndYear={actions.setEndYear}
          sortedSlots={state.sortedSlots}
          onSlotClick={setActiveSlotIndex}
          lastModifiedIndex={lastSavedIndex}
          years={years}
        />

        <StatsPanel
          totalCount={state.totalCount}
          pinkCount={state.pinkCount}
          blueCount={state.blueCount}
          typeCounts={state.typeCounts}
          predictedDate={state.predictedDate}
          exportBackup={actions.exportBackup}
          onImportBackup={handleImportBackup}
          onResetBoard={() => setIsResetOpen(true)}
        />
      </div>

      {activeSlotIndex !== null && (
        <DeliveryModal
          slot={state.slots[activeSlotIndex]}
          index={activeSlotIndex}
          onClose={() => setActiveSlotIndex(null)}
          onUpdate={(updates) => handleSlotSave(activeSlotIndex, updates)}
          onClear={() => setIsClearOpen(true)}
        />
      )}

      <ResetConfirmation
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={() => {
          actions.resetBoard();
          setIsResetOpen(false);
        }}
      />

      <ClearSlotConfirmation
        isOpen={isClearOpen}
        onClose={() => setIsClearOpen(false)}
        onConfirm={handleClearSlot}
      />
    </div>
  );
}

export default App;
