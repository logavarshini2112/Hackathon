import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function StatusUpdateModal({ record, onClose, onUpdateSuccess }) {
  if (!record) return null;

  const [selectedStatus, setSelectedStatus] = useState(record.status || 'In Progress');
  const [declineReason, setDeclineReason] = useState(record.declineReason || '');
  const [error, setError] = useState('');
  const [showAdminNotice, setShowAdminNotice] = useState(false);

  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Declined'];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStatus === 'Declined' && !declineReason.trim()) {
      setError('Please provide a mandatory reason for declining this feedback.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication session expired. Please log in as Staff.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/staff/update-status/${record.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: selectedStatus,
          declineReason: selectedStatus === 'Declined' ? declineReason.trim() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update ticket status.');
      }

      const updatedRecord = {
        ...record,
        status: data.status,
        declineReason: data.decline_reason || data.declineReason,
        escalationStatus: data.escalation_status || data.escalationStatus || record.escalationStatus,
      };

      setIsSubmitting(false);
      onUpdateSuccess(updatedRecord);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Server connection error.');
    }
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

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Update Ticket Status
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Ref: {record.referenceId} &bull; {record.visitorName}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Status Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-600"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Mandatory Reason for Declining */}
          {selectedStatus === 'Declined' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-semibold text-red-700 uppercase tracking-wider">
                Reason for Declining <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => {
                  setDeclineReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Explain why this feedback or complaint is being declined..."
                className={`w-full px-4 py-3 rounded-xl border text-xs text-slate-900 bg-white focus:outline-none ${
                  error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Notification Simulation Warning Banner */}
          {(record.daysPending >= 10 || selectedStatus === 'Escalated to Administrator') && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span className="font-bold">Admin Notification Simulation:</span> Administrator has been notified about this unresolved ticket (&gt;10 days pending).
              </div>
            </div>
          )}

          {/* Buttons */}
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
