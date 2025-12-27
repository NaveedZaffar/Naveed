
import { EnergyReading } from '../types';

export const generateReading = (previous?: EnergyReading): EnergyReading => {
  const basePower = previous?.activePower || 45;
  const drift = (Math.random() - 0.5) * 4;
  
  return {
    timestamp: Date.now(),
    activePower: Math.max(10, Math.min(150, basePower + drift)),
    reactivePower: 5 + Math.random() * 5,
    voltage: [
      228 + Math.random() * 4,
      228 + Math.random() * 4,
      228 + Math.random() * 4
    ],
    current: [
      12 + Math.random() * 2,
      12 + Math.random() * 2,
      12 + Math.random() * 2
    ],
    powerFactor: 0.88 + Math.random() * 0.1,
    thd: 2.5 + Math.random() * 3.5
  };
};

export const calculateROI = (cost: number, savings: number, rate: number, years: number) => {
  let npv = 0;
  const discountRate = rate / 100;
  
  for (let t = 1; t <= years; t++) {
    npv += savings / Math.pow(1 + discountRate, t);
  }
  npv -= cost;

  const totalSavings = savings * years;
  const netProfit = totalSavings - cost;
  const roi = (netProfit / cost) * 100;
  const payback = cost / savings;

  return { npv, roi, payback };
};
