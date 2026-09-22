/**
 * AI Vehicle Maintenance Prediction Engine
 * 
 * College AI Immersion Project - Expert System / Heuristic Rule-Based Prediction Algorithm
 * 
 * How it works:
 * 1. Feature Extraction: Extracts dynamic operational features (Mileage Delta, Elapsed Days, Sensor Conditions, Age Factor).
 * 2. Component Wear Scoring: Computes a multi-factor wear score (0 - 100) for each vital subsystem.
 * 3. Decision Boundary Classification:
 *    - Score < 35: LOW RISK (Component healthy, routine monitoring)
 *    - Score 35 - 65: MEDIUM RISK (Maintenance advised soon, minor wear detected)
 *    - Score > 65: HIGH RISK (Urgent attention / Overdue service required)
 * 4. Interval Estimation: Projects remaining safe kilometers and days until critical failure threshold.
 * 5. Explainable AI (XAI) Contribution: Calculates individual feature contributions to explain why predictions were triggered.
 */

import {
  VehicleData,
  PredictionItem,
  PredictionSummary,
  RiskLevel,
  FeatureContribution
} from '../types';

// Standard OEM Automotive Benchmark Thresholds
export const OEM_THRESHOLDS = {
  OIL_CHANGE_KM: 8000,
  OIL_CHANGE_DAYS: 180, // ~6 months
  GENERAL_SERVICE_KM: 10000,
  GENERAL_SERVICE_DAYS: 365, // 1 year
  TYRE_INSPECTION_KM: 15000,
  BRAKE_INSPECTION_KM: 12000,
  ENGINE_MAJOR_KM: 20000,
  BATTERY_LIFESPAN_YEARS: 3.5,
};

/**
 * Predicts vehicle maintenance status based on vehicle telemetry & physical conditions.
 */
export function predictVehicleMaintenance(vehicle: VehicleData): PredictionSummary {
  // --- 1. FEATURE EXTRACTION & METRIC CALCULATION ---
  const distanceSinceLastService = Math.max(0, vehicle.currentMileage - vehicle.lastServiceMileage);
  const daysSinceLastService = Math.max(0, vehicle.daysSinceLastService);
  const vehicleAge = Math.max(0, vehicle.vehicleAge);

  const ruleTriggers: string[] = [];
  const contributions: FeatureContribution[] = [];

  // ==========================================
  // COMPONENT 1: OIL CHANGE PREDICTION
  // ==========================================
  // Factors: Distance since last service, elapsed days, visual oil condition
  let oilScore = 0;
  const oilKmRatio = distanceSinceLastService / OEM_THRESHOLDS.OIL_CHANGE_KM;
  const oilDaysRatio = daysSinceLastService / OEM_THRESHOLDS.OIL_CHANGE_DAYS;
  
  // Baseline wear from usage
  oilScore += Math.min(50, oilKmRatio * 40);
  oilScore += Math.min(30, oilDaysRatio * 20);

  // Condition multiplier
  if (vehicle.oilCondition === 'Low') {
    oilScore += 50;
    ruleTriggers.push('Oil level is critically Low / Sludgy (+50 risk points)');
    contributions.push({
      featureName: 'Oil Condition (Low)',
      weight: 0.45,
      inputObserved: 'Low / Sludgy',
      riskPointsAdded: 50,
      description: 'Severe oil degradation accelerates thermal breakdown and piston friction.'
    });
  } else if (vehicle.oilCondition === 'Degraded') {
    oilScore += 30;
    ruleTriggers.push('Engine oil shows chemical breakdown / dark oxidation (+30 risk points)');
    contributions.push({
      featureName: 'Oil Condition (Degraded)',
      weight: 0.35,
      inputObserved: 'Degraded / Dark',
      riskPointsAdded: 30,
      description: 'Oxidized oil loses lubricity and viscosity protection.'
    });
  } else {
    contributions.push({
      featureName: 'Oil Condition (Clean)',
      weight: 0.1,
      inputObserved: 'Clean / Amber',
      riskPointsAdded: 0,
      description: 'Clean lubricating oil with normal thermal viscosity.'
    });
  }

  oilScore = Math.min(100, Math.round(oilScore));
  const oilRisk: RiskLevel = oilScore > 65 ? 'High' : oilScore >= 35 ? 'Medium' : 'Low';
  const remainingOilKm = OEM_THRESHOLDS.OIL_CHANGE_KM - distanceSinceLastService;
  const remainingOilDays = OEM_THRESHOLDS.OIL_CHANGE_DAYS - daysSinceLastService;

  const oilItem: PredictionItem = {
    id: 'pred-oil',
    name: 'Oil Change',
    riskLevel: oilRisk,
    healthScore: Math.max(0, 100 - oilScore),
    estimatedDueKm: remainingOilKm,
    estimatedDueDays: remainingOilDays,
    urgent: remainingOilKm <= 500 || remainingOilDays <= 15 || vehicle.oilCondition === 'Low',
    reason: remainingOilKm <= 0 
      ? `Exceeded scheduled oil interval by ${Math.abs(remainingOilKm).toLocaleString()} km with ${vehicle.oilCondition} oil condition.`
      : `Driven ${distanceSinceLastService.toLocaleString()} km since last service with ${vehicle.oilCondition.toLowerCase()} oil quality.`,
    recommendedAction: oilRisk === 'High'
      ? 'Perform immediate full synthetic oil and filter replacement to prevent valve train wear.'
      : oilRisk === 'Medium'
      ? 'Schedule engine oil and oil filter change within the next 2-3 weeks.'
      : 'Oil condition satisfactory. Inspect oil dipstick level during routine weekly checks.',
    score: oilScore
  };

  // ==========================================
  // COMPONENT 2: ENGINE SERVICE PREDICTION
  // ==========================================
  // Factors: Engine condition sensor, vehicle age, mileage delta, oil correlation
  let engineScore = 0;
  const engineKmRatio = distanceSinceLastService / OEM_THRESHOLDS.ENGINE_MAJOR_KM;
  engineScore += Math.min(30, engineKmRatio * 30);
  engineScore += Math.min(20, vehicleAge * 3.5); // Age wear penalty

  if (vehicle.engineCondition === 'Critical') {
    engineScore += 65;
    ruleTriggers.push('Engine diagnostics detected Critical anomaly / knocking (+65 risk points)');
    contributions.push({
      featureName: 'Engine Sensor Condition',
      weight: 0.50,
      inputObserved: 'Critical',
      riskPointsAdded: 65,
      description: 'Severe combustion misfire, abnormal vibration, or sensor check fault.'
    });
  } else if (vehicle.engineCondition === 'Poor') {
    engineScore += 45;
    ruleTriggers.push('Engine performance noted as Poor with reduced compression/rough idle (+45 risk points)');
    contributions.push({
      featureName: 'Engine Sensor Condition',
      weight: 0.40,
      inputObserved: 'Poor',
      riskPointsAdded: 45,
      description: 'Irregular combustion cycle and elevated operating temperature.'
    });
  } else if (vehicle.engineCondition === 'Moderate') {
    engineScore += 20;
    contributions.push({
      featureName: 'Engine Sensor Condition',
      weight: 0.20,
      inputObserved: 'Moderate',
      riskPointsAdded: 20,
      description: 'Minor timing drift or fuel injector deposit buildup.'
    });
  }

  // Cross-component impact: Bad oil wears engine faster
  if (vehicle.oilCondition === 'Low') {
    engineScore += 15;
  }

  engineScore = Math.min(100, Math.round(engineScore));
  const engineRisk: RiskLevel = engineScore > 65 ? 'High' : engineScore >= 35 ? 'Medium' : 'Low';
  const remainingEngineKm = OEM_THRESHOLDS.ENGINE_MAJOR_KM - distanceSinceLastService;
  const remainingEngineDays = 365 - daysSinceLastService;

  const engineItem: PredictionItem = {
    id: 'pred-engine',
    name: 'Engine Service',
    riskLevel: engineRisk,
    healthScore: Math.max(0, 100 - engineScore),
    estimatedDueKm: remainingEngineKm,
    estimatedDueDays: remainingEngineDays,
    urgent: engineRisk === 'High' || remainingEngineKm <= 1000,
    reason: vehicle.engineCondition === 'Critical' || vehicle.engineCondition === 'Poor'
      ? `Sensor telemetry indicates ${vehicle.engineCondition} engine diagnostics with ${vehicleAge} years powertrain age.`
      : `Powertrain operating with ${vehicle.engineCondition.toLowerCase()} integrity; ${distanceSinceLastService.toLocaleString()} km logged.`,
    recommendedAction: engineRisk === 'High'
      ? 'Perform full computer OBD-II diagnostic scan, compression check, and spark plug/injector inspection immediately.'
      : engineRisk === 'Medium'
      ? 'Clean throttle body, inspect air filter intake, and monitor coolant level on next service.'
      : 'Engine powertrain parameters within nominal operating limits.',
    score: engineScore
  };

  // ==========================================
  // COMPONENT 3: BATTERY CHECK PREDICTION
  // ==========================================
  // Factors: Battery physical state, vehicle age (electro-chemical decay over years)
  let batteryScore = 0;
  const batteryAgeRatio = vehicleAge / OEM_THRESHOLDS.BATTERY_LIFESPAN_YEARS;
  batteryScore += Math.min(45, batteryAgeRatio * 40);

  if (vehicle.batteryCondition === 'Weak') {
    batteryScore += 55;
    ruleTriggers.push('Battery terminal voltage drops below threshold (<12.2V) (+55 risk points)');
    contributions.push({
      featureName: 'Battery Voltage Condition',
      weight: 0.40,
      inputObserved: 'Weak (<12.2V)',
      riskPointsAdded: 55,
      description: 'Internal lead-acid sulfation or low cell charge leading to starting failure risk.'
    });
  } else if (vehicle.batteryCondition === 'Moderate') {
    batteryScore += 25;
    ruleTriggers.push('Battery shows moderate cranking attenuation (+25 risk points)');
    contributions.push({
      featureName: 'Battery Voltage Condition',
      weight: 0.25,
      inputObserved: 'Moderate (12.2V - 12.5V)',
      riskPointsAdded: 25,
      description: 'Marginal cold-cranking amp output under load.'
    });
  } else {
    contributions.push({
      featureName: 'Battery Voltage Condition',
      weight: 0.10,
      inputObserved: 'Good (12.6V+)',
      riskPointsAdded: 0,
      description: 'Optimal electrolyte balance and resting terminal voltage.'
    });
  }

  // Older cars drain batteries through parasitic draws
  if (daysSinceLastService > 250) {
    batteryScore += 10;
  }

  batteryScore = Math.min(100, Math.round(batteryScore));
  const batteryRisk: RiskLevel = batteryScore > 65 ? 'High' : batteryScore >= 35 ? 'Medium' : 'Low';
  // Batteries fail mostly by time rather than mileage
  const estimatedBatteryDays = vehicle.batteryCondition === 'Weak' ? 7 : vehicle.batteryCondition === 'Moderate' ? 45 : 180;
  const estimatedBatteryKm = estimatedBatteryDays * 35; // typical daily average

  const batteryItem: PredictionItem = {
    id: 'pred-battery',
    name: 'Battery Check',
    riskLevel: batteryRisk,
    healthScore: Math.max(0, 100 - batteryScore),
    estimatedDueKm: estimatedBatteryKm,
    estimatedDueDays: estimatedBatteryDays,
    urgent: vehicle.batteryCondition === 'Weak' || vehicleAge >= 4.5,
    reason: vehicle.batteryCondition === 'Weak'
      ? `Battery voltage test indicates low state-of-charge with vehicle operational age of ${vehicleAge} years.`
      : `Battery in ${vehicle.batteryCondition.toLowerCase()} state; typical battery life cycle is 3-4 years.`,
    recommendedAction: batteryRisk === 'High'
      ? 'Conduct a digital conductance load test immediately; prepare for 12V battery replacement to prevent non-start breakdowns.'
      : batteryRisk === 'Medium'
      ? 'Clean terminal posts, check alternator charging output (should be 13.8V - 14.4V), and test battery fluid.'
      : 'Battery voltage healthy. Maintain clean terminals free of corrosion.',
    score: batteryScore
  };

  // ==========================================
  // COMPONENT 4: TYRE REPLACEMENT / CHECK
  // ==========================================
  // Factors: Tyre tread condition, distance driven, overall vehicle mileage
  let tyreScore = 0;
  const tyreKmRatio = distanceSinceLastService / OEM_THRESHOLDS.TYRE_INSPECTION_KM;
  tyreScore += Math.min(30, tyreKmRatio * 25);

  if (vehicle.tyreCondition === 'Uneven') {
    tyreScore += 55;
    ruleTriggers.push('Tyres exhibit uneven shoulder tread wear / suspension misalignment (+55 risk points)');
    contributions.push({
      featureName: 'Tyre Tread Condition',
      weight: 0.40,
      inputObserved: 'Uneven / Misaligned',
      riskPointsAdded: 55,
      description: 'Wheel alignment or toe/camber drift causing rapid asymmetrical rubber loss.'
    });
  } else if (vehicle.tyreCondition === 'Worn') {
    tyreScore += 60;
    ruleTriggers.push('Tyre tread depth approaching critical wear bar (<2mm) (+60 risk points)');
    contributions.push({
      featureName: 'Tyre Tread Condition',
      weight: 0.45,
      inputObserved: 'Worn / Thin Tread',
      riskPointsAdded: 60,
      description: 'Inadequate hydroplaning resistance and severely compromised wet braking distance.'
    });
  } else if (vehicle.tyreCondition === 'Fair') {
    tyreScore += 20;
    contributions.push({
      featureName: 'Tyre Tread Condition',
      weight: 0.20,
      inputObserved: 'Fair / Normal Wear',
      riskPointsAdded: 20,
      description: 'Moderate tread wear consistent with highway mileage.'
    });
  }

  tyreScore = Math.min(100, Math.round(tyreScore));
  const tyreRisk: RiskLevel = tyreScore > 65 ? 'High' : tyreScore >= 35 ? 'Medium' : 'Low';
  const remainingTyreKm = vehicle.tyreCondition === 'Worn' ? 800 : vehicle.tyreCondition === 'Uneven' ? 1500 : Math.max(200, OEM_THRESHOLDS.TYRE_INSPECTION_KM - distanceSinceLastService);
  const remainingTyreDays = Math.round(remainingTyreKm / 35);

  const tyreItem: PredictionItem = {
    id: 'pred-tyre',
    name: 'Tyre Replacement/Check',
    riskLevel: tyreRisk,
    healthScore: Math.max(0, 100 - tyreScore),
    estimatedDueKm: remainingTyreKm,
    estimatedDueDays: remainingTyreDays,
    urgent: vehicle.tyreCondition === 'Worn' || vehicle.tyreCondition === 'Uneven',
    reason: vehicle.tyreCondition === 'Worn' || vehicle.tyreCondition === 'Uneven'
      ? `Tyre physical inspection returned "${vehicle.tyreCondition}" tread wear profile after ${distanceSinceLastService.toLocaleString()} km.`
      : `Tyre tread integrity reported as ${vehicle.tyreCondition.toLowerCase()}; within safe driving specifications.`,
    recommendedAction: tyreRisk === 'High'
      ? (vehicle.tyreCondition === 'Uneven' 
          ? 'Perform 4-wheel laser alignment, wheel balancing, and replace tyres with tread depth below 2mm.'
          : 'Replace worn tyre set immediately to avoid blowout and loss of wet-road traction.')
      : tyreRisk === 'Medium'
      ? 'Perform cross-rotation of tyres and verify cold inflation pressure against manufacturer placard.'
      : 'Tyre tread depth is adequate. Check tire inflation pressure every 2 weeks.',
    score: tyreScore
  };

  // ==========================================
  // COMPONENT 5: BRAKE INSPECTION
  // ==========================================
  // Factors: Distance driven, tyre wear correlation, vehicle age
  let brakeScore = 0;
  const brakeKmRatio = distanceSinceLastService / OEM_THRESHOLDS.BRAKE_INSPECTION_KM;
  brakeScore += Math.min(45, brakeKmRatio * 40);
  
  // Driving with worn or uneven tyres usually puts higher stress or reflects neglected running gear
  if (vehicle.tyreCondition === 'Uneven' || vehicle.tyreCondition === 'Worn') {
    brakeScore += 20;
    ruleTriggers.push('Chassis running gear correlation: High friction wear detected (+20 risk points)');
  }
  if (vehicleAge >= 5) {
    brakeScore += 15; // Brake fluid absorbs atmospheric moisture after 2-3 years
  }

  brakeScore = Math.min(100, Math.round(brakeScore));
  const brakeRisk: RiskLevel = brakeScore > 65 ? 'High' : brakeScore >= 35 ? 'Medium' : 'Low';
  const remainingBrakeKm = OEM_THRESHOLDS.BRAKE_INSPECTION_KM - distanceSinceLastService;
  const remainingBrakeDays = Math.round(remainingBrakeKm / 35);

  const brakeItem: PredictionItem = {
    id: 'pred-brake',
    name: 'Brake Inspection',
    riskLevel: brakeRisk,
    healthScore: Math.max(0, 100 - brakeScore),
    estimatedDueKm: remainingBrakeKm,
    estimatedDueDays: remainingBrakeDays,
    urgent: remainingBrakeKm <= 500 || brakeRisk === 'High',
    reason: remainingBrakeKm <= 0
      ? `Brake inspection overdue by ${Math.abs(remainingBrakeKm).toLocaleString()} km based on OEM preventative safety intervals.`
      : `Brake friction assemblies logged ${distanceSinceLastService.toLocaleString()} km since previous service audit.`,
    recommendedAction: brakeRisk === 'High'
      ? 'Inspect front and rear brake pads for minimum 3mm friction material, check rotor runout, and test brake fluid moisture content.'
      : brakeRisk === 'Medium'
      ? 'Inspect brake pad wear levels and check brake fluid reservoir level during upcoming service.'
      : 'Brake system within safe operating parameters. Test pedal firmness periodically.',
    score: brakeScore
  };

  // ==========================================
  // COMPONENT 6: GENERAL SERVICE
  // ==========================================
  // Holistic multi-point service based on composite intervals and worst-case component score
  let generalScore = 0;
  const generalKmRatio = distanceSinceLastService / OEM_THRESHOLDS.GENERAL_SERVICE_KM;
  const generalDaysRatio = daysSinceLastService / OEM_THRESHOLDS.GENERAL_SERVICE_DAYS;
  
  generalScore += Math.min(45, generalKmRatio * 45);
  generalScore += Math.min(35, generalDaysRatio * 35);

  // Severe single-component risks push general service necessity
  const worstSubsystemScore = Math.max(oilScore, engineScore, batteryScore, tyreScore, brakeScore);
  if (worstSubsystemScore >= 75) {
    generalScore += 25;
    ruleTriggers.push('Critical subsystem risk detected — triggers comprehensive vehicle service (+25 risk points)');
  }

  generalScore = Math.min(100, Math.round(generalScore));
  const generalRisk: RiskLevel = generalScore > 65 ? 'High' : generalScore >= 35 ? 'Medium' : 'Low';
  const remainingGeneralKm = OEM_THRESHOLDS.GENERAL_SERVICE_KM - distanceSinceLastService;
  const remainingGeneralDays = OEM_THRESHOLDS.GENERAL_SERVICE_DAYS - daysSinceLastService;

  const generalItem: PredictionItem = {
    id: 'pred-general',
    name: 'General Service',
    riskLevel: generalRisk,
    healthScore: Math.max(0, 100 - generalScore),
    estimatedDueKm: remainingGeneralKm,
    estimatedDueDays: remainingGeneralDays,
    urgent: remainingGeneralKm <= 0 || remainingGeneralDays <= 0 || generalRisk === 'High',
    reason: remainingGeneralKm <= 0 || remainingGeneralDays <= 0
      ? `Full preventative maintenance cycle overdue by ${Math.abs(remainingGeneralKm).toLocaleString()} km / ${Math.abs(remainingGeneralDays)} days.`
      : `${distanceSinceLastService.toLocaleString()} km and ${daysSinceLastService} days elapsed since comprehensive multi-point service.`,
    recommendedAction: generalRisk === 'High'
      ? 'Book immediate comprehensive vehicle service: fluids flush, belt inspection, suspension check, and safety audit.'
      : generalRisk === 'Medium'
      ? 'Plan routine periodic maintenance service in next month.'
      : 'Vehicle is within normal maintenance interval. Continue standard maintenance schedule.',
    score: generalScore
  };

  // Compile all 6 required prediction items
  const predictions: PredictionItem[] = [
    engineItem,
    oilItem,
    batteryItem,
    tyreItem,
    brakeItem,
    generalItem
  ];

  // Count risk distribution
  const highRiskCount = predictions.filter(p => p.riskLevel === 'High').length;
  const mediumRiskCount = predictions.filter(p => p.riskLevel === 'Medium').length;
  const lowRiskCount = predictions.filter(p => p.riskLevel === 'Low').length;

  // Composite overall vehicle health score (0 - 100%)
  const avgHealth = Math.round(predictions.reduce((acc, cur) => acc + cur.healthScore, 0) / predictions.length);
  const overallRiskLevel: RiskLevel = highRiskCount >= 1 ? 'High' : mediumRiskCount >= 2 ? 'Medium' : 'Low';

  // Find the most urgent upcoming service item
  const sortedByDue = [...predictions].sort((a, b) => a.estimatedDueKm - b.estimatedDueKm);
  const nextService = sortedByDue[0];

  // Add summary contributions for distance and age
  contributions.unshift(
    {
      featureName: 'Cumulative Mileage Delta',
      weight: 0.35,
      inputObserved: `${distanceSinceLastService.toLocaleString()} km`,
      riskPointsAdded: Math.round(Math.min(45, (distanceSinceLastService / 10000) * 40)),
      description: 'Continuous mechanical wear, thermal cycles, and component fatigue proportional to distance.'
    },
    {
      featureName: 'Time Elapsed Since Service',
      weight: 0.25,
      inputObserved: `${daysSinceLastService} days`,
      riskPointsAdded: Math.round(Math.min(35, (daysSinceLastService / 365) * 30)),
      description: 'Fluid oxidation, atmospheric moisture absorption, rubber seal stiffening over time.'
    },
    {
      featureName: 'Vehicle Operational Age',
      weight: 0.15,
      inputObserved: `${vehicleAge} years`,
      riskPointsAdded: Math.min(25, Math.round(vehicleAge * 3.5)),
      description: 'Baseline chassis aging, wiring harness fatigue, and legacy wear characteristics.'
    }
  );

  return {
    vehicleId: vehicle.id,
    overallHealthScore: avgHealth,
    overallRiskLevel,
    nextPredictedService: {
      serviceName: nextService.name,
      dueInKm: nextService.estimatedDueKm,
      dueInDays: nextService.estimatedDueDays,
      isOverdue: nextService.estimatedDueKm <= 0 || nextService.estimatedDueDays <= 0
    },
    predictions,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    explanation: {
      decisionSummary: overallRiskLevel === 'High'
        ? `High risk alerts detected across ${highRiskCount} critical system(s). Immediate preventative intervention recommended to avert mechanical failure or safety hazards.`
        : overallRiskLevel === 'Medium'
        ? `Moderate wear detected across ${mediumRiskCount} system(s). Routine maintenance window approaching within 15-30 days.`
        : 'All vehicle telemetry falls within nominal factory operating parameters. Vehicle is in good overall operational health.',
      totalRiskScore: 100 - avgHealth,
      ruleTriggers,
      contributions
    }
  };
}
