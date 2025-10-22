import React from 'react';

const KashITLogo: React.FC<{ className?: string; size?: number }> = ({ 
  className = "", 
  size = 64 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#ff6b35', stopOpacity: 1}} />
          <stop offset="30%" style={{stopColor: '#f7931e', stopOpacity: 1}} />
          <stop offset="60%" style={{stopColor: '#ffd23f', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#ff6b35', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="kGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#1e293b', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#0f172a', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* Background circle with sunset gradient */}
      <circle cx="32" cy="32" r="30" fill="url(#sunsetGradient)" stroke="#1e293b" strokeWidth="2"/>
      
      {/* Stylized K letter with metallic effect */}
      <g transform="translate(16, 12)">
        {/* Main K structure */}
        <path 
          d="M4 4 L4 40 L8 40 L8 24 L20 40 L24 40 L14 24 L24 4 L20 4 L8 20 L8 4 Z" 
          fill="url(#kGradient)" 
          stroke="#1e293b" 
          strokeWidth="0.5"
        />
        
        {/* Decorative elements inside K segments */}
        {/* Top left - Chinar leaf */}
        <g transform="translate(6, 8)">
          <path 
            d="M2 2 L4 1 L6 2 L5 4 L6 6 L4 7 L2 6 L3 4 Z" 
            fill="#22c55e" 
            stroke="#16a34a" 
            strokeWidth="0.3"
          />
          <path d="M4 1 L4 7" stroke="#16a34a" strokeWidth="0.2"/>
        </g>
        
        {/* Top right - Metallic sphere */}
        <circle cx="18" cy="10" r="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.3"/>
        <circle cx="17.5" cy="9.5" r="0.5" fill="#f1f5f9" opacity="0.8"/>
        
        {/* Middle left - Mountain peaks */}
        <g transform="translate(6, 18)">
          <path d="M1 4 L3 1 L5 4 L4 6 L2 6 Z" fill="#64748b" stroke="#475569" strokeWidth="0.3"/>
        </g>
        
        {/* Bottom left - Abstract figure */}
        <g transform="translate(6, 28)">
          <circle cx="2" cy="2" r="1.5" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="0.3"/>
          <rect x="1" y="3" width="2" height="2" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="0.3"/>
        </g>
        
        {/* Middle right - Crystalline object */}
        <g transform="translate(18, 20)">
          <path d="M2 1 L4 2 L3 4 L1 4 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="0.3"/>
        </g>
        
        {/* Bottom right - Modern chair */}
        <g transform="translate(18, 30)">
          <rect x="1" y="2" width="3" height="1" fill="#f59e0b" stroke="#d97706" strokeWidth="0.3"/>
          <rect x="1" y="3" width="1" height="2" fill="#f59e0b" stroke="#d97706" strokeWidth="0.3"/>
          <rect x="3" y="3" width="1" height="2" fill="#f59e0b" stroke="#d97706" strokeWidth="0.3"/>
        </g>
      </g>
    </svg>
  );
};

export default KashITLogo;

