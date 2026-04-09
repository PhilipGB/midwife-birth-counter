import { useEffect, useState } from 'react';
import { SlotColor, SlotData } from '../types';

interface DeliveryModalProps {
  slot: SlotData;
  index: number;
  onClose: () => void;
  onUpdate: (updates: Partial<SlotData>) => void;
  onClear: () => void;
}

export const DeliveryModal = ({
  slot,
  index,
  onClose,
  onUpdate,
  onClear,
}: DeliveryModalProps) => {
  const [localDate, setLocalDate] = useState(slot.date);
  const [localColor, setLocalColor] = useState<SlotColor>(slot.color);

  useEffect(() => {
    setLocalDate(slot.date);
    setLocalColor(slot.color);
  }, [slot]);

  const handleSave = () => {
    onUpdate({ date: localDate, color: localColor });
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-2xl font-bold text-stone-800'>Record Delivery</h3>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2'>
              Delivery Date
            </label>
            <div className='flex gap-2'>
              <input
                type='date'
                value={localDate}
                onChange={(e) => setLocalDate(e.target.value)}
                className='flex-1 p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-stone-200 transition-all text-stone-800 font-mono'
              />
              <button
                onClick={() =>
                  setLocalDate(new Date().toISOString().split('T')[0])
                }
                className='px-4 py-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 text-sm font-semibold transition-colors whitespace-nowrap'
              >
                Today
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3'>
              Gender / Color
            </label>
            <div className='grid grid-cols-2 gap-3'>
              {(['pink', 'blue'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setLocalColor(color)}
                  className={`py-3 px-2 rounded-xl border-2 transition-all capitalize font-semibold text-sm ${
                    localColor === color
                      ? color === 'pink'
                        ? 'border-pink-400 bg-pink-50 text-pink-600'
                        : 'border-blue-400 bg-blue-50 text-blue-600'
                      : 'border-stone-100 bg-white text-stone-400 hover:border-stone-200'
                  }`}
                >
                  {color === 'pink' ? 'Girl' : 'Boy'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-8 flex gap-3'>
          <button
            onClick={onClear}
            className='flex-1 py-3 rounded-xl text-red-500 hover:bg-red-50 font-semibold transition-colors'
          >
            Clear Slot
          </button>
          <button
            onClick={onClose}
            className='flex-1 py-3 rounded-xl text-stone-500 hover:bg-stone-100 font-semibold transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='flex-1 py-3 rounded-xl bg-stone-800 text-white hover:bg-stone-700 font-semibold shadow-lg transition-all active:scale-95'
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};
