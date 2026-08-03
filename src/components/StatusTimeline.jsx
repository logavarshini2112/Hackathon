import React from 'react';
import { CheckCircle2, Clock, Activity, Flag, XCircle, Flame } from 'lucide-react';

export default function StatusTimeline({ record, currentStatus }) {
  // Determine actual status and attributes from record object or fallback prop
  const status = record?.status || currentStatus || 'Open';
  const assignedStaff = record?.assignedStaff || record?.assigned_staff;
  const isAssigned = Boolean(assignedStaff && assignedStaff !== 'Unassigned');
  const escalationStatus = record?.escalationStatus || record?.escalation_status;
  const declineReason = record?.declineReason || record?.decline_reason;

  const createdAt = record?.createdAt || record?.created_at || record?.submissionDate || record?.date;
  const updatedAt = record?.updatedAt || record?.updated_at;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Build steps dynamically based on actual feedback record data
  const steps = [];

  // Step 1: Feedback Submitted (Always completed for any recorded feedback)
  steps.push({
    key: 'submitted',
    title: 'Feedback Submitted',
    desc: `Received & logged in portal system${createdAt ? ` • ${formatDate(createdAt)}` : ''}`,
    icon: CheckCircle2,
    isCompleted: true,
    isCurrent: status === 'Open' && !isAssigned,
    badge: null,
  });

  // Step 2: Assigned to Staff
  steps.push({
    key: 'assigned',
    title: 'Assigned to Staff',
    desc: isAssigned 
      ? `Assigned to ${assignedStaff}${record?.department ? ` (${record.department})` : ''}`
      : 'Pending staff assignment',
    icon: Clock,
    isCompleted: isAssigned,
    isCurrent: status === 'Open' && isAssigned,
    badge: isAssigned && status === 'Open' ? 'Assigned' : null,
  });

  // Step 3: In Progress
  const isInProgressOrBeyond = ['In Progress', 'Resolved', 'Declined', 'Escalated to Administrator'].includes(status) || escalationStatus === 'Escalated';
  steps.push({
    key: 'in-progress',
    title: 'In Progress',
    desc: status === 'In Progress' 
      ? 'Investigation & action plan underway by staff' 
      : (isInProgressOrBeyond ? 'Staff review & investigation completed' : 'Awaiting staff review'),
    icon: Activity,
    isCompleted: isInProgressOrBeyond,
    isCurrent: status === 'In Progress',
    badge: status === 'In Progress' ? 'Active Step' : null,
  });

  // Step 4: Dynamic Outcome Step (Resolved / Declined / Escalated to Administrator)
  if (status === 'Declined') {
    steps.push({
      key: 'declined',
      title: 'Declined',
      desc: `Feedback request declined.${declineReason ? ` Reason: ${declineReason}` : ''}${updatedAt ? ` • ${formatDate(updatedAt)}` : ''}`,
      icon: XCircle,
      isCompleted: true,
      isCurrent: true,
      badge: 'Declined',
      isError: true,
    });
  } else if (status === 'Escalated to Administrator' || escalationStatus === 'Escalated') {
    steps.push({
      key: 'escalated',
      title: 'Escalated to Administrator',
      desc: `Escalated to administrator for management review.${updatedAt ? ` • ${formatDate(updatedAt)}` : ''}`,
      icon: Flame,
      isCompleted: true,
      isCurrent: true,
      badge: 'Escalated',
      isWarning: true,
    });
  } else {
    const isResolved = status === 'Resolved';
    steps.push({
      key: 'resolved',
      title: 'Resolved',
      desc: isResolved 
        ? `Final resolution completed & feedback closed${updatedAt ? ` • ${formatDate(updatedAt)}` : ''}` 
        : 'Final resolution & feedback closed',
      icon: Flag,
      isCompleted: isResolved,
      isCurrent: isResolved,
      badge: isResolved ? 'Resolved' : null,
    });
  }

  // Helper for current status text color styling
  const getStatusColor = (st) => {
    switch (st) {
      case 'Resolved': return 'text-emerald-600';
      case 'In Progress': return 'text-amber-600';
      case 'Declined': return 'text-red-600';
      case 'Escalated to Administrator': return 'text-rose-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Feedback Resolution Timeline
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Current Status: <span className={`font-semibold ${getStatusColor(status)}`}>{status}</span>
        </p>
      </div>

      <div className="relative border-l-2 border-blue-100 ml-4 pl-6 space-y-8 py-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.isCompleted;
          const isCurrent = step.isCurrent;

          let iconBgStyle = 'bg-white border-slate-300 text-slate-400';
          if (step.isError) {
            iconBgStyle = 'bg-red-600 border-red-600 text-white shadow-md shadow-red-500/30';
          } else if (step.isWarning) {
            iconBgStyle = 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-500/30';
          } else if (isCompleted) {
            iconBgStyle = 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30';
          }

          return (
            <div key={step.key} className="relative group">
              {/* Dot / Icon Node */}
              <div
                className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${iconBgStyle}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Text Description */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </h4>
                  {isCurrent && step.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse ${
                      step.isError 
                        ? 'bg-red-100 text-red-700'
                        : step.isWarning
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-normal">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
