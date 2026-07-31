import React, { useState } from 'react';
import { Users, Search, Key, UserX, UserCheck, Shield, Info, X } from 'lucide-react';

export default function StaffManagementTable({ staffList, onToggleStaffStatus, onResetPassword }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedStaffDetails, setSelectedStaffDetails] = useState(null);

  const filteredStaff = staffList.filter((stf) => {
    const matchesSearch =
      stf.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stf.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stf.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter ? stf.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Staff Roster Management</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              {staffList.length} Active Staff
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor department assignments, resolution SLA scores, and manage account statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff name or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
          >
            <option value="">All Departments</option>
            <option value="Maintenance">Maintenance</option>
            <option value="IT Support">IT Support</option>
            <option value="Transport">Transport</option>
            <option value="Security">Security</option>
            <option value="Cafeteria">Cafeteria</option>
            <option value="Library">Library</option>
            <option value="Accounts">Accounts</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Staff Member</th>
              <th className="py-3.5 px-4">Staff ID</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Assigned</th>
              <th className="py-3.5 px-4">Pending</th>
              <th className="py-3.5 px-4">Resolved</th>
              <th className="py-3.5 px-4">Avg Response</th>
              <th className="py-3.5 px-4">Performance</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {filteredStaff.map((stf) => (
              <tr key={stf.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{stf.staffName}</td>
                <td className="py-3.5 px-4 font-mono text-blue-600 font-semibold">{stf.staffId}</td>
                <td className="py-3.5 px-4">{stf.department}</td>
                <td className="py-3.5 px-4 font-semibold">{stf.assignedCount}</td>
                <td className="py-3.5 px-4 font-semibold text-amber-600">{stf.pendingCount}</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-600">{stf.resolvedCount}</td>
                <td className="py-3.5 px-4 text-slate-600">{stf.avgResponseTime}</td>
                <td className="py-3.5 px-4 font-bold text-blue-600">{stf.performanceScore}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    stf.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stf.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedStaffDetails(stf)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                      title="View Staff Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onResetPassword(stf.staffName)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Reset Staff Password"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onToggleStaffStatus(stf.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        stf.status === 'Active'
                          ? 'bg-red-50 hover:bg-red-100 text-red-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                      }`}
                      title={stf.status === 'Active' ? 'Disable Account' : 'Activate Account'}
                    >
                      {stf.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Staff Details Modal */}
      {selectedStaffDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 relative">
            <button
              onClick={() => setSelectedStaffDetails(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {selectedStaffDetails.staffName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{selectedStaffDetails.staffName}</h4>
                <p className="text-xs text-blue-600 font-mono">{selectedStaffDetails.staffId}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p><span className="text-slate-400 font-medium">Department:</span> {selectedStaffDetails.department}</p>
              <p><span className="text-slate-400 font-medium">Email:</span> {selectedStaffDetails.email}</p>
              <p><span className="text-slate-400 font-medium">Performance SLA:</span> <strong className="text-blue-600">{selectedStaffDetails.performanceScore}</strong></p>
              <p><span className="text-slate-400 font-medium">Average Response:</span> {selectedStaffDetails.avgResponseTime}</p>
              <p><span className="text-slate-400 font-medium">Resolved Tickets:</span> {selectedStaffDetails.resolvedCount}</p>
            </div>

            <button
              onClick={() => setSelectedStaffDetails(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
