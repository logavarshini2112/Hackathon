import React, { useState } from 'react';
import { FileSpreadsheet, Download, Printer, FileText, CheckCircle2, Calendar, User } from 'lucide-react';

export default function ReportsSection({ feedbackRecords, adminProfile }) {
  const [reportGeneratedToast, setReportGeneratedToast] = useState(null);
  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate Report Summaries
  const total = feedbackRecords.length;
  const resolved = feedbackRecords.filter((r) => r.status === 'Resolved').length;
  const escalated = feedbackRecords.filter(
    (r) => r.escalationStatus === 'Escalated' || r.status === 'Escalated to Administrator'
  ).length;
  const inProgress = feedbackRecords.filter((r) => r.status === 'In Progress').length;
  const open = feedbackRecords.filter((r) => r.status === 'Open').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // 1. Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Reference ID',
      'Visitor Name',
      'Department',
      'Assigned Staff',
      'Feedback Type',
      'Priority',
      'Submission Date',
      'Days Pending',
      'Status',
      'Escalation Status',
    ];

    const rows = feedbackRecords.map((r) => [
      `"${r.referenceId}"`,
      `"${r.visitorName}"`,
      `"${r.department}"`,
      `"${r.assignedStaff}"`,
      `"${r.feedbackType}"`,
      `"${r.priority}"`,
      `"${r.submissionDate}"`,
      r.daysPending,
      `"${r.status}"`,
      `"${r.escalationStatus}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Visitor_Feedback_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportGeneratedToast('CSV dataset report downloaded successfully.');
    setTimeout(() => setReportGeneratedToast(null), 3000);
  };

  // 2. Print Report / PDF Handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Operational Reports &amp; Audit Engine</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generate formal executive feedback compliance reports and export CSV datasets.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {reportGeneratedToast && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{reportGeneratedToast}</span>
        </div>
      )}

      {/* Formal Report Preview Container */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
        
        {/* Report Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Executive Feedback Audit Report
            </h3>
            <p className="text-xs text-slate-500">Digital Visitor Feedback &amp; Experience Management System</p>
          </div>

          <div className="text-xs text-slate-600 space-y-1 sm:text-right">
            <p className="flex items-center sm:justify-end gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Report Date: {todayDate}</span>
            </p>
            <p className="flex items-center sm:justify-end gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Generated By: {adminProfile.name}</span>
            </p>
          </div>
        </div>

        {/* 4 Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-500 font-semibold uppercase text-[10px]">Total Logged</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
            <p className="text-[11px] text-slate-400">All submissions</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-500 font-semibold uppercase text-[10px]">Resolution Rate</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{resolutionRate}%</p>
            <p className="text-[11px] text-slate-400">{resolved} tickets closed</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-500 font-semibold uppercase text-[10px]">In Progress / Open</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{open + inProgress}</p>
            <p className="text-[11px] text-slate-400">Active tickets</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-500 font-semibold uppercase text-[10px]">Escalated (&gt;10 Days)</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{escalated}</p>
            <p className="text-[11px] text-slate-400">Admin review required</p>
          </div>
        </div>

        {/* Detailed Summary Tables */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Departmental Breakdown Summary
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Total Submissions</th>
                  <th className="py-2.5 px-4">Resolved</th>
                  <th className="py-2.5 px-4">Escalated</th>
                  <th className="py-2.5 px-4">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {['Maintenance', 'IT Support', 'Transport', 'Security', 'Cafeteria'].map((dept) => {
                  const deptTotal = feedbackRecords.filter((r) => r.department === dept).length;
                  const deptResolved = feedbackRecords.filter((r) => r.department === dept && r.status === 'Resolved').length;
                  const deptEscalated = feedbackRecords.filter((r) => r.department === dept && r.escalationStatus === 'Escalated').length;

                  return (
                    <tr key={dept}>
                      <td className="py-2.5 px-4 font-bold">{dept}</td>
                      <td className="py-2.5 px-4">{deptTotal}</td>
                      <td className="py-2.5 px-4 text-emerald-600 font-semibold">{deptResolved}</td>
                      <td className="py-2.5 px-4 text-rose-600 font-semibold">{deptEscalated}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          deptEscalated > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {deptEscalated > 0 ? 'Action Required' : 'Compliant'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
