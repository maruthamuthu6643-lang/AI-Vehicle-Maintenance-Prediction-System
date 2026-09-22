import React from 'react';
import { 
  BarChart3, 
  Activity, 
  Gauge, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  ShieldCheck
} from 'lucide-react';
import { PredictionSummary, VehicleData } from '../types';

interface HealthAnalyticsChartsProps {
  prediction: PredictionSummary;
  vehicle: VehicleData;
}

export const HealthAnalyticsCharts: React.FC<HealthAnalyticsChartsProps> = ({
  prediction,
  vehicle
}) => {
  const distanceSinceLast = Math.max(0, vehicle.currentMileage - vehicle.lastServiceMileage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Telemetry Health Analytics & Risk Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Component health degradation curves and risk categorization boundaries.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>&gt;70% Safe</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>40-70% Warning</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>&lt;40% Critical</span>
          </div>
        </div>
      </div>

      {/* Subsystems Bar Chart */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Subsystem Health Index (0 - 100%)
        </h4>

        <div className="space-y-3">
          {prediction.predictions.map(item => {
            const barColor = 
              item.healthScore >= 70 ? 'bg-emerald-500' :
              item.healthScore >= 40 ? 'bg-amber-500' : 'bg-rose-500';

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (Risk: {item.score} pts)
                    </span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500 text-[11px]">
                      {item.estimatedDueKm <= 0 ? 'Overdue' : `Due: ~${item.estimatedDueKm.toLocaleString()} km`}
                    </span>
                    <span className="font-bold text-slate-900 w-10 text-right">
                      {item.healthScore}%
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="relative w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${item.healthScore}%` }}
                  />
                  {/* Warning threshold markers */}
                  <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-rose-300 opacity-60 pointer-events-none" title="Critical Boundary (40%)" />
                  <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-amber-300 opacity-60 pointer-events-none" title="Warning Boundary (70%)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Horizon Mileage Timeline Graphic */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Service Horizon Lifecycle Timeline
          </h4>
          <span className="text-xs font-mono text-slate-600">
            Current: <strong className="text-slate-900">{vehicle.currentMileage.toLocaleString()} km</strong>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Last Service ({vehicle.lastServiceMileage.toLocaleString()} km)</span>
            <span>+5,000 km</span>
            <span>+10,000 km (OEM Interval)</span>
            <span>+15,000 km</span>
          </div>

          <div className="relative w-full h-4 rounded-full bg-slate-200 overflow-hidden">
            {/* Driven fill */}
            <div 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${Math.min(100, (distanceSinceLast / 15000) * 100)}%` }}
            />
            {/* Standard 10k km marker */}
            <div className="absolute top-0 bottom-0 left-[66.6%] w-0.5 bg-rose-500" title="10,000 km General Service Mark" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>{distanceSinceLast.toLocaleString()} km elapsed since last service</span>
            <span className="font-semibold text-blue-700">
              {(10000 - distanceSinceLast) > 0 
                ? `${(10000 - distanceSinceLast).toLocaleString()} km remaining to standard 10k mark` 
                : `${Math.abs(10000 - distanceSinceLast).toLocaleString()} km past regular service mark`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
