import React, { useState } from 'react';
import { Send, RotateCcw, AlertCircle, CheckCircle2, FileText, Calendar, X, Clock } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function FeedbackForm({ onFeedbackSubmitted }) {
  const todayDate = new Date().toISOString().split('T')[0];

  const initialFormState = {
    department: '',
    feedbackType: '',
    subject: '',
    description: '',
    priority: 'Medium',
    incidentDate: todayDate,
    termsAccepted: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmationData, setConfirmationData] = useState(null);

  const departments = [
    'Administration',
    'Accounts',
    'Library',
    'Transport',
    'Hostel',
    'Cafeteria',
    'Maintenance',
    'IT Support',
    'Security',
    'Others',
  ];

  const feedbackTypes = ['Complaint', 'Suggestion', 'Appreciation'];
  const priorityOptions = ['Low', 'Medium', 'High'];

  const validate = () => {
    const newErrors = {};
    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.feedbackType) newErrors.feedbackType = 'Please select feedback type';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must confirm that the information is true';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleReset = () => {
    setFormData(initialFormState);
    setImageFile(null);
    setImageError(null);
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitError('Authentication token missing. Please sign in as a Visitor.');
        setIsSubmitting(false);
        return;
      }

      const payloadData = new FormData();
      payloadData.append('department', formData.department);
      payloadData.append('feedbackType', formData.feedbackType);
      payloadData.append('subject', formData.subject.trim());
      payloadData.append('description', formData.description.trim());
      payloadData.append('priority', formData.priority);
      payloadData.append('incidentDate', formData.incidentDate);

      if (imageFile && imageFile.file) {
        payloadData.append('image', imageFile.file);
      }

      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: payloadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback ticket.');
      }

      const newRecord = {
        id: data.id,
        referenceId: data.reference_id || data.referenceId,
        department: data.department,
        feedbackType: data.feedback_type || data.feedbackType,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        date: data.incident_date ? data.incident_date.split('T')[0] : formData.incidentDate,
        status: data.status || 'Open',
        estimatedResponse: '48 Hours',
        image: data.image_url ? `http://localhost:5000${data.image_url}` : (imageFile ? imageFile.previewUrl : null),
        assignedStaff: data.assigned_staff || 'Unassigned',
      };

      // Show Confirmation Card modal
      setConfirmationData(newRecord);

      // Pass up to parent dashboard state
      if (onFeedbackSubmitted) onFeedbackSubmitted(newRecord);

      // Reset Form
      setFormData(initialFormState);
      setImageFile(null);
      setImageError(null);
      setErrors({});
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Server connection error. Please ensure backend is running.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Submit Visitor Feedback</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Fill in the details below to log a new inquiry, complaint, or appreciation ticket.
        </p>
      </div>

      {/* Backend API Error Banner */}
      {submitError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Submission Error</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        
        {/* Row 1: Department & Feedback Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Department Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => {
                setFormData({ ...formData, department: e.target.value });
                if (errors.department) setErrors({ ...errors, department: null });
              }}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none transition-all ${
                errors.department ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600'
              }`}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.department}
              </p>
            )}
          </div>

          {/* Feedback Type Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Feedback Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.feedbackType}
              onChange={(e) => {
                setFormData({ ...formData, feedbackType: e.target.value });
                if (errors.feedbackType) setErrors({ ...errors, feedbackType: null });
              }}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none transition-all ${
                errors.feedbackType ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600'
              }`}
            >
              <option value="">Select Type</option>
              {feedbackTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.feedbackType && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.feedbackType}
              </p>
            )}
          </div>

        </div>

        {/* Row 2: Subject */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => {
              setFormData({ ...formData, subject: e.target.value });
              if (errors.subject) setErrors({ ...errors, subject: null });
            }}
            placeholder="Brief summary of your feedback or issue"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none transition-all ${
              errors.subject ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600'
            }`}
          />
          {errors.subject && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
            </p>
          )}
        </div>

        {/* Row 3: Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: null });
            }}
            placeholder="Provide complete details regarding your feedback or experience..."
            className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none transition-all ${
              errors.description ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
            </p>
          )}
        </div>

        {/* Row 4: Priority & Incident Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Priority Radios */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 pt-1">
              {priorityOptions.map((priority) => (
                <label key={priority} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>{priority}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Incident Date Auto-filled */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Incident Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Image Upload Optional */}
        <ImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          imageError={imageError}
          setImageError={setImageError}
        />

        {/* Terms Checkbox */}
        <div className="space-y-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => {
                setFormData({ ...formData, termsAccepted: e.target.checked });
                if (errors.termsAccepted) setErrors({ ...errors, termsAccepted: null });
              }}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-xs sm:text-sm text-slate-700">
              I confirm the above information is true.
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-xs text-red-600 flex items-center gap-1 pt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.termsAccepted}
            </p>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/25 transition-all duration-200 active:scale-95 disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Submission Confirmation Card Modal */}
      {confirmationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            
            <button
              onClick={() => setConfirmationData(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Feedback Submitted Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Your feedback ticket has been logged and assigned to the department team.
              </p>
            </div>

            {/* Ticket Details Grid */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Reference ID:</span>
                <span className="font-bold text-blue-600 font-mono text-sm">{confirmationData.referenceId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="font-semibold text-slate-900">{confirmationData.department}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Feedback Type:</span>
                <span className="font-semibold text-slate-900">{confirmationData.feedbackType}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Priority:</span>
                <span className="font-semibold text-slate-900">{confirmationData.priority}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Submission Date:</span>
                <span className="font-semibold text-slate-900">{confirmationData.date}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Estimated Response:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {confirmationData.estimatedResponse}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  {confirmationData.status}
                </span>
              </div>
            </div>

            {/* Dismiss Button */}
            <div className="pt-2">
              <button
                onClick={() => setConfirmationData(null)}
                className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                Close &amp; View Ticket List
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
