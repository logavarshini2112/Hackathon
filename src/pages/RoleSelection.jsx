import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquarePlus, User, UserCheck, ShieldCheck, ArrowLeft } from 'lucide-react';
import RoleCard from '../components/RoleCard';

export default function RoleSelection() {
  const navigate = useNavigate();

  const roleOptions = [
    {
      role: 'Visitor',
      description: 'Submit feedback, track complaints, and receive updates.',
      buttonText: 'Continue as Visitor',
      targetRoute: '/visitor/login',
      icon: User,
      badgeText: 'Public Access',
    },
    {
      role: 'Staff',
      description: 'Review assigned feedback, update status, and generate reports.',
      buttonText: 'Continue as Staff',
      targetRoute: '/staff/login',
      icon: UserCheck,
      badgeText: 'Staff Portal',
    },
    {
      role: 'Administrator',
      description: 'Manage users, monitor analytics, oversee departments, and configure workflows.',
      buttonText: 'Continue as Admin',
      targetRoute: '/admin/login',
      icon: ShieldCheck,
      badgeText: 'Admin Controls',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  Digital Visitor Feedback
                </span>
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                  &amp; Experience Management
                </span>
              </div>
            </Link>

            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 shadow-xs transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="my-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Select Your Role
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Choose your role to continue securely.
          </p>
        </div>

        {/* Role Cards Grid (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {roleOptions.map((option) => (
            <RoleCard
              key={option.role}
              role={option.role}
              description={option.description}
              buttonText={option.buttonText}
              targetRoute={option.targetRoute}
              icon={option.icon}
              badgeText={option.badgeText}
            />
          ))}
        </div>

      </main>

      {/* Footer Notice Bar */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Digital Visitor Feedback &amp; Experience Management Portal. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
