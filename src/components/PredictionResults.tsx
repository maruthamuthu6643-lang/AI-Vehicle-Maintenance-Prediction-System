import React, { useState } from 'react';
import { 
  Flame, 
  Droplet, 
  Battery, 
  Disc, 
  Wrench, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Gauge, 
  HelpCircle, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { PredictionSummary, PredictionItem, RiskLevel } from '../types';

interface PredictionResultsProps {
  prediction: PredictionSummary;
  onRecordMaintenance?: (item: PredictionItem) => void;
  onGoToExplanation: () => void;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction,
  onRecordMaintenance,
  onGoToExplanation
}) => {
  const [filterRisk, setFilterRisk] = useState<'All' | RiskLevel>('All');
  const [justServicedId, setJustServicedId] = useState<string | null>(null);

  const getSubsystemIcon = (name: string) => {
    switch (name) {
      case 'Engine Service':
        return <Flame className="w-5 h-5 text-orange-600" />;
      case 'Oil Change':
        return <Droplet className="w-5 h-5 text-amber-600" />;
      case 'Battery Check':
        return <Battery className="w-5 h-5 text-blue-600" />;
      case 'Tyre Replacement/Check':
        return <Disc className="w-5 h-5 text-slate-800" />;
      case 'Brake Inspection':
        return <Disc className="w-5 h-5 text-rose-600" />;
      default:
        return <Wrench className="w-5 h-5 text-indigo-600" />;
    }
  };

  const filteredPredictions = prediction.predictions.filter(item => {
    if (filterRisk === 'All') return true;
    return item.riskLevel === filterRisk;
  });

  const handleQuickService = (item: PredictionItem) => {
    if (onRecordMaintenance) {
      onRecordMaintenance(item);
    }
    setJustServicedId(item.id);
    setTimeout(() => {
      setJustServicedId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar with summary & filter pills */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Wrench className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Maintenance Predictions & Recommendations
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time heuristic evaluation across 6 automotive systems, estimating wear boundaries and scheduled interventions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Risk Filter:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['All', 'High', 'Medium', 'Low'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => setFilterRisk(risk)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterRisk === risk
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {risk} {risk === 'High' && `(${prediction.highRiskCount})`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPredictions.map(item => {
          const isHigh = item.riskLevel === 'High';
          const isMedium = item.riskLevel === 'Medium';
          const isOverdue = item.estimatedDueKm <= 0 || item.estimatedDueDays <= 0;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden ${
                isHigh
                  ? 'border-rose-300 ring-1 ring-rose-200/50'
                  : isMedium
                  ? 'border-amber-300 ring-1 ring-amber-200/50'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className={`p-5 border-b ${
                isHigh ? 'bg-rose-50/50 border-rose-100' :
                isMedium ? 'bg-amber-50/40 border-amber-100' :
                'bg-slate-50/50 border-slate-100'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {getSubsystemIcon(item.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">Component Health:</span>
                        <span className={`text-xs font-bold font-mono ${
                          item.healthScore >= 70 ? 'text-emerald-600' :
                          item.healthScore >= 40 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {item.healthScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isHigh ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      isMedium ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {isHigh ? <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> :
                       isMedium ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> :
                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {item.riskLevel} Risk
                    </span>
                  </div>
                </div>

                {/* Subsystem Health Progress Bar */}
                <div className="mt-3">
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.healthScore >= 70 ? 'bg-emerald-500' :
                        item.healthScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.healthScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Body: Estimated Due, Reason, Recommended Action */}
              <div className="p-5 space-y-4 flex-1">
                {/* 1. Estimated Due in Days or Kilometers */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Service Timing Horizon:</span>
                  </div>

                  <div className="text-right">
                    {isOverdue ? (
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        OVERDUE ({Math.abs(item.estimatedDueKm).toLocaleString()} km / {Math.abs(item.estimatedDueDays)} days)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        ~{item.estimatedDueKm.toLocaleString()} km <span className="font-normal text-slate-500 font-sans">or</span> {item.estimatedDueDays} days
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Reason for Prediction */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <span>Reason for Prediction</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    {item.reason}
                  </p>
                </div>

                {/* 3. Recommended Action */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <span>Recommended Engineering Action</span>
                  </h4>
                  <p className={`text-xs leading-relaxed p-2.5 rounded-lg border ${
                    isHigh ? 'bg-rose-50/70 border-rose-200 text-rose-900 font-medium' :
                    isMedium ? 'bg-amber-50/70 border-amber-200 text-amber-950 font-medium' :
                    'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {item.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onGoToExplanation}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Inspect Feature Weights <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickService(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    justServicedId === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {justServicedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Logged to History
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3.5 h-3.5 text-slate-500" />
                      Record Service
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
