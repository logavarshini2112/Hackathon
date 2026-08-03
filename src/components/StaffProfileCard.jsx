import React from 'react';
import { User, Mail, Phone, ShieldCheck, Building } from 'lucide-react';

export default function StaffProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <User className="w-5 h-5 text-blue-600" />
          <span>Staff Profile Information</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View your staff credentials, assigned department, and role permissions.
        </p>
      </div>

      {/* Main Profile Info Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

        {/* Profile Details List */}
        <div className="flex-1 space-y-4 text-center sm:text-left w-full">
          <div>
            <h4 className="text-2xl font-extrabold text-slate-900">
              {profile.name}
            </h4>
            <p className="text-xs text-blue-600 font-mono font-semibold">
              ID: {profile.staffId}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{profile.email}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Building className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Dept: {profile.department}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Role: {profile.role}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{profile.phone}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
