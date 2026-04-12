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
    <div className='w-full max-w-sm bg-panel-bg rounded-3xl p-8 shadow-xl border border-panel-border flex flex-col gap-8 sticky top-12 transition-colors duration-300'>
      <div>
        <h2 className='text-xl font-bold text-text-main mb-2'>
          Delivery Progress
        </h2>
        <p className='text-text-muted text-sm'>
          Click the footprints on the board to record a delivery date and choose
          a color.
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='mb-2'>
          <div className='w-full h-3 bg-panel-border rounded-full overflow-hidden border border-panel-border'>
            <div
              className='h-full bg-linear-to-r from-pink-300 via-stone-300 to-blue-300 transition-all duration-700 ease-out'
              style={{ width: `${(totalCount / 40) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className='flex justify-between items-end pb-4 border-b border-panel-border'>
          <span className='text-text-muted font-medium'>Total Deliveries</span>
          <span className='text-4xl font-bold text-text-main'>
            {totalCount}{' '}
            <span className='text-text-muted opacity-60 text-xl font-normal'>
              / 40
            </span>
          </span>
        </div>
        {predictedDate && (
          <div className='flex justify-between items-center py-4 border-b border-panel-border gap-2'>
            <span className='text-text-muted font-medium'>
              Predicted Completion
            </span>
            <span className='text-sm font-semibold text-text-main text-right'>
              {predictedDate}
            </span>
          </div>
        )}

        <div className='flex gap-4 pt-2'>
          <div className='flex-1 bg-pink-50/50 dark:bg-pink-900/20 rounded-2xl p-4 flex flex-col items-center border border-pink-100 dark:border-pink-900/30'>
            <span className='text-pink-400 dark:text-pink-300 text-sm font-semibold mb-1 uppercase tracking-wider'>
              Girls
            </span>
            <span className='text-3xl font-bold text-pink-400 dark:text-pink-400'>
              {pinkCount}
            </span>
          </div>
          <div className='flex-1 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-4 flex flex-col items-center border border-blue-100 dark:border-blue-900/30'>
            <span className='text-blue-400 dark:text-blue-300 text-sm font-semibold mb-1 uppercase tracking-wider'>
              Boys
            </span>
            <span className='text-3xl font-bold text-blue-400 dark:text-blue-400'>
              {blueCount}
            </span>
          </div>
        </div>

        <div className='mt-6 p-4 bg-panel-border/50 rounded-2xl border border-panel-border'>
          <h3 className='text-xs font-bold text-text-muted uppercase tracking-widest mb-3'>
            Delivery Type Breakdown
          </h3>
          <div className='space-y-2'>
            {Object.entries(typeCounts).length > 0 ? (
              Object.entries(typeCounts).map(([type, count]) => (
                <div
                  key={type}
                  className='flex justify-between items-center text-sm'
                >
                  <span className='text-text-muted font-medium'>
                    {DELIVERY_TYPE_LABELS[type] || type}
                  </span>
                  <span className='text-text-main font-bold'>{count}</span>
                </div>
              ))
            ) : (
              <p className='text-text-muted text-xs italic'>
                No types recorded yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='flex gap-3 mt-4'>
        <button
          onClick={exportBackup}
          className='flex-1 py-3 rounded-xl text-text-muted hover:bg-panel-border hover:text-text-main transition-colors font-semibold text-xs border border-panel-border'
        >
          Export Backup
        </button>
        <label className='flex-1 py-3 rounded-xl text-text-muted hover:bg-panel-border hover:text-text-main transition-colors font-semibold text-xs border border-panel-border text-center cursor-pointer'>
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
        className='mt-4 w-full py-4 rounded-xl text-text-muted hover:bg-panel-border hover:text-text-main transition-colors font-semibold text-sm border border-panel-border'
      >
        Reset Board
      </button>
    </div>
  );
};
