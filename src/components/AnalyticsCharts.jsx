import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, PieChart, Clock, Award } from 'lucide-react';

export default function AnalyticsCharts({ feedbackRecords = [], staffList = [] }) {
  // 1. Dynamic Department Distribution from real MySQL feedback records
  const deptData = useMemo(() => {
    const counts = {};
    const total = feedbackRecords.length;
    
    feedbackRecords.forEach((r) => {
      if (r.department) {
        counts[r.department] = (counts[r.department] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [feedbackRecords]);

  // 2. Dynamic Monthly Trend from real MySQL feedback submission dates
  const monthlyTrend = useMemo(() => {
    const monthsMap = {};
    feedbackRecords.forEach((r) => {
      if (r.submissionDate) {
        const d = new Date(r.submissionDate);
        if (!isNaN(d.getTime())) {
          const monthName = d.toLocaleString('en-US', { month: 'short' });
          monthsMap[monthName] = (monthsMap[monthName] || 0) + 1;
        }
      }
    });

    // Default order or extracted order
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const activeMonths = monthNames.filter((m) => monthsMap[m] !== undefined);
    
    if (activeMonths.length === 0) {
      const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
      return [{ month: currentMonth, tickets: feedbackRecords.length }];
    }

    return activeMonths.map((month) => ({
      month,
      tickets: monthsMap[month] || 0,
    }));
  }, [feedbackRecords]);

  // 3. Dynamic Status Breakdown from real MySQL feedback records
  const statusDist = useMemo(() => {
    const openCount = feedbackRecords.filter((r) => r.status === 'Open').length;
    const inProgressCount = feedbackRecords.filter((r) => r.status === 'In Progress').length;
    const resolvedCount = feedbackRecords.filter((r) => r.status === 'Resolved').length;
    const declinedCount = feedbackRecords.filter((r) => r.status === 'Declined').length;
    const escalatedCount = feedbackRecords.filter(
      (r) => r.escalationStatus === 'Escalated' || r.status === 'Escalated to Administrator'
    ).length;

    return [
      { label: 'Open', count: openCount, color: 'bg-blue-600', text: 'text-blue-600' },
      { label: 'In Progress', count: inProgressCount, color: 'bg-amber-500', text: 'text-amber-600' },
      { label: 'Resolved', count: resolvedCount, color: 'bg-emerald-500', text: 'text-emerald-600' },
      { label: 'Declined', count: declinedCount, color: 'bg-red-500', text: 'text-red-600' },
      { label: 'Escalated', count: escalatedCount, color: 'bg-rose-700', text: 'text-rose-700' },
    ];
  }, [feedbackRecords]);

  // 4. Dynamic Top Staff Performers from real MySQL staff & feedback data
  const topStaff = useMemo(() => {
    return staffList
      .map((stf) => {
        const assigned = feedbackRecords.filter((r) => r.assignedStaff === stf.staffName);
        const resolved = assigned.filter((r) => r.status === 'Resolved').length;
        const total = assigned.length;
        const scoreVal = total > 0 ? Math.round((resolved / total) * 100) : 100;
        return {
          name: stf.staffName || stf.name,
          dept: stf.department,
          resolved,
          scoreVal,
          score: `${scoreVal}%`,
        };
      })
      .sort((a, b) => b.resolved - a.resolved || b.scoreVal - a.scoreVal)
      .slice(0, 5);
  }, [staffList, feedbackRecords]);

  const maxMonthlyTickets = Math.max(...monthlyTrend.map((m) => m.tickets), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>System Analytics &amp; Performance Metrics</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time database metrics detailing feedback distribution, status breakdown, and top performers.
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
            {deptData.length > 0 ? (
              deptData.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{d.name}</span>
                    <span>{d.count} tickets ({d.percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${Math.min(d.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No feedback records logged yet.</p>
            )}
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
                  style={{ height: `${Math.max((m.tickets / maxMonthlyTickets) * 100, 10)}%` }}
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
            {topStaff.length > 0 ? (
              topStaff.map((stf, idx) => (
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
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-2">No staff performance data available.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
