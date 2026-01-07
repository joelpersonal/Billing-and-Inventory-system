import React from 'react';

const BillfinityLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', svg: 'w-6 h-6' },
    md: { container: 'w-12 h-12', svg: 'w-8 h-8' },
    lg: { container: 'w-16 h-16', svg: 'w-10 h-10' },
    xl: { container: 'w-20 h-20', svg: 'w-12 h-12' }
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo SVG - Based on your Billfinity logo */}
      <div className={`${sizeConfig.container} rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg`}>
        <svg 
          className={`${sizeConfig.svg} text-white`} 
          viewBox="0 0 120 120" 
          fill="currentColor"
        >
          {/* Chart/Graph bars - representing analytics */}
          <g transform="translate(15, 30)">
            <rect x="0" y="40" width="6" height="20" rx="1" opacity="0.9" />
            <rect x="8" y="30" width="6" height="30" rx="1" opacity="0.9" />
            <rect x="16" y="20" width="6" height="40" rx="1" />
            <rect x="24" y="25" width="6" height="35" rx="1" opacity="0.9" />
            <rect x="32" y="15" width="6" height="45" rx="1" />
          </g>
          
          {/* Upward trending arrow */}
          <g transform="translate(50, 20)">
            <path d="M5 25 L15 15 L25 25 L20 25 L20 35 L10 35 L10 25 Z" opacity="0.95" />
            <path d="M15 15 L25 25 M15 15 L25 15 M15 15 L15 25" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.8"/>
          </g>
          
          {/* Shopping cart with dollar sign */}
          <g transform="translate(75, 35)">
            {/* Cart body */}
            <path d="M5 10 L25 10 L27 20 L3 20 Z" rx="2" />
            {/* Cart wheels */}
            <circle cx="8" cy="25" r="2" />
            <circle cx="22" cy="25" r="2" />
            {/* Cart handle */}
            <path d="M0 5 L5 5 L5 10" fill="none" stroke="currentColor" strokeWidth="2"/>
            {/* Dollar sign in cart */}
            <text x="15" y="17" fontSize="8" textAnchor="middle" fontWeight="bold">$</text>
          </g>
          
          {/* Infinity symbol at bottom */}
          <g transform="translate(30, 75)">
            <path d="M10 10 Q20 5 30 10 Q40 15 50 10 Q60 5 70 10 Q60 15 50 10 Q40 5 30 10 Q20 15 10 10" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  opacity="0.8"/>
          </g>
          
          {/* Additional decorative elements */}
          <g opacity="0.6">
            <circle cx="90" cy="25" r="2" />
            <circle cx="95" cy="30" r="1.5" />
            <circle cx="25" cy="85" r="1.5" />
            <circle cx="85" cy="85" r="2" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            BILLFINITY
          </h2>
          <p className="text-xs text-purple-600 font-medium">
            Smart Control & Billing
          </p>
        </div>
      )}
    </div>
  );
};

export default BillfinityLogo;