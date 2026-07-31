import React, { useState } from 'react';
import { User, Mail, ShieldAlert, Edit3, Key, X, Info } from 'lucide-react';

export default function AdminProfileCard({ profile }) {
  const [comingSoonFeature, setComingSoonFeature] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <User className="w-5 h-5 text-blue-600" />
          <span>Administrator Profile Information</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View your administrative identity, governance permissions, and account credentials.
        </p>
      </div>

      {/* Main Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        
        {/* Avatar */}
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-blue-50 shadow-md"
          />
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-xs">
            Admin
          </span>
        </div>

        {/* Profile Details */}
        <div className="flex-1 space-y-4 text-center sm:text-left w-full">
          <div>
            <h4 className="text-2xl font-extrabold text-slate-900">
              {profile.name}
            </h4>
            <p className="text-xs text-blue-600 font-mono font-semibold">
              ID: {profile.adminId}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{profile.email}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Role: {profile.role}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <button
              onClick={() => setComingSoonFeature('Edit Profile')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => setComingSoonFeature('Change Password')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

      </div>

      {/* Coming Soon Modal */}
      {comingSoonFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center relative">
            <button
              onClick={() => setComingSoonFeature(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-slate-900">
              {comingSoonFeature} Coming Soon
            </h4>

            <p className="text-xs text-slate-500">
              The {comingSoonFeature} action will be enabled in the upcoming admin release.
            </p>

            <button
              onClick={() => setComingSoonFeature(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
