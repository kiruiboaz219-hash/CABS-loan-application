import { LoanCategory, LoanProductConfig, LoanDetails } from '../types';

export const LOAN_PRODUCTS: Record<LoanCategory, LoanProductConfig> = {
  personal: {
    id: 'personal',
    name: 'Personal Finance',
    tagline: 'For life’s important moments',
    subtext: 'Quick unsecured cash loans for medical, education, home improvement, or sudden expenses.',
    iconName: 'user',
    annualInterestRate: 14.5,
    minTenureMonths: 6,
    maxTenureMonths: 36,
    defaultTenureMonths: 24,
    minAmount: 500,
    maxAmount: 25000,
    features: [
      'Instant pre-approval on CABS mobile',
      'No collateral required for salary earners',
      'Flexible repayment up to 36 months'
    ]
  },
  vehicle: {
    id: 'vehicle',
    name: 'Vehicle Finance',
    tagline: 'Drive your dreams',
    subtext: 'Finance new or quality pre-owned vehicles with competitive interest rates and easy terms.',
    iconName: 'car',
    annualInterestRate: 13.0,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    defaultTenureMonths: 36,
    minAmount: 2000,
    maxAmount: 50000,
    features: [
      'Up to 80% vehicle value financing',
      'Comprehensive insurance partnership options',
      'Direct dealership settlement'
    ]
  },
  business: {
    id: 'business',
    name: 'Business Finance',
    tagline: 'Grow your business',
    subtext: 'Working capital, stock purchasing, and asset financing to scale your SME enterprise.',
    iconName: 'store',
    annualInterestRate: 15.0,
    minTenureMonths: 6,
    maxTenureMonths: 48,
    defaultTenureMonths: 24,
    minAmount: 1000,
    maxAmount: 50000,
    features: [
      'Flexible working capital facilities',
      'Structured cashflow repayment plans',
      'Dedicated SME relationship banker'
    ]
  },
  home: {
    id: 'home',
    name: 'Home Finance',
    tagline: 'Build your future',
    subtext: 'Turn your home ownership dreams into reality with CABS trusted mortgage & property finance.',
    iconName: 'home',
    annualInterestRate: 11.5,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    defaultTenureMonths: 48,
    minAmount: 5000,
    maxAmount: 50000,
    features: [
      'Lowest commercial interest tier',
      'Property acquisition and building loans',
      'Transparent legal and deed handling'
    ]
  }
};

/**
 * Standard Amortization Calculation
 * M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 */
export function calculateLoanDetails(
  category: LoanCategory,
  amount: number,
  tenureMonths: number
): LoanDetails {
  const product = LOAN_PRODUCTS[category];
  const annualRate = product.annualInterestRate;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyAdminFee = 4.5; // $4.50 monthly maintenance fee

  let monthlyInstallment = 0;
  if (monthlyRate === 0) {
    monthlyInstallment = amount / tenureMonths;
  } else {
    monthlyInstallment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalRepayment = monthlyInstallment * tenureMonths + monthlyAdminFee * tenureMonths;
  const totalInterest = monthlyInstallment * tenureMonths - amount;

  // Approximate disbursement date (next business day)
  const disbursementDate = new Date();
  disbursementDate.setDate(disbursementDate.getDate() + 1);
  const formattedDate = disbursementDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    category,
    amount,
    tenureMonths,
    interestRate: annualRate,
    monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyAdminFee,
    estimatedDisbursementDate: formattedDate
  };
}

export function generateReferenceNumber(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear();
  return `CABS-LN-${year}-${randomDigits}`;
}
