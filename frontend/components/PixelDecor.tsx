import React from 'react';

export const PixelStar = ({ className = "" }: { className?: string }) => (
  <div className={`inline-block ${className}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
      <rect x="10" y="0" width="4" height="4" />
      <rect x="6" y="4" width="4" height="4" />
      <rect x="14" y="4" width="4" height="4" />
      <rect x="2" y="8" width="4" height="4" />
      <rect x="10" y="8" width="4" height="4" />
      <rect x="18" y="8" width="4" height="4" />
      <rect x="6" y="12" width="4" height="4" />
      <rect x="14" y="12" width="4" height="4" />
      <rect x="10" y="16" width="4" height="4" />
    </svg>
  </div>
);

export const PixelCoin = ({ className = "" }: { className?: string }) => (
  <div className={`inline-block ${className}`}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="0" width="12" height="4" />
      <rect x="0" y="4" width="4" height="12" />
      <rect x="16" y="4" width="4" height="12" />
      <rect x="4" y="16" width="12" height="4" />
      <rect x="4" y="4" width="12" height="12" opacity="0.7" />
    </svg>
  </div>
);

export const PixelGem = ({ className = "", color = "#00e5cc" }: { className?: string; color?: string }) => (
  <div className={`inline-block ${className}`}>
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="6" y="0" width="4" height="2" fill={color} />
      <rect x="4" y="2" width="8" height="2" fill={color} />
      <rect x="2" y="4" width="12" height="2" fill={color} />
      <rect x="4" y="6" width="8" height="2" fill={color} opacity="0.8" />
      <rect x="6" y="8" width="4" height="2" fill={color} opacity="0.6" />
    </svg>
  </div>
);

export const PixelSword = ({ className = "" }: { className?: string }) => (
  <div className={`inline-block ${className}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" style={{ imageRendering: 'pixelated' }}>
      <rect x="16" y="0" width="4" height="4" fill="#b8a5cc" />
      <rect x="12" y="4" width="4" height="4" fill="#b8a5cc" />
      <rect x="8" y="8" width="4" height="4" fill="#b8a5cc" />
      <rect x="4" y="12" width="4" height="4" fill="#8b6d9c" />
      <rect x="0" y="16" width="4" height="4" fill="#ffd700" />
      <rect x="4" y="16" width="4" height="4" fill="#ffd700" />
      <rect x="0" y="20" width="4" height="4" fill="#8b6d9c" />
    </svg>
  </div>
);

export const PixelCrystal = ({ className = "" }: { className?: string }) => (
  <div className={`inline-block animate-float ${className}`}>
    <svg width="20" height="24" viewBox="0 0 20 24" style={{ imageRendering: 'pixelated' }}>
      <rect x="8" y="0" width="4" height="4" fill="#00ffd5" />
      <rect x="4" y="4" width="12" height="4" fill="#00e5cc" />
      <rect x="2" y="8" width="16" height="4" fill="#00e5cc" opacity="0.8" />
      <rect x="4" y="12" width="12" height="4" fill="#00e5cc" opacity="0.6" />
      <rect x="6" y="16" width="8" height="4" fill="#00e5cc" opacity="0.4" />
      <rect x="8" y="20" width="4" height="4" fill="#00e5cc" opacity="0.2" />
    </svg>
  </div>
);

export const PixelHeart = ({ className = "" }: { className?: string }) => (
  <div className={`inline-block ${className}`}>
    <svg width="20" height="18" viewBox="0 0 20 18" fill="#ff3864" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="0" width="6" height="4" />
      <rect x="12" y="0" width="6" height="4" />
      <rect x="0" y="4" width="20" height="4" />
      <rect x="2" y="8" width="16" height="4" />
      <rect x="4" y="12" width="12" height="4" />
      <rect x="8" y="16" width="4" height="2" />
    </svg>
  </div>
);

export const PixelDivider = () => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-1 bg-gh-border-default" style={{ imageRendering: 'pixelated' }}></div>
    <PixelGem />
    <div className="flex-1 h-1 bg-gh-border-default" style={{ imageRendering: 'pixelated' }}></div>
  </div>
);
