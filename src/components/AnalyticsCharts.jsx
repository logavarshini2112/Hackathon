import React from 'react';
import { BarChart3, TrendingUp, PieChart, Clock, Award, Star } from 'lucide-react';

export default function AnalyticsCharts() {
  const deptData = [
    { name: 'Maintenance', count: 8, percentage: 33 },
    { name: 'IT Support', count: 4, percentage: 17 },
    { name: 'Transport', count: 3, percentage: 13 },
    { name: 'Security', count: 3, percentage: 13 },
    { name: 'Cafeteria', count: 2, percentage: 8 },
    { name: 'Accounts', count: 2, percentage: 8 },
    { name: 'Library', count: 2, percentage: 8 },
  ];

  const monthlyTrend = [
    { month: 'Feb', tickets: 12 },
    { month: 'Mar', tickets: 18 },
    { month: 'Apr', tickets: 15 },
    { month: 'May', tickets: 22 },
    { month: 'Jun', tickets: 19 },
    { month: 'Jul', tickets: 24 },
  ];

  const statusDist = [
    { label: 'Open', count: 6, color: 'bg-blue-600', text: 'text-blue-600' },
    { label: 'In Progress', count: 5, color: 'bg-amber-500', text: 'text-amber-600' },
    { label: 'Resolved', count: 10, color: 'bg-emerald-500', text: 'text-emerald-600' },
    { label: 'Declined', count: 3, color: 'bg-red-500', text: 'text-red-600' },
    { label: 'Escalated', count: 4, color: 'bg-rose-700', text: 'text-rose-700' },
  ];

  const topStaff = [
    { name: 'Sarah Jenkins', dept: 'Maintenance', score: '98%', resolved: 14 },
    { name: 'Michael Chang', dept: 'IT Support', score: '96%', resolved: 11 },
    { name: 'David Miller', dept: 'Security', score: '95%', resolved: 9 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>System Analytics &amp; Performance Metrics</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Visual insights into department feedback loads, resolution speed trends, and top performers.
        </p>
      </div>

      {/* Grid 1: Department Distribution & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Department Distribution */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            <span>Department-wise Feedback Distribution</span>
          </h3>

          <div className="space-y-3 pt-2">
            {deptData.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{d.name}</span>
                  <span>{d.count} tickets ({d.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${d.percentage * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Visual */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Monthly Feedback Volume Trend</span>
          </h3>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-200">
            {monthlyTrend.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-blue-600">{m.tickets}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-500 hover:opacity-90"
                  style={{ height: `${(m.tickets / 25) * 100}%` }}
                />
                <span className="text-[11px] font-semibold text-slate-600">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid 2: Status Breakdown & Top Staff */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Feedback Status Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {statusDist.map((st) => (
              <div key={st.label} className="p-3.5 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                <p className="text-[11px] font-semibold text-slate-500">{st.label}</p>
                <p className={`text-2xl font-extrabold ${st.text}`}>{st.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Staff Performers */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Top Performing Staff</span>
          </h3>

          <div className="space-y-3 pt-1">
            {topStaff.map((stf, idx) => (
              <div key={stf.name} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{stf.name}</p>
                    <p className="text-[10px] text-slate-500">{stf.dept}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600">{stf.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
