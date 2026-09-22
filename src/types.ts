export type RiskLevel = 'Low' | 'Medium' | 'High';

export type EngineCondition = 'Good' | 'Moderate' | 'Poor' | 'Critical';
export type BatteryCondition = 'Good' | 'Moderate' | 'Weak';
export type TyreCondition = 'Good' | 'Fair' | 'Worn' | 'Uneven';
export type OilCondition = 'Clean' | 'Degraded' | 'Low';

export interface VehicleData {
  id: string;
  vehicleNumber: string;
  vehicleModel: string;
  vehicleAge: number; // in years
  currentMileage: number; // in km
  lastServiceMileage: number; // in km
  daysSinceLastService: number; // in days
  lastServiceDate: string; // YYYY-MM-DD
  engineCondition: EngineCondition;
  batteryCondition: BatteryCondition;
  tyreCondition: TyreCondition;
  oilCondition: OilCondition;
}

export interface PredictionItem {
  id: string;
  name: 'Engine Service' | 'Oil Change' | 'Battery Check' | 'Tyre Replacement/Check' | 'Brake Inspection' | 'General Service';
  riskLevel: RiskLevel;
  healthScore: number; // 0 to 100% (100% = brand new, 0% = fail)
  estimatedDueKm: number; // positive = km remaining, negative = overdue km
  estimatedDueDays: number; // positive = days remaining, negative = overdue days
  reason: string;
  recommendedAction: string;
  urgent: boolean;
  score: number; // internal risk score 0 - 100
}

export interface FeatureContribution {
  featureName: string;
  weight: number;
  inputObserved: string;
  riskPointsAdded: number;
  description: string;
}

export interface PredictionSummary {
  vehicleId: string;
  overallHealthScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  nextPredictedService: {
    serviceName: string;
    dueInKm: number;
    dueInDays: number;
    isOverdue: boolean;
  };
  predictions: PredictionItem[];
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  explanation: {
    decisionSummary: string;
    totalRiskScore: number;
    ruleTriggers: string[];
    contributions: FeatureContribution[];
  };
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  serviceType: string;
  cost: number;
  technician: string;
  status: 'Completed' | 'Scheduled' | 'Pending';
  notes: string;
}
