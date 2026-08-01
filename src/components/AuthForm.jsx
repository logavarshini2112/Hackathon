import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquarePlus, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Phone, 
  User as UserIcon, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  UserPlus 
} from 'lucide-react';

export default function AuthForm({ 
  initialMode = 'login', 
  roleTitle, 
  roleSubtitle, 
  icon: RoleIcon, 
  badgeText, 
  destinationDashboard,
  allowRegister = true 
}) {
  const navigate = useNavigate();

  // Mode State: login vs register
  const [isRegister, setIsRegister] = useState(allowRegister && initialMode === 'register');

  // Form Field State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI Feedback State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Password Reset Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Validation
  const validate = () => {
    const newErrors = {};
    if (isRegister && !name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (isRegister && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler connecting to Port 5000 Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Backend API endpoint selection based on action
      const endpoint = isRegister
        ? 'http://localhost:5000/api/auth/register'
        : 'http://localhost:5000/api/auth/login';

      const payload = isRegister
        ? { name: name.trim(), email: email.trim(), password, phone: phone.trim() }
        : { email: email.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isRegister ? 'Registration failed. Please check details.' : 'Invalid credentials.'));
      }

      // Store JWT token and user info upon success
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      }

      // Determine actual target dashboard based on user's database role
      let targetDashboard = destinationDashboard;
      if (data.role === 'Visitor') {
        targetDashboard = '/visitor/dashboard';
      } else if (data.role === 'Staff') {
        targetDashboard = '/staff/dashboard';
      } else if (data.role === 'Administrator' || data.role === 'Admin') {
        targetDashboard = '/admin/dashboard';
      }

      if (isRegister) {
        setSuccessMessage('Account registered successfully! Redirecting to dashboard...');
      } else {
        setSuccessMessage('Login successful! Redirecting to dashboard...');
      }

      setTimeout(() => {
        setIsSubmitting(false);
        navigate(targetDashboard);
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setApiError(err.message || 'Server connection error. Please ensure backend is running on port 5000.');
    }
  };

  const handleModeSwitch = (mode) => {
    setIsRegister(mode === 'register');
    setErrors({});
    setApiError(null);
    setSuccessMessage(null);
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

      {/* Main Card Container */}
      <main className="my-auto py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-blue-500/5 space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              {isRegister ? <UserPlus className="w-7 h-7" /> : <RoleIcon className="w-7 h-7" />}
            </div>
            
            <div className="space-y-1">
              {badgeText && (
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 mb-1">
                  {badgeText}
                </span>
              )}
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isRegister ? 'Create Visitor Account' : roleTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {isRegister 
                  ? 'Register to submit complaints, suggestions, and track feedback.' 
                  : (roleSubtitle || 'Sign in to access your portal session.')}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          {allowRegister && (
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isRegister ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isRegister ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Backend API Error Banner */}
          {apiError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Registration Error</span>
                <span>{apiError}</span>
              </div>
            </div>
          )}

          {/* Backend API Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Success</span>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Full Name Input Field (Register Mode Only) */}
            {isRegister && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                    }}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                      errors.name
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            )}

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

            {/* Phone Input Field (Register Mode Only) */}
            {isRegister && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all duration-200 active:scale-95 disabled:opacity-75 cursor-pointer mt-3"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isRegister ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode Footer Link */}
          {allowRegister && (
            <div className="text-center pt-1 border-t border-slate-100">
              {isRegister ? (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Create an Account
                  </button>
                </p>
              )}
            </div>
          )}

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
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Password Reset
              </h3>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                Password reset is currently managed by the system administrator.
              </p>
              <p>
                Please contact your administrator to reset your account credentials.
              </p>
            </div>

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
