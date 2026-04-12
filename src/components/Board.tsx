import { Footprint } from './Footprint';
import { SlotData } from '../types';

interface BoardProps {
  name: string;
  setName: (name: string) => void;
  startYear: string;
  setStartYear: (year: string) => void;
  endYear: string;
  setEndYear: (year: string) => void;
  sortedSlots: { slot: SlotData; index: number }[];
  onSlotClick: (index: number) => void;
  lastModifiedIndex: number | null;
  years: string[];
}

export const Board = ({
  name,
  setName,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  sortedSlots,
  onSlotClick,
  lastModifiedIndex,
  years,
}: BoardProps) => {
  return (
    <div className='relative shrink-0 w-full max-w-2xl'>
      <div className='wood-board w-full rounded-4xl p-6 sm:p-10 relative z-10'>
        {/* Hanging holes */}
        <div className='absolute top-6 left-8 w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-800 shadow-inner opacity-80'></div>
        <div className='absolute top-6 right-8 w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-800 shadow-inner opacity-80'></div>

        {/* Header Texts */}
        <div className='flex flex-col items-center gap-1 mb-8 relative z-10 mt-2'>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='bg-transparent text-center text-4xl sm:text-5xl md:text-6xl font-script outline-none w-full placeholder-stone-500 dark:placeholder-stone-600 engraved-text'
          />
          <div className='text-center text-xl sm:text-2xl md:text-3xl font-serif engraved-text font-semibold tracking-wide'>
            Midwife in the making
          </div>
          <div className='flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl font-serif engraved-text font-semibold tracking-widest mt-1'>
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className='bg-transparent outline-none cursor-pointer text-center appearance-none hover:bg-black/5 dark:hover:bg-white/10 rounded px-3 py-1 transition-colors min-w-[4.5em]'
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
              className='bg-transparent outline-none cursor-pointer text-center appearance-none hover:bg-black/5 dark:hover:bg-white/10 rounded px-3 py-1 transition-colors min-w-[4.5em]'
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
          {sortedSlots.map(({ slot, index }) => (
            <button
              key={index}
              onClick={() => onSlotClick(index)}
              className='flex flex-col items-center justify-start focus:outline-none hover:scale-110 transition-transform cursor-pointer relative group'
              aria-label={`Slot ${index + 1}, currently ${slot.color}`}
              title={
                slot.date ? `Delivered: ${slot.date}` : `Slot ${index + 1}`
              }
            >
              <div
                className={`aspect-square w-full ${index === lastModifiedIndex ? 'animate-pulsate' : ''}`}
              >
                <Footprint color={slot.color} />
              </div>
              <div className='h-4 mt-1 flex items-center justify-center w-full'>
                {slot.date && (
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono text-stone-900 dark:text-stone-400/80 engraved-text whitespace-nowrap ${index === lastModifiedIndex ? 'font-bold' : ''}`}
                  >
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
      </div>

      {/* Board Stand Legs (Decorative) */}
      <div className='absolute -bottom-4 left-16 w-8 h-8 bg-[#b8956c] dark:bg-[#3d2b1f] rounded-b-xl z-0 shadow-lg'></div>
      <div className='absolute -bottom-4 right-16 w-8 h-8 bg-[#b8956c] dark:bg-[#3d2b1f] rounded-b-xl z-0 shadow-lg'></div>
    </div>
  );
};
