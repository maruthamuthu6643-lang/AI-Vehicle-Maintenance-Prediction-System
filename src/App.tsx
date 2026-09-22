/**
 * AI Vehicle Maintenance Prediction System
 * 
 * College AI Immersion Project - Expert System Prototype
 * Built with React.js, React Hooks, Tailwind CSS, Lucide Icons.
 * 
 * This client-side application analyzes real-time vehicle telemetry, odometer readings,
 * and physical component ratings to predict upcoming vehicle maintenance needs using
 * an explainable heuristic rule-based AI algorithm.
 */

import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Wrench, 
  BrainCircuit, 
  History, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Info,
  Calendar,
  Gauge,
  Layers,
  ArrowRight
} from 'lucide-react';
import { VehicleData, MaintenanceRecord, PredictionItem } from './types';
import { DEMO_VEHICLES, INITIAL_MAINTENANCE_HISTORY } from './data/demoVehicles';
import { predictVehicleMaintenance } from './utils/predictionEngine';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { VehicleForm } from './components/VehicleForm';
import { PredictionResults } from './components/PredictionResults';
import { AIExplanationView } from './components/AIExplanationView';
import { MaintenanceHistoryTable } from './components/MaintenanceHistoryTable';
import { HealthAnalyticsCharts } from './components/HealthAnalyticsCharts';

export default function App() {
  // 1. Local State - Active Vehicle Data
  const [currentVehicle, setCurrentVehicle] = useState<VehicleData>(DEMO_VEHICLES[0]);

  // 2. Local State - Historical Maintenance Logs
  const [historyRecords, setHistoryRecords] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE_HISTORY);

  // 3. Local State - Active UI Tab Navigation
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'form' | 'predictions' | 'explanation' | 'history'>('dashboard');

  // 4. Local State - Prediction Animation State
  const [isPredicting, setIsPredicting] = useState(false);

  // 5. Local State - Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Re-run the rule-based prediction engine whenever currentVehicle changes
  const prediction = useMemo(() => {
    return predictVehicleMaintenance(currentVehicle);
  }, [currentVehicle]);

  // Show a temporary feedback notification
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Handle Form Submission with Simulated AI Inference Timing
  const handleFormSubmit = (updatedData: VehicleData) => {
    setIsPredicting(true);
    // Simulate algorithmic evaluation cycle
    setTimeout(() => {
      setCurrentVehicle(updatedData);
      setIsPredicting(false);
      triggerNotification(`Telemetry updated for ${updatedData.vehicleModel}. Predictions recalculated!`, 'success');
      setCurrentTab('predictions');
    }, 450);
  };

  // Switch between pre-loaded demo vehicles
  const handleSelectDemo = (demo: VehicleData) => {
    setIsPredicting(true);
    setTimeout(() => {
      setCurrentVehicle(demo);
      setIsPredicting(false);
      triggerNotification(`Loaded demo vehicle: ${demo.vehicleModel} (${demo.vehicleNumber})`, 'info');
    }, 200);
  };

  // Add new maintenance record and refresh vehicle status
  const handleAddMaintenanceRecord = (newRecord: MaintenanceRecord) => {
    setHistoryRecords(prev => [newRecord, ...prev]);
    // Refresh vehicle's last service metrics
    setCurrentVehicle(prev => ({
      ...prev,
      lastServiceMileage: newRecord.mileage,
      daysSinceLastService: 0,
      lastServiceDate: newRecord.date,
      // If full service or oil was recorded, improve physical conditions
      oilCondition: newRecord.serviceType.toLowerCase().includes('oil') ? 'Clean' : prev.oilCondition,
      engineCondition: newRecord.serviceType.toLowerCase().includes('engine') ? 'Good' : prev.engineCondition,
      batteryCondition: newRecord.serviceType.toLowerCase().includes('battery') ? 'Good' : prev.batteryCondition,
      tyreCondition: newRecord.serviceType.toLowerCase().includes('tyre') ? 'Good' : prev.tyreCondition,
    }));
    triggerNotification(`Service record logged: ${newRecord.serviceType}`, 'success');
  };

  // Quick service trigger from prediction card
  const handleQuickServiceFromCard = (item: PredictionItem) => {
    const newRecord: MaintenanceRecord = {
      id: 'hist-' + Date.now(),
      vehicleId: currentVehicle.id,
      date: new Date().toISOString().split('T')[0],
      mileage: currentVehicle.currentMileage,
      serviceType: item.name,
      cost: item.name === 'Oil Change' ? 120 : item.name === 'Tyre Replacement/Check' ? 450 : 250,
      technician: 'Certified Diagnostic Technician',
      status: 'Completed',
      notes: `Service executed following AI prediction recommendation: "${item.recommendedAction}"`
    };
    handleAddMaintenanceRecord(newRecord);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header & Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentVehicle={currentVehicle}
        onSelectVehicle={handleSelectDemo}
        overallRisk={prediction.overallRiskLevel}
        healthScore={prediction.overallHealthScore}
      />

      {/* 2. Floating Quick Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-blue-900 text-white border-blue-800'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 3. Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Navigation Breadcrumb & Quick Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>AutoPredict AI</span>
              <span>/</span>
              <span className="text-blue-600 capitalize">{currentTab}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {currentTab === 'dashboard' && 'Fleet Telemetry & Operational Health'}
              {currentTab === 'form' && 'Vehicle Diagnostics & Telemetry Form'}
              {currentTab === 'predictions' && 'Predictive Maintenance Recommendations'}
              {currentTab === 'explanation' && 'AI Prediction Explanation (XAI Model)'}
              {currentTab === 'history' && 'Historical Maintenance Records'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {currentTab !== 'form' && (
              <button
                onClick={() => setCurrentTab('form')}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Wrench className="w-3.5 h-3.5 text-slate-500" />
                <span>Adjust Vehicle Inputs</span>
              </button>
            )}

            {currentTab !== 'predictions' && (
              <button
                onClick={() => setCurrentTab('predictions')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>View Predictions</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Dashboard View */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            <DashboardOverview
              vehicle={currentVehicle}
              prediction={prediction}
              onNavigateTab={setCurrentTab}
            />

            {/* Health Analytics & Service Horizon Visualizer */}
            <HealthAnalyticsCharts
              vehicle={currentVehicle}
              prediction={prediction}
            />
          </div>
        )}

        {/* Tab 2: Vehicle Input Form View */}
        {currentTab === 'form' && (
          <div className="space-y-6">
            <VehicleForm
              initialData={currentVehicle}
              onSubmit={handleFormSubmit}
              onLoadDemo={handleSelectDemo}
              isPredicting={isPredicting}
            />
          </div>
        )}

        {/* Tab 3: Predictions & Subsystem Recommendations */}
        {currentTab === 'predictions' && (
          <div className="space-y-6">
            <PredictionResults
              prediction={prediction}
              onRecordMaintenance={handleQuickServiceFromCard}
              onGoToExplanation={() => setCurrentTab('explanation')}
            />

            {/* Also show analytics below prediction cards */}
            <HealthAnalyticsCharts
              vehicle={currentVehicle}
              prediction={prediction}
            />
          </div>
        )}

        {/* Tab 4: AI Prediction Explanation (XAI Architecture) */}
        {currentTab === 'explanation' && (
          <div className="space-y-6">
            <AIExplanationView
              prediction={prediction}
              vehicle={currentVehicle}
            />
          </div>
        )}

        {/* Tab 5: Maintenance History Log Table */}
        {currentTab === 'history' && (
          <div className="space-y-6">
            <MaintenanceHistoryTable
              records={historyRecords}
              currentVehicle={currentVehicle}
              onAddRecord={handleAddMaintenanceRecord}
            />
          </div>
        )}
      </main>

      {/* 4. Project Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AI Vehicle Maintenance Prediction System</span>
            <span>•</span>
            <span>College AI Immersion Project</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Client-Side Expert System (React + TypeScript)</span>
            <span>•</span>
            <button 
              onClick={() => setCurrentTab('explanation')}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              View Decision Logic
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
