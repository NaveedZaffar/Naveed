
export const STANDARDS = {
  POWER_QUALITY: "IEEE 519-2022",
  AUDIT_LEVEL: "ASHRAE Level 2/3",
  MANAGEMENT: "ISO 50001"
};

export const THRESHOLDS = {
  THD_LIMIT: 5.0, // IEEE 519 limit for most LV systems
  PF_MIN: 0.90,
  VOLTAGE_UNBALANCE_MAX: 2.0 // %
};

export const MOCK_CHART_HISTORY_LENGTH = 30;
