import React, { useState } from 'react';
import { Settings, Save, Plus, Trash2, CheckCircle2, Shield, Bell, Sliders, Sun, Moon, Laptop } from 'lucide-react';

export default function SettingsPanel({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState(settings);
  const [newCategory, setNewCategory] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (formData.categories.includes(newCategory.trim())) return;

    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory.trim()],
    }));
    setNewCategory('');
  };

  const handleDeleteCategory = (catToDelete) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== catToDelete),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setToastMsg('System settings saved successfully!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>System Settings &amp; Workflow Configuration</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure global portal parameters, escalation rules, categories, and notification channels.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: General Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>General Portal Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Institution / Portal Title
              </label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Support Email Address
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Support Phone Number
              </label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Escalation Response Deadline
              </label>
              <select
                value={formData.escalationDays}
                onChange={(e) => setFormData({ ...formData, escalationDays: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
              >
                <option value={5}>5 Days Response SLA</option>
                <option value={7}>7 Days Response SLA</option>
                <option value={10}>10 Days Response SLA (Default)</option>
                <option value={15}>15 Days Response SLA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Notification Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Notification &amp; Alert Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Enable Email Notifications</span>
              <input
                type="checkbox"
                checked={formData.enableEmailNotifications}
                onChange={() => handleToggle('enableEmailNotifications')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Enable In-App Notifications</span>
              <input
                type="checkbox"
                checked={formData.enableInAppNotifications}
                onChange={() => handleToggle('enableInAppNotifications')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Enable Escalation Alerts</span>
              <input
                type="checkbox"
                checked={formData.enableEscalationAlerts}
                onChange={() => handleToggle('enableEscalationAlerts')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Enable Staff Performance Alerts</span>
              <input
                type="checkbox"
                checked={formData.enableStaffAlerts}
                onChange={() => handleToggle('enableStaffAlerts')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Feedback Categories */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Manage Department Categories</span>
          </h3>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {formData.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Theme Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sun className="w-4 h-4 text-blue-600" />
            <span>Theme &amp; Display Preference</span>
          </h3>

          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            {['Light', 'Dark', 'System'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setFormData({ ...formData, theme: t })}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formData.theme === t
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t === 'Light' && <Sun className="w-4 h-4" />}
                {t === 'Dark' && <Moon className="w-4 h-4" />}
                {t === 'System' && <Laptop className="w-4 h-4" />}
                <span>{t} Mode</span>
              </button>
            ))}
          </div>
        </div>

      </form>

    </div>
  );
}
