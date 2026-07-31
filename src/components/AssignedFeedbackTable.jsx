import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Flame,
  Clock
} from 'lucide-react';

export default function AssignedFeedbackTable({ records, onViewDetails, onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState('');
  const [escalationFilter, setEscalationFilter] = useState(''); // Normal, Warning, Escalated
  const [sortBy, setSortBy] = useState('Default'); // Default, Newest, Oldest, Priority, Status

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const departmentsList = [
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

  // Filtering & Automatic Escalated-First Sorting
  const processedRecords = useMemo(() => {
    // 1. Filter
    let result = records.filter((item) => {
      const matchesSearch =
        item.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter ? item.department === departmentFilter : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesPriority = priorityFilter ? item.priority === priorityFilter : true;
      const matchesType = feedbackTypeFilter ? item.feedbackType === feedbackTypeFilter : true;
      const matchesEscalation = escalationFilter ? item.escalationStatus === escalationFilter : true;

      return matchesSearch && matchesDept && matchesStatus && matchesPriority && matchesType && matchesEscalation;
    });

    // 2. Sort: Always float Escalated tickets to top, then apply user sort
    result.sort((a, b) => {
      const aIsEscalated = a.escalationStatus === 'Escalated' || a.status === 'Escalated to Administrator';
      const bIsEscalated = b.escalationStatus === 'Escalated' || b.status === 'Escalated to Administrator';

      if (aIsEscalated && !bIsEscalated) return -1;
      if (!aIsEscalated && bIsEscalated) return 1;

      // Secondary sorting
      if (sortBy === 'Newest') return new Date(b.submissionDate) - new Date(a.submissionDate);
      if (sortBy === 'Oldest') return new Date(a.submissionDate) - new Date(b.submissionDate);
      if (sortBy === 'Priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'Status') return a.status.localeCompare(b.status);

      return b.daysPending - a.daysPending; // Default sort by urgency
    });

    return result;
  }, [records, searchTerm, departmentFilter, statusFilter, priorityFilter, feedbackTypeFilter, escalationFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(processedRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedRecords.slice(start, start + itemsPerPage);
  }, [processedRecords, currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Declined':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Escalated to Administrator':
      case 'Escalated':
        return 'bg-rose-950/10 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getEscalationBadge = (escalationStatus) => {
    switch (escalationStatus) {
      case 'Escalated':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1 w-max">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
            Escalated
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1 w-max">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Approaching
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Table Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Assigned Visitor Feedback</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              {records.length} Total
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage assigned issues, update ticket statuses, and monitor SLA progress deadlines.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search ref ID, visitor, subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">All Departments</option>
          {departmentsList.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open (Blue)</option>
          <option value="In Progress">In Progress (Orange)</option>
          <option value="Resolved">Resolved (Green)</option>
          <option value="Declined">Declined (Red)</option>
          <option value="Escalated to Administrator">Escalated (Dark Red)</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Feedback Type Filter */}
        <select
          value={feedbackTypeFilter}
          onChange={(e) => {
            setFeedbackTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">All Types</option>
          <option value="Complaint">Complaint</option>
          <option value="Suggestion">Suggestion</option>
          <option value="Appreciation">Appreciation</option>
        </select>

        {/* Escalation Status Filter (Requirement #2) */}
        <select
          value={escalationFilter}
          onChange={(e) => {
            setEscalationFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-rose-700 bg-rose-50/50 focus:outline-none focus:border-rose-500"
        >
          <option value="">Escalation: All</option>
          <option value="Normal">Normal</option>
          <option value="Warning">Warning (8-10 Days)</option>
          <option value="Escalated">Escalated (&gt;10 Days)</option>
        </select>

        {/* Sorting Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="Default">Sort: Urgent First</option>
          <option value="Newest">Sort: Newest First</option>
          <option value="Oldest">Sort: Oldest First</option>
          <option value="Priority">Sort: Priority</option>
          <option value="Status">Sort: Status</option>
        </select>
      </div>

      {/* Table Data Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Ref ID</th>
              <th className="py-3.5 px-4">Visitor</th>
              <th className="py-3.5 px-4">Dept</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">SLA Progress (10-Day Deadline)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Escalation</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((item) => {
                const isOverdue = item.daysPending >= 10;
                const slaPercentage = Math.min(Math.round((item.daysPending / 10) * 100), 100);

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isOverdue
                        ? 'bg-rose-50/60 hover:bg-rose-50 border-l-4 border-l-rose-600 font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Ref ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {isOverdue && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                        <span className="font-mono font-bold text-blue-600">{item.referenceId}</span>
                      </div>
                    </td>

                    {/* Visitor Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {item.visitorName}
                    </td>

                    {/* Dept */}
                    <td className="py-3.5 px-4">{item.department}</td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${
                        item.priority === 'High' ? 'text-red-600' : item.priority === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        {item.priority}
                      </span>
                    </td>

                    {/* SLA Progress Bar */}
                    <td className="py-3.5 px-4 min-w-[180px]">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-semibold text-slate-600">
                            {item.daysPending} Days Pending
                          </span>
                          <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                            {isOverdue ? 'OVERDUE (100%)' : `${slaPercentage}%`}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOverdue
                                ? 'bg-rose-600'
                                : item.daysPending >= 8
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${slaPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Escalation Status */}
                    <td className="py-3.5 px-4">
                      {getEscalationBadge(item.escalationStatus)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewDetails(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition-colors cursor-pointer"
                          title="View Ticket Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => onUpdateStatus(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                          title="Update Ticket Status"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No assigned feedback records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
        <div>
          Showing {processedRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, processedRecords.length)} of {processedRecords.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
