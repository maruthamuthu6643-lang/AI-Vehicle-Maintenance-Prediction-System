import React from 'react';
import { 
  Car, 
  Gauge, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Wrench,
  Flame,
  Droplet,
  Battery,
  Disc
} from 'lucide-react';
import { VehicleData, PredictionSummary, PredictionItem } from '../types';

interface DashboardOverviewProps {
  vehicle: VehicleData;
  prediction: PredictionSummary;
  onNavigateTab: (tab: 'dashboard' | 'form' | 'predictions' | 'explanation' | 'history') => void;
  onSelectItem?: (item: PredictionItem) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  vehicle,
  prediction,
  onNavigateTab,
}) => {
  const distanceSinceLast = Math.max(0, vehicle.currentMileage - vehicle.lastServiceMileage);

  // Filter urgent & high-priority alerts
  const urgentAlerts = prediction.predictions.filter(
    p => p.urgent || p.riskLevel === 'High' || p.estimatedDueKm <= 1000 || p.estimatedDueDays <= 15
  );

  const getSubsystemIcon = (name: string) => {
    switch (name) {
      case 'Engine Service': return <Flame className="w-4 h-4 text-orange-600" />;
      case 'Oil Change': return <Droplet className="w-4 h-4 text-amber-600" />;
      case 'Battery Check': return <Battery className="w-4 h-4 text-blue-600" />;
      case 'Tyre Replacement/Check': return <Disc className="w-4 h-4 text-slate-700" />;
      default: return <Wrench className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Maintenance Alert Banner (Feature 4: Show alerts when maintenance is due soon or overdue) */}
      {urgentAlerts.length > 0 ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/90 border border-rose-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-rose-950">
                    Maintenance Attention Required! ({urgentAlerts.length} Critical Alert{urgentAlerts.length > 1 ? 's' : ''})
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-rose-200 text-rose-800">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  The AI prediction model detected {urgentAlerts.map(a => a.name).join(', ')} either overdue or entering high-wear risk thresholds.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('predictions')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>View Recommended Actions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                All Vehicle Subsystems Within Safe Thresholds
              </h3>
              <p className="text-xs text-emerald-800">
                No immediate or overdue maintenance alerts detected. Next preventative service scheduled normally.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('predictions')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            View Checklist <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Top Vehicle Identity Card & Health Index Radial */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Vehicle Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-slate-900 text-white tracking-wider">
                {vehicle.vehicleNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                {vehicle.vehicleAge} Years Old
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                prediction.overallRiskLevel === 'High' 
                  ? 'bg-rose-100 text-rose-800' 
                  : prediction.overallRiskLevel === 'Medium' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {prediction.overallRiskLevel} Risk Status
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {vehicle.vehicleModel}
            </h1>

            <p className="text-xs text-slate-500 max-w-xl">
              {prediction.explanation.decisionSummary}
            </p>

            {/* Quick sensor status pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sensors:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Engine: <strong className="text-slate-900">{vehicle.engineCondition}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Battery: <strong className="text-slate-900">{vehicle.batteryCondition}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Tyres: <strong className="text-slate-900">{vehicle.tyreCondition}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Oil: <strong className="text-slate-900">{vehicle.oilCondition}</strong>
              </span>
            </div>
          </div>

          {/* Right: Circular Overall Health Gauge */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    prediction.overallHealthScore >= 75
                      ? 'text-emerald-500'
                      : prediction.overallHealthScore >= 45
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }`}
                  strokeDasharray={`${prediction.overallHealthScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 font-mono leading-none">
                  {prediction.overallHealthScore}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">
                  Health
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-800">Risk Assessment Index</div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-600">High Risk: <strong className="text-slate-900">{prediction.highRiskCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600">Medium Risk: <strong className="text-slate-900">{prediction.mediumRiskCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Low Risk: <strong className="text-slate-900">{prediction.lowRiskCount}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four Vital Metric Cards (Feature 1 requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Mileage */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Mileage
            </span>
            <Gauge className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            {vehicle.currentMileage.toLocaleString()} <span className="text-sm font-semibold text-slate-400">km</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>+{distanceSinceLast.toLocaleString()} km since last service</span>
          </div>
        </div>

        {/* Card 2: Last Service */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Last Service Date
            </span>
            <Calendar className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {vehicle.lastServiceDate || 'Previous Log'}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            At {vehicle.lastServiceMileage.toLocaleString()} km ({vehicle.daysSinceLastService} days ago)
          </div>
        </div>

        {/* Card 3: Next Predicted Service */}
        <div className={`p-5 rounded-2xl border shadow-xs ${
          prediction.nextPredictedService.isOverdue
            ? 'bg-rose-50/70 border-rose-200'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Next Service Predicted
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 truncate" title={prediction.nextPredictedService.serviceName}>
            {prediction.nextPredictedService.serviceName}
          </div>
          <div className="mt-2 text-xs">
            {prediction.nextPredictedService.isOverdue ? (
              <span className="text-rose-700 font-bold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                OVERDUE by {Math.abs(prediction.nextPredictedService.dueInKm).toLocaleString()} km
              </span>
            ) : (
              <span className="text-slate-600">
                Due in ~<strong className="text-slate-900">{prediction.nextPredictedService.dueInKm.toLocaleString()} km</strong> or <strong className="text-slate-900">{prediction.nextPredictedService.dueInDays} days</strong>
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Maintenance Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Maintenance Status
            </span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${
              prediction.overallRiskLevel === 'High' ? 'text-rose-600' :
              prediction.overallRiskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {prediction.overallRiskLevel === 'High' ? 'Action Required' :
               prediction.overallRiskLevel === 'Medium' ? 'Service Approaching' : 'Good Operating Health'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {prediction.highRiskCount > 0 
              ? `${prediction.highRiskCount} system(s) flagged as urgent` 
              : 'Subsystems within regular thresholds'}
          </div>
        </div>
      </div>

      {/* 4. Quick Preview of 6 Predictive Subsystems */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Subsystem Wear & Predictive Maintenance Forecast
            </h2>
            <p className="text-xs text-slate-500">
              Calculated using the AI rule-based algorithm across mechanical and fluid systems.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('predictions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            View Full Prediction Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {prediction.predictions.map(item => (
            <div 
              key={item.id} 
              onClick={() => onNavigateTab('predictions')}
              className={`p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${
                item.riskLevel === 'High' 
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300' 
                  : item.riskLevel === 'Medium'
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {getSubsystemIcon(item.name)}
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {item.name}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' :
                  item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.riskLevel} Risk
                </span>
              </div>

              {/* Progress bar representing component health */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Remaining Health:</span>
                  <span className="font-semibold text-slate-700">{item.healthScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.healthScore >= 70 ? 'bg-emerald-500' :
                      item.healthScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.healthScore}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-600 line-clamp-1">
                {item.estimatedDueKm <= 0 ? (
                  <span className="text-rose-600 font-semibold">Overdue by {Math.abs(item.estimatedDueKm).toLocaleString()} km</span>
                ) : (
                  <span>Due in ~{item.estimatedDueKm.toLocaleString()} km</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
