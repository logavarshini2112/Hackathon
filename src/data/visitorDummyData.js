/**
 * Visitor Dashboard Dummy Data Repository
 */

export const initialVisitorStats = {
  submitted: 14,
  pending: 4,
  resolved: 9,
  declined: 1,
};

export const initialVisitorProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@visitor.org",
  visitorId: "VIS-2026-8942",
  phone: "+91-9876543210",
  role: "Visitor",
  joinDate: "January 2026",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export const initialNotifications = [
  {
    id: "notif-1",
    title: "Complaint Status Updated",
    description: "Maintenance team has updated your complaint #FB-2026-0004 to 'In Progress'.",
    time: "10 minutes ago",
    read: false,
    type: "info",
  },
  {
    id: "notif-2",
    title: "Ticket Assigned",
    description: "Your IT Support feedback #FB-2026-0003 was assigned to Senior Specialist.",
    time: "2 hours ago",
    read: false,
    type: "assignment",
  },
  {
    id: "notif-3",
    title: "Feedback Resolved",
    description: "Cafeteria service appreciation #FB-2026-0001 has been marked as 'Resolved'.",
    time: "1 day ago",
    read: true,
    type: "success",
  },
  {
    id: "notif-4",
    title: "System Update",
    description: "Digital Visitor Portal scheduled maintenance completed successfully.",
    time: "2 days ago",
    read: true,
    type: "system",
  },
];

export const initialFeedbackRecords = [
  {
    id: "fb-1",
    referenceId: "FB-2026-0001",
    department: "Cafeteria",
    feedbackType: "Appreciation",
    subject: "Excellent hygiene and quick food service",
    description: "Appreciated the cleanliness and polite behavior of staff at central dining hall.",
    priority: "Low",
    date: "2026-07-28",
    status: "Resolved",
    estimatedResponse: "24 Hours",
  },
  {
    id: "fb-2",
    referenceId: "FB-2026-0002",
    department: "Transport",
    feedbackType: "Complaint",
    subject: "Shuttle bus delay during peak evening hours",
    description: "Shuttle bus #4 arrived 25 minutes late causing queue backlog.",
    priority: "High",
    date: "2026-07-29",
    status: "In Progress",
    estimatedResponse: "48 Hours",
  },
  {
    id: "fb-3",
    referenceId: "FB-2026-0003",
    department: "IT Support",
    feedbackType: "Suggestion",
    subject: "Add guest Wi-Fi QR code scanner at lobby",
    description: "Scanning a QR code at reception would speed up visitor guest Wi-Fi provisioning.",
    priority: "Medium",
    date: "2026-07-30",
    status: "Open",
    estimatedResponse: "48 Hours",
  },
  {
    id: "fb-4",
    referenceId: "FB-2026-0004",
    department: "Maintenance",
    feedbackType: "Complaint",
    subject: "Air conditioning temperature issue in conference room B",
    description: "AC cooling fan was making excessive noise during visitor briefing.",
    priority: "High",
    date: "2026-07-31",
    status: "In Progress",
    estimatedResponse: "48 Hours",
  },
  {
    id: "fb-5",
    referenceId: "FB-2026-0005",
    department: "Security",
    feedbackType: "Appreciation",
    subject: "Helpful security officer at North Gate",
    description: "Officer assisted visitor with direction guidance and badge clearance.",
    priority: "Low",
    date: "2026-07-31",
    status: "Resolved",
    estimatedResponse: "24 Hours",
  },
  {
    id: "fb-6",
    referenceId: "FB-2026-0006",
    department: "Library",
    feedbackType: "Suggestion",
    subject: "Extend digital catalog access for temporary visitors",
    description: "Requesting guest access pass extension for academic journal search.",
    priority: "Medium",
    date: "2026-07-30",
    status: "Declined",
    estimatedResponse: "48 Hours",
  },
];

export const defaultTimelineData = [
  { step: 1, title: "Feedback Submitted", status: "completed", timestamp: "Just now" },
  { step: 2, title: "Assigned to Staff", status: "in-progress", timestamp: "Pending dispatch" },
  { step: 3, title: "Under Review", status: "upcoming", timestamp: "--" },
  { step: 4, title: "Resolved", status: "upcoming", timestamp: "--" },
];
