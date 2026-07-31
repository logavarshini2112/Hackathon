import React from 'react';
import { X, FileText, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import StatusTimeline from './StatusTimeline';

export default function FeedbackCard({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-blue-600">
                {record.referenceId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {record.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {record.subject}
            </h3>
          </div>
        </div>

        {/* Info Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <p className="text-slate-400 font-medium">Department</p>
            <p className="font-bold text-slate-800">{record.department}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Type</p>
            <p className="font-bold text-slate-800">{record.feedbackType}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Priority</p>
            <p className="font-bold text-slate-800">{record.priority}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Incident Date</p>
            <p className="font-bold text-slate-800">{record.date}</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Detailed Description
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-100">
            {record.description}
          </p>
        </div>

        {/* Image Attachment Preview if present */}
        {record.image && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Attached Proof / Media</span>
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56">
              <img
                src={record.image}
                alt="Attachment Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Embedded Status Timeline */}
        <StatusTimeline currentStatus={record.status} />

        {/* Close Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
