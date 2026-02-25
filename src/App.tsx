import React, { useState, useEffect } from 'react';

type SlotState = 'empty' | 'pink' | 'blue';

const Footprint = ({
  state,
  className,
}: {
  state: SlotState;
  className?: string;
}) => {
  const isEmpty = state === 'empty';
  const color =
    state === 'pink' ? '#ff9eb5' : state === 'blue' ? '#7cd0ff' : 'transparent';

  return (
    <svg
      viewBox='0 0 100 100'
      className={`w-full h-full transition-all duration-300 ${className}`}
      style={{
        filter: isEmpty ? 'none' : 'drop-shadow(2px 4px 3px rgba(0,0,0,0.4))',
        transform:
          state !== 'empty'
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
        <g fill={color} stroke='rgba(0,0,0,0.05)' strokeWidth='1'>
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
  const [name, setName] = useState('Enter your name here');
  const [subtitle, setSubtitle] = useState('Midwife in the making');
  const [dateRange, setDateRange] = useState('Start Year - End Year');
  const [slots, setSlots] = useState<SlotState[]>(Array(40).fill('empty'));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('midwife-tracker');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.name) setName(parsed.name);
        if (parsed.subtitle) setSubtitle(parsed.subtitle);
        if (parsed.dateRange) setDateRange(parsed.dateRange);
        if (parsed.slots && parsed.slots.length === 40) setSlots(parsed.slots);
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
          subtitle,
          dateRange,
          slots,
        }),
      );
    }
  }, [name, subtitle, dateRange, slots, isLoaded]);

  const handleSlotClick = (index: number) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      const current = newSlots[index];
      if (current === 'empty') newSlots[index] = 'pink';
      else if (current === 'pink') newSlots[index] = 'blue';
      else newSlots[index] = 'empty';
      return newSlots;
    });
  };

  const pinkCount = slots.filter((s) => s === 'pink').length;
  const blueCount = slots.filter((s) => s === 'blue').length;
  const totalCount = pinkCount + blueCount;

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
            <input
              type='text'
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className='bg-transparent text-center text-xl sm:text-2xl md:text-3xl font-serif text-stone-800 outline-none w-full placeholder-stone-500 engraved-text font-semibold tracking-wide'
            />
            <input
              type='text'
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className='bg-transparent text-center text-lg sm:text-xl md:text-2xl font-serif text-stone-800 outline-none w-full placeholder-stone-500 engraved-text font-semibold tracking-widest'
            />
          </div>

          {/* Grid */}
          <div className='grid grid-cols-8 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6 relative z-10 px-2 sm:px-4'>
            {slots.map((slot, i) => (
              <button
                key={i}
                onClick={() => handleSlotClick(i)}
                className='aspect-square w-full flex items-center justify-center focus:outline-none hover:scale-110 transition-transform cursor-pointer'
                aria-label={`Slot ${i + 1}, currently ${slot}`}
              >
                <Footprint state={slot} />
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
              Click the footprints on the board to track your deliveries. Cycle
              through pink, blue, and empty.
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
            onClick={() => {
              if (confirm('Are you sure you want to reset all counters?')) {
                setSlots(Array(40).fill('empty'));
              }
            }}
            className='mt-4 w-full py-4 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors font-semibold text-sm border border-stone-200'
          >
            Reset Board
          </button>
        </div>
      </div>
    </div>
  );
}
