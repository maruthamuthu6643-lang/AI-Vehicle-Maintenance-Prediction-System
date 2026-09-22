import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Binary, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Layers, 
  Sliders, 
  Compass, 
  Cpu, 
  ArrowRight,
  Code2
} from 'lucide-react';
import { PredictionSummary, VehicleData } from '../types';
import { OEM_THRESHOLDS } from '../utils/predictionEngine';

interface AIExplanationViewProps {
  prediction: PredictionSummary;
  vehicle: VehicleData;
}

export const AIExplanationView: React.FC<AIExplanationViewProps> = ({
  prediction,
  vehicle
}) => {
  const [activeTab, setActiveTab] = useState<'contributions' | 'rules' | 'math' | 'code'>('contributions');

  const distanceSinceLast = Math.max(0, vehicle.currentMileage - vehicle.lastServiceMileage);

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Prediction Explanation (XAI Architecture)
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              Transparent, explainable diagnostic inference model detailing why maintenance was scheduled, the mathematical weights applied, and specific automotive rules triggered.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('contributions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'contributions'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feature Attribution
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fired Rules ({prediction.explanation.ruleTriggers.length})
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'math'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Decision Boundaries
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Algorithm Logic
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inference Status</span>
          <div className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              prediction.overallRiskLevel === 'High' ? 'bg-rose-500' :
              prediction.overallRiskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></span>
            {prediction.overallRiskLevel} Risk Classification
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Determined by composite wear scores across 6 vehicle telemetry channels.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total System Wear Penalty</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">
            {prediction.explanation.totalRiskScore} / 100 points
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Normalized across distance, elapsed days, and sensor condition degradation.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dominant Decision Driver</span>
          <div className="text-lg font-bold text-slate-900 mt-1 truncate">
            {prediction.explanation.contributions[0]?.featureName || 'Mileage Delta'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Added +{prediction.explanation.contributions[0]?.riskPointsAdded || 0} risk wear points.
          </p>
        </div>
      </div>

      {/* Tab 1: Feature Attribution Breakdown */}
      {activeTab === 'contributions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Dynamic Feature Contribution & Sensitivity Weights
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Relative impact of each vehicle input parameter on the final predictive maintenance output.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Feature Vector</th>
                  <th className="py-3 px-4">Observed Value</th>
                  <th className="py-3 px-4">Weight ($\omega_i$)</th>
                  <th className="py-3 px-4">Risk Points Added</th>
                  <th className="py-3 px-4">Biomechanical / Automotive Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prediction.explanation.contributions.map((feat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {feat.featureName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-700">
                      {feat.inputObserved}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {feat.weight.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
                        feat.riskPointsAdded > 40 ? 'bg-rose-100 text-rose-700' :
                        feat.riskPointsAdded > 20 ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        +{feat.riskPointsAdded} pts
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                      {feat.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Fired Heuristic Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Automotive Heuristic Rules Triggered
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Production-level vehicle expert systems evaluate hundreds of OEM engineering criteria to guard against catastrophic failure.
            </p>
          </div>

          {prediction.explanation.ruleTriggers.length > 0 ? (
            <div className="space-y-3">
              {prediction.explanation.ruleTriggers.map((rule, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3"
                >
                  <span className="p-1 rounded-md bg-amber-500 text-white text-[10px] font-bold font-mono shrink-0 mt-0.5">
                    RULE #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {rule}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Fired during multi-variable evaluation: input value exceeded nominal manufacturer bounds.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-950">No High-Wear Rules Triggered</h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                All inputs for vehicle {vehicle.vehicleNumber} align within normal preventative maintenance boundaries.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Decision Boundaries & Thresholds */}
      {activeTab === 'math' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Binary className="w-4 h-4 text-indigo-600" />
              Mathematical Wear Formulation & Decision Boundaries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulas used by the inference engine to classify vehicle status.
            </p>
          </div>

          {/* Mathematical Formula Display */}
          <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3 shadow-inner">
            <div className="text-slate-400 font-sans font-semibold text-[11px] uppercase tracking-wider">
              Component Wear Index Formula
            </div>
            <div className="text-amber-300 text-sm font-semibold">
              WearScore(c) = min(100, Σ [ w_k · (ΔDistance / Threshold_km) + w_t · (ΔDays / Threshold_days) + Penalty(SensorState) + α · Age ])
            </div>
            <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
              Where c ∈ &#123;Engine, Oil, Battery, Tyre, Brake, General&#125;, and Penalty(SensorState) maps discrete physical degradation.
            </div>
          </div>

          {/* Decision Matrix Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-600 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-emerald-900">LOW RISK (Score &lt; 35)</span>
              </div>
              <p className="text-xs text-emerald-800">
                Safe operational territory. Component integrity &gt; 65%. Follow regular preventative calendar checks.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500 text-white">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-amber-900">MEDIUM RISK (Score 35 - 65)</span>
              </div>
              <p className="text-xs text-amber-800">
                Advisory status. Noticeable wear or interval approaching (within 1,500 km or 30 days). Service recommended soon.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-rose-600 text-white">
                  <AlertOctagon className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-rose-900">HIGH RISK (Score &gt; 65)</span>
              </div>
              <p className="text-xs text-rose-800">
                Urgent attention required. Service overdue or severe physical degradation detected. High likelihood of failure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Algorithm Logic & College AI Notes */}
      {activeTab === 'code' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              Engine Implementation Architecture
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated predictive maintenance AI utilizing forward-chaining expert rules and feature attribution weights.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto space-y-2">
            <p className="text-emerald-400">// 1. Feature extraction from vehicle state</p>
            <p>const deltaKm = vehicle.currentMileage - vehicle.lastServiceMileage;</p>
            <p>const deltaDays = vehicle.daysSinceLastService;</p>
            <br />
            <p className="text-emerald-400">// 2. Dynamic threshold calculation</p>
            <p>const oilKmRatio = deltaKm / OEM_THRESHOLDS.OIL_CHANGE_KM;</p>
            <p>if (vehicle.oilCondition === 'Low') riskScore += 50;</p>
            <p>else if (vehicle.oilCondition === 'Degraded') riskScore += 30;</p>
            <br />
            <p className="text-emerald-400">// 3. Cross-subsystem correlations</p>
            <p>if (vehicle.tyreCondition === 'Uneven') brakeScore += 20; // wheel drift stresses brakes</p>
            <p>if (vehicle.oilCondition === 'Low') engineScore += 15; // friction thermal wear</p>
          </div>
        </div>
      )}
    </div>
  );
};
