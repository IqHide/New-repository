export interface FilterPreset {
  id: string;
  name: string;
  userId: string;
  brand: string | null;
  onlyWithPhoto: boolean;
  accelerationMin: number;
  accelerationMax: number;
  quarterMileMin: number;
  quarterMileMax: number;
  nurburgringMin: number;
  nurburgringMax: number;
  createdAt: string;
}

export interface CreatePresetDto {
  name: string;
  brand: string | null;
  onlyWithPhoto: boolean;
  accelerationMin: number;
  accelerationMax: number;
  quarterMileMin: number;
  quarterMileMax: number;
  nurburgringMin: number;
  nurburgringMax: number;
}
