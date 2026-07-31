import React from 'react';
import { X, FileText, User, Calendar, Clock, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import StatusTimeline from './StatusTimeline';

export default function FeedbackDetailsModal({ record, onClose }) {
  if (!record) return null;

  const isOverdue = record.daysPending >= 10;
  const slaPercentage = Math.min(Math.round((record.daysPending / 10) * 100), 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-blue-600">
                {record.referenceId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {record.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {record.subject}
            </h3>
          </div>
        </div>

        {/* Visitor Info Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-500">Submitted by:</span>
            <span className="font-bold text-slate-900">{record.visitorName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-500">Date:</span>
            <span className="font-semibold text-slate-900">{record.submissionDate}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <p className="text-slate-400 font-medium">Department</p>
            <p className="font-bold text-slate-800">{record.department}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Type</p>
            <p className="font-bold text-slate-800">{record.feedbackType}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Priority</p>
            <p className="font-bold text-slate-800">{record.priority}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Incident Date</p>
            <p className="font-bold text-slate-800">{record.incidentDate || record.submissionDate}</p>
          </div>
        </div>

        {/* SLA Progress Bar Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              SLA Countdown (10 Days Response Deadline)
            </span>
            <span className={`font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
              {record.daysPending} Days Pending ({isOverdue ? 'OVERDUE' : `${slaPercentage}%`})
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverdue ? 'bg-rose-600' : record.daysPending >= 8 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${slaPercentage}%` }}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Detailed Description
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-100">
            {record.description}
          </p>
        </div>

        {/* Decline Reason if present */}
        {record.declineReason && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Decline Reason</span>
            </h4>
            <p className="text-xs text-red-700 leading-relaxed p-4 rounded-xl bg-red-50 border border-red-200">
              {record.declineReason}
            </p>
          </div>
        )}

        {/* Image Attachment Preview if present */}
        {record.image && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Attached Image Proof</span>
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56">
              <img
                src={record.image}
                alt="Attachment Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Embedded Status Timeline */}
        <StatusTimeline currentStatus={record.status} />

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
