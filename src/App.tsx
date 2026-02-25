import React, { useState, useEffect } from 'react';

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

  const years = Array.from({ length: 15 }, (_, i) => (2020 + i).toString());

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
          <div className='grid grid-cols-8 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 relative z-10 px-2 sm:px-4'>
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
                <label className='block text-sm font-medium text-stone-700 mb-1'>
                  Delivery Date
                </label>
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
                      newSlots[activeSlotIndex] = {
                        ...newSlots[activeSlotIndex],
                        color: 'pink',
                      };
                      setSlots(newSlots);
                    }}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${slots[activeSlotIndex].color === 'pink' ? 'bg-pink-50 border-pink-400 text-pink-700' : 'border-stone-100 hover:border-pink-200 text-stone-600'}`}
                  >
                    Girl (Pink)
                  </button>
                  <button
                    onClick={() => {
                      const newSlots = [...slots];
                      newSlots[activeSlotIndex] = {
                        ...newSlots[activeSlotIndex],
                        color: 'blue',
                      };
                      setSlots(newSlots);
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
