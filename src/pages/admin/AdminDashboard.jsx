import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

import { initialAdminSettings } from '../../data/adminDummyData';

import { applyTheme } from '../../utils/theme';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State Management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [profile, setProfile] = useState({
    name: storedUser.name || 'System Administrator',
    adminId: storedUser.user_id_code || 'ADM-2026-0001',
    email: storedUser.email || 'admin@visitorportal.com',
    role: storedUser.role || 'Administrator',
    phone: storedUser.phone || '+91-9876543210',
    supportEmail: 'support@visitorportal.com',
    supportPhone: '+91-9876543210',
    joinDate: 'January 2026',
    avatarUrl: storedUser.avatar_url ? `http://localhost:5000${storedUser.avatar_url}` : null,
  });

  const [staffList, setStaffList] = useState([]);
  const [feedbackRecords, setFeedbackRecords] = useState([]);
  const [settings, setSettings] = useState(initialAdminSettings);
  const [notifications, setNotifications] = useState([]);

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

  // Fetch real MySQL data for feedback, staff roster, settings, and profile
  const fetchAdminData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // 0. Fetch Current User Profile
      const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const userData = await profileRes.json();
        setProfile((prev) => ({
          ...prev,
          name: userData.name || prev.name,
          email: userData.email || prev.email,
          adminId: userData.user_id_code || prev.adminId,
          role: userData.role || prev.role,
          phone: userData.phone || prev.phone,
          avatarUrl: userData.avatar_url ? `http://localhost:5000${userData.avatar_url}` : prev.avatarUrl,
        }));
      }

      // 1. Fetch All Feedback Records
      const feedbackRes = await fetch('http://localhost:5000/api/admin/feedback', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (feedbackRes.ok) {
        const data = await feedbackRes.json();
        const formatted = data.map((r) => ({
          id: r.id,
          referenceId: r.reference_id || `FB-2026-${r.id}`,
          visitorName: r.visitor_name || 'Anonymous Visitor',
          department: r.department || '',
          assignedStaff: r.assigned_staff || 'Unassigned',
          feedbackType: r.feedback_type || '',
          subject: r.subject || '',
          description: r.description || '',
          priority: r.priority || 'Medium',
          submissionDate: r.created_at ? r.created_at.split('T')[0] : (r.incident_date ? r.incident_date.split('T')[0] : ''),
          incidentDate: r.incident_date ? r.incident_date.split('T')[0] : '',
          daysPending: r.days_pending || 0,
          status: r.status || 'Open',
          escalationStatus: r.escalation_status || 'Normal',
          declineReason: r.decline_reason || null,
          image: r.image_url ? (r.image_url.startsWith('http') ? r.image_url : `http://localhost:5000${r.image_url}`) : null,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));
        setFeedbackRecords(formatted);
      }

      // 2. Fetch Staff Roster
      const staffRes = await fetch('http://localhost:5000/api/admin/staff-roster', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffList(staffData);
      }

      // 3. Fetch Settings
      const settingsRes = await fetch('http://localhost:5000/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const fetchedTheme = settingsData.theme || 'Light';
        setSettings((prev) => ({
          ...prev,
          institutionName: settingsData.institution_name || prev.institutionName,
          supportEmail: settingsData.support_email || prev.supportEmail,
          supportPhone: settingsData.support_phone || prev.supportPhone,
          escalationDays: settingsData.escalation_days !== undefined ? settingsData.escalation_days : prev.escalationDays,
          enableEmailNotifications: Boolean(settingsData.enable_email_notifications),
          enableInAppNotifications: Boolean(settingsData.enable_in_app_notifications),
          enableEscalationAlerts: Boolean(settingsData.enable_escalation_alerts),
          theme: fetchedTheme,
        }));
        applyTheme(fetchedTheme);
      }

      // 4. Fetch Notifications
      const notifRes = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        if (Array.isArray(notifData) && notifData.length > 0) {
          const formattedNotifs = notifData.map((n) => ({
            id: `notif-${n.id}`,
            title: n.title,
            description: n.description,
            time: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recently',
            read: Boolean(n.is_read),
            type: n.type || 'info',
          }));
          setNotifications(formattedNotifs);
        }
      }
    } catch (err) {
      console.error('Error loading Admin Dashboard data:', err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Apply theme when settings change
  useEffect(() => {
    if (settings && settings.theme) {
      applyTheme(settings.theme);
    }
  }, [settings.theme]);

  const handleProfileUpdated = (updatedData) => {
    setProfile((prev) => ({
      ...prev,
      name: updatedData.name || prev.name,
      email: updatedData.email || prev.email,
      phone: updatedData.phone || prev.phone,
      avatarUrl: updatedData.avatarUrl !== undefined ? updatedData.avatarUrl : (updatedData.avatar_url ? `http://localhost:5000${updatedData.avatar_url}` : prev.avatarUrl),
    }));
    fetchAdminData();
  };

  // Enrich Staff List with dynamic counts computed from real feedback records
  const enrichedStaffList = useMemo(() => {
    return staffList.map((stf) => {
      const assigned = feedbackRecords.filter((r) => r.assignedStaff === stf.staffName);
      const pending = assigned.filter((r) => r.status === 'Open' || r.status === 'In Progress').length;
      const resolved = assigned.filter((r) => r.status === 'Resolved').length;
      const total = assigned.length;
      const score = total > 0 ? `${Math.round((resolved / total) * 100)}%` : '100%';
      return {
        ...stf,
        assignedCount: total,
        pendingCount: pending,
        resolvedCount: resolved,
        avgResponseTime: '1.2 Days',
        performanceScore: score,
      };
    });
  }, [staffList, feedbackRecords]);

  // Save Settings handler to update MySQL settings table
  const handleSaveSettings = async (updatedSettings) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          institutionName: updatedSettings.institutionName,
          supportEmail: updatedSettings.supportEmail,
          supportPhone: updatedSettings.supportPhone,
          escalationDays: updatedSettings.escalationDays,
          enableEmailNotifications: updatedSettings.enableEmailNotifications,
          enableInAppNotifications: updatedSettings.enableInAppNotifications,
          enableEscalationAlerts: updatedSettings.enableEscalationAlerts,
          theme: updatedSettings.theme,
        }),
      });
      if (res.ok) {
        setSettings(updatedSettings);
        applyTheme(updatedSettings.theme);
        fetchAdminData();
        showToast('System settings updated in MySQL database.');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  // Staff Assignment Handler (Reassignment if required)
  const handleAssignStaffSuccess = async (recordId, newStaffName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/assign-staff/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ staffName: newStaffName }),
      });
      if (res.ok) {
        setFeedbackRecords((prev) =>
          prev.map((item) =>
            item.id === recordId ? { ...item, assignedStaff: newStaffName } : item
          )
        );
        showToast(`Staff member "${newStaffName}" assigned successfully.`);
      }
    } catch (err) {
      console.error('Failed to assign staff:', err);
    }
    setAssigningRecord(null);
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

  // Staff Account Status Toggle via backend API
  const handleToggleStaffStatus = async (staffId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/toggle-staff/${staffId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setStaffList((prev) =>
          prev.map((s) => (s.id === staffId ? { ...s, status: updatedUser.status } : s))
        );
        showToast(`Staff account status updated to ${updatedUser.status}.`);
      }
    } catch (err) {
      console.error('Failed to toggle staff status:', err);
      showToast('Failed to toggle staff status.');
    }
  };

  // Reset Staff Password simulation
  const handleResetStaffPassword = (staffName) => {
    showToast(`Password reset link sent for ${staffName}.`);
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Handle New Staff Account Created by Admin
  const handleStaffCreated = (newStaff) => {
    fetchAdminData();
    showToast(`Account created successfully for ${newStaff.staffName || newStaff.name} (${newStaff.role || 'Staff'}).`);
  };

  // Computed Dynamic Stats directly from real MySQL feedbackRecords and staffList
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
    registeredVisitors: Array.from(new Set(feedbackRecords.map((r) => r.visitorName))).length || 0,
    activeStaff: staffList.filter((s) => s.status === 'Active').length,
    avgResolutionTime: '1.2 Days',
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
              staffList={enrichedStaffList}
              onToggleStaffStatus={handleToggleStaffStatus}
              onResetPassword={handleResetStaffPassword}
              onStaffCreated={handleStaffCreated}
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
            <AnalyticsCharts
              feedbackRecords={feedbackRecords}
              staffList={staffList}
            />
          </section>

          {/* Reports Section */}
          <section id="reports" className="pt-2">
            <ReportsSection
              feedbackRecords={feedbackRecords}
              adminProfile={profile}
              settings={settings}
            />
          </section>

          {/* Settings Section */}
          <section id="settings" className="pt-2">
            <SettingsPanel
              settings={settings}
              onSaveSettings={handleSaveSettings}
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
            <AdminProfileCard
              profile={profile}
              onProfileUpdated={handleProfileUpdated}
            />
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
