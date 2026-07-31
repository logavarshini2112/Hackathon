import React from 'react';
import { Flame, UserPlus, AlertOctagon, CheckCircle, ArrowRight } from 'lucide-react';

export default function EscalationManagement({ escalatedRecords, onAssignStaff, onMarkHighPriority, onCloseEscalation }) {
  if (!escalatedRecords || escalatedRecords.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Escalated Feedback</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          All visitor feedback tickets are within normal SLA response deadlines (&lt;10 days).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-rose-900/20 space-y-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-700/60 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-400/30">
            <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>System Escalation Command Center</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-extrabold">
                {escalatedRecords.length} Unresolved
              </span>
            </h3>
            <p className="text-xs text-rose-200/80">
              Feedback pending over 10 days requiring administrator intervention or reassignment.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {escalatedRecords.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-rose-400/20 space-y-4 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-rose-300 text-base">
                {item.referenceId}
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider">
                Escalated (&gt;10 Days)
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-rose-100">
              <h4 className="font-bold text-white text-base leading-snug">{item.subject}</h4>
              <div className="grid grid-cols-2 gap-2 pt-1 text-slate-200">
                <p><span className="text-rose-300">Dept:</span> {item.department}</p>
                <p><span className="text-rose-300">Visitor:</span> {item.visitorName}</p>
                <p><span className="text-rose-300">Assigned Staff:</span> <strong className="text-white">{item.assignedStaff}</strong></p>
                <p><span className="text-rose-300">Days Pending:</span> <strong className="text-rose-300">{item.daysPending} Days</strong></p>
              </div>
              <p className="text-rose-200/90 italic pt-1 border-t border-rose-700/50 mt-2">
                Escalated Reason: {item.reason || "No staff resolution recorded for more than 10 days."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rose-700/40">
              <button
                onClick={() => onAssignStaff(item)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Reassign Staff</span>
              </button>

              <button
                onClick={() => onMarkHighPriority(item.id)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>High Priority</span>
              </button>

              <button
                onClick={() => onCloseEscalation(item.id)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Close Ticket</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
