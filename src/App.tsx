import React, { useState } from 'react';
import { useBirthTracker } from './hooks/useBirthTracker';
import { Board } from './components/Board';
import { StatsPanel } from './components/StatsPanel';
import { DeliveryModal } from './components/DeliveryModal';
import { ResetConfirmation } from './components/ResetConfirmation';
import { ClearSlotConfirmation } from './components/ClearSlotConfirmation';

function App() {
  const { state, actions } = useBirthTracker();
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
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
    <div className='min-h-screen bg-[#fdfaf7] text-stone-900 font-sans selection:bg-pink-100 selection:text-pink-900 p-4 sm:p-8 md:p-12 flex items-center justify-center'>
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
