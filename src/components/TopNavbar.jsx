import React, { useState } from 'react';
import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react';

export default function TopNavbar({ profile, unreadCount, onNotificationClick, onLogoutClick, setIsMobileOpen }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <span className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
            Digital Visitor Feedback Portal
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Visitor Management Workspace
          </span>
        </div>
      </div>

      {/* Right: Notifications & Profile Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Notification Bell Icon Button */}
        <button
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Visitor Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-blue-600/30"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {profile.name}
              </span>
              <span className="text-[10px] text-slate-500">
                {profile.role}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:inline" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                <p className="text-[10px] text-slate-500">{profile.role}</p>
              </div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onLogoutClick();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
