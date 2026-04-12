import { TrackerState } from '../types';

const STORAGE_KEY = 'midwife-tracker';

export const storageService = {
  save: (state: TrackerState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  load: (): TrackerState | null => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return null;

    try {
      const parsed = JSON.parse(savedData);

      // Basic validation and migration
      if (!parsed.name || !parsed.slots) {
        console.error('Invalid tracker data format found in storage');
        return null;
      }

      // Migrate old string-based slots to SlotData objects if necessary
      const migratedSlots = parsed.slots.map((s: any) =>
        typeof s === 'string' ? { color: s, date: '' } : s,
      );

      return {
        name: parsed.name,
        startYear: parsed.startYear || '2025',
        endYear: parsed.endYear || '2028',
        theme: parsed.theme || 'light',
        slots: migratedSlots,
      };
    } catch (e) {
      console.error('Failed to parse saved data', e);
      return null;
    }
  },
};
