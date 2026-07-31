import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Building, 
  Users, 
  UserCheck, 
  Timer, 
  Sparkles,
  LogOut,
  X
} from 'lucide-react';

import AdminSidebar from '../../components/AdminSidebar';
import AdminTopNavbar from '../../components/AdminTopNavbar';
import AdminDashboardCard from '../../components/AdminDashboardCard';
import FeedbackManagementTable from '../../components/FeedbackManagementTable';
import StaffManagementTable from '../../components/StaffManagementTable';
import EscalationManagement from '../../components/EscalationManagement';
import AnalyticsCharts from '../../components/AnalyticsCharts';
import ReportsSection from '../../components/ReportsSection';
import SettingsPanel from '../../components/SettingsPanel';
import AdminNotificationPanel from '../../components/AdminNotificationPanel';
import AdminProfileCard from '../../components/AdminProfileCard';

import AssignStaffModal from '../../components/AssignStaffModal';
import FeedbackDetailsModal from '../../components/FeedbackDetailsModal';

import {
  initialAdminProfile,
  initialAdminStats,
  initialStaffList,
  initialAdminFeedbackRecords,
  initialAdminNotifications,
  initialAdminSettings,
} from '../../data/adminDummyData';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State Management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [profile] = useState(initialAdminProfile);
  const [stats, setStats] = useState(initialAdminStats);
  const [staffList, setStaffList] = useState(initialStaffList);
  const [feedbackRecords, setFeedbackRecords] = useState(initialAdminFeedbackRecords);
  const [notifications, setNotifications] = useState(initialAdminNotifications);
  const [settings, setSettings] = useState(initialAdminSettings);

  // Modals state
  const [assigningRecord, setAssigningRecord] = useState(null);
  const [inspectingRecord, setInspectingRecord] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Toast notice
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Staff Assignment Handler
  const handleAssignStaffSuccess = (recordId, newStaffName) => {
    setFeedbackRecords((prev) =>
      prev.map((item) =>
        item.id === recordId ? { ...item, assignedStaff: newStaffName } : item
      )
    );
    setAssigningRecord(null);
    showToast(`Staff member "${newStaffName}" assigned successfully.`);
  };

  // Force Close / Resolve Ticket
  const handleCloseFeedback = (recordId) => {
    setFeedbackRecords((prev) =>
      prev.map((item) =>
        item.id === recordId ? { ...item, status: 'Resolved', escalationStatus: 'Normal' } : item
      )
    );
    showToast(`Feedback ticket resolved and closed.`);
  };

  // Mark High Priority on Escalation
  const handleMarkHighPriority = (recordId) => {
    setFeedbackRecords((prev) =>
      prev.map((item) => (item.id === recordId ? { ...item, priority: 'High' } : item))
    );
    showToast(`Ticket priority elevated to HIGH.`);
  };

  // Staff Account Status Toggle
  const handleToggleStaffStatus = (staffId) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
          : s
      )
    );
    showToast(`Staff account status updated.`);
  };

  // Reset Staff Password simulation
  const handleResetStaffPassword = (staffName) => {
    showToast(`Password reset link sent for ${staffName}.`);
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Computed Dynamic Stats
  const computedStats = {
    totalFeedback: feedbackRecords.length,
    openFeedback: feedbackRecords.filter((r) => r.status === 'Open').length,
    inProgress: feedbackRecords.filter((r) => r.status === 'In Progress').length,
    resolved: feedbackRecords.filter((r) => r.status === 'Resolved').length,
    declined: feedbackRecords.filter((r) => r.status === 'Declined').length,
    escalated: feedbackRecords.filter(
      (r) => r.escalationStatus === 'Escalated' || r.status === 'Escalated to Administrator'
    ).length,
    departments: settings.categories.length,
    registeredVisitors: stats.registeredVisitors,
    activeStaff: staffList.filter((s) => s.status === 'Active').length,
    avgResolutionTime: stats.avgResolutionTime,
  };

  // Escalated Records List
  const escalatedList = feedbackRecords.filter(
    (r) => r.escalationStatus === 'Escalated' || r.status === 'Escalated to Administrator'
  );

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex selection:bg-blue-600 selection:text-white">
      
      {/* Left Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Body */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <AdminTopNavbar
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

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fadeIn text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Section */}
          <section id="dashboard" className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin Command Console</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome, Administrator!
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                  Monitor system activities, manage feedback, configure workflows, and improve operational efficiency.
                </p>
              </div>
            </div>

            {/* 10 Statistics Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <AdminDashboardCard
                title="Total Feedback"
                value={computedStats.totalFeedback}
                icon={FileText}
                iconBg="bg-blue-50 text-blue-600"
                badgeText="All submissions"
              />

              <AdminDashboardCard
                title="Open Feedback"
                value={computedStats.openFeedback}
                icon={Clock}
                iconBg="bg-slate-100 text-slate-700"
                badgeText="Unprocessed"
              />

              <AdminDashboardCard
                title="In Progress"
                value={computedStats.inProgress}
                icon={RefreshCw}
                iconBg="bg-amber-50 text-amber-600"
                badgeText="Under review"
              />

              <AdminDashboardCard
                title="Resolved"
                value={computedStats.resolved}
                icon={CheckCircle2}
                iconBg="bg-emerald-50 text-emerald-600"
                badgeText="Completed SLA"
              />

              <AdminDashboardCard
                title="Declined"
                value={computedStats.declined}
                icon={XCircle}
                iconBg="bg-red-50 text-red-600"
                badgeText="Out of scope"
              />

              <AdminDashboardCard
                title="Escalated"
                value={computedStats.escalated}
                icon={Flame}
                iconBg="bg-rose-100 text-rose-700"
                badgeText="&gt;10 days pending"
              />

              <AdminDashboardCard
                title="Departments"
                value={computedStats.departments}
                icon={Building}
                iconBg="bg-indigo-50 text-indigo-600"
                badgeText="Active units"
              />

              <AdminDashboardCard
                title="Visitors"
                value={computedStats.registeredVisitors}
                icon={Users}
                iconBg="bg-blue-50 text-blue-700"
                badgeText="Registered user accounts"
              />

              <AdminDashboardCard
                title="Active Staff"
                value={computedStats.activeStaff}
                icon={UserCheck}
                iconBg="bg-teal-50 text-teal-700"
                badgeText="Operations team"
              />

              <AdminDashboardCard
                title="Avg Resolution"
                value={computedStats.avgResolutionTime}
                icon={Timer}
                iconBg="bg-sky-50 text-sky-700"
                badgeText="Response speed"
              />
            </div>
          </section>

          {/* Feedback Management Section */}
          <section id="feedback-management" className="pt-2">
            <FeedbackManagementTable
              records={feedbackRecords}
              onViewDetails={(item) => setInspectingRecord(item)}
              onAssignStaff={(item) => setAssigningRecord(item)}
              onCloseFeedback={(recordId) => handleCloseFeedback(recordId)}
            />
          </section>

          {/* Staff Management Section */}
          <section id="staff-management" className="pt-2">
            <StaffManagementTable
              staffList={staffList}
              onToggleStaffStatus={handleToggleStaffStatus}
              onResetPassword={handleResetStaffPassword}
            />
          </section>

          {/* Escalation Management Section */}
          <section id="escalated-feedback" className="pt-2">
            <EscalationManagement
              escalatedRecords={escalatedList}
              onAssignStaff={(item) => setAssigningRecord(item)}
              onMarkHighPriority={(recordId) => handleMarkHighPriority(recordId)}
              onCloseEscalation={(recordId) => handleCloseFeedback(recordId)}
            />
          </section>

          {/* Analytics Charts Section */}
          <section id="analytics" className="pt-2">
            <AnalyticsCharts />
          </section>

          {/* Reports Section */}
          <section id="reports" className="pt-2">
            <ReportsSection
              feedbackRecords={feedbackRecords}
              adminProfile={profile}
            />
          </section>

          {/* Settings Section */}
          <section id="settings" className="pt-2">
            <SettingsPanel
              settings={settings}
              onSaveSettings={(updatedSettings) => {
                setSettings(updatedSettings);
                showToast("System settings updated.");
              }}
            />
          </section>

          {/* Notifications Panel */}
          <section id="notifications" className="pt-2">
            <AdminNotificationPanel
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
            />
          </section>

          {/* Admin Profile Card */}
          <section id="profile" className="pt-2 pb-8">
            <AdminProfileCard profile={profile} />
          </section>

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            &copy; {new Date().getFullYear()} Digital Visitor Feedback &amp; Experience Management Portal. All rights reserved.
          </div>
        </footer>

      </div>

      {/* Assign Staff Modal */}
      {assigningRecord && (
        <AssignStaffModal
          record={assigningRecord}
          staffList={staffList}
          onClose={() => setAssigningRecord(null)}
          onAssignSuccess={handleAssignStaffSuccess}
        />
      )}

      {/* Ticket Details Modal */}
      {inspectingRecord && (
        <FeedbackDetailsModal
          record={inspectingRecord}
          onClose={() => setInspectingRecord(null)}
        />
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
                Are you sure you want to log out of your administrator session?
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
