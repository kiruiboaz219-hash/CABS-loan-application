import React from 'react';
import { CABSLogo } from './CABSLogo';
import { ShieldCheck, PhoneCall, HelpCircle, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentPhase: 1 | 2 | 3 | 4;
  onNavigatePhase: (phase: 1 | 2 | 3 | 4) => void;
  onOpenSupport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPhase,
  onNavigatePhase,
  onOpenSupport,
}) => {
  const steps = [
    { num: 1, label: 'Overview', short: 'Overview' },
    { num: 2, label: 'Calculator', short: 'Amount' },
    { num: 3, label: 'Personal Details', short: 'Details' },
    { num: 4, label: 'OTP & Status', short: 'Review' },
  ];

  return (
    <header id="cabs-app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top utility security ribbon */}
      <div className="bg-[#081F44] text-white text-xs px-4 py-1.5 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#65B32E] animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#85D844]" />
            <span className="hidden sm:inline text-slate-300">Official Portal:</span>
            <span className="text-white font-semibold tracking-wide">CABS Mobile Banking</span>
            <span className="text-slate-400 hidden md:inline">• RBZ Licensed Banking Institution</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <button
              onClick={onOpenSupport}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              title="CABS 24/7 Helpline"
            >
              <PhoneCall className="w-3 h-3 text-[#85D844]" />
              <span className="hidden sm:inline">Support:</span>
              <span className="text-white font-mono font-semibold">+263 242 883822</span>
            </button>
            <button
              onClick={onOpenSupport}
              className="hover:text-white flex items-center gap-1 cursor-pointer text-slate-200"
            >
              <HelpCircle className="w-3 h-3 text-[#85D844]" />
              <span>Assistance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentPhase > 1 && (
            <button
              onClick={() => onNavigatePhase((currentPhase - 1) as 1 | 2 | 3 | 4)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-sm font-medium"
              title="Return to previous phase"
            >
              <ArrowLeft className="w-4 h-4 text-[#0A2960]" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <button
            onClick={() => onNavigatePhase(1)}
            className="text-left cursor-pointer focus:outline-hidden"
          >
            <CABSLogo size="sm" variant="dark" />
          </button>
        </div>

        {/* 4 Phases Stepper Indicator */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {steps.map((step, idx) => {
            const isActive = currentPhase === step.num;
            const isPassed = currentPhase > step.num;
            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => {
                    // Only allow navigating back to completed steps or current
                    if (isPassed || isActive) {
                      onNavigatePhase(step.num as 1 | 2 | 3 | 4);
                    }
                  }}
                  disabled={!isPassed && !isActive}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0A2960] text-white shadow-xs'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer border border-emerald-200'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActive
                        ? 'bg-[#65B32E] text-white'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPassed ? '✓' : step.num}
                  </span>
                  <span className="whitespace-nowrap">Phase {step.num}: {step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-4 sm:w-6 h-0.5 rounded-full transition-colors ${
                      currentPhase > step.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          {currentPhase === 1 ? (
            <button
              onClick={() => onNavigatePhase(2)}
              className="bg-[#65B32E] hover:bg-[#579d26] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply for Loan</span>
              <span className="text-emerald-100">→</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0A2960]"></span>
              <span>Phase {currentPhase} of 4</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden w-full bg-slate-100 h-1">
        <div
          className="bg-gradient-to-r from-[#0A2960] to-[#65B32E] h-1 transition-all duration-300"
          style={{ width: `${(currentPhase / 4) * 100}%` }}
        />
      </div>
    </header>
  );
};
