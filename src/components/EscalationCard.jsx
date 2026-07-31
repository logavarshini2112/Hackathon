import React from 'react';
import { Flame, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';

export default function EscalationCard({ escalatedItems, onViewDetails }) {
  if (!escalatedItems || escalatedItems.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-rose-900/20 space-y-6 relative overflow-hidden">
      
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-700/60 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-400/30">
            <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Escalated Feedback Alerts</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-extrabold">
                {escalatedItems.length} Urgent
              </span>
            </h3>
            <p className="text-xs text-rose-200/80">
              Tickets pending over 10 days requiring executive administrative review.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Notification Simulation Banner */}
      <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-600/40 text-xs text-rose-200 flex items-start gap-3 relative z-10">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-white text-sm">
            Administrator Notification Simulation Active
          </p>
          <p className="text-rose-200/90">
            Administrator has been notified about unresolved feedback pending over 10 days.
          </p>
        </div>
      </div>

      {/* List of Escalated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {escalatedItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-rose-400/20 space-y-3 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-rose-300 text-sm">
                {item.referenceId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase">
                Status: Escalated
              </span>
            </div>

            <div className="space-y-1 text-xs text-rose-100">
              <p className="font-bold text-white text-sm truncate">{item.subject}</p>
              <p><span className="text-rose-300">Department:</span> {item.department}</p>
              <p><span className="text-rose-300">Visitor:</span> {item.visitorName}</p>
              <p><span className="text-rose-300">Pending Duration:</span> <strong className="text-rose-300">{item.daysPending} Days</strong> (&gt;10 Days threshold)</p>
              <p className="text-rose-200/90 italic pt-1">
                Reason: No staff resolution recorded for more than 10 days.
              </p>
            </div>

            <button
              onClick={() => onViewDetails(item)}
              className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Inspect Escalated Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
