import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RoleCard({ role, description, buttonText, targetRoute, icon: Icon, badgeText }) {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between">
      <div>
        {/* Top Badge & Icon Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
            <Icon className="w-7 h-7" />
          </div>
          {badgeText && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {badgeText}
            </span>
          )}
        </div>

        {/* Role Title */}
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
          {role}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={() => navigate(targetRoute)}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
