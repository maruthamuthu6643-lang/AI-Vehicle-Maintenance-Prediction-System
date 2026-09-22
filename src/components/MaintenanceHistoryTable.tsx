import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Plus, 
  Calendar, 
  Wrench, 
  UserCheck, 
  DollarSign, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X
} from 'lucide-react';
import { MaintenanceRecord, VehicleData } from '../types';

interface MaintenanceHistoryTableProps {
  records: MaintenanceRecord[];
  currentVehicle: VehicleData;
  onAddRecord: (record: MaintenanceRecord) => void;
}

export const MaintenanceHistoryTable: React.FC<MaintenanceHistoryTableProps> = ({
  records,
  currentVehicle,
  onAddRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVehicleOnly, setFilterVehicleOnly] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Record Form State
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMileage, setNewMileage] = useState(currentVehicle.currentMileage);
  const [newServiceType, setNewServiceType] = useState('Scheduled Oil & Filter Change');
  const [newCost, setNewCost] = useState(120);
  const [newTechnician, setNewTechnician] = useState('Automotive Service Tech');
  const [newNotes, setNewNotes] = useState('Routine periodic inspection and fluid replacement.');

  const filteredRecords = records.filter(rec => {
    if (filterVehicleOnly && rec.vehicleId !== currentVehicle.id) {
      return false;
    }
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      rec.serviceType.toLowerCase().includes(q) ||
      rec.technician.toLowerCase().includes(q) ||
      rec.notes.toLowerCase().includes(q) ||
      rec.mileage.toString().includes(q) ||
      rec.date.includes(q)
    );
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MaintenanceRecord = {
      id: 'hist-' + Date.now(),
      vehicleId: currentVehicle.id,
      date: newDate,
      mileage: Number(newMileage),
      serviceType: newServiceType,
      cost: Number(newCost),
      technician: newTechnician,
      status: 'Completed',
      notes: newNotes
    };
    onAddRecord(created);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <History className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Maintenance History & Service Log
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Historical work orders, parts replacement records, and technician signatures for auditability.
            </p>
          </div>

          <button
            onClick={() => {
              setNewMileage(currentVehicle.currentMileage);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Service Record</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by service type, technician, or notes..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-300 select-none">
              <input
                type="checkbox"
                checked={filterVehicleOnly}
                onChange={(e) => setFilterVehicleOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Filter for current vehicle ({currentVehicle.vehicleNumber})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="px-6 pb-6 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] bg-slate-50/50">
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Mileage</th>
              <th className="py-3 px-3">Service Details</th>
              <th className="py-3 px-3">Technician / Workshop</th>
              <th className="py-3 px-3">Cost ($)</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Notes & Observations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-medium text-slate-800 whitespace-nowrap">
                    {rec.mileage.toLocaleString()} km
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{rec.serviceType}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.technician}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                    ${rec.cost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate" title={rec.notes}>
                    {rec.notes}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <History className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">No maintenance records found</p>
                    <p className="text-[11px] text-slate-400">
                      Try adjusting search filters or log a new completed service record.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Maintenance Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Log Completed Maintenance Service
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Odometer Mileage (km) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newMileage}
                    onChange={(e) => setNewMileage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Category / Description *
                </label>
                <select
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Engine Oil & Filter Replacement">Engine Oil & Filter Replacement</option>
                  <option value="Brake Pad & Rotor Inspection">Brake Pad & Rotor Inspection</option>
                  <option value="Battery Health Test & Terminal Service">Battery Health Test & Terminal Service</option>
                  <option value="Tyre Rotation, Balancing & Alignment">Tyre Rotation, Balancing & Alignment</option>
                  <option value="Major Powertrain Engine Tune-Up">Major Powertrain Engine Tune-Up</option>
                  <option value="Comprehensive Multi-Point General Service">Comprehensive Multi-Point General Service</option>
                  <option value="Transmission Fluid Flush">Transmission Fluid Flush</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Cost ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Technician / Workshop *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTechnician}
                    onChange={(e) => setNewTechnician(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Notes / Parts Installed
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
