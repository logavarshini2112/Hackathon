import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, ArrowRight } from 'lucide-react';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Card Container */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-14 text-white shadow-2xl shadow-blue-600/30 overflow-hidden">
          
          {/* Subtle Background Accent Pattern */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-0 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-semibold uppercase tracking-wider border border-white/20">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Ready for Seamless Feedback Management?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Elevate Your Visitor Experience Today
            </h2>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
              Join operational teams, administrators, and visitors in utilizing our unified digital portal for instant feedback and transparent issue tracking.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/role-selection')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-base shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <LogIn className="w-5 h-5 text-blue-600" />
                <span>Login to Continue</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
