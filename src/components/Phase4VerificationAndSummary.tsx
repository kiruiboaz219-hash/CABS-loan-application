import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Clock, CheckCircle2, Copy, Check, Printer, RefreshCw, Smartphone, Download, AlertTriangle, ArrowRight, Home, HelpCircle } from 'lucide-react';
import { LoanDetails, PersonalDetails, LoanApplicationRecord } from '../types';
import { generateReferenceNumber } from '../data/loanProducts';

interface Phase4Props {
  loanDetails: LoanDetails;
  personalDetails: PersonalDetails;
  onResetToStart: () => void;
  onOpenSupport: () => void;
}

export const Phase4VerificationAndSummary: React.FC<Phase4Props> = ({
  loanDetails,
  personalDetails,
  onResetToStart,
  onOpenSupport,
}) => {
  // Step in Phase 4: 'otp_entry' | 'submitting' | 'summary_view'
  const [stage, setStage] = useState<'otp_entry' | 'submitting' | 'summary_view'>('otp_entry');
  
  // 6-digit OTP code state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState<number>(45);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [submissionRecord, setSubmissionRecord] = useState<LoanApplicationRecord | null>(null);

  // Mock OTP for easy testing
  const DEMO_OTP = '849201';

  // Countdown timer for resend
  useEffect(() => {
    if (stage === 'otp_entry' && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [stage, timer]);

  // Mask phone number for display
  const maskedPhone = personalDetails.phoneNumber.length > 8
    ? personalDetails.phoneNumber.slice(0, 7) + ' ••• •' + personalDetails.phoneNumber.slice(-3)
    : personalDetails.phoneNumber;

  // Mask account number
  const maskedAccount = personalDetails.accountNumber.length > 6
    ? personalDetails.accountNumber.slice(0, 4) + ' •••• ••' + personalDetails.accountNumber.slice(-2)
    : personalDetails.accountNumber;

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    setOtpError(null);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasteData[i] || '';
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pasteData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  // Quick auto-fill helper for demo testing
  const handleAutoFillDemo = () => {
    setOtp(DEMO_OTP.split(''));
    setOtpError(null);
    inputRefs.current[5]?.focus();
  };

  // Submit OTP & transition into Final Summary
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setOtpError('Please enter the full 6-digit OTP code sent to your phone');
      return;
    }

    setStage('submitting');

    // Simulate authentic bank underwriting and credit bureau check
    setTimeout(() => {
      const record: LoanApplicationRecord = {
        referenceNumber: generateReferenceNumber(),
        submissionTimestamp: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        status: 'under_review',
        loanDetails,
        personalDetails: {
          fullName: personalDetails.fullName,
          phoneNumber: personalDetails.phoneNumber,
          idNumber: personalDetails.idNumber,
          accountNumber: personalDetails.accountNumber,
          monthlyIncome: personalDetails.monthlyIncome,
          loanPurpose: personalDetails.loanPurpose,
          isExistingCustomer: personalDetails.isExistingCustomer,
        },
        applicantInitials: personalDetails.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        estimatedReviewHours: 3,
      };

      setSubmissionRecord(record);
      setStage('summary_view');
    }, 1800);
  };

  const handleCopyReference = () => {
    if (submissionRecord) {
      navigator.clipboard.writeText(submissionRecord.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="phase-4-container" className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10">
      
      {/* -------------------- 1. OTP INPUT VIEW -------------------- */}
      {stage === 'otp_entry' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg max-w-xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#65B32E] flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
              <Smartphone className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100/60 text-[#0A2960] text-xs font-bold uppercase tracking-wider">
              Phase 4: Two-Factor Authorization
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A2960] tracking-tight">
              Enter Verification Code (OTP)
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              We have dispatched a 6-digit One-Time PIN via SMS to your registered mobile number{' '}
              <strong className="text-slate-900 font-mono font-bold">{maskedPhone}</strong>.
            </p>
          </div>

          {/* Quick Demo Helper Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="text-slate-700">
              <span className="font-bold text-[#0A2960]">Test Demonstration:</span> Use demo code{' '}
              <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-blue-200 text-blue-900">
                {DEMO_OTP}
              </code>
            </div>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="bg-[#0A2960] hover:bg-[#081F44] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              Auto-fill Code
            </button>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            
            {/* 6 Digit Input Boxes */}
            <div className="space-y-2">
              <label className="block text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                Enter 6-Digit OTP
              </label>
              
              <div className="flex justify-center items-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-13 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl border-2 transition-all focus:outline-hidden ${
                      digit
                        ? 'border-[#65B32E] bg-emerald-50/40 text-[#0A2960]'
                        : 'border-slate-200 bg-slate-50 focus:border-[#0A2960] focus:bg-white'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-center text-xs font-semibold text-red-500 pt-1 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>

            {/* Resend timer */}
            <div className="text-center text-xs text-slate-500">
              {timer > 0 ? (
                <span className="flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Resend code in <strong className="font-mono text-slate-700">{timer}s</strong></span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTimer(45);
                    setOtp(['', '', '', '', '', '']);
                    inputRefs.current[0]?.focus();
                  }}
                  className="font-bold text-[#65B32E] hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend New OTP</span>
                </button>
              )}
            </div>

            {/* Verify CTA */}
            <button
              id="verify-otp-btn"
              type="submit"
              className="w-full bg-[#65B32E] hover:bg-[#589c28] text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify & Finalize Loan Application</span>
            </button>

            <div className="text-center text-[11px] text-slate-400">
              By confirming, you authorize CABS to perform credit referencing as per RBZ guidelines.
            </div>

          </form>

        </div>
      )}

      {/* -------------------- 2. SUBMITTING SIMULATION -------------------- */}
      {stage === 'submitting' && (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-lg max-w-md mx-auto text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-[#65B32E] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[#0A2960]">
              CABS
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#0A2960]">Submitting to CABS Core Banking...</h3>
            <p className="text-xs text-slate-500">
              Validating mobile banking PIN, authenticating applicant identity, and logging credit facility...
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-[#65B32E] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit Encrypted Transfer</span>
          </div>
        </div>
      )}

      {/* -------------------- 3. FINAL SUMMARY: STATUS - UNDER REVIEW -------------------- */}
      {stage === 'summary_view' && submissionRecord && (
        <div id="final-loan-summary-card" className="space-y-6">
          
          {/* Top Success & Status Banner */}
          <div className="bg-gradient-to-br from-[#0A2960] to-[#0d3478] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            {/* Background ambient lighting */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#65B32E]/25 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#65B32E] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1 border border-emerald-500/30">
                    Application Logged Successfully
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    Loan Application Successful!
                  </h2>
                  <p className="text-blue-200 text-sm mt-1">
                    Your request has been officially recorded in the CABS mobile banking system.
                  </p>
                </div>
              </div>

              {/* The Prominent Requested Badge: STATUS - UNDER REVIEW */}
              <div className="bg-amber-500/20 border-2 border-amber-400/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center flex-shrink-0 min-w-[240px]">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
                    Application Status
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-tight">
                  Status: Under Review
                </div>
                <div className="text-[11px] text-amber-100 font-medium mt-1">
                  Estimated review: 2 – 4 business hours
                </div>
              </div>

            </div>
          </div>

          {/* Reference Number & Quick Actions Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500">
                <span>Application Reference:</span>
                <div className="text-lg sm:text-xl font-mono font-black text-[#0A2960] tracking-wider">
                  {submissionRecord.referenceNumber}
                </div>
              </div>
              <button
                onClick={handleCopyReference}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                title="Copy reference number"
              >
                {copiedRef ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onOpenSupport}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#65B32E] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Chat with Banker</span>
              </button>
            </div>
          </div>

          {/* Comprehensive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card A: Financial Details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-[#0A2960] text-sm uppercase tracking-wide">
                  Loan Facility Summary
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0A2960] capitalize">
                  {loanDetails.category} Finance
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Loan Amount Requested:</span>
                  <span className="font-black font-mono text-base text-[#0A2960]">
                    ${loanDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Repayment Period:</span>
                  <span className="font-bold text-slate-800">{loanDetails.tenureMonths} Months</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Annual Interest Rate:</span>
                  <span className="font-bold text-slate-800">{loanDetails.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Estimated Monthly Installment:</span>
                  <span className="font-bold font-mono text-[#65B32E] text-sm">
                    ${loanDetails.monthlyInstallment.toFixed(2)}/month
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Repayable (inc. fees):</span>
                  <span className="font-bold font-mono text-slate-800">
                    ${loanDetails.totalRepayment.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Estimated Disbursement:</span>
                  <span className="font-bold text-emerald-700">{loanDetails.estimatedDisbursementDate}</span>
                </div>
              </div>
            </div>

            {/* Card B: Applicant Profile & Disbursement Destination */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-[#0A2960] text-sm uppercase tracking-wide">
                  Applicant & Destination
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified via OTP
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-slate-800">{personalDetails.fullName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Registered Phone:</span>
                  <span className="font-bold font-mono text-slate-800">{maskedPhone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">National ID Number:</span>
                  <span className="font-bold font-mono text-slate-800">{personalDetails.idNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Target CABS Account:</span>
                  <span className="font-bold font-mono text-slate-800">{maskedAccount}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Stated Purpose:</span>
                  <span className="font-medium text-slate-700 max-w-[200px] text-right truncate">
                    {personalDetails.loanPurpose}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Submission Timestamp:</span>
                  <span className="font-mono text-slate-600">{submissionRecord.submissionTimestamp}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Workflow & Next Steps Pipeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0A2960]">What Happens Next?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {[
                {
                  step: '1',
                  title: 'Application Logged',
                  desc: 'SMS acknowledgment sent to mobile device.',
                  done: true,
                },
                {
                  step: '2',
                  title: 'Under Review',
                  desc: 'Credit underwriting officer assesses KYC & credit registry.',
                  current: true,
                },
                {
                  step: '3',
                  title: 'Offer Acceptance',
                  desc: 'Digital acceptance via SMS or CABS mobile *227#.',
                  done: false,
                },
                {
                  step: '4',
                  title: 'Disbursement',
                  desc: 'Funds credited straight to your CABS account.',
                  done: false,
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    s.done
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : s.current
                      ? 'border-amber-300 bg-amber-50/50 ring-2 ring-amber-200'
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        s.done
                          ? 'bg-emerald-600 text-white'
                          : s.current
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.done ? '✓' : s.step}
                    </span>
                    {s.current && (
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-[#0A2960] mb-1">{s.title}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to restart / return */}
          <div className="text-center pt-4 pb-8">
            <button
              onClick={onResetToStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#0A2960]" />
              <span>Return to CABS Banking Homepage</span>
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
