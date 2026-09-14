import React from 'react';

interface CABSLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const CABSLogo: React.FC<CABSLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isLight = variant === 'light';

  const sizeStyles = {
    sm: { text: 'text-xl tracking-tighter', tagline: 'text-[9px]', icon: 'w-4 h-5' },
    md: { text: 'text-3xl tracking-tight font-black', tagline: 'text-xs font-semibold', icon: 'w-6 h-7' },
    lg: { text: 'text-4xl md:text-5xl tracking-tight font-black', tagline: 'text-sm font-semibold', icon: 'w-8 h-9' },
  }[size];

  return (
    <div id="cabs-brand-logo" className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-1 leading-none">
        <span
          className={`font-black ${sizeStyles.text} ${
            isLight ? 'text-white' : 'text-[#0A2960]'
          }`}
          style={{ letterSpacing: '-0.04em' }}
        >
          CABS
        </span>
        {/* The CABS dual-leaf/swoosh green accent */}
        <svg
          viewBox="0 0 28 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeStyles.icon} flex-shrink-0 -ml-0.5 -mt-1`}
          aria-hidden="true"
        >
          <path
            d="M5 28C10 24 16 16 19 6C23 15 21 24 14 29C10 32 6 30 5 28Z"
            fill="#65B32E"
          />
          <path
            d="M17 5C19 12 18 19 13 24C12 18 14 10 17 5Z"
            fill="#88D645"
            opacity="0.9"
          />
        </svg>
      </div>
      {showTagline && (
        <span
          className={`tracking-tight ${sizeStyles.tagline} mt-0.5 ${
            isLight ? 'text-blue-100' : 'text-slate-600'
          }`}
        >
          Wealth. Together.
        </span>
      )}
    </div>
  );
};
