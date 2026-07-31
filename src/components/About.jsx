import React from 'react';
import { FileX, Zap, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function About() {
  const comparisons = [
    {
      title: 'Traditional Paper-Based System',
      badge: 'Legacy Process',
      badgeColor: 'bg-red-50 text-red-600 border-red-200',
      icon: FileX,
      points: [
        'Physical paper forms subject to loss, damage, or misplacement',
        'Manual collection and slow data entry introducing delays',
        'Lack of real-time visibility and status tracking for visitors',
        'Difficulty in generating operational insights or analytics',
      ],
      isModern: false,
    },
    {
      title: 'Digital Visitor Feedback Portal',
      badge: 'Modern Workflow',
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
      icon: Zap,
      points: [
        'Instant online submission accessible via mobile or desktop',
        'Automated department routing and escalation workflows',
        'Real-time ticket status updates and notification alerts',
        'Centralized dashboard with analytics and SLA reporting',
      ],
      isModern: true,
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50/70 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            About The Portal
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Replacing Manual Paperwork with Intelligent Automation
          </h3>
          <p className="text-base sm:text-lg text-slate-600">
            Discover how shifting to a digital-first feedback architecture eliminates bottlenecks and transforms visitor interactions into actionable insights.
          </p>
        </div>

        {/* Side by Side Process Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
          {comparisons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-8 border transition-all duration-300 ${
                  item.isModern
                    ? 'bg-white border-blue-200 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20'
                    : 'bg-slate-100/70 border-slate-200 shadow-sm opacity-90'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    item.isModern ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h4>

                <ul className="space-y-3">
                  {item.points.map((point, pointIdx) => (
                    <li key={pointIdx} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        item.isModern ? 'text-blue-600' : 'text-slate-400'
                      }`} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Operational Highlights Pill Banner */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="p-4 space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-slate-900 text-base">100% Paperless</h5>
            <p className="text-xs text-slate-500">Eco-friendly digital workflow saving physical resources and archiving costs.</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-slate-900 text-base">Rapid Resolution</h5>
            <p className="text-xs text-slate-500">Instant routing cuts feedback resolution time down from days to minutes.</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-slate-900 text-base">Complete Audit Trail</h5>
            <p className="text-xs text-slate-500">Every ticket and action logged transparently for compliance and review.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
