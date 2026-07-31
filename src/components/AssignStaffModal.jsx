import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';

export default function AssignStaffModal({ record, staffList, onClose, onAssignSuccess }) {
  if (!record) return null;

  const [selectedStaff, setSelectedStaff] = useState(
    record.assignedStaff !== 'Unassigned' ? record.assignedStaff : staffList[0]?.staffName || ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStaff) return;

    onAssignSuccess(record.id, selectedStaff);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Assign Staff Member
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Ticket: {record.referenceId} &bull; Dept: {record.department}
            </p>
          </div>
        </div>

        {/* Current Ticket Details summary */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
          <p className="font-semibold text-slate-800 truncate">{record.subject}</p>
          <p className="text-slate-500">Currently Assigned: <span className="font-bold text-blue-600">{record.assignedStaff}</span></p>
        </div>

        {/* Assign Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select Staff Personnel
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-600"
            >
              {staffList.map((stf) => (
                <option key={stf.id} value={stf.staffName}>
                  {stf.staffName} ({stf.department} &bull; Score: {stf.performanceScore})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Assign Staff
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
