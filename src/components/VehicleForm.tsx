import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Car, 
  Calendar, 
  Gauge, 
  Battery, 
  Disc, 
  Droplet, 
  Flame, 
  HelpCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  VehicleData, 
  EngineCondition, 
  BatteryCondition, 
  TyreCondition, 
  OilCondition 
} from '../types';
import { DEMO_VEHICLES } from '../data/demoVehicles';

interface VehicleFormProps {
  initialData: VehicleData;
  onSubmit: (data: VehicleData) => void;
  onLoadDemo: (demo: VehicleData) => void;
  isPredicting: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onLoadDemo,
  isPredicting
}) => {
  const [formData, setFormData] = useState<VehicleData>(initialData);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize internal state whenever initialData changes (e.g. when a demo is selected)
  useEffect(() => {
    setFormData(initialData);
    setErrorMsg(null);
  }, [initialData]);

  const handleChange = (field: keyof VehicleData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.vehicleNumber.trim()) {
      setErrorMsg('Please provide a valid vehicle registration number.');
      return;
    }
    if (!formData.vehicleModel.trim()) {
      setErrorMsg('Please specify the vehicle make and model.');
      return;
    }
    if (formData.currentMileage < formData.lastServiceMileage) {
      setErrorMsg('Current mileage cannot be lower than the last service mileage.');
      return;
    }
    if (formData.currentMileage < 0 || formData.daysSinceLastService < 0) {
      setErrorMsg('Mileage and elapsed days cannot be negative values.');
      return;
    }

    setErrorMsg(null);
    onSubmit(formData);
  };

  const distanceSinceLast = Math.max(0, formData.currentMileage - formData.lastServiceMileage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Form Header with Demo Presets */}
      <div className="p-6 bg-slate-50/80 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Car className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Vehicle Telemetry & Diagnostics Input
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Input vehicle physical parameters and sensory conditions to feed the AI predictive maintenance engine.
            </p>
          </div>

          {/* Quick Demo Loader Pill Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Sample Presets:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {DEMO_VEHICLES.map((demo, i) => (
                <button
                  type="button"
                  key={demo.id}
                  onClick={() => onLoadDemo(demo)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                    formData.id === demo.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                  title={`${demo.vehicleModel} - ${demo.currentMileage.toLocaleString()} km`}
                >
                  Preset {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Validation Error</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Section 1: Basic Vehicle Identity */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5" /> General Vehicle Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="vehicleNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Registration Number *
              </label>
              <input
                id="vehicleNumber"
                type="text"
                required
                value={formData.vehicleNumber}
                onChange={(e) => handleChange('vehicleNumber', e.target.value.toUpperCase())}
                placeholder="e.g. KA-01-MJ-4029"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              />
              <span className="text-[11px] text-slate-400">License plate identifier</span>
            </div>

            <div>
              <label htmlFor="vehicleModel" className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Model & Trim *
              </label>
              <input
                id="vehicleModel"
                type="text"
                required
                value={formData.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
                placeholder="e.g. Toyota Corolla 1.8L"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400">Make, model, engine displacement</span>
            </div>

            <div>
              <label htmlFor="vehicleAge" className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Age (Years) *
              </label>
              <input
                id="vehicleAge"
                type="number"
                min="0"
                max="35"
                step="0.5"
                required
                value={formData.vehicleAge}
                onChange={(e) => handleChange('vehicleAge', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400">Total operational lifespan in years</span>
            </div>
          </div>
        </div>

        {/* Section 2: Mileage & Odometer Telemetry */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" /> Mileage & Service Timeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="currentMileage" className="block text-xs font-semibold text-slate-700 mb-1">
                Current Odometer Mileage (km) *
              </label>
              <div className="relative">
                <input
                  id="currentMileage"
                  type="number"
                  min="0"
                  required
                  value={formData.currentMileage}
                  onChange={(e) => handleChange('currentMileage', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono pr-10"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">km</span>
              </div>
              <span className="text-[11px] text-slate-400">Total accumulated distance</span>
            </div>

            <div>
              <label htmlFor="lastServiceMileage" className="block text-xs font-semibold text-slate-700 mb-1">
                Last Service Mileage (km) *
              </label>
              <div className="relative">
                <input
                  id="lastServiceMileage"
                  type="number"
                  min="0"
                  required
                  value={formData.lastServiceMileage}
                  onChange={(e) => handleChange('lastServiceMileage', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono pr-10"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">km</span>
              </div>
              <span className="text-[11px] text-slate-400">Odometer reading at previous service</span>
            </div>

            <div>
              <label htmlFor="daysSinceLastService" className="block text-xs font-semibold text-slate-700 mb-1">
                Days Since Last Service *
              </label>
              <div className="relative">
                <input
                  id="daysSinceLastService"
                  type="number"
                  min="0"
                  required
                  value={formData.daysSinceLastService}
                  onChange={(e) => handleChange('daysSinceLastService', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">days</span>
              </div>
              <span className="text-[11px] text-slate-400">Elapsed time since maintenance</span>
            </div>
          </div>

          {/* Quick Computed Delta Preview */}
          <div className="mt-3 p-3 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Calculated Driving Interval:
            </span>
            <div className="font-semibold space-x-3">
              <span>Distance driven: <strong className="font-mono text-blue-700">{distanceSinceLast.toLocaleString()} km</strong></span>
              <span>•</span>
              <span>Elapsed: <strong className="font-mono text-blue-700">{formData.daysSinceLastService} days</strong> (~{(formData.daysSinceLastService / 30).toFixed(1)} mo)</span>
            </div>
          </div>
        </div>

        {/* Section 3: Subsystem Physical Sensory Conditions */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Disc className="w-3.5 h-3.5" /> Subsystem Diagnostics & Physical Condition Ratings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Engine Condition */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Engine Condition
                </span>
                <span className="text-[11px] text-slate-500 font-medium">OBD-II & Acoustic check</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Powertrain compression, idle smoothness, and check-engine status.
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Good', 'Moderate', 'Poor', 'Critical'] as EngineCondition[]).map(status => {
                  const isSelected = formData.engineCondition === status;
                  let colorClass = 'hover:bg-slate-100 text-slate-700 border-slate-200';
                  if (isSelected) {
                    if (status === 'Good') colorClass = 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs';
                    else if (status === 'Moderate') colorClass = 'bg-amber-500 text-white border-amber-500 font-semibold shadow-2xs';
                    else if (status === 'Poor') colorClass = 'bg-orange-600 text-white border-orange-600 font-semibold shadow-2xs';
                    else colorClass = 'bg-rose-600 text-white border-rose-600 font-semibold shadow-2xs';
                  }
                  return (
                    <button
                      type="button"
                      key={status}
                      onClick={() => handleChange('engineCondition', status)}
                      className={`py-2 px-1 text-center rounded-lg text-xs border transition-all cursor-pointer ${colorClass}`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Battery Condition */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-blue-600" />
                  Battery Condition
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Resting voltage & CCA</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                12V Lead-Acid / AGM terminal voltage and starting efficiency.
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: 'Good', label: 'Good (12.6V+)' },
                  { value: 'Moderate', label: 'Moderate (12.2V)' },
                  { value: 'Weak', label: 'Weak (<12.2V)' }
                ].map(item => {
                  const isSelected = formData.batteryCondition === item.value;
                  let colorClass = 'hover:bg-slate-100 text-slate-700 border-slate-200';
                  if (isSelected) {
                    if (item.value === 'Good') colorClass = 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs';
                    else if (item.value === 'Moderate') colorClass = 'bg-amber-500 text-white border-amber-500 font-semibold shadow-2xs';
                    else colorClass = 'bg-rose-600 text-white border-rose-600 font-semibold shadow-2xs';
                  }
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => handleChange('batteryCondition', item.value as BatteryCondition)}
                      className={`py-2 px-1 text-center rounded-lg text-xs border transition-all cursor-pointer ${colorClass}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Tyre Condition */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Disc className="w-4 h-4 text-slate-700" />
                  Tyre Condition
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Tread depth gauge</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Rubber tread depth (&gt;4mm good, &lt;2mm worn), camber wear, and shoulder balding.
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { value: 'Good', label: 'Good (>4mm)' },
                  { value: 'Fair', label: 'Fair (3mm)' },
                  { value: 'Worn', label: 'Worn (<2mm)' },
                  { value: 'Uneven', label: 'Uneven Camber' }
                ].map(item => {
                  const isSelected = formData.tyreCondition === item.value;
                  let colorClass = 'hover:bg-slate-100 text-slate-700 border-slate-200';
                  if (isSelected) {
                    if (item.value === 'Good') colorClass = 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs';
                    else if (item.value === 'Fair') colorClass = 'bg-amber-500 text-white border-amber-500 font-semibold shadow-2xs';
                    else colorClass = 'bg-rose-600 text-white border-rose-600 font-semibold shadow-2xs';
                  }
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => handleChange('tyreCondition', item.value as TyreCondition)}
                      className={`py-2 px-1 text-center rounded-lg text-xs border transition-all cursor-pointer ${colorClass}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Oil Condition */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-amber-600" />
                  Oil Condition
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Dipstick inspection</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Lubricant viscosity, thermal oxidation color, and particulate contamination.
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: 'Clean', label: 'Clean (Amber)' },
                  { value: 'Degraded', label: 'Degraded (Dark)' },
                  { value: 'Low', label: 'Low / Sludgy' }
                ].map(item => {
                  const isSelected = formData.oilCondition === item.value;
                  let colorClass = 'hover:bg-slate-100 text-slate-700 border-slate-200';
                  if (isSelected) {
                    if (item.value === 'Clean') colorClass = 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs';
                    else if (item.value === 'Degraded') colorClass = 'bg-amber-500 text-white border-amber-500 font-semibold shadow-2xs';
                    else colorClass = 'bg-rose-600 text-white border-rose-600 font-semibold shadow-2xs';
                  }
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => handleChange('oilCondition', item.value as OilCondition)}
                      className={`py-2 px-1 text-center rounded-lg text-xs border transition-all cursor-pointer ${colorClass}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Rule-Based Engine evaluates 6 critical automotive safety subsystems.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFormData(initialData)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Inputs
            </button>

            <button
              type="submit"
              disabled={isPredicting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              {isPredicting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Telemetry...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Predict Maintenance
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
