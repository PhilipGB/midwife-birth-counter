interface ClearSlotConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearSlotConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
}: ClearSlotConfirmationProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-panel-bg rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-panel-border animate-in zoom-in-95 duration-200'>
        <div className='text-center mb-6'>
          <div className='w-16 h-16 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-bold text-text-main'>
            Clear this slot?
          </h3>
          <p className='text-text-muted mt-2'>
            Are you sure you want to remove this delivery record? This action
            cannot be undone.
          </p>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 py-3 rounded-xl text-text-muted hover:bg-panel-border font-semibold transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 font-semibold shadow-lg transition-all active:scale-95'
          >
            Clear Slot
          </button>
        </div>
      </div>
    </div>
  );
};
