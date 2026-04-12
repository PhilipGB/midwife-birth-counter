import { useState, useEffect, useMemo } from 'react';
import { SlotData, TrackerState, ThemeMode } from '../types';
import confetti from 'canvas-confetti';
import { storageService } from '../services/storage';
import { calculateBirthStats } from '../utils/birth-stats';

export function useBirthTracker() {
  const [name, setName] = useState('Enter Your Name Here');
  const [startYear, setStartYear] = useState('2025');
  const [endYear, setEndYear] = useState('2028');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [slots, setSlots] = useState<SlotData[]>(
    Array.from({ length: 40 }, () => ({ color: 'empty', date: '' })),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    const savedData = storageService.load();
    if (savedData) {
      setName(savedData.name);
      setStartYear(savedData.startYear);
      setEndYear(savedData.endYear);
      setTheme(savedData.theme);
      setSlots(savedData.slots);
    }
    setIsLoaded(true);
  }, []);

  // Sync to storage
  useEffect(() => {
    if (isLoaded) {
      storageService.save({ name, startYear, endYear, slots, theme });
    }
  }, [name, startYear, endYear, slots, theme, isLoaded]);

  // Computed Stats via Utility
  const stats = useMemo(() => calculateBirthStats(slots), [slots]);

  // Actions
  const updateSlot = (index: number, updates: Partial<SlotData>) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      const currentSlot = newSlots[index];
      const isNew =
        currentSlot.color === 'empty' &&
        !currentSlot.date &&
        (updates.color !== 'empty' || updates.date);

      newSlots[index] = {
        ...currentSlot,
        ...updates,
        id: isNew
          ? Math.max(0, ...prev.map((s) => s.id || 0)) + 1
          : currentSlot.id,
      };
      return newSlots;
    });
  };

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

  const exportBackup = () => {
    const data: TrackerState = { name, startYear, endYear, slots, theme };
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

  const importBackup = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      // Robust Validation
      if (!parsed.name || !Array.isArray(parsed.slots)) {
        throw new Error('Missing essential data: name or slots');
      }

      if (parsed.slots.length !== 40) {
        throw new Error('Backup must contain exactly 40 slots');
      }

      // Validate each slot
      const validatedSlots = parsed.slots.map((s: any, idx: number) => {
        if (typeof s !== 'object' || s === null) {
          throw new Error(`Slot ${idx + 1} is invalid`);
        }
        return {
          color: ['pink', 'blue', 'empty'].includes(s.color)
            ? s.color
            : 'empty',
          date: typeof s.date === 'string' ? s.date : '',
          deliveryType:
            typeof s.deliveryType === 'string' ? s.deliveryType : undefined,
          id: typeof s.id === 'number' ? s.id : undefined,
        };
      });

      return {
        success: true,
        data: {
          name: String(parsed.name),
          startYear: String(parsed.startYear || '2025'),
          endYear: String(parsed.endYear || '2028'),
          theme: ['light', 'dark'].includes(parsed.theme)
            ? parsed.theme
            : 'light',
          slots: validatedSlots,
        },
      };
    } catch (e) {
      return {
        success: false,
        error:
          e instanceof Error
            ? e.message
            : 'An unknown error occurred during import',
      };
    }
  };

  const resetBoard = () => {
    setSlots(Array.from({ length: 40 }, () => ({ color: 'empty', date: '' })));
  };

  const setSlotsBulk = (newSlots: SlotData[]) => {
    if (newSlots.length === 40) {
      setSlots(newSlots);
    }
  };

  return {
    state: {
      name,
      startYear,
      endYear,
      slots,
      theme,
      ...stats,
    },
    actions: {
      setName,
      setStartYear,
      setEndYear,
      setTheme,
      updateSlot,
      setSlotsBulk,
      triggerCelebration,
      exportBackup,
      importBackup,
      resetBoard,
    },
  };
}
