import React from 'react';

export default function AdminDashboardCard({ title, value, icon: Icon, iconBg, badgeText }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>

        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${iconBg || 'bg-blue-50 text-blue-600'} flex items-center justify-center shadow-xs shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {badgeText && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center text-[11px] font-medium text-slate-500">
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
}
