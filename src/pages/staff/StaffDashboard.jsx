import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Printer, 
  Sparkles,
  LogOut,
  X,
  Info
} from 'lucide-react';

import StaffSidebar from '../../components/StaffSidebar';
import StaffTopNavbar from '../../components/StaffTopNavbar';
import StaffDashboardCard from '../../components/StaffDashboardCard';
import AssignedFeedbackTable from '../../components/AssignedFeedbackTable';
import FeedbackDetailsModal from '../../components/FeedbackDetailsModal';
import StatusUpdateModal from '../../components/StatusUpdateModal';
import EscalationCard from '../../components/EscalationCard';
import StaffNotificationCard from '../../components/StaffNotificationCard';
import StaffProfileCard from '../../components/StaffProfileCard';

import {
  initialStaffProfile,
  initialStaffNotifications,
} from '../../data/staffDummyData';

export default function StaffDashboard() {
  const navigate = useNavigate();

  // State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Load user profile from localStorage if available
  const storedUserJson = localStorage.getItem('user');
  let loadedProfile = initialStaffProfile;
  if (storedUserJson) {
    try {
      const u = JSON.parse(storedUserJson);
      loadedProfile = {
        staffName: u.name || initialStaffProfile.staffName,
        staffId: u.userIdCode || u.user_id_code || initialStaffProfile.staffId,
        department: u.department || initialStaffProfile.department,
        role: u.role || 'Staff Member',
        email: u.email || initialStaffProfile.email,
        phone: u.phone || '+91-9876543210',
        joinedDate: 'August 2026',
        performanceScore: '96%',
        avgResponseTime: '3.5 Hours',
      };
    } catch (e) {
      console.error(e);
    }
  }

  const [profile, setProfile] = useState(loadedProfile);
  const [notifications, setNotifications] = useState(initialStaffNotifications);
  const [assignedFeedback, setAssignedFeedback] = useState([]);

  // Modals state
  const [inspectRecord, setInspectRecord] = useState(null);
  const [updatingRecord, setUpdatingRecord] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [reportsModalFeature, setReportsModalFeature] = useState(null);

  // Success Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch assigned feedback records from backend API on mount
  useEffect(() => {
    const fetchAssignedFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/staff/assigned-feedback', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const mappedRecords = data.map((item) => ({
              id: item.id,
              referenceId: item.reference_id || item.referenceId,
              visitorName: item.visitor_name || item.visitorName || 'Anonymous Visitor',
              department: item.department,
              feedbackType: item.feedback_type || item.feedbackType,
              subject: item.subject,
              description: item.description,
              priority: item.priority || 'Medium',
              submissionDate: item.created_at ? item.created_at.split('T')[0] : (item.incident_date ? item.incident_date.split('T')[0] : ''),
              incidentDate: item.incident_date ? item.incident_date.split('T')[0] : '',
              status: item.status || 'Open',
              escalationStatus: item.escalation_status || item.escalationStatus || 'Normal',
              daysPending: item.days_pending !== undefined ? item.days_pending : 0,
              declineReason: item.decline_reason || item.declineReason || null,
              assignedStaff: item.assigned_staff || item.assignedStaff,
              image: item.image_url ? `http://localhost:5000${item.image_url}` : null,
            }));
            setAssignedFeedback(mappedRecords);
          }
        }
      } catch (err) {
        console.error('Error fetching assigned feedback records:', err);
      }
    };

    fetchAssignedFeedback();
  }, []);

  // Status Update Handler
  const handleUpdateSuccess = (updatedRecord) => {
    setAssignedFeedback((prev) =>
      prev.map((item) => (item.id === updatedRecord.id ? updatedRecord : item))
    );
    setUpdatingRecord(null);
    showToast(`Ticket #${updatedRecord.referenceId} updated to status "${updatedRecord.status}".`);
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Dynamic statistics calculations
  const computedStats = {
    totalAssigned: assignedFeedback.length,
    pending: assignedFeedback.filter((r) => r.status === 'Open').length,
    inProgress: assignedFeedback.filter((r) => r.status === 'In Progress').length,
    resolved: assignedFeedback.filter((r) => r.status === 'Resolved').length,
    declined: assignedFeedback.filter((r) => r.status === 'Declined').length,
    escalated: assignedFeedback.filter(
      (r) => r.escalationStatus === 'Escalated' || r.status === 'Escalated to Administrator'
    ).length,
  };

  // Escalated items list for Escalation Alerts
  const escalatedList = assignedFeedback.filter(
    (r) => r.escalationStatus === 'Escalated' || r.status === 'Escalated to Administrator'
  );

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex selection:bg-blue-600 selection:text-white">
      
      {/* Left Sidebar */}
      <StaffSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Body */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <StaffTopNavbar
          profile={profile}
          unreadCount={unreadNotifCount}
          onNotificationClick={() => {
            setActiveSection('notifications');
            document.getElementById('notifications')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onProfileClick={() => {
            setActiveSection('profile');
            document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Success Toast Banner */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fadeIn text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Dashboard Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner */}
          <section id="dashboard" className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Staff Workspace</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome, Staff!
                </h1>
                <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl">
                  Manage assigned visitor feedback efficiently and resolve issues within the response timeline.
                </p>
              </div>
            </div>

            {/* Statistics Cards Grid (6 Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StaffDashboardCard
                title="Assigned"
                value={computedStats.totalAssigned}
                icon={ClipboardList}
                iconBg="bg-blue-50 text-blue-600"
                badgeText="Total Queue"
              />

              <StaffDashboardCard
                title="Pending"
                value={computedStats.pending}
                icon={Clock}
                iconBg="bg-slate-100 text-slate-700"
                badgeText="Unprocessed"
              />

              <StaffDashboardCard
                title="In Progress"
                value={computedStats.inProgress}
                icon={RefreshCw}
                iconBg="bg-amber-50 text-amber-600"
                badgeText="Active SLA"
              />

              <StaffDashboardCard
                title="Resolved"
                value={computedStats.resolved}
                icon={CheckCircle2}
                iconBg="bg-emerald-50 text-emerald-600"
                badgeText="Closed"
              />

              <StaffDashboardCard
                title="Declined"
                value={computedStats.declined}
                icon={XCircle}
                iconBg="bg-red-50 text-red-600"
                badgeText="Out of scope"
              />

              <StaffDashboardCard
                title="Escalated"
                value={computedStats.escalated}
                icon={Flame}
                iconBg="bg-rose-100 text-rose-700"
                badgeText="Admin Alert"
              />
            </div>
          </section>

          {/* Escalation Alerts Section */}
          {escalatedList.length > 0 && (
            <section className="pt-2">
              <EscalationCard
                escalatedItems={escalatedList}
                onViewDetails={(item) => setInspectRecord(item)}
              />
            </section>
          )}

          {/* Assigned Feedback Table Section */}
          <section id="assigned-feedback" className="pt-2">
            <AssignedFeedbackTable
              records={assignedFeedback}
              onViewDetails={(item) => setInspectRecord(item)}
              onUpdateStatus={(item) => setUpdatingRecord(item)}
            />
          </section>

          {/* Update Status Anchor Section */}
          <section id="update-status-section" className="pt-2">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Quick Update Ticket Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select any assigned ticket from the table above or click below to update ticket progress.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (assignedFeedback.length > 0) {
                      setUpdatingRecord(assignedFeedback[0]);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  Update Top Assigned Ticket Status
                </button>
              </div>
            </div>
          </section>

          {/* Reports Section UI Cards (Coming Soon) */}
          <section id="reports" className="pt-2">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  <span>Operational Reports &amp; Exports</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Export operational feedback records, SLA compliance data, and department performance logs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Export PDF Card */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-center group hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Export PDF Report</h4>
                    <p className="text-xs text-slate-500 mt-1">Formatted summary report for executive reviews.</p>
                  </div>
                  <button
                    onClick={() => setReportsModalFeature('Export PDF')}
                    className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    Export PDF (Coming Soon)
                  </button>
                </div>

                {/* Export CSV Card */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-center group hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Export CSV Data</h4>
                    <p className="text-xs text-slate-500 mt-1">Raw tabular dataset for spreadsheet analysis.</p>
                  </div>
                  <button
                    onClick={() => setReportsModalFeature('Export CSV')}
                    className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    Export CSV (Coming Soon)
                  </button>
                </div>

                {/* Print Report Card */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-center group hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                    <Printer className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Print Department Report</h4>
                    <p className="text-xs text-slate-500 mt-1">Printable audit trail for physical filing.</p>
                  </div>
                  <button
                    onClick={() => setReportsModalFeature('Print Report')}
                    className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    Print Report (Coming Soon)
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* Notifications Panel Section */}
          <section id="notifications" className="pt-2">
            <StaffNotificationCard
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
            />
          </section>

          {/* Staff Profile Card Section */}
          <section id="profile" className="pt-2 pb-8">
            <StaffProfileCard profile={profile} />
          </section>

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            &copy; {new Date().getFullYear()} Digital Visitor Feedback &amp; Experience Management Portal. All rights reserved.
          </div>
        </footer>

      </div>

      {/* Ticket Details Modal */}
      {inspectRecord && (
        <FeedbackDetailsModal
          record={inspectRecord}
          onClose={() => setInspectRecord(null)}
        />
      )}

      {/* Status Update Modal */}
      {updatingRecord && (
        <StatusUpdateModal
          record={updatingRecord}
          onClose={() => setUpdatingRecord(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Reports Coming Soon Modal */}
      {reportsModalFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center relative">
            <button
              onClick={() => setReportsModalFeature(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-slate-900">
              {reportsModalFeature} Coming Soon
            </h4>

            <p className="text-xs text-slate-500">
              The {reportsModalFeature} feature will be enabled in the upcoming analytics module update.
            </p>

            <button
              onClick={() => setReportsModalFeature(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 text-center relative">
            
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Confirm Logout
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to log out of your staff session?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
