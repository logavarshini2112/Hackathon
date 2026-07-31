import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50/50 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative background glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/60 text-blue-700 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Next-Gen Visitor Experience Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Streamline Visitor Feedback with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Digital Precision
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Transform traditional paper feedback into real-time digital intelligence. Automatically route inquiries, resolve complaints faster, and elevate visitor satisfaction across every touchpoint.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/role-selection')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 shadow-sm hover:border-slate-300 transition-all duration-200"
              >
                Learn More
              </a>
            </div>

            {/* Key Value Pill Highlights */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Instant Ticket Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Secure &amp; Role-Based</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Real-Time SLA Insights</span>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic / Mockup Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Card */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl shadow-blue-600/20">
                <div className="bg-white rounded-xl p-6 sm:p-8 space-y-6">
                  
                  {/* Header Badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Live Visitor Feed</h4>
                        <p className="text-xs text-slate-500">Real-time submissions</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Portal
                    </span>
                  </div>

                  {/* Sample Mock Feedback Items */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        5★
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-800">Facilities Feedback</span>
                          <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">"Prompt assistance at reception desk. Very smooth check-in process."</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        Tkt
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-800">Service Dispatch #804</span>
                          <span className="text-[10px] text-blue-600 font-semibold">Assigned: Maintenance</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">Escalated automatically to department head for immediate resolution.</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Pill Footer */}
                  <div className="pt-2 grid grid-cols-2 gap-3 text-center border-t border-slate-100">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="text-lg font-bold text-blue-600">99.4%</div>
                      <div className="text-[11px] text-slate-500">Satisfaction Score</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="text-lg font-bold text-slate-900">&lt; 15 min</div>
                      <div className="text-[11px] text-slate-500">Avg. Response Time</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
