import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquarePlus, ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn, Phone, X, AlertCircle } from 'lucide-react';

export default function AuthForm({ roleTitle, roleSubtitle, icon: RoleIcon, badgeText, destinationDashboard }) {
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Validation
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate login delay & navigate
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(destinationDashboard);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Top Header */}
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

            {/* Back to Role Selection Button */}
            <button
              onClick={() => navigate('/role-selection')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 shadow-xs transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="my-auto py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-blue-500/5 space-y-6">
          
          {/* Form Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <RoleIcon className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              {badgeText && (
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 mb-1">
                  {badgeText}
                </span>
              )}
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {roleTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {roleSubtitle || 'Sign in to access your portal session.'}
              </p>
            </div>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Input Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  placeholder="name@organization.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                    errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all duration-200 active:scale-95 disabled:opacity-75 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Digital Visitor Feedback &amp; Experience Management Portal. All rights reserved.
        </div>
      </footer>

      {/* Forgot Password Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            
            {/* Close Button Top Right */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Icon & Header */}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Password Reset
              </h3>
            </div>

            {/* Modal Message */}
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                Password reset is currently managed by the system administrator.
              </p>
              <p>
                Please contact your administrator to reset your account credentials.
              </p>
            </div>

            {/* Contact Info Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs text-slate-700">
              <div className="font-semibold text-slate-900 mb-1 uppercase tracking-wider text-[11px]">
                Administrator Contact
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium text-slate-800">Email:</span>
                <a href="mailto:support@visitorportal.com" className="text-blue-600 hover:underline">
                  support@visitorportal.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium text-slate-800">Phone:</span>
                <span className="text-slate-800">+91-9876543210</span>
              </div>
            </div>

            {/* Modal Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
