import React from 'react';
import { 
  FileText, 
  Search, 
  GitFork, 
  BellRing, 
  BarChart3, 
  ShieldCheck 
} from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      icon: FileText,
      title: 'Digital Feedback',
      description: 'Streamlined online submission forms with star ratings, custom category tagging, and instant photo attachment options.',
    },
    {
      icon: Search,
      title: 'Complaint Tracking',
      description: 'Transparent end-to-end status tracking with unique ticket numbers, audit history, and resolution timestamps.',
    },
    {
      icon: GitFork,
      title: 'Department Routing',
      description: 'Smart automated ticket dispatching that routes incoming visitor issues directly to responsible department personnel.',
    },
    {
      icon: BellRing,
      title: 'Real-Time Notifications',
      description: 'Instant multi-channel alerts (SMS/Email) notifying staff of critical feedback and urgent service requests.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive visual metrics, visitor sentiment trends, and department performance reports for executive decision-making.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Role-Based Access',
      description: 'Granular permissions and isolated access controls tailored specifically for Visitors, Staff Members, and Administrators.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            Powerful Features
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need for Total Experience Management
          </h3>
          <p className="text-base sm:text-lg text-slate-600">
            Designed to bridge visitors, operational staff, and leadership into one seamless digital feedback workflow.
          </p>
        </div>

        {/* Feature Cards Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Wrapper */}
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Card Footer Indicator */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <span>&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
