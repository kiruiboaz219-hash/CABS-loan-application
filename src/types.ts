export type LoanCategory = 'home' | 'vehicle' | 'business' | 'personal';

export interface LoanProductConfig {
  id: LoanCategory;
  name: string;
  tagline: string;
  subtext: string;
  iconName: 'home' | 'car' | 'store' | 'user';
  annualInterestRate: number; // percentage, e.g. 13.5%
  minTenureMonths: number;
  maxTenureMonths: number;
  defaultTenureMonths: number;
  minAmount: number;
  maxAmount: number;
  features: string[];
}

export interface LoanDetails {
  category: LoanCategory;
  amount: number; // $500 to $50,000
  tenureMonths: number;
  interestRate: number;
  monthlyInstallment: number;
  totalRepayment: number;
  totalInterest: number;
  monthlyAdminFee: number;
  estimatedDisbursementDate: string;
}

export interface PersonalDetails {
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  accountNumber: string;
  pin: string;
  monthlyIncome: string;
  loanPurpose: string;
  isExistingCustomer: boolean;
}

export type ApplicationStatus = 'under_review' | 'approved' | 'action_required';

export interface LoanApplicationRecord {
  referenceNumber: string;
  submissionTimestamp: string;
  status: ApplicationStatus;
  loanDetails: LoanDetails;
  personalDetails: Omit<PersonalDetails, 'pin'>;
  applicantInitials: string;
  estimatedReviewHours: number;
}
