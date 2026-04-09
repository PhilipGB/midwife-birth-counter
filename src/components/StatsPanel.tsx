import React from 'react';

interface StatsPanelProps {
  totalCount: number;
  pinkCount: number;
  blueCount: number;
  typeCounts: Record<string, number>;
  predictedDate: string | null;
  exportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetBoard: () => void;
}

const DELIVERY_TYPE_LABELS: Record<string, string> = {
  SVD: 'Spontaneous Vaginal Delivery (SVD)',
  Instrumental: 'Instrumental (Forceps/Ventouse)',
  Caesarean: 'Caesarean Section',
  WaterBirth: 'Water Birth',
  Assisted: 'Assisted Delivery',
};

export const StatsPanel = ({
  totalCount,
  pinkCount,
  blueCount,
  typeCounts,
  predictedDate,
  exportBackup,
  onImportBackup,
  onResetBoard,
}: StatsPanelProps) => {
  return (
    <div className='w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-stone-100 flex flex-col gap-8 sticky top-12'>
      <div>
        <h2 className='text-xl font-bold text-stone-800 mb-2'>
          Delivery Progress
        </h2>
        <p className='text-stone-500 text-sm'>
          Click the footprints on the board to record a delivery date and choose
          a color.
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='mb-2'>
          <div className='w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200'>
            <div
              className='h-full bg-linear-to-r from-pink-300 via-stone-300 to-blue-300 transition-all duration-700 ease-out'
              style={{ width: `${(totalCount / 40) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className='flex justify-between items-end pb-4 border-b border-stone-100'>
          <span className='text-stone-500 font-medium'>Total Deliveries</span>
          <span className='text-4xl font-bold text-stone-800'>
            {totalCount}{' '}
            <span className='text-stone-400 text-xl font-normal'>/ 40</span>
          </span>
        </div>
        {predictedDate && (
          <div className='flex justify-between items-center py-4 border-b border-stone-100 gap-2'>
            <span className='text-stone-500 font-medium'>
              Predicted Completion
            </span>
            <span className='text-sm font-semibold text-stone-800 text-right'>
              {predictedDate}
            </span>
          </div>
        )}

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

        <div className='mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-100'>
          <h3 className='text-xs font-bold text-stone-400 uppercase tracking-widest mb-3'>
            Delivery Type Breakdown
          </h3>
          <div className='space-y-2'>
            {Object.entries(typeCounts).length > 0 ? (
              Object.entries(typeCounts).map(([type, count]) => (
                <div
                  key={type}
                  className='flex justify-between items-center text-sm'
                >
                  <span className='text-stone-600 font-medium'>
                    {DELIVERY_TYPE_LABELS[type] || type}
                  </span>
                  <span className='text-stone-800 font-bold'>{count}</span>
                </div>
              ))
            ) : (
              <p className='text-stone-400 text-xs italic'>
                No types recorded yet
              </p>
            )}
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
            onChange={onImportBackup}
          />
        </label>
      </div>
      <button
        onClick={onResetBoard}
        className='mt-4 w-full py-4 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors font-semibold text-sm border border-stone-200'
      >
        Reset Board
      </button>
    </div>
  );
};
