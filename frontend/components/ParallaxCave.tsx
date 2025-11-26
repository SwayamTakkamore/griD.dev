import React, { useEffect, useRef } from 'react';

export const ParallaxCave: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      
      const scrolled = window.scrollY;
      const layers = parallaxRef.current.querySelectorAll('.parallax-layer');
      
      layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.15;
        const yPos = -(scrolled * speed);
        (layer as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={parallaxRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1 - Deep Background (Darkest Cave Wall) */}
      <div className="parallax-layer absolute inset-0 opacity-30">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="cave-deep" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Deep cave rocks */}
              <rect x="20" y="30" width="60" height="40" fill="#1a0f1f" opacity="0.8"/>
              <rect x="90" y="50" width="50" height="35" fill="#1a0f1f" opacity="0.9"/>
              <rect x="150" y="20" width="40" height="50" fill="#1a0f1f" opacity="0.7"/>
              <rect x="10" y="100" width="70" height="45" fill="#1a0f1f" opacity="0.85"/>
              <rect x="120" y="120" width="55" height="40" fill="#1a0f1f" opacity="0.75"/>
              <rect x="50" y="160" width="45" height="30" fill="#1a0f1f" opacity="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cave-deep)"/>
        </svg>
      </div>

      {/* Layer 2 - Mid Background (Cave Formations) */}
      <div className="parallax-layer absolute inset-0 opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="cave-mid" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
              {/* Stalactites hanging from top */}
              <rect x="30" y="0" width="16" height="40" fill="#2d1b2e"/>
              <rect x="34" y="40" width="8" height="20" fill="#2d1b2e"/>
              <rect x="100" y="0" width="20" height="50" fill="#2d1b2e"/>
              <rect x="104" y="50" width="12" height="25" fill="#2d1b2e"/>
              <rect x="150" y="0" width="14" height="35" fill="#2d1b2e"/>
              
              {/* Stalagmites rising from bottom */}
              <rect x="50" y="140" width="12" height="40" fill="#2d1b2e"/>
              <rect x="54" y="120" width="4" height="20" fill="#2d1b2e"/>
              <rect x="120" y="150" width="16" height="30" fill="#2d1b2e"/>
              <rect x="124" y="130" width="8" height="20" fill="#2d1b2e"/>
              
              {/* Cave crystals */}
              <rect x="80" y="60" width="4" height="4" fill="#00e5cc" opacity="0.6"/>
              <rect x="140" y="100" width="4" height="4" fill="#7dfc00" opacity="0.6"/>
              <rect x="25" y="130" width="4" height="4" fill="#ffd700" opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cave-mid)"/>
        </svg>
      </div>

      {/* Layer 3 - Foreground (Closest Cave Details) */}
      <div className="parallax-layer absolute inset-0 opacity-25">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="cave-fore" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
              {/* Large foreground rocks */}
              <rect x="0" y="80" width="80" height="60" fill="#3d2946" opacity="0.7"/>
              <rect x="180" y="100" width="60" height="50" fill="#3d2946" opacity="0.8"/>
              <rect x="100" y="0" width="50" height="70" fill="#3d2946" opacity="0.6"/>
              <rect x="40" y="180" width="70" height="60" fill="#3d2946" opacity="0.75"/>
              
              {/* Glowing crystals */}
              <g opacity="0.8">
                <rect x="60" y="50" width="8" height="12" fill="#00e5cc"/>
                <rect x="62" y="48" width="4" height="4" fill="#00ffd5"/>
                <rect x="64" y="62" width="2" height="8" fill="#00e5cc" opacity="0.5"/>
              </g>
              <g opacity="0.8">
                <rect x="200" y="140" width="10" height="14" fill="#7dfc00"/>
                <rect x="202" y="138" width="6" height="4" fill="#8fff00"/>
                <rect x="204" y="154" width="3" height="10" fill="#7dfc00" opacity="0.5"/>
              </g>
              <g opacity="0.8">
                <rect x="150" y="200" width="8" height="10" fill="#ffd700"/>
                <rect x="152" y="198" width="4" height="4" fill="#ffed4e"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cave-fore)"/>
        </svg>
      </div>

      {/* Layer 4 - Floating Particles/Dust */}
      <div className="parallax-layer absolute inset-0 opacity-20">
        <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}/>
        <div className="absolute top-[25%] left-[45%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}/>
        <div className="absolute top-[40%] left-[70%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}/>
        <div className="absolute top-[60%] left-[30%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}/>
        <div className="absolute top-[75%] left-[80%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '1.5s', animationDuration: '5.5s' }}/>
        <div className="absolute top-[20%] left-[90%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '2.5s', animationDuration: '4s' }}/>
        <div className="absolute top-[50%] left-[10%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '0.8s', animationDuration: '5.2s' }}/>
        <div className="absolute top-[85%] left-[55%] w-1 h-1 bg-fg-muted animate-float" style={{ animationDelay: '1.8s', animationDuration: '4.8s' }}/>
        
        {/* Glowing crystal sparkles */}
        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-accent-fg animate-pixel-pulse" style={{ animationDelay: '0s' }}/>
        <div className="absolute top-[70%] left-[75%] w-2 h-2 bg-success-fg animate-pixel-pulse" style={{ animationDelay: '1s' }}/>
        <div className="absolute top-[45%] left-[60%] w-2 h-2 bg-attention-fg animate-pixel-pulse" style={{ animationDelay: '2s' }}/>
        <div className="absolute top-[15%] left-[85%] w-2 h-2 bg-accent-fg animate-pixel-pulse" style={{ animationDelay: '1.5s' }}/>
      </div>

      {/* Layer 5 - Ambient Glow (Lighting Effects) */}
      <div className="parallax-layer absolute inset-0 opacity-10">
        <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-accent-fg rounded-full blur-[120px]"/>
        <div className="absolute top-[60%] left-[70%] w-80 h-80 bg-success-fg rounded-full blur-[100px]"/>
        <div className="absolute top-[80%] left-[20%] w-72 h-72 bg-attention-fg rounded-full blur-[90px]"/>
        <div className="absolute top-[40%] left-[85%] w-64 h-64 bg-danger-fg rounded-full blur-[80px]"/>
      </div>
    </div>
  );
};
