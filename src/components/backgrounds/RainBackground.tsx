import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const RainContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
  background: 'linear-gradient(to bottom, #2c3e50, #3a506b)',
});

const fall = keyframes`
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0.8;
  }
`;

const splash = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

const flash = keyframes`
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  11% {
    opacity: 1;
  }
  14% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  21% {
    opacity: 1;
  }
  24% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

interface RainDropProps {
  left: string;
  width: number;
  height: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface SplashProps {
  left: string;
  bottom: string;
  size: number;
  delay: number;
  opacity: number;
}

const RainDrop = styled(Box)<RainDropProps>(({ left, width, height, delay, duration, opacity }) => ({
  position: 'absolute',
  left,
  top: '-100px',
  width: `${width}px`,
  height: `${height}px`,
  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.8))',
  borderRadius: '0 0 5px 5px',
  opacity,
  animation: `${fall} ${duration}s linear infinite`,
  animationDelay: `${delay}s`,
  boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
}));

const Splash = styled(Box)<SplashProps>(({ left, bottom, size, delay, opacity }) => ({
  position: 'absolute',
  left,
  bottom,
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.4)',
  opacity,
  animation: `${splash} 0.8s ease-out infinite`,
  animationDelay: `${delay}s`,
}));

const Lightning = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  opacity: 0,
  animation: `${flash} 10s linear infinite`,
  animationDelay: '3s',
  pointerEvents: 'none',
  zIndex: 2,
});

const RainBackground: React.FC = () => {
  const [raindrops, setRaindrops] = useState<RainDropProps[]>([]);
  const [splashes, setSplashes] = useState<SplashProps[]>([]);
  
  useEffect(() => {
    const generateRaindrops = () => {
      const drops: RainDropProps[] = [];
      // Reduce density - fewer raindrops
      const dropCount = Math.floor(window.innerWidth / 10); 
      
      for (let i = 0; i < dropCount; i++) {
        drops.push({
          left: `${Math.random() * 100}%`,
          width: Math.random() * 2 + 1, // Width between 1-3px
          height: Math.random() * 20 + 15, // Height between 15-35px
          delay: Math.random() * 10, // Longer random delay up to 10s
          duration: Math.random() * 1.5 + 1.5, // Slower duration between 1.5-3s
          opacity: Math.random() * 0.4 + 0.4, // Opacity between 0.4-0.8
        });
      }
      
      setRaindrops(drops);
      
      // Generate splash effects
      const splashCount = Math.floor(dropCount / 3); // Fewer splashes than raindrops
      const splashEffects: SplashProps[] = [];
      
      for (let i = 0; i < splashCount; i++) {
        splashEffects.push({
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * 5}%`, // Near the bottom of the screen
          size: Math.random() * 6 + 4, // Size between 4-10px
          delay: Math.random() * 3, // Random delay up to 3s
          opacity: Math.random() * 0.3 + 0.2, // Opacity between 0.2-0.5
        });
      }
      
      setSplashes(splashEffects);
    };
    
    generateRaindrops();
    
    // Regenerate raindrops when window is resized
    const handleResize = () => {
      generateRaindrops();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <RainContainer>
      {raindrops.map((drop, index) => (
        <RainDrop key={`drop-${index}`} {...drop} />
      ))}
      {splashes.map((splash, index) => (
        <Splash key={`splash-${index}`} {...splash} />
      ))}
      <Lightning />
    </RainContainer>
  );
};

export default RainBackground; 