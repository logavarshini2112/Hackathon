import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  UserPlus, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Flame 
} from 'lucide-react';

export default function FeedbackManagementTable({ records, onViewDetails, onAssignStaff, onCloseFeedback }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState('');
  const [escalationFilter, setEscalationFilter] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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

  // Filtering & Sorting
  const processedRecords = useMemo(() => {
    let result = records.filter((item) => {
      const matchesSearch =
        item.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedStaff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter ? item.department === departmentFilter : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesPriority = priorityFilter ? item.priority === priorityFilter : true;
      const matchesType = feedbackTypeFilter ? item.feedbackType === feedbackTypeFilter : true;
      const matchesEscalation = escalationFilter ? item.escalationStatus === escalationFilter : true;

      return matchesSearch && matchesDept && matchesStatus && matchesPriority && matchesType && matchesEscalation;
    });

    result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.submissionDate) - new Date(a.submissionDate);
      if (sortBy === 'Oldest') return new Date(a.submissionDate) - new Date(b.submissionDate);
      if (sortBy === 'Priority') {
        const pOrder = { High: 3, Medium: 2, Low: 1 };
        return pOrder[b.priority] - pOrder[a.priority];
      }
      if (sortBy === 'Status') return a.status.localeCompare(b.status);
      return 0;
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
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1 w-max">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
            Escalated
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1 w-max">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Warning
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
      
      {/* Header & Global Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Feedback Management Controls</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              {records.length} Total Records
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor all incoming visitor feedback, assign staff leads, and override ticket statuses.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search ID, visitor, staff, dept..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">Dept: All</option>
          {departmentsList.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">Status: All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Declined">Declined</option>
          <option value="Escalated to Administrator">Escalated</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">Priority: All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={feedbackTypeFilter}
          onChange={(e) => {
            setFeedbackTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">Type: All</option>
          <option value="Complaint">Complaint</option>
          <option value="Suggestion">Suggestion</option>
          <option value="Appreciation">Appreciation</option>
        </select>

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
          <option value="Warning">Warning</option>
          <option value="Escalated">Escalated</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="Newest">Sort: Newest</option>
          <option value="Oldest">Sort: Oldest</option>
          <option value="Priority">Sort: Priority</option>
          <option value="Status">Sort: Status</option>
        </select>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Ref ID</th>
              <th className="py-3.5 px-4">Visitor</th>
              <th className="py-3.5 px-4">Dept</th>
              <th className="py-3.5 px-4">Assigned Staff</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Days</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Escalation</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{item.referenceId}</td>
                  <td className="py-3.5 px-4 font-medium">{item.visitorName}</td>
                  <td className="py-3.5 px-4">{item.department}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.assignedStaff === 'Unassigned' ? (
                      <span className="text-amber-600 italic">Unassigned</span>
                    ) : (
                      item.assignedStaff
                    )}
                  </td>
                  <td className="py-3.5 px-4">{item.feedbackType}</td>
                  <td className="py-3.5 px-4 font-semibold">
                    <span className={item.priority === 'High' ? 'text-red-600' : 'text-slate-700'}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.submissionDate}</td>
                  <td className="py-3.5 px-4 font-bold">{item.daysPending}d</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getEscalationBadge(item.escalationStatus)}</td>
                  
                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        title="View Ticket Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onAssignStaff(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Assign / Reassign Staff"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>

                      {item.status !== 'Resolved' && (
                        <button
                          onClick={() => onCloseFeedback(item.id)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                          title="Force Close / Mark Resolved"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500">
                  No feedback records match your filters.
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
