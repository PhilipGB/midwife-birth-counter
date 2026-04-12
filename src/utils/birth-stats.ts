import { SlotData } from '../types';

export interface BirthStats {
  pinkCount: number;
  blueCount: number;
  totalCount: number;
  typeCounts: Record<string, number>;
  sortedSlots: { slot: SlotData; index: number }[];
  predictedDate: string | null;
}

export function calculateBirthStats(slots: SlotData[]): BirthStats {
  const pinkCount = slots.filter((s) => s.color === 'pink').length;
  const blueCount = slots.filter((s) => s.color === 'blue').length;
  const totalCount = pinkCount + blueCount;

  const typeCounts: Record<string, number> = {};
  slots.forEach((s) => {
    if (s.deliveryType) {
      typeCounts[s.deliveryType] = (typeCounts[s.deliveryType] || 0) + 1;
    }
  });

  const sortedSlots = [...slots]
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

  let predictedDate: string | null = null;
  if (totalCount < 40) {
    const datedSlots = slots
      .filter((s) => s.date)
      .map((s) => new Date(s.date))
      .sort((a, b) => a.getTime() - b.getTime());

    if (datedSlots.length >= 2) {
      const firstBirth = datedSlots[0];
      const lastBirth = datedSlots[datedSlots.length - 1];
      const timeDiff = lastBirth.getTime() - firstBirth.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      const avgDaysPerBirth = daysDiff / (datedSlots.length - 1);

      const remainingBirths = 40 - totalCount;
      const estimatedDaysRemaining = remainingBirths * avgDaysPerBirth;
      const predDate = new Date(
        lastBirth.getTime() + estimatedDaysRemaining * 1000 * 60 * 60 * 24,
      );

      predictedDate = predDate.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      });
    }
  } else {
    predictedDate = 'Goal reached!';
  }

  return {
    pinkCount,
    blueCount,
    totalCount,
    typeCounts,
    sortedSlots,
    predictedDate,
  };
}
