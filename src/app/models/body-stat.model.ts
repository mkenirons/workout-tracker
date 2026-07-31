export interface BodyStatEntry {
  id: string;
  date: string;
  weightKg: number | null;
  bodyFatPct: number | null;
  steps?: number | null;
  proteinG?: number | null;
  calories?: number | null;
  notes?: string;
}

export interface BodyGoal {
  heightCm: number;
  startWeightKg: number;
  targetWeightKg: number;
  targetBodyFatLowPct: number;
  targetBodyFatHighPct: number;
  label: string;
}
