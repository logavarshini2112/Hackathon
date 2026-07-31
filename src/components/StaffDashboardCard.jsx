import React from 'react';

export default function StaffDashboardCard({ title, value, icon: Icon, iconBg, badgeText }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>

        <div className={`w-12 h-12 rounded-2xl ${iconBg || 'bg-blue-50 text-blue-600'} flex items-center justify-center shadow-xs`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {badgeText && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-medium text-slate-500">
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
}
