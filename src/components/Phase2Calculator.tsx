import React, { useState, useMemo } from 'react';
import { Home, Car, Store, User, Calculator, ArrowRight, ArrowLeft, Info, Calendar, DollarSign, Percent, ShieldCheck } from 'lucide-react';
import { LoanCategory, LoanDetails } from '../types';
import { LOAN_PRODUCTS, calculateLoanDetails } from '../data/loanProducts';

interface Phase2CalculatorProps {
  initialCategory: LoanCategory;
  onProceed: (details: LoanDetails) => void;
  onBack: () => void;
}

export const Phase2Calculator: React.FC<Phase2CalculatorProps> = ({
  initialCategory,
  onProceed,
  onBack,
}) => {
  const [category, setCategory] = useState<LoanCategory>(initialCategory);
  const [amount, setAmount] = useState<number>(() => {
    // sensible default depending on category
    if (initialCategory === 'home') return 15000;
    if (initialCategory === 'vehicle') return 12000;
    if (initialCategory === 'business') return 8000;
    return 3500;
  });

  const product = LOAN_PRODUCTS[category];

  // Tenure in months
  const [tenure, setTenure] = useState<number>(product.defaultTenureMonths);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Quick preset amounts between $500 and $50,000
  const presets = [1000, 2500, 5000, 10000, 25000, 50000];

  // Calculate live loan financial breakdown
  const loanDetails = useMemo(() => {
    return calculateLoanDetails(category, amount, tenure);
  }, [category, amount, tenure]);

  // Handle category change and reset tenure to bounds
  const handleCategoryChange = (newCat: LoanCategory) => {
    setCategory(newCat);
    const newProduct = LOAN_PRODUCTS[newCat];
    if (tenure > newProduct.maxTenureMonths) {
      setTenure(newProduct.maxTenureMonths);
    } else if (tenure < newProduct.minTenureMonths) {
      setTenure(newProduct.minTenureMonths);
    }
  };

  // Slider background fill percentage
  const sliderPercentage = ((amount - 500) / (50000 - 500)) * 100;

  return (
    <section id="phase-2-loan-calculator" className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
      
      {/* Title & Phase Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#65B32E] text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Phase 2: Loan Calculator & Term Selection</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2960] tracking-tight">
          Calculate Your Loan Repayments
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Choose your loan category and adjust the slider between <strong>$500</strong> and <strong>$50,000</strong> to view your personalized monthly installment.
        </p>
      </div>

      {/* Loan Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { id: 'personal' as LoanCategory, name: 'Personal Finance', icon: User, tagline: "Life's moments" },
          { id: 'vehicle' as LoanCategory, name: 'Vehicle Finance', icon: Car, tagline: 'Drive dreams' },
          { id: 'business' as LoanCategory, name: 'Business Finance', icon: Store, tagline: 'Grow business' },
          { id: 'home' as LoanCategory, name: 'Home Finance', icon: Home, tagline: 'Build future' },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = category === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleCategoryChange(item.id)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#65B32E] bg-emerald-50/50 shadow-sm ring-2 ring-[#65B32E]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#0A2960] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#65B32E] text-white px-2 py-0.5 rounded-md">
                    Selected
                  </span>
                )}
              </div>
              <div>
                <div className="font-bold text-sm text-[#0A2960] leading-snug">{item.name}</div>
                <div className="text-[11px] text-slate-500">{item.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          
          {/* Amount Slider Section ($500 to $50,000) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="loan-amount-slider" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#65B32E]" />
                  <span>Borrowing Amount ($500 - $50,000)</span>
                </label>
                <p className="text-xs text-slate-500">Slide or enter your desired loan sum</p>
              </div>

              {/* Direct Numerical Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                  $
                </span>
                <input
                  id="loan-amount-input"
                  type="number"
                  min={500}
                  max={50000}
                  step={100}
                  value={amount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 50000) {
                      setAmount(val);
                    }
                  }}
                  onBlur={() => {
                    if (amount < 500) setAmount(500);
                    if (amount > 50000) setAmount(50000);
                  }}
                  className="w-32 sm:w-36 pl-7 pr-3 py-2 text-right text-lg sm:text-xl font-black text-[#0A2960] border-2 border-slate-200 rounded-xl focus:border-[#65B32E] focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Slider */}
            <div className="pt-2">
              <input
                id="loan-amount-slider"
                type="range"
                min={500}
                max={50000}
                step={250}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="cabs-slider"
                style={{
                  background: `linear-gradient(to right, #65B32E 0%, #65B32E ${sliderPercentage}%, #E2E8F0 ${sliderPercentage}%, #E2E8F0 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-slate-400 font-semibold mt-2">
                <span>$500 (Min)</span>
                <span className="hidden sm:inline">$15,000</span>
                <span className="hidden sm:inline">$30,000</span>
                <span>$50,000 (Max)</span>
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 font-medium mr-1">Quick Select:</span>
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    amount === preset
                      ? 'bg-[#0A2960] text-white border-[#0A2960]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Repayment Period / Tenure Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#65B32E]" />
                  <span>Repayment Tenure</span>
                </label>
                <p className="text-xs text-slate-500">Duration in months to amortize payment</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#0A2960]">{tenure} Months</span>
                <span className="text-xs text-slate-500 block">({(tenure / 12).toFixed(1)} years)</span>
              </div>
            </div>

            {/* Tenure Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[6, 12, 18, 24, 36, 48, 60].map((months) => {
                const isSelected = tenure === months;
                const isAvailable =
                  months >= product.minTenureMonths && months <= product.maxTenureMonths;
                if (!isAvailable) return null;

                return (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setTenure(months)}
                    className={`py-2 px-1 text-center rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#65B32E] text-white border-[#65B32E] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {months}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product key features */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="font-bold text-[#0A2960] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#65B32E]" />
              <span>{product.name} Highlights</span>
            </div>
            <p className="text-slate-600">{product.subtext}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {product.features.map((feat, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65B32E]"></span>
                  {feat}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Loan Summary Card */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#0A2960] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Background accent curves */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#65B32E]/30 to-transparent rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-blue-800/80 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                    Loan Breakdown
                  </span>
                  <h3 className="text-lg font-black text-white">{product.name}</h3>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 border border-white/10">
                    {product.annualInterestRate}% p.a.
                  </span>
                </div>
              </div>

              {/* Huge Monthly Installment Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center">
                <span className="text-xs uppercase tracking-wider text-blue-200 font-medium block mb-1">
                  Estimated Monthly Installment
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                  ${loanDetails.monthlyInstallment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-sm text-blue-200 font-sans font-medium ml-1">/mo</span>
                </div>
                <div className="text-[11px] text-blue-200 mt-1">
                  Includes standard CABS account service charge
                </div>
              </div>

              {/* Financial Metrics breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-blue-200">Principal Requested:</span>
                  <span className="font-bold font-mono text-white">${loanDetails.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-blue-200">Total Interest Over Term:</span>
                  <span className="font-bold font-mono text-emerald-300">
                    ${loanDetails.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-blue-200">Monthly Admin Fee:</span>
                  <span className="font-bold font-mono text-white">${loanDetails.monthlyAdminFee.toFixed(2)}/mo</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-blue-200">Total Repayment Amount:</span>
                  <span className="font-bold font-mono text-white text-sm">
                    ${loanDetails.totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-blue-200">Target First Disbursement:</span>
                  <span className="font-bold text-[#88D645]">{loanDetails.estimatedDisbursementDate}</span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <button
                id="continue-to-phase-3-btn"
                type="button"
                onClick={() => onProceed(loanDetails)}
                className="w-full bg-[#65B32E] hover:bg-[#589c28] text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group text-base"
              >
                <span>Proceed to Personal Details</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>No impact on credit rating until formal submission</span>
              </div>
            </div>
          </div>

          {/* Navigation and Back button */}
          <div className="flex items-center justify-between px-2">
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="text-xs font-semibold text-[#0A2960] hover:underline cursor-pointer"
            >
              {showAmortization ? 'Hide Amortization Table' : 'View Sample Repayment Schedule'}
            </button>
          </div>

          {/* Optional Amortization Drawer */}
          {showAmortization && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2 max-h-60 overflow-y-auto">
              <div className="font-bold text-[#0A2960] mb-1">First 6 Months Sample Schedule:</div>
              <div className="grid grid-cols-4 font-bold text-slate-500 border-b pb-1 text-[11px]">
                <span>Month</span>
                <span>Payment</span>
                <span>Principal</span>
                <span>Balance</span>
              </div>
              {Array.from({ length: Math.min(6, tenure) }).map((_, i) => {
                const monthNum = i + 1;
                const monthlyRate = product.annualInterestRate / 100 / 12;
                const estInterest = amount * monthlyRate;
                const estPrincipal = loanDetails.monthlyInstallment - estInterest;
                const remaining = Math.max(0, amount - estPrincipal * monthNum);
                return (
                  <div key={monthNum} className="grid grid-cols-4 font-mono text-[11px] text-slate-700 py-0.5 border-b border-slate-100">
                    <span>M{monthNum}</span>
                    <span>${loanDetails.monthlyInstallment.toFixed(0)}</span>
                    <span>${estPrincipal.toFixed(0)}</span>
                    <span>${remaining.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
