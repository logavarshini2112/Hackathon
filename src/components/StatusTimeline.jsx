import React from 'react';
import { CheckCircle2, Clock, Activity, Flag } from 'lucide-react';

export default function StatusTimeline({ currentStatus = 'Open' }) {
  const steps = [
    { title: 'Feedback Submitted', desc: 'Received & logged in portal system', icon: CheckCircle2 },
    { title: 'Assigned to Staff', desc: 'Routed to department team lead', icon: Clock },
    { title: 'Under Review', desc: 'Investigation & action plan underway', icon: Activity },
    { title: 'Resolved', desc: 'Final resolution & feedback closed', icon: Flag },
  ];

  // Helper to calculate active step index based on status string
  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Open':
        return 0;
      case 'In Progress':
        return 1;
      case 'Resolved':
        return 3;
      case 'Declined':
        return 0;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Feedback Resolution Timeline
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Current Status: <span className="font-semibold text-blue-600">{currentStatus}</span>
        </p>
      </div>

      <div className="relative border-l-2 border-blue-100 ml-4 pl-6 space-y-8 py-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={idx} className="relative group">
              {/* Dot / Icon Node */}
              <div
                className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Text Description */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </h4>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold animate-pulse">
                      Active Step
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
