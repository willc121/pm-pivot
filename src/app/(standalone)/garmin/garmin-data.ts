// ============================================================================
// GARMIN HEALTH DATA
// This file contains consolidated data from 10 years of Garmin tracking
// Update this file with your real data from garmin-consolidated.json
// ============================================================================

export interface VO2MaxEntry {
  date: string;
  value: number;
  sport: 'running' | 'cycling' | 'trail';
}

export interface SleepEntry {
  date: string;
  durationHours: number;
}

export interface ActivitySummary {
  type: string;
  count: number;
  totalDistanceKm: number;
  totalDurationHours: number;
  avgHeartRate?: number;
}

export interface RacePrediction {
  date: string;
  fiveK: string;
  tenK: string;
  halfMarathon: string;
  marathon: string;
}

export interface HeartRateZones {
  maxHR: number;
  lactateThreshold: number;
  zones: {
    zone1: { name: string; floor: number; ceiling: number };
    zone2: { name: string; floor: number; ceiling: number };
    zone3: { name: string; floor: number; ceiling: number };
    zone4: { name: string; floor: number; ceiling: number };
    zone5: { name: string; floor: number; ceiling: number };
  };
}

export interface GarminHealthData {
  meta: {
    dataStartDate: string;
    dataEndDate: string;
    totalActivities: number;
    totalDaysTracked: number;
    lastUpdated: string;
  };
  vo2Max: VO2MaxEntry[];
  sleepSummary: {
    avgDurationHours: number;
    totalNightsTracked: number;
    recentData: SleepEntry[];
  };
  activities: ActivitySummary[];
  racePredictions: RacePrediction[];
  heartRateZones: HeartRateZones;
  fitnessAge: {
    estimated: string;
    category: string;
    basedOnVO2Max: number;
  };
  insights: string[];
}

// ============================================================================
// YOUR GARMIN DATA - UPDATE WITH REAL VALUES FROM CONSOLIDATED FILE
// ============================================================================

export const garminData: GarminHealthData = {
  meta: {
    dataStartDate: "2015-11-15",
    dataEndDate: "2024-12-31",
    totalActivities: 419,
    totalDaysTracked: 3300,
    lastUpdated: "2024-12-31",
  },

  vo2Max: [
    // 2016 - Starting fitness journey
    { date: "2016-02-15", value: 46, sport: "running" },
    { date: "2016-02-17", value: 43, sport: "running" },
    { date: "2016-02-19", value: 46, sport: "running" },
    { date: "2016-02-21", value: 49, sport: "running" },
    { date: "2016-03-21", value: 50, sport: "running" },
    { date: "2016-04-03", value: 51, sport: "running" },
    { date: "2016-04-11", value: 51, sport: "running" },
    { date: "2016-04-29", value: 50, sport: "running" },
    { date: "2016-05-24", value: 52, sport: "running" },
    // 2023 - Return to peak fitness
    { date: "2023-07-09", value: 52, sport: "trail" },
    { date: "2023-07-17", value: 51, sport: "running" },
    { date: "2023-07-19", value: 50, sport: "trail" },
    { date: "2023-07-22", value: 49, sport: "trail" },
    { date: "2023-07-30", value: 49, sport: "trail" },
    { date: "2023-08-04", value: 50, sport: "trail" },
    { date: "2023-08-06", value: 50, sport: "trail" },
    { date: "2023-08-09", value: 52, sport: "trail" },
    { date: "2023-08-16", value: 54, sport: "running" },
    { date: "2023-08-29", value: 54, sport: "running" },
    { date: "2023-09-02", value: 54, sport: "trail" },
    { date: "2023-09-15", value: 54, sport: "running" },
    { date: "2023-09-26", value: 54, sport: "running" },
    { date: "2023-10-02", value: 55, sport: "running" },
    { date: "2023-10-08", value: 54, sport: "trail" },
  ],

  sleepSummary: {
    avgDurationHours: 7.8,
    totalNightsTracked: 2800,
    recentData: [
      { date: "2016-02-11", durationHours: 8.0 },
      { date: "2016-02-12", durationHours: 10.73 },
      { date: "2016-02-13", durationHours: 7.3 },
      { date: "2016-02-14", durationHours: 8.82 },
      { date: "2016-02-15", durationHours: 8.77 },
      { date: "2016-02-16", durationHours: 5.72 },
      { date: "2016-02-17", durationHours: 5.57 },
      { date: "2016-02-18", durationHours: 6.2 },
      { date: "2016-02-19", durationHours: 7.25 },
      { date: "2016-02-20", durationHours: 9.75 },
    ],
  },

  activities: [
    { type: "running", count: 156, totalDistanceKm: 1850, totalDurationHours: 245, avgHeartRate: 155 },
    { type: "cycling", count: 89, totalDistanceKm: 3200, totalDurationHours: 180, avgHeartRate: 138 },
    { type: "lap_swimming", count: 67, totalDistanceKm: 95, totalDurationHours: 85 },
    { type: "mountain_biking", count: 34, totalDistanceKm: 420, totalDurationHours: 75, avgHeartRate: 142 },
    { type: "virtual_ride", count: 45, totalDistanceKm: 890, totalDurationHours: 65, avgHeartRate: 135 },
    { type: "strength_training", count: 28, totalDistanceKm: 0, totalDurationHours: 22, avgHeartRate: 95 },
  ],

  racePredictions: [
    { date: "2022-12-20", fiveK: "22:22", tenK: "50:04", halfMarathon: "1:56:07", marathon: "4:17:53" },
    { date: "2023-01-04", fiveK: "22:36", tenK: "50:34", halfMarathon: "1:57:15", marathon: "4:20:21" },
    { date: "2023-02-06", fiveK: "23:01", tenK: "51:29", halfMarathon: "1:59:39", marathon: "4:25:30" },
    { date: "2023-03-20", fiveK: "23:25", tenK: "52:19", halfMarathon: "2:01:45", marathon: "4:29:24" },
  ],

  heartRateZones: {
    maxHR: 189,
    lactateThreshold: 173,
    zones: {
      zone1: { name: "Warm Up", floor: 95, ceiling: 112 },
      zone2: { name: "Easy", floor: 113, ceiling: 131 },
      zone3: { name: "Aerobic", floor: 132, ceiling: 150 },
      zone4: { name: "Threshold", floor: 151, ceiling: 169 },
      zone5: { name: "Maximum", floor: 170, ceiling: 189 },
    },
  },

  fitnessAge: {
    estimated: "25-30",
    category: "Excellent",
    basedOnVO2Max: 55,
  },

  insights: [
    "VO2 Max improved 19% from baseline (46 to 55) over tracking period",
    "Peak fitness achieved in October 2023 with VO2 Max of 55",
    "Most active in running (156 activities) followed by cycling (89)",
    "Average sleep duration of 7.8 hours per night",
    "Heart rate zones optimized with lactate threshold at 173 bpm",
    "Trail running shows slightly lower VO2 Max due to elevation",
    "Best 5K prediction: 22:22 (December 2022)",
    "Consistent multi-sport athlete: running, cycling, swimming, MTB",
  ],
};

// Helper function to format data for Claude API prompt
export function formatDataForPrompt(): string {
  return `
GARMIN HEALTH DATA FOR WILL CHUNG
==================================
Data Range: ${garminData.meta.dataStartDate} to ${garminData.meta.dataEndDate}
Total Activities: ${garminData.meta.totalActivities}
Days Tracked: ${garminData.meta.totalDaysTracked}

VO2 MAX PROGRESSION:
- Starting VO2 Max (Feb 2016): 46 ml/kg/min
- Peak VO2 Max (Oct 2023): 55 ml/kg/min  
- Improvement: +19%
- Current Fitness Category: ${garminData.fitnessAge.category}
- Estimated Fitness Age: ${garminData.fitnessAge.estimated}

RECENT VO2 MAX READINGS:
${garminData.vo2Max.slice(-10).map(v => `- ${v.date}: ${v.value} (${v.sport})`).join('\n')}

ACTIVITY BREAKDOWN:
${garminData.activities.map(a => `- ${a.type}: ${a.count} activities, ${a.totalDistanceKm}km, ${a.totalDurationHours}hrs`).join('\n')}

RACE PREDICTIONS (Best):
- 5K: ${garminData.racePredictions[0]?.fiveK}
- 10K: ${garminData.racePredictions[0]?.tenK}
- Half Marathon: ${garminData.racePredictions[0]?.halfMarathon}
- Marathon: ${garminData.racePredictions[0]?.marathon}

HEART RATE ZONES (Max HR: ${garminData.heartRateZones.maxHR}, LT: ${garminData.heartRateZones.lactateThreshold}):
- Zone 1 (Warm Up): ${garminData.heartRateZones.zones.zone1.floor}-${garminData.heartRateZones.zones.zone1.ceiling} bpm
- Zone 2 (Easy): ${garminData.heartRateZones.zones.zone2.floor}-${garminData.heartRateZones.zones.zone2.ceiling} bpm
- Zone 3 (Aerobic): ${garminData.heartRateZones.zones.zone3.floor}-${garminData.heartRateZones.zones.zone3.ceiling} bpm
- Zone 4 (Threshold): ${garminData.heartRateZones.zones.zone4.floor}-${garminData.heartRateZones.zones.zone4.ceiling} bpm
- Zone 5 (Maximum): ${garminData.heartRateZones.zones.zone5.floor}-${garminData.heartRateZones.zones.zone5.ceiling} bpm

SLEEP: Average ${garminData.sleepSummary.avgDurationHours} hours over ${garminData.sleepSummary.totalNightsTracked} nights

KEY INSIGHTS:
${garminData.insights.map(i => `- ${i}`).join('\n')}
`.trim();
}
