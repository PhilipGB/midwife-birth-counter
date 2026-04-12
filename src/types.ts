export type SlotColor = 'empty' | 'pink' | 'blue';

export type DeliveryType =
  | 'SVD'
  | 'Instrumental'
  | 'Caesarean'
  | 'WaterBirth'
  | 'Assisted';

export type ThemeMode = 'light' | 'dark';

export interface SlotData {
  color: SlotColor;
  date: string;
  id?: number;
  deliveryType?: DeliveryType;
  reflectivePractice?: string;
}

export interface TrackerState {
  name: string;
  startYear: string;
  endYear: string;
  slots: SlotData[];
  theme: ThemeMode;
}
