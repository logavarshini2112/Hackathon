import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Search,
  Sparkles,
  LogOut,
  X
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/TopNavbar';
import DashboardCard from '../../components/DashboardCard';
import FeedbackCard from '../../components/FeedbackCard';
import FeedbackTable from '../../components/FeedbackTable';
import NotificationCard from '../../components/NotificationCard';
import FeedbackForm from '../../components/FeedbackForm';

import {
  initialVisitorStats,
  initialVisitorProfile,
  initialNotifications,
} from '../../data/visitorDummyData';

export default function VisitorDashboard() {
  const navigate = useNavigate();

  // State Management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [stats, setStats] = useState(initialVisitorStats);

  // Load user profile from localStorage if available
  const storedUserJson = localStorage.getItem('user');
  let loadedProfile = initialVisitorProfile;
  if (storedUserJson) {
    try {
      const u = JSON.parse(storedUserJson);
      loadedProfile = {
        name: u.name || initialVisitorProfile.name,
        visitorId: u.userIdCode || u.user_id_code || initialVisitorProfile.visitorId,
        email: u.email || initialVisitorProfile.email,
        phone: u.phone || initialVisitorProfile.phone,
        organization: u.department || 'Visitor Portal',
        joinedDate: 'August 2026',
        totalSubmitted: initialVisitorProfile.totalSubmitted,
      };
    } catch (e) {
      console.error(e);
    }
  }

  const [profile, setProfile] = useState(loadedProfile);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [feedbackRecords, setFeedbackRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fetch real visitor feedback records from MySQL API on mount
  useEffect(() => {
    const fetchMyFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setFeedbackRecords([]);
          return;
        }

        const response = await fetch('http://localhost:5000/api/feedback/my-feedback', {
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
              department: item.department,
              feedbackType: item.feedback_type || item.feedbackType,
              subject: item.subject,
              description: item.description,
              priority: item.priority,
              date: item.incident_date ? item.incident_date.split('T')[0] : (item.created_at ? item.created_at.split('T')[0] : ''),
              status: item.status,
              estimatedResponse: '48 Hours',
              image: item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`) : null,
              assignedStaff: item.assigned_staff || 'Unassigned',
              createdAt: item.created_at,
              updatedAt: item.updated_at,
              declineReason: item.decline_reason,
            }));
            setFeedbackRecords(mappedRecords);
          } else {
            setFeedbackRecords([]);
          }
        } else {
          setFeedbackRecords([]);
        }
      } catch (err) {
        console.error('Error fetching visitor feedback records:', err);
        setFeedbackRecords([]);
      }
    };

    fetchMyFeedback();
  }, []);

  // Handle Feedback Submission Event
  const handleFeedbackSubmitted = (newRecord) => {
    setFeedbackRecords((prev) => [newRecord, ...prev]);
    setStats((prev) => ({
      ...prev,
      submitted: prev.submitted + 1,
      pending: prev.pending + 1,
    }));
  };

  // Mark notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Scroll Helper
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate stats dynamically from state
  const computedStats = {
    submitted: feedbackRecords.length,
    pending: feedbackRecords.filter((r) => r.status === 'Open' || r.status === 'In Progress').length,
    resolved: feedbackRecords.filter((r) => r.status === 'Resolved').length,
    declined: feedbackRecords.filter((r) => r.status === 'Declined').length,
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex selection:bg-blue-600 selection:text-white">
      
      {/* Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Body */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <TopNavbar
          profile={profile}
          unreadCount={unreadNotifCount}
          onNotificationClick={() => scrollToSection('notifications')}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Dashboard Scrollable Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Section */}
          <section id="dashboard" className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Visitor Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome, Visitor!
                </h1>
                <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl">
                  Manage your feedback, track complaint status, and stay updated from one place.
                </p>

                {/* Quick Action Scroll Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => scrollToSection('submit-feedback')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </button>

                  <button
                    onClick={() => scrollToSection('my-feedback')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Track Feedback</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Cards Grid (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Feedback Submitted"
                value={computedStats.submitted}
                icon={FileText}
                iconBg="bg-blue-50 text-blue-600"
                badgeText="Total logs created"
              />

              <DashboardCard
                title="Pending"
                value={computedStats.pending}
                icon={Clock}
                iconBg="bg-amber-50 text-amber-600"
                badgeText="Under review / Open"
              />

              <DashboardCard
                title="Resolved"
                value={computedStats.resolved}
                icon={CheckCircle2}
                iconBg="bg-emerald-50 text-emerald-600"
                badgeText="Successfully closed"
              />

              <DashboardCard
                title="Declined"
                value={computedStats.declined}
                icon={XCircle}
                iconBg="bg-red-50 text-red-600"
                badgeText="Out of operational scope"
              />
            </div>
          </section>

          {/* SECTION 1: Submit Feedback Form */}
          <section id="submit-feedback" className="pt-2">
            <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
          </section>

          {/* SECTION 2: My Feedback Table */}
          <section id="my-feedback" className="pt-2">
            <FeedbackTable
              records={feedbackRecords}
              onViewDetails={(record) => setSelectedRecord(record)}
            />
          </section>

          {/* SECTION 3: Notifications Panel */}
          <section id="notifications" className="pt-2 pb-8">
            <NotificationCard
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
            />
          </section>

        </main>

        {/* Dashboard Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            &copy; {new Date().getFullYear()} Digital Visitor Feedback &amp; Experience Management Portal. All rights reserved.
          </div>
        </footer>

      </div>

      {/* Ticket Details Modal Popup */}
      {selectedRecord && (
        <FeedbackCard
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
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
                Are you sure you want to log out of your visitor session?
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
