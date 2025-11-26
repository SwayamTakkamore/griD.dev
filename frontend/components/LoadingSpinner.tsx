import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  message 
}) => {
  const sizeMultiplier = {
    small: 0.6,
    medium: 1,
    large: 1.5,
  };

  const scale = sizeMultiplier[size];

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Pixel Pickaxe Mining Animation */}
      <div className="relative" style={{ width: `${64 * scale}px`, height: `${64 * scale}px` }}>
        {/* Pickaxe */}
        <div className="absolute inset-0 animate-[swing_0.6s_ease-in-out_infinite]">
          <svg 
            width={64 * scale} 
            height={64 * scale} 
            viewBox="0 0 64 64" 
            style={{ 
              imageRendering: 'pixelated',
              transformOrigin: 'bottom center'
            }}
          >
            {/* Pickaxe Head */}
            <rect x="36" y="8" width="8" height="8" fill="#b8a5cc" />
            <rect x="44" y="8" width="8" height="8" fill="#9b87ad" />
            <rect x="52" y="8" width="8" height="8" fill="#8b6d9c" />
            
            {/* Handle */}
            <rect x="28" y="16" width="8" height="8" fill="#8b6d9c" />
            <rect x="20" y="24" width="8" height="8" fill="#8b6d9c" />
            <rect x="12" y="32" width="8" height="8" fill="#5c4a68" />
            <rect x="4" y="40" width="8" height="8" fill="#5c4a68" />
            
            {/* Handle Grip */}
            <rect x="4" y="48" width="12" height="8" fill="#a89bb5" />
            <rect x="4" y="56" width="8" height="4" fill="#8b6d9c" />
          </svg>
        </div>

        {/* Mining Sparks */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1 animate-[sparkle_0.6s_ease-in-out_infinite]">
            <div className="w-2 h-2 bg-gh-attention-fg" style={{ imageRendering: 'pixelated' }}></div>
            <div className="w-2 h-2 bg-gh-success-fg" style={{ imageRendering: 'pixelated' }}></div>
            <div className="w-2 h-2 bg-gh-accent-fg" style={{ imageRendering: 'pixelated' }}></div>
          </div>
        </div>

        {/* Ground/Rock */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-1">
          <div className="w-2 h-2 bg-gh-border-muted" style={{ imageRendering: 'pixelated' }}></div>
          <div className="w-2 h-2 bg-gh-border-default" style={{ imageRendering: 'pixelated' }}></div>
          <div className="w-2 h-2 bg-gh-border-muted" style={{ imageRendering: 'pixelated' }}></div>
        </div>
      </div>

      {message && (
        <p className="mt-6 text-gh-fg-default font-bold text-xl uppercase tracking-wider animate-pixel-pulse">
          {message}
        </p>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes swing {
          0%, 100% {
            transform: rotate(-15deg);
          }
          50% {
            transform: rotate(15deg);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0px);
          }
          50% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
