import React, { useState } from 'react';
import { Header } from './components/Header';
import { Phase1Display } from './components/Phase1Display';
import { Phase2Calculator } from './components/Phase2Calculator';
import { Phase3PersonalDetails } from './components/Phase3PersonalDetails';
import { Phase4VerificationAndSummary } from './components/Phase4VerificationAndSummary';
import { SupportModal } from './components/SupportModal';
import { CABSLogo } from './components/CABSLogo';
import { LoanCategory, LoanDetails, PersonalDetails } from './types';
import { calculateLoanDetails } from './data/loanProducts';
import { ShieldCheck, Phone, Landmark, Lock, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategory, setSelectedCategory] = useState<LoanCategory>('personal');
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  // Default calculated loan details
  const [loanDetails, setLoanDetails] = useState<LoanDetails>(() =>
    calculateLoanDetails('personal', 3500, 24)
  );

  // Personal details state
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: 'Tinashe Moyo',
    phoneNumber: '+263 77 412 8934',
    idNumber: '63-2049182-W-23',
    accountNumber: '1004 8291 03',
    pin: '4821',
    monthlyIncome: '2400',
    loanPurpose: 'Personal Development & Renovation',
    isExistingCustomer: true,
  });

  // Action from Phase 1: user clicks a finance product or "Proceed"
  const handleSelectCategoryAndProceed = (category: LoanCategory) => {
    setSelectedCategory(category);
    setLoanDetails(calculateLoanDetails(category, category === 'home' ? 15000 : 5000, 24));
    setCurrentPhase(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action from Phase 2: user finishes slider & calculator
  const handleCalculatorProceed = (details: LoanDetails) => {
    setLoanDetails(details);
    setCurrentPhase(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action from Phase 3: user submits personal details & PIN
  const handlePersonalDetailsProceed = (details: PersonalDetails) => {
    setPersonalDetails(details);
    setCurrentPhase(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset back to Phase 1
  const handleResetToStart = () => {
    setCurrentPhase(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* CABS Top Navigation & Phase Stepper */}
      <Header
        currentPhase={currentPhase}
        onNavigatePhase={(phase) => {
          setCurrentPhase(phase);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Main Content Area rendering the Active Phase */}
      <main className="flex-1 flex flex-col justify-start">
        {currentPhase === 1 && (
          <Phase1Display
            onSelectCategoryAndProceed={handleSelectCategoryAndProceed}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        )}

        {currentPhase === 2 && (
          <Phase2Calculator
            initialCategory={selectedCategory}
            onProceed={handleCalculatorProceed}
            onBack={() => {
              setCurrentPhase(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPhase === 3 && (
          <Phase3PersonalDetails
            loanDetails={loanDetails}
            onProceed={handlePersonalDetailsProceed}
            onBack={() => {
              setCurrentPhase(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPhase === 4 && (
          <Phase4VerificationAndSummary
            loanDetails={loanDetails}
            personalDetails={personalDetails}
            onResetToStart={handleResetToStart}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        )}
      </main>

      {/* CABS Banking Footer */}
      <footer className="mt-auto bg-[#071936] text-slate-300 border-t border-slate-800 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <CABSLogo variant="light" size="sm" />
              <p className="text-slate-400 text-[11px] mt-2 max-w-sm">
                Central Africa Building Society (CABS) is a registered building society and commercial bank in Zimbabwe. A member of the Old Mutual Group.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#85D844]" />
                <span>RBZ Regulated Institution</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#85D844]" />
                <span>256-Bit SSL Secured Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#85D844]" />
                <span>Deposit Protection Scheme</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} CABS Bank Zimbabwe. All rights reserved. Wealth. Together.
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSupportOpen(true)}
                className="hover:text-slate-300 cursor-pointer"
              >
                Privacy Notice
              </button>
              <span>•</span>
              <button
                onClick={() => setIsSupportOpen(true)}
                className="hover:text-slate-300 cursor-pointer"
              >
                Terms & Conditions
              </button>
              <span>•</span>
              <button
                onClick={() => setIsSupportOpen(true)}
                className="hover:text-slate-300 cursor-pointer text-[#85D844]"
              >
                24/7 Helpline: +263 242 883822
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Support & Banker Interaction Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

    </div>
  );
}
