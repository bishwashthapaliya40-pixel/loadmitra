import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  inverted?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  inverted = false,
  showSubtitle = true,
  className = ''
}) => {
  // Dimension mappings
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 42, h: 42 },
    lg: { w: 56, h: 56 },
    xl: { w: 76, h: 76 }
  }[size];

  const titleSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight'
  }[size];

  const subtitleSizes = {
    sm: 'text-[9px] tracking-wide uppercase font-semibold',
    md: 'text-[11px] tracking-wider uppercase font-semibold',
    lg: 'text-xs tracking-wider uppercase font-bold',
    xl: 'text-sm tracking-wider uppercase font-bold'
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        layout === 'vertical' ? 'flex-col text-center' : 'flex-row text-left'
      } ${className}`}
    >
      {/* Precision SVG Monogram & Cargo Truck / Container Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform duration-200"
        >
          <defs>
            <linearGradient id="lmNavyGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B192C" />
              <stop offset="100%" stopColor="#1E3E62" />
            </linearGradient>
            <linearGradient id="lmOrangeGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF6500" />
              <stop offset="100%" stopColor="#E05300" />
            </linearGradient>
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer Rounded Container / Freight Hexagon Shield */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="20"
            fill="url(#lmNavyGrad)"
            stroke="#264770"
            strokeWidth="2.5"
          />

          {/* Subtle Freight Container Corrugation Ribs */}
          <line x1="22" y1="12" x2="22" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="12" x2="32" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="12" x2="68" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="12" x2="78" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />

          {/* Forward Speed Chevron / Cargo Flow Accent in Brand Orange */}
          <path
            d="M58 18L78 36L58 54"
            stroke="url(#lmOrangeGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M74 36L44 36"
            stroke="url(#lmOrangeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Stylized 'LM' Monogram Integrated with Freight Truck Chassis */}
          {/* Letter 'L' */}
          <path
            d="M24 26V68H44"
            stroke="#FFFFFF"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Letter 'M' */}
          <path
            d="M48 68V42L61 57L74 42V68"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cargo Truck Wheel Axles / Fast Ground Transit Indicators */}
          <circle cx="34" cy="80" r="5.5" fill="url(#lmOrangeGrad)" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="68" cy="80" r="5.5" fill="url(#lmOrangeGrad)" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="42" y1="80" x2="60" y2="80" stroke="#FF6500" strokeWidth="3" strokeDasharray="2 3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography Zone */}
      {layout !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${titleSizes} font-['Outfit'] ${
                inverted ? 'text-white' : 'text-slate-900'
              }`}
            >
              Load<span className="text-[#FF6500]">Mitra</span>
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`${subtitleSizes} mt-0.5 tracking-wider ${
                inverted ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              LM Logistics &amp; Cargo
            </span>
          )}
        </div>
      )}
    </div>
  );
};
