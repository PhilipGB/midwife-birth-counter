import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlotColor, SlotData, DeliveryType } from '../types';

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
  const [localType, setLocalType] = useState<DeliveryType | undefined>(
    slot.deliveryType,
  );
  const [localReflectivePractice, setLocalReflectivePractice] = useState(
    slot.reflectivePractice || '',
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalDate(slot.date);
    setLocalColor(slot.color);
    setLocalType(slot.deliveryType);
    setLocalReflectivePractice(slot.reflectivePractice || '');
  }, [slot]);

  const handleSave = () => {
    onUpdate({
      date: localDate,
      color: localColor,
      deliveryType: localType,
      reflectivePractice: localReflectivePractice,
    });
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-panel-bg rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-panel-border animate-in zoom-in-95 duration-200'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-2xl font-bold text-text-main'>Record Delivery</h3>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-panel-border text-text-muted hover:text-text-main transition-colors'
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
            <label className='block text-sm font-semibold text-text-muted uppercase tracking-wider mb-2'>
              Delivery Date
            </label>
            <div className='flex gap-2'>
              <input
                type='date'
                value={localDate}
                onChange={(e) => setLocalDate(e.target.value)}
                className='flex-1 p-3 rounded-xl border border-panel-border outline-none focus:ring-2 focus:ring-panel-border transition-all text-text-main font-mono'
              />
              <button
                onClick={() =>
                  setLocalDate(new Date().toISOString().split('T')[0])
                }
                className='px-4 py-2 rounded-xl bg-panel-border text-text-muted hover:bg-panel-border/80 text-sm font-semibold transition-colors whitespace-nowrap'
              >
                Today
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-text-muted uppercase tracking-wider mb-2'>
              Delivery Type (Optional)
            </label>
            <select
              value={localType || ''}
              onChange={(e) =>
                setLocalType((e.target.value as DeliveryType) || undefined)
              }
              className='w-full p-3 rounded-xl border border-panel-border outline-none focus:ring-2 focus:ring-panel-border transition-all text-text-main font-medium bg-panel-bg'
            >
              <option value='' disabled>
                Select delivery type...
              </option>
              <option value='SVD'>Spontaneous Vaginal Delivery (SVD)</option>
              <option value='Instrumental'>
                Instrumental (Forceps/Ventouse)
              </option>
              <option value='Caesarean'>Caesarean Section</option>
              <option value='WaterBirth'>Water Birth</option>
              <option value='Assisted'>Assisted Delivery</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-semibold text-text-muted uppercase tracking-wider mb-3'>
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
                        ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/30 text-pink-400 dark:text-pink-400'
                        : 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-400 dark:text-blue-400'
                      : 'border-panel-border bg-panel-bg text-text-muted hover:border-panel-border'
                  }`}
                >
                  {color === 'pink' ? 'Girl' : 'Boy'}
                </button>
              ))}
            </div>
          </div>

          <div className='pt-2'>
            <button
              type='button'
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center justify-between w-full p-3 rounded-xl transition-all text-sm font-semibold ${
                isExpanded
                  ? 'bg-panel-border text-text-main'
                  : 'text-text-muted hover:bg-panel-border/50 hover:text-text-main'
              }`}
            >
              <span>Reflective Practice (Optional)</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className='overflow-hidden'
                >
                  <div className='pt-3'>
                    <textarea
                      value={localReflectivePractice}
                      onChange={(e) =>
                        setLocalReflectivePractice(e.target.value)
                      }
                      placeholder='Record your reflections here...'
                      className='w-full p-3 rounded-xl border border-panel-border outline-none focus:ring-2 focus:ring-panel-border transition-all text-text-main font-medium min-h-25 resize-none'
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className='mt-8 flex gap-3'>
          <button
            onClick={onClear}
            className='flex-1 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition-colors'
          >
            Clear Slot
          </button>
          <button
            onClick={onClose}
            className='flex-1 py-3 rounded-xl text-text-muted hover:bg-panel-border font-semibold transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='flex-1 py-3 rounded-xl bg-text-main text-app-bg hover:opacity-90 font-semibold shadow-lg transition-all active:scale-95'
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};
