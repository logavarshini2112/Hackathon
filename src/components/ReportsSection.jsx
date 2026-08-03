import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  User, 
  Filter, 
  X, 
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsSection({ feedbackRecords = [], adminProfile = {}, settings = {} }) {
  const [reportGeneratedToast, setReportGeneratedToast] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Report Configuration State
  const [reportType, setReportType] = useState('full'); // 'department', 'full', 'date', 'range', 'month'
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState('08');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Applied Report Configuration (used for rendering preview & print)
  const [appliedConfig, setAppliedConfig] = useState({
    type: 'full',
    title: 'Full System Feedback Audit Report',
    filterText: 'All Departments & All Feedback Records',
    dept: '',
    date: '',
    fromDate: '',
    toDate: '',
    month: '',
    year: '',
    isConfigured: true,
  });

  const departmentOptions = [
    'Administration',
    'Accounts',
    'Library',
    'Transport',
    'Hostel',
    'Cafeteria',
    'Maintenance',
    'IT Support',
    'Security',
    'Others',
  ];

  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Filter feedback records based on applied configuration
  const filteredRecords = useMemo(() => {
    return feedbackRecords.filter((r) => {
      if (appliedConfig.type === 'department') {
        return r.department === appliedConfig.dept;
      }
      if (appliedConfig.type === 'date') {
        const recordDate = r.submissionDate || (r.createdAt ? r.createdAt.split('T')[0] : '');
        return recordDate === appliedConfig.date;
      }
      if (appliedConfig.type === 'range') {
        const recordDate = r.submissionDate || (r.createdAt ? r.createdAt.split('T')[0] : '');
        return recordDate >= appliedConfig.fromDate && recordDate <= appliedConfig.toDate;
      }
      if (appliedConfig.type === 'month') {
        const recordDate = r.submissionDate || (r.createdAt ? r.createdAt.split('T')[0] : '');
        if (!recordDate) return false;
        const [y, m] = recordDate.split('-');
        return y === appliedConfig.year && m === appliedConfig.month;
      }
      return true; // Full System Report
    });
  }, [feedbackRecords, appliedConfig]);

  // Compute Metrics from Filtered Records
  const metrics = useMemo(() => {
    const total = filteredRecords.length;
    const open = filteredRecords.filter((r) => r.status === 'Open').length;
    const inProgress = filteredRecords.filter((r) => r.status === 'In Progress').length;
    const resolved = filteredRecords.filter((r) => r.status === 'Resolved').length;
    const declined = filteredRecords.filter((r) => r.status === 'Declined').length;
    const escalated = filteredRecords.filter(
      (r) => r.escalationStatus === 'Escalated' || r.status === 'Escalated to Administrator'
    ).length;
    const warning = filteredRecords.filter((r) => r.escalationStatus === 'Warning').length;
    const highPriority = filteredRecords.filter((r) => r.priority === 'High').length;

    return { total, open, inProgress, resolved, declined, escalated, warning, highPriority };
  }, [filteredRecords]);

  // Handle Apply Configuration from Modal
  const handleApplyConfiguration = () => {
    let title = 'Executive Feedback Audit Report';
    let filterText = 'Full System Report';

    if (reportType === 'department') {
      title = `Departmental Report - ${selectedDept || 'All'}`;
      filterText = `Department: ${selectedDept || 'None Selected'}`;
    } else if (reportType === 'date') {
      title = `Daily Feedback Report (${selectedDate})`;
      filterText = `Specific Date: ${selectedDate}`;
    } else if (reportType === 'range') {
      title = `Date Range Feedback Report (${fromDate} to ${toDate})`;
      filterText = `Date Range: ${fromDate} to ${toDate}`;
    } else if (reportType === 'month') {
      const monthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label || selectedMonth;
      title = `Monthly Feedback Report (${monthLabel} ${selectedYear})`;
      filterText = `Month: ${monthLabel} ${selectedYear}`;
    }

    setAppliedConfig({
      type: reportType,
      title,
      filterText,
      dept: selectedDept,
      date: selectedDate,
      fromDate,
      toDate,
      month: selectedMonth,
      year: selectedYear,
      isConfigured: true,
    });

    setIsConfigModalOpen(false);
    setReportGeneratedToast(`Report configured for scope: ${filterText}`);
    setTimeout(() => setReportGeneratedToast(null), 3500);
  };

  // CSV Export for filtered dataset
  const handleExportCSV = () => {
    const headers = [
      'Reference ID',
      'Visitor Name',
      'Department',
      'Feedback Type',
      'Subject',
      'Priority',
      'Assigned Staff',
      'Status',
      'Escalation Status',
      'Days Pending',
      'Submission Date',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.referenceId}"`,
      `"${r.visitorName}"`,
      `"${r.department}"`,
      `"${r.feedbackType}"`,
      `"${r.subject}"`,
      `"${r.priority}"`,
      `"${r.assignedStaff}"`,
      `"${r.status}"`,
      `"${r.escalationStatus}"`,
      r.daysPending,
      `"${r.submissionDate}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Visitor_Feedback_Report_${appliedConfig.type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Action 1: Print Report (Browser Print Dialog)
  const handlePrintReport = () => {
    window.print();
  };

  // Action 2: Download PDF (Direct PDF File Download using jsPDF + autoTable)
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    setErrorMessage(null);

    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const institution = settings.institutionName || 'Digital Experience & Visitor Portal';
      const title = appliedConfig.title;
      const filterText = `Filter Scope: ${appliedConfig.filterText}`;
      const generatedAt = `Generated: ${todayDateFormatted}`;
      const adminName = `Administrator: ${adminProfile.name || 'System Admin'}`;

      // Document Title & Header
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235); // Blue-600
      doc.setFont('helvetica', 'bold');
      doc.text(institution.toUpperCase(), 14, 15);

      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, 23);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.setFont('helvetica', 'normal');
      doc.text(filterText, 14, 29);

      doc.setFontSize(8);
      doc.text(`${generatedAt} | ${adminName}`, 14, 34);

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 37, 196, 37);

      // Summary Metrics Grid (Boxed)
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 40, 182, 22, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 40, 182, 22, 'S');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);

      const m = metrics;
      const metricText1 = `Total: ${m.total}   |   Open: ${m.open}   |   In Progress: ${m.inProgress}   |   Resolved: ${m.resolved}`;
      const metricText2 = `Declined: ${m.declined}   |   Escalated (>10d): ${m.escalated}   |   Warning (8-10d): ${m.warning}   |   High Priority: ${m.highPriority}`;

      doc.text(metricText1, 18, 48);
      doc.text(metricText2, 18, 56);

      // Detailed Feedback Records Table
      const tableHeaders = [
        ['Ref ID', 'Visitor Name', 'Department', 'Type', 'Subject', 'Priority', 'Staff', 'Status', 'Escalation', 'Pending', 'Date']
      ];

      const tableRows = filteredRecords.map((r) => [
        r.referenceId || '',
        r.visitorName || '',
        r.department || '',
        r.feedbackType || '',
        r.subject ? (r.subject.length > 22 ? r.subject.substring(0, 19) + '...' : r.subject) : '',
        r.priority || '',
        r.assignedStaff || '',
        r.status || '',
        r.escalationStatus || '',
        `${r.daysPending || 0}d`,
        r.submissionDate || ''
      ]);

      autoTable(doc, {
        startY: 67,
        head: tableHeaders,
        body: tableRows.length > 0 ? tableRows : [['-', 'No matching records found', '-', '-', '-', '-', '-', '-', '-', '-', '-']],
        theme: 'striped',
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [30, 41, 59],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [37, 99, 235] },
          4: { cellWidth: 32 },
        },
        margin: { top: 67, left: 14, right: 14 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, 196, 290, { align: 'right' });
          doc.text('Digital Visitor Feedback & Operations Portal', 14, 290);
        }
      });

      const scopeName = (appliedConfig.dept || appliedConfig.type || 'Report').replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Visitor_Feedback_Report_${scopeName}_${Date.now()}.pdf`);

      setReportGeneratedToast('PDF downloaded successfully.');
      setTimeout(() => setReportGeneratedToast(null), 3500);
    } catch (err) {
      console.error('PDF Generation Failed:', err);
      setErrorMessage('Failed to generate PDF. Please try again.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Executive Report Generator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure report scope criteria by department, date, month, or range, and generate PDF or Print output.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Configure Report Button */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            <span>Configure Report</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* Print Report Button */}
          <button
            onClick={handlePrintReport}
            disabled={!appliedConfig.isConfigured || isGeneratingPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={!appliedConfig.isConfigured || isGeneratingPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {reportGeneratedToast && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{reportGeneratedToast}</span>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active Scope Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900 print:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span><strong>Active Scope:</strong> {appliedConfig.filterText} ({filteredRecords.length} records matching)</span>
        </div>
        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="text-blue-700 font-bold hover:underline cursor-pointer shrink-0"
        >
          Change Criteria
        </button>
      </div>

      {/* Formal Printable Document Layout */}
      <div id="printable-report-content" className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-6 print:bg-white print:p-0 print:border-none">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-blue-600 tracking-wider">
              {settings.institutionName || 'Digital Experience & Visitor Portal'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {appliedConfig.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Filter Details: <strong>{appliedConfig.filterText}</strong>
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-1 sm:text-right">
            <p className="flex items-center sm:justify-end gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Generated: {todayDateFormatted}</span>
            </p>
            <p className="flex items-center sm:justify-end gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Administrator: {adminProfile.name || 'System Admin'}</span>
            </p>
          </div>
        </div>

        {/* 8 Metric Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-500 font-semibold uppercase text-[10px]">Total Feedback</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{metrics.total}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-blue-600 font-semibold uppercase text-[10px]">Open</p>
            <p className="text-xl font-bold text-blue-700 mt-0.5">{metrics.open}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-amber-600 font-semibold uppercase text-[10px]">In Progress</p>
            <p className="text-xl font-bold text-amber-700 mt-0.5">{metrics.inProgress}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-emerald-600 font-semibold uppercase text-[10px]">Resolved</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{metrics.resolved}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-red-600 font-semibold uppercase text-[10px]">Declined</p>
            <p className="text-xl font-bold text-red-700 mt-0.5">{metrics.declined}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-rose-700 font-semibold uppercase text-[10px]">Escalated (&gt;10d)</p>
            <p className="text-xl font-bold text-rose-800 mt-0.5">{metrics.escalated}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-amber-700 font-semibold uppercase text-[10px]">Warning (8-10d)</p>
            <p className="text-xl font-bold text-amber-800 mt-0.5">{metrics.warning}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <p className="text-rose-600 font-semibold uppercase text-[10px]">High Priority</p>
            <p className="text-xl font-bold text-rose-700 mt-0.5">{metrics.highPriority}</p>
          </div>
        </div>

        {/* Detailed Feedback Records Table */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Detailed Feedback Audit Records ({filteredRecords.length})</span>
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-3">Ref ID</th>
                  <th className="py-2.5 px-3">Visitor Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Assigned Staff</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Escalation</th>
                  <th className="py-2.5 px-3">Pending</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{item.referenceId}</td>
                      <td className="py-2.5 px-3 font-medium">{item.visitorName}</td>
                      <td className="py-2.5 px-3">{item.department}</td>
                      <td className="py-2.5 px-3">{item.feedbackType}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">{item.subject}</td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={item.priority === 'High' ? 'text-red-600' : 'text-slate-700'}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{item.assignedStaff}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-800">{item.status}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{item.escalationStatus}</td>
                      <td className="py-2.5 px-3 font-bold">{item.daysPending}d</td>
                      <td className="py-2.5 px-3 text-slate-500">{item.submissionDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-500">
                      No feedback records match the selected report criteria ({appliedConfig.filterText}).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* REPORT CONFIGURATION MODAL */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            
            {/* Close Modal */}
            <button
              onClick={() => setIsConfigModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <span>Configure Report Scope</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select report scope and filter options before generating the report document.
              </p>
            </div>

            {/* Report Type Radio Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Report Scope Type
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  reportType === 'department' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900' : 'border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reportType"
                    value="department"
                    checked={reportType === 'department'}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>A. Department-wise Report</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  reportType === 'full' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900' : 'border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reportType"
                    value="full"
                    checked={reportType === 'full'}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>B. Full System Report</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  reportType === 'date' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900' : 'border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reportType"
                    value="date"
                    checked={reportType === 'date'}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>C. Specific Date Report</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  reportType === 'range' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900' : 'border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reportType"
                    value="range"
                    checked={reportType === 'range'}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>D. Date Range Report</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all sm:col-span-2 ${
                  reportType === 'month' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900' : 'border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reportType"
                    value="month"
                    checked={reportType === 'month'}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>E. Month-wise Report</span>
                </label>
              </div>
            </div>

            {/* Dynamic Filter Input Fields based on Report Type */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              
              {/* Option A: Department Selector */}
              {reportType === 'department' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select Target Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="">Select Department...</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Option B: Full System */}
              {reportType === 'full' && (
                <p className="text-xs text-slate-600 italic">
                  Full System Report includes all feedback tickets across all departments with zero date restrictions.
                </p>
              )}

              {/* Option C: Specific Date */}
              {reportType === 'date' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select Target Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              )}

              {/* Option D: Date Range */}
              {reportType === 'range' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">From Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">To Date</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Option E: Month-wise */}
              {reportType === 'month' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Select Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                    >
                      {monthOptions.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Year</label>
                    <input
                      type="number"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyConfiguration}
                disabled={reportType === 'department' && !selectedDept}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply Configuration</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
