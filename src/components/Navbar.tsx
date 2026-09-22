import React from 'react';
import { 
  Car, 
  Wrench, 
  BrainCircuit, 
  History, 
  FileText, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { VehicleData, RiskLevel } from '../types';
import { DEMO_VEHICLES } from '../data/demoVehicles';

interface NavbarProps {
  currentTab: 'dashboard' | 'form' | 'predictions' | 'explanation' | 'history';
  setCurrentTab: (tab: 'dashboard' | 'form' | 'predictions' | 'explanation' | 'history') => void;
  currentVehicle: VehicleData;
  onSelectVehicle: (vehicle: VehicleData) => void;
  overallRisk: RiskLevel;
  healthScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentVehicle,
  onSelectVehicle,
  overallRisk,
  healthScore
}) => {
  const getRiskBadge = () => {
    switch (overallRisk) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            High Risk Alert
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Maintenance Due Soon
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Optimal Condition
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner for college project context & quick vehicle selector */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold tracking-wide">AI IMMERSION PROJECT</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Rule-Based Predictive Maintenance Expert System</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden md:inline">Quick Demo Vehicles:</span>
            <div className="flex items-center gap-1">
              {DEMO_VEHICLES.map((demo, idx) => {
                const isSelected = currentVehicle.id === demo.id;
                return (
                  <button
                    key={demo.id}
                    onClick={() => onSelectVehicle(demo)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={`${demo.vehicleModel} (${demo.vehicleNumber})`}
                  >
                    Demo {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  AutoPredict AI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  v2.4 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Vehicle Maintenance Prediction System
              </p>
            </div>
          </div>

          {/* Current Active Vehicle Pill */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-800">
                {currentVehicle.vehicleModel}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {currentVehicle.vehicleNumber}
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Health:</span>
              <span className={`text-xs font-bold ${healthScore >= 70 ? 'text-emerald-600' : healthScore >= 45 ? 'text-amber-600' : 'text-rose-600'}`}>
                {healthScore}%
              </span>
            </div>
            {getRiskBadge()}
          </div>

          {/* Primary Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('form')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'form'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Vehicle Input</span>
            </button>

            <button
              onClick={() => setCurrentTab('predictions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'predictions'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Predictions</span>
            </button>

            <button
              onClick={() => setCurrentTab('explanation')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'explanation'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span className="hidden sm:inline">AI Explanation</span>
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden md:inline">History</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
