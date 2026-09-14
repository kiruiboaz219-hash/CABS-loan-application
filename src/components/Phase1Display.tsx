import React from 'react';
import { Home, Car, Store, User, Landmark, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CABSLogo } from './CABSLogo';
import { LoanCategory } from '../types';
import bankerImg from '../assets/images/banker_consultant_1789419621328.jpg';

interface Phase1DisplayProps {
  onSelectCategoryAndProceed: (category: LoanCategory) => void;
  onOpenSupport: () => void;
}

export const Phase1Display: React.FC<Phase1DisplayProps> = ({
  onSelectCategoryAndProceed,
  onOpenSupport,
}) => {
  const financeProducts: {
    id: LoanCategory;
    title: string;
    tagline: string;
    icon: React.ComponentType<{ className?: string }>;
    rate: string;
    range: string;
  }[] = [
    {
      id: 'home',
      title: 'Home Finance',
      tagline: 'Build your future',
      icon: Home,
      rate: 'From 11.5% p.a.',
      range: 'Up to $50,000',
    },
    {
      id: 'vehicle',
      title: 'Vehicle Finance',
      tagline: 'Drive your dreams',
      icon: Car,
      rate: 'From 13.0% p.a.',
      range: 'Up to $50,000',
    },
    {
      id: 'business',
      title: 'Business Finance',
      tagline: 'Grow your business',
      icon: Store,
      rate: 'From 15.0% p.a.',
      range: 'Up to $50,000',
    },
    {
      id: 'personal',
      title: 'Personal Finance',
      tagline: "For life's important moments",
      icon: User,
      rate: 'From 14.5% p.a.',
      range: 'Up to $25,000',
    },
  ];

  return (
    <section id="phase-1-poster-display" className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 md:py-8">
      {/* Visual Poster Frame mimicking the exact flyer layout */}
      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Top Wave Accent / CABS Blue curved backdrop on the left/right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] relative">
          
          {/* LEFT SIDE: Brand, Headline, and 4 Finance Categories */}
          <div className="lg:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-between z-10 bg-gradient-to-br from-white via-white to-blue-50/30">
            <div>
              {/* Top Logo */}
              <div className="mb-6 sm:mb-8">
                <CABSLogo size="lg" variant="dark" />
              </div>

              {/* Main Headline from photo */}
              <div className="space-y-1 mb-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0A2960] leading-none">
                  CABS BANK
                </h1>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#65B32E] leading-none">
                  FINANCE
                </div>
              </div>

              {/* Sub-headline from photo */}
              <p className="text-base sm:text-lg text-slate-700 font-semibold mb-8 max-w-md">
                Flexible finance solutions for your goals.
              </p>

              {/* 4 Finance Offerings with round blue badges & green divider */}
              <div className="relative pl-3 space-y-4 sm:space-y-5">
                {/* Thin vertical green accent line */}
                <div className="absolute left-6 top-3 bottom-3 w-[3px] bg-[#65B32E] rounded-full" />

                {financeProducts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectCategoryAndProceed(item.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onSelectCategoryAndProceed(item.id)}
                      className="group relative flex items-center justify-between gap-4 p-2.5 rounded-2xl bg-transparent hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 z-10">
                        {/* Round dark blue circular badge with white icon */}
                        <div className="w-11 h-11 rounded-full bg-[#0A2960] text-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-[#65B32E] transition-all flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[#0A2960] text-base sm:text-lg group-hover:text-[#0A2960] transition-colors leading-tight">
                            {item.title}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-500 font-medium leading-tight">
                            {item.tagline}
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#65B32E] group-hover:translate-x-1 transition-transform">
                        <span>Calculate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick action button for mobile / desktop */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectCategoryAndProceed('personal')}
                className="bg-[#0A2960] hover:bg-[#081F44] text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Proceed to Loan Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#85D844]" />
              </button>
              <span className="text-xs text-slate-500 font-medium">
                Borrow from <strong className="text-slate-800 font-bold">$500</strong> to <strong className="text-slate-800 font-bold">$50,000</strong>
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Professional Banker photo & branch environment */}
          <div className="lg:col-span-6 relative bg-[#0A2960] flex items-center justify-center overflow-hidden min-h-[360px] lg:min-h-full">
            {/* Background subtle diagonal graphic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2960]/90 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#0A2960]/60 z-10 pointer-events-none" />

            {/* Banker Portrait Image matching the user photo */}
            <img
              src={bankerImg}
              alt="CABS Bank Finance Consultant"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center max-h-[560px] lg:max-h-none"
            />

            {/* In-image CABS badge floating in top right */}
            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#65B32E] animate-ping" />
              <span className="text-[11px] font-bold text-[#0A2960] tracking-wide">
                CABS FINANCIAL ADVISOR ONLINE
              </span>
            </div>

            {/* Bottom floating badge on image */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#65B32E] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0A2960]">Instant Pre-Assessment</div>
                  <div className="text-[11px] text-slate-500">Apply right from your phone in 4 easy steps</div>
                </div>
              </div>
              <button
                onClick={() => onSelectCategoryAndProceed('personal')}
                className="bg-[#65B32E] hover:bg-[#589c28] text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM RIBBON: Wave Accent + Blue & Green Bar exactly as in photo */}
        <div className="relative">
          {/* Smooth organic wave divider SVG in lime green */}
          <div className="w-full overflow-hidden leading-none bg-white -mb-[1px]">
            <svg
              viewBox="0 0 1200 48"
              preserveAspectRatio="none"
              className="w-full h-7 sm:h-9 text-[#65B32E] fill-current"
            >
              <path d="M0,0 C150,35 350,45 600,20 C850,-5 1050,40 1200,10 L1200,48 L0,48 Z"></path>
            </svg>
          </div>

          {/* Deep Royal Navy Bar with Bank Pillars & Message Button */}
          <div className="bg-[#0A2960] text-white px-6 sm:px-10 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Left: Classic Bank Pillars Icon + Tagline from photo */}
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                  <Landmark className="w-6 h-6 text-[#88D645]" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black tracking-wider uppercase text-white">
                    YOUR TRUSTED BANK
                  </div>
                  <div className="text-xs sm:text-sm font-semibold tracking-wide text-blue-200">
                    FOR A BRIGHTER TOMORROW
                  </div>
                </div>
              </div>

              {/* Right: Vibrant Lime Green Message Us Button from photo */}
              <button
                id="message-us-button"
                onClick={onOpenSupport}
                className="w-full sm:w-auto bg-[#65B32E] hover:bg-[#589d27] text-white px-5 sm:px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] cursor-pointer group flex-shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-black tracking-wider uppercase">
                    MESSAGE US NOW
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-100 uppercase tracking-tight">
                    FOR MORE INFORMATION
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* Feature Highlights beneath banner */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Loan Range', val: '$500 – $50,000', desc: 'Flexible funding amounts' },
          { label: 'Repayment Terms', val: '6 to 60 Months', desc: 'Comfortable monthly terms' },
          { label: 'Approval Speed', val: 'Same-day Review', desc: 'Real-time SMS updates' },
          { label: 'Disbursement', val: 'Direct to CABS Account', desc: 'Instant access to funds' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            <div className="text-lg font-bold text-[#0A2960] mt-0.5">{stat.val}</div>
            <div className="text-[11px] text-slate-400 mt-1">{stat.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
