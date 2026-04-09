export type SlotColor = 'empty' | 'pink' | 'blue';

export interface SlotData {
  color: SlotColor;
  date: string;
  id?: number;
}

export interface TrackerState {
  name: string;
  startYear: string;
  endYear: string;
  slots: SlotData[];
}
