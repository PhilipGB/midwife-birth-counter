import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

type SlotColor = 'empty' | 'pink' | 'blue';
interface SlotData {
  color: SlotColor;
  date: string;
}

const Footprint = ({
  color,
  className,
}: {
  color: SlotColor;
  className?: string;
}) => {
  const isEmpty = color === 'empty';
  const fill =
    color === 'pink' ? '#ff9eb5' : color === 'blue' ? '#7cd0ff' : 'transparent';

  return (
    <svg
      viewBox='0 0 100 100'
      className={`w-full h-full transition-all duration-300 ${className}`}
      style={{
        filter: isEmpty ? 'none' : 'drop-shadow(2px 4px 3px rgba(0,0,0,0.4))',
        transform:
          color !== 'empty'
            ? 'scale(1.05) rotate(-5deg)'
            : 'scale(0.95) rotate(-5deg)',
      }}
    >
      {isEmpty && (
        <g
          fill='rgba(80, 50, 20, 0.15)'
          stroke='rgba(0,0,0,0.1)'
          strokeWidth='1'
        >
          <ellipse
            cx='32'
            cy='22'
            rx='10'
            ry='14'
            transform='rotate(-15 32 22)'
          />
          <ellipse
            cx='54'
            cy='18'
            rx='7'
            ry='10'
            transform='rotate(-5 54 18)'
          />
          <ellipse cx='70' cy='22' rx='6' ry='8' transform='rotate(5 70 22)' />
          <ellipse cx='82' cy='30' rx='5' ry='7' transform='rotate(15 82 30)' />
          <path d='M 32 40 C 20 50, 25 85, 45 92 C 65 99, 82 85, 80 60 C 78 40, 60 32, 45 35 C 38 36, 35 38, 32 40 Z' />
        </g>
      )}
      {!isEmpty && (
        <g fill={fill} stroke='rgba(0,0,0,0.05)' strokeWidth='1'>
          <ellipse
            cx='32'
            cy='22'
            rx='10'
            ry='14'
            transform='rotate(-15 32 22)'
          />
          <ellipse
            cx='54'
            cy='18'
            rx='7'
            ry='10'
            transform='rotate(-5 54 18)'
          />
          <ellipse cx='70' cy='22' rx='6' ry='8' transform='rotate(5 70 22)' />
          <ellipse cx='82' cy='30' rx='5' ry='7' transform='rotate(15 82 30)' />
          <path d='M 32 40 C 20 50, 25 85, 45 92 C 65 99, 82 85, 80 60 C 78 40, 60 32, 45 35 C 38 36, 35 38, 32 40 Z' />

          {/* Subtle highlights */}
          <path
            d='M 32 40 C 20 50, 25 85, 45 92'
            fill='none'
            stroke='rgba(255,255,255,0.5)'
            strokeWidth='2'
            strokeLinecap='round'
          />
          <ellipse
            cx='30'
            cy='18'
            rx='3'
            ry='5'
            fill='rgba(255,255,255,0.4)'
            transform='rotate(-15 30 18)'
          />
        </g>
      )}
    </svg>
  );
};

export default function App() {
  const [name, setName] = useState('Enter Your Name Here');
  const [startYear, setStartYear] = useState('20225');
  const [endYear, setEndYear] = useState('2028');
  const [slots, setSlots] = useState<SlotData[]>(
    Array.from({ length: 40 }, () => ({ color: 'empty', date: '' })),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [pendingCelebration, setPendingCelebration] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<{
    name: string;
    startYear: string;
    endYear: string;
    slots: SlotData[];
  } | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('midwife-tracker');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.name) setName(parsed.name);
        if (parsed.startYear) setStartYear(parsed.startYear);
        if (parsed.endYear) setEndYear(parsed.endYear);

        // Handle migration from old string array to object array
        if (parsed.slots && parsed.slots.length === 40) {
          const migratedSlots = parsed.slots.map((s: any) =>
            typeof s === 'string' ? { color: s, date: '' } : s,
          );
          setSlots(migratedSlots);
        }
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        'midwife-tracker',
        JSON.stringify({
          name,
          startYear,
          endYear,
          slots,
        }),
      );
    }
  }, [name, startYear, endYear, slots, isLoaded]);

  const pinkCount = slots.filter((s) => s.color === 'pink').length;
  const blueCount = slots.filter((s) => s.color === 'blue').length;
  const totalCount = pinkCount + blueCount;

  useEffect(() => {
    if (activeSlotIndex === null && pendingCelebration) {
      triggerCelebration(totalCount);
      setPendingCelebration(false);
    }
  }, [activeSlotIndex, pendingCelebration, totalCount]);

  const triggerCelebration = (count: number) => {
    const milestones = [10, 20, 30, 40];
    if (milestones.includes(count)) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  };

  const years = Array.from({ length: 15 }, (_, i) => (2020 + i).toString());

  const exportBackup = () => {
    const data = { name, startYear, endYear, slots };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `midwife-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (
          data.name &&
          data.startYear &&
          data.endYear &&
          Array.isArray(data.slots) &&
          data.slots.length === 40
        ) {
          setPendingImportData(data);
          setIsImportConfirmOpen(true);
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Error reading backup file.');
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (pendingImportData) {
      setName(pendingImportData.name);
      setStartYear(pendingImportData.startYear);
      setEndYear(pendingImportData.endYear);
      setSlots(pendingImportData.slots);
      setPendingImportData(null);
      setIsImportConfirmOpen(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center py-8 sm:py-12 px-4 font-sans'>
      <div className='max-w-4xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 justify-center'>
        {/* Board */}
        <div className='wood-board w-full max-w-2xl rounded-4xl p-6 sm:p-10 relative shrink-0'>
          {/* Hanging holes */}
          <div className='absolute top-6 left-8 w-4 h-4 rounded-full bg-stone-900 shadow-inner opacity-80'></div>
          <div className='absolute top-6 right-8 w-4 h-4 rounded-full bg-stone-900 shadow-inner opacity-80'></div>

          {/* Header Texts */}
          <div className='flex flex-col items-center gap-1 mb-8 relative z-10 mt-2'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-transparent text-center text-4xl sm:text-5xl md:text-6xl font-script text-stone-800 outline-none w-full placeholder-stone-500 engraved-text'
            />
            <div className='text-center text-xl sm:text-2xl md:text-3xl font-serif text-stone-800 engraved-text font-semibold tracking-wide'>
              Midwife in the making
            </div>
            <div className='flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl font-serif text-stone-800 engraved-text font-semibold tracking-widest mt-1'>
              <select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className='bg-transparent outline-none cursor-pointer text-center appearance-none hover:bg-black/5 rounded px-3 py-1 transition-colors min-w-[4.5em]'
              >
                {years.map((y) => (
                  <option key={`start-${y}`} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span>-</span>
              <select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className='bg-transparent outline-none cursor-pointer text-center appearance-none hover:bg-black/5 rounded px-3 py-1 transition-colors min-w-[4.5em]'
              >
                {years.map((y) => (
                  <option key={`end-${y}`} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className='grid grid-cols-5 sm:grid-cols-8 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 relative z-10 px-2 sm:px-4'>
            {slots.map((slot, i) => (
              <button
                key={i}
                onClick={() => setActiveSlotIndex(i)}
                className='flex flex-col items-center justify-start focus:outline-none hover:scale-110 transition-transform cursor-pointer relative group'
                aria-label={`Slot ${i + 1}, currently ${slot.color}`}
                title={slot.date ? `Delivered: ${slot.date}` : `Slot ${i + 1}`}
              >
                <div className='aspect-square w-full'>
                  <Footprint color={slot.color} />
                </div>
                <div className='h-4 mt-1 flex items-center justify-center w-full'>
                  {slot.date && (
                    <span className='text-[9px] sm:text-[10px] font-mono text-stone-700/80 whitespace-nowrap'>
                      {new Date(slot.date).toLocaleDateString(undefined, {
                        year: '2-digit',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Board Stand Legs (Decorative) */}
          <div className='absolute -bottom-4 left-16 w-8 h-8 bg-[#b8956c] rounded-b-xl -z-10 shadow-lg'></div>
          <div className='absolute -bottom-4 right-16 w-8 h-8 bg-[#b8956c] rounded-b-xl -z-10 shadow-lg'></div>
        </div>

        {/* Controls & Stats */}
        <div className='w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-stone-100 flex flex-col gap-8 sticky top-12'>
          <div>
            <h2 className='text-xl font-bold text-stone-800 mb-2'>
              Delivery Progress
            </h2>
            <p className='text-stone-500 text-sm'>
              Click the footprints on the board to record a delivery date and
              choose a color.
            </p>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='mb-2'>
              <div className='w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200'>
                <div
                  className='h-full bg-gradient-to-r from-pink-300 via-stone-300 to-blue-300 transition-all duration-700 ease-out'
                  style={{ width: `${(totalCount / 40) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className='flex justify-between items-end pb-4 border-b border-stone-100'>
              <span className='text-stone-500 font-medium'>
                Total Deliveries
              </span>
              <span className='text-4xl font-bold text-stone-800'>
                {totalCount}{' '}
                <span className='text-stone-400 text-xl font-normal'>/ 40</span>
              </span>
            </div>

            <div className='flex gap-4 pt-2'>
              <div className='flex-1 bg-pink-50/50 rounded-2xl p-4 flex flex-col items-center border border-pink-100'>
                <span className='text-pink-400 text-sm font-semibold mb-1 uppercase tracking-wider'>
                  Girls
                </span>
                <span className='text-3xl font-bold text-pink-500'>
                  {pinkCount}
                </span>
              </div>
              <div className='flex-1 bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center border border-blue-100'>
                <span className='text-blue-400 text-sm font-semibold mb-1 uppercase tracking-wider'>
                  Boys
                </span>
                <span className='text-3xl font-bold text-blue-500'>
                  {blueCount}
                </span>
              </div>
            </div>
          </div>

          <div className='flex gap-3 mt-4'>
            <button
              onClick={exportBackup}
              className='flex-1 py-3 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors font-semibold text-xs border border-stone-200'
            >
              Export Backup
            </button>
            <label className='flex-1 py-3 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors font-semibold text-xs border border-stone-200 text-center cursor-pointer'>
              Import Backup
              <input
                type='file'
                accept='.json'
                className='hidden'
                onChange={importBackup}
              />
            </label>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className='mt-4 w-full py-4 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors font-semibold text-sm border border-stone-200'
          >
            Reset Board
          </button>
        </div>
      </div>

      {/* Modal */}
      {activeSlotIndex !== null && (
        <div
          className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={() => setActiveSlotIndex(null)}
        >
          <div
            className='bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-bold text-stone-800 mb-4'>
              Record Delivery {activeSlotIndex + 1}
            </h3>

            <div className='space-y-5'>
              <div>
                <div className='flex justify-between items-center mb-1'>
                  <label className='block text-sm font-medium text-stone-700'>
                    Delivery Date
                  </label>
                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      const newSlots = [...slots];
                      newSlots[activeSlotIndex] = {
                        ...newSlots[activeSlotIndex],
                        date: today,
                      };
                      setSlots(newSlots);
                    }}
                    className='px-2 py-1 bg-stone-100 border border-stone-200 text-stone-600 rounded-md text-[10px] font-medium hover:bg-stone-200 hover:text-stone-800 transition-all flex items-center gap-1'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='10'
                      height='10'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <rect
                        x='3'
                        y='4'
                        width='18'
                        height='18'
                        rx='2'
                        ry='2'
                      ></rect>
                      <line x1='16' y1='2' x2='16' y2='6'></line>
                      <line x1='8' y1='2' x2='8' y2='6'></line>
                      <line x1='3' y1='10' x2='21' y2='10'></line>
                    </svg>
                    Set to Today
                  </button>
                </div>
                <input
                  type='date'
                  value={slots[activeSlotIndex].date}
                  onChange={(e) => {
                    const newSlots = [...slots];
                    newSlots[activeSlotIndex] = {
                      ...newSlots[activeSlotIndex],
                      date: e.target.value,
                    };
                    setSlots(newSlots);
                  }}
                  className='w-full border border-stone-300 rounded-lg p-2.5 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700 mb-2'>
                  Footprint Color
                </label>
                <div className='flex gap-3'>
                  <button
                    onClick={() => {
                      const newSlots = [...slots];
                      const prevColor = newSlots[activeSlotIndex].color;
                      newSlots[activeSlotIndex] = {
                        ...newSlots[activeSlotIndex],
                        color: 'pink',
                      };
                      setSlots(newSlots);
                      if (prevColor === 'empty') {
                        const newTotal = totalCount + 1;
                        const milestones = [10, 20, 30, 40];
                        if (milestones.includes(newTotal)) {
                          setPendingCelebration(true);
                        }
                      }
                    }}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${slots[activeSlotIndex].color === 'pink' ? 'bg-pink-50 border-pink-400 text-pink-700' : 'border-stone-100 hover:border-pink-200 text-stone-600'}`}
                  >
                    Girl (Pink)
                  </button>
                  <button
                    onClick={() => {
                      const newSlots = [...slots];
                      const prevColor = newSlots[activeSlotIndex].color;
                      newSlots[activeSlotIndex] = {
                        ...newSlots[activeSlotIndex],
                        color: 'blue',
                      };
                      setSlots(newSlots);
                      if (prevColor === 'empty') {
                        const newTotal = totalCount + 1;
                        const milestones = [10, 20, 30, 40];
                        if (milestones.includes(newTotal)) {
                          setPendingCelebration(true);
                        }
                      }
                    }}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${slots[activeSlotIndex].color === 'blue' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'border-stone-100 hover:border-blue-200 text-stone-600'}`}
                  >
                    Boy (Blue)
                  </button>
                </div>
                <button
                  onClick={() => {
                    const newSlots = [...slots];
                    newSlots[activeSlotIndex] = { color: 'empty', date: '' };
                    setSlots(newSlots);
                    setPendingCelebration(false);
                  }}
                  className={`w-full mt-3 py-2.5 rounded-xl border-2 font-medium transition-all ${slots[activeSlotIndex].color === 'empty' ? 'bg-stone-100 border-stone-300 text-stone-700' : 'border-stone-100 hover:bg-stone-50 text-stone-500'}`}
                >
                  Clear Slot
                </button>
              </div>
            </div>

            <div className='mt-8 flex justify-end'>
              <button
                onClick={() => setActiveSlotIndex(null)}
                className='px-6 py-2.5 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors font-medium w-full'
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Import Confirmation Modal */}
      {isImportConfirmOpen && (
        <div
          className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={() => setIsImportConfirmOpen(false)}
        >
          <div
            className='bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-bold text-stone-800 mb-2'>
              Import Backup
            </h3>
            <p className='text-stone-600 mb-6'>
              This will overwrite your current board and all recorded
              deliveries. Are you sure you want to proceed?
            </p>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setIsImportConfirmOpen(false)}
                className='px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors font-medium'
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                className='px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors font-medium'
              >
                Confirm Overwrite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div
          className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={() => setIsResetModalOpen(false)}
        >
          <div
            className='bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-bold text-stone-800 mb-2'>
              Reset Board
            </h3>
            <p className='text-stone-600 mb-6'>
              Are you sure you want to reset all counters? This action cannot be
              undone.
            </p>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className='px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors font-medium'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSlots(
                    Array.from({ length: 40 }, () => ({
                      color: 'empty',
                      date: '',
                    })),
                  );
                  setIsResetModalOpen(false);
                }}
                className='px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium'
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
