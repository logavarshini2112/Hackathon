import React, { useState, useRef } from 'react';
import { User, Mail, ShieldAlert, Edit3, X, Camera, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminProfileCard({ profile = {}, onProfileUpdated }) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Edit Profile Form state
  const [editName, setEditName] = useState(profile.name || '');
  const [editEmail, setEditEmail] = useState(profile.email || '');
  const [editPhone, setEditPhone] = useState(profile.phone || '+91-9876543210');

  // Status & Notifications
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const fileInputRef = useRef(null);

  const showSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Open Edit Profile Modal
  const handleOpenEditProfile = () => {
    setEditName(profile.name || '');
    setEditEmail(profile.email || '');
    setEditPhone(profile.phone || '');
    setFormError(null);
    setIsEditProfileOpen(true);
  };

  // Submit Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!editName.trim()) {
      setFormError('Name is required');
      return;
    }
    if (!editEmail.trim()) {
      setFormError('Email is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      // Update localStorage user object
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, name: data.name, email: data.email, phone: data.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (onProfileUpdated) onProfileUpdated(data);
      setIsEditProfileOpen(false);
      showSuccess('Profile updated successfully in MySQL database.');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Profile Photo Upload Handler
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type & size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSuccess('Unsupported format. Please select JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showSuccess('File size exceeds 5 MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile-photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload photo.');
      }

      // Append cache-busting timestamp
      const avatarUrl = data.avatar_url ? `http://localhost:5000${data.avatar_url}?t=${Date.now()}` : null;
      
      // Update localStorage user
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.avatar_url = data.avatar_url;
      localStorage.setItem('user', JSON.stringify(storedUser));

      if (avatarUrl && onProfileUpdated) {
        onProfileUpdated({ ...profile, avatarUrl, avatar_url: data.avatar_url });
      }

      showSuccess('Profile photo uploaded and saved to MySQL.');
    } catch (err) {
      console.error('Avatar upload error:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Toast Notice */}
      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

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

      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileSelect}
        accept="image/jpeg, image/jpg, image/png, image/webp"
        className="hidden"
      />

      {/* Main Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        
        {/* Avatar with Camera Upload Overlay */}
        <div className="relative group">
          <img
            src={profile.avatarUrl || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'}
            alt={profile.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-blue-50 shadow-md"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-2xl bg-slate-900/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all cursor-pointer"
            title="Upload Profile Photo"
          >
            <Camera className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1">Upload Photo</span>
          </button>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{profile.email}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{profile.phone || '+91-9876543210'}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Role: {profile.role}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <button
              onClick={handleOpenEditProfile}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Edit Administrator Profile</h4>
                <p className="text-xs text-slate-500">Update personal profile details in MySQL database.</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
