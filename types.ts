
export interface EnergyReading {
  timestamp: number;
  activePower: number; // kW
  reactivePower: number; // kVAR
  voltage: [number, number, number]; // Phases L1, L2, L3
  current: [number, number, number]; // Phases L1, L2, L3
  powerFactor: number;
  thd: number; // %
}

export interface AuditMetrics {
  npv: number;
  roi: number;
  payback: number;
}

export interface OptimizationInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  potentialSavings: string;
}

export interface SearchResult {
  text: string;
  sources?: any[];
}
