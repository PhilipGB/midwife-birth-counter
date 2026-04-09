import { useState, useEffect, useMemo } from 'react';
import { SlotData, TrackerState } from '../types';
import confetti from 'canvas-confetti';

export function useBirthTracker() {
  const [name, setName] = useState('Enter Your Name Here');
  const [startYear, setStartYear] = useState('2025');
  const [endYear, setEndYear] = useState('2028');
  const [slots, setSlots] = useState<SlotData[]>(
    Array.from({ length: 40 }, () => ({ color: 'empty', date: '' })),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('midwife-tracker');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.name) setName(parsed.name);
        if (parsed.startYear) setStartYear(parsed.startYear);
        if (parsed.endYear) setEndYear(parsed.endYear);

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

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        'midwife-tracker',
        JSON.stringify({ name, startYear, endYear, slots }),
      );
    }
  }, [name, startYear, endYear, slots, isLoaded]);

  // Computed Stats
  const pinkCount = useMemo(
    () => slots.filter((s) => s.color === 'pink').length,
    [slots],
  );
  const blueCount = useMemo(
    () => slots.filter((s) => s.color === 'blue').length,
    [slots],
  );
  const totalCount = pinkCount + blueCount;

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    slots.forEach((s) => {
      if (s.deliveryType) {
        counts[s.deliveryType] = (counts[s.deliveryType] || 0) + 1;
      }
    });
    return counts;
  }, [slots]);

  const sortedSlots = useMemo(() => {
    return [...slots]
      .map((slot, index) => ({ slot, index }))
      .sort((a, b) => {
        const sA = a.slot;
        const sB = b.slot;
        if (sA.date && sB.date) {
          const dateComp = sA.date.localeCompare(sB.date);
          if (dateComp !== 0) return dateComp;
          return (sA.id || 0) - (sB.id || 0);
        }
        if (sA.date) return -1;
        if (sB.date) return 1;
        if (sA.color !== 'empty' && sB.color === 'empty') return -1;
        if (sA.color === 'empty' && sB.color !== 'empty') return 1;
        return 0;
      });
  }, [slots]);

  const predictedDate = useMemo(() => {
    if (totalCount >= 40) return 'Goal reached!';

    const datedSlots = slots
      .filter((s) => s.date)
      .map((s) => new Date(s.date))
      .sort((a, b) => a.getTime() - b.getTime());

    if (datedSlots.length < 2) return null;

    const firstBirth = datedSlots[0];
    const lastBirth = datedSlots[datedSlots.length - 1];
    const timeDiff = lastBirth.getTime() - firstBirth.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    const avgDaysPerBirth = daysDiff / (datedSlots.length - 1);

    const remainingBirths = 40 - totalCount;
    const estimatedDaysRemaining = remainingBirths * avgDaysPerBirth;
    const predictedDate = new Date(
      lastBirth.getTime() + estimatedDaysRemaining * 1000 * 60 * 60 * 24,
    );

    return predictedDate.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  }, [slots, totalCount]);

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
    const data: TrackerState = { name, startYear, endYear, slots };
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
      totalCount,
      pinkCount,
      blueCount,
      typeCounts,
      sortedSlots,
      predictedDate,
    },
    actions: {
      setName,
      setStartYear,
      setEndYear,
      updateSlot,
      setSlotsBulk,
      triggerCelebration,
      exportBackup,
      resetBoard,
    },
  };
}
