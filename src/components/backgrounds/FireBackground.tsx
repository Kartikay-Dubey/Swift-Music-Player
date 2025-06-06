import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const FireContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 0,
  background: 'linear-gradient(to bottom, #000000, #1a0000)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
});

// Styled components for the fire elements
const FireBase = styled(Box)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '15vh',
  background: 'linear-gradient(to top, #ff4500, #ff6a00)',
  zIndex: 1,
});

const FireLayer = styled(Box)<{ delay: number; height: string; opacity: number }>(({ delay, height, opacity }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height,
  background: 'linear-gradient(to top, #ff4500, #ff6a00, #ff8c00, transparent)',
  opacity,
  animation: `flicker ${2 + delay}s ease-in-out infinite alternate`,
  '@keyframes flicker': {
    '0%': {
      transform: 'scaleY(1.0) scaleX(1.0)',
      opacity: opacity,
    },
    '25%': {
      transform: 'scaleY(1.1) scaleX(0.98)',
      opacity: opacity * 0.8,
    },
    '50%': {
      transform: 'scaleY(0.95) scaleX(1.02)',
      opacity: opacity * 0.9,
    },
    '75%': {
      transform: 'scaleY(1.05) scaleX(0.99)',
      opacity: opacity * 1.1,
    },
    '100%': {
      transform: 'scaleY(1.0) scaleX(1.0)',
      opacity: opacity,
    },
  },
}));

const Ember = styled(Box)<{ size: number; left: string; delay: number; duration: number }>(
  ({ size, left, delay, duration }) => ({
    position: 'absolute',
    bottom: '15vh',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,140,0,0.8) 50%, rgba(255,69,0,0.4) 100%)',
    boxShadow: '0 0 10px 2px rgba(255,140,0,0.6)',
    left,
    opacity: 0,
    animation: `float ${duration}s ease-out infinite`,
    animationDelay: `${delay}s`,
    '@keyframes float': {
      '0%': {
        transform: 'translateY(0) scale(1)',
        opacity: 0.8,
      },
      '50%': {
        transform: 'translateY(-100px) translateX(10px) scale(0.8)',
        opacity: 0.6,
      },
      '75%': {
        transform: 'translateY(-150px) translateX(-10px) scale(0.6)',
        opacity: 0.4,
      },
      '100%': {
        transform: 'translateY(-200px) translateX(5px) scale(0.2)',
        opacity: 0,
      },
    },
  })
);

const FireGlow = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '40vh',
  background: 'radial-gradient(ellipse at center bottom, rgba(255,69,0,0.4) 0%, rgba(255,69,0,0.2) 40%, rgba(255,69,0,0) 80%)',
  zIndex: 0,
});

const FireBackground: React.FC = () => {
  const [embers, setEmbers] = useState<Array<{ id: number; size: number; left: string; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Create embers
    const emberCount = 50;
    const newEmbers = Array.from({ length: emberCount }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 3,
    }));
    setEmbers(newEmbers);
  }, []);

  return (
    <FireContainer>
      {/* Fire base */}
      <FireBase />
      
      {/* Multiple fire layers with different animations */}
      <FireLayer delay={0} height="35vh" opacity={0.9} />
      <FireLayer delay={0.5} height="30vh" opacity={0.8} />
      <FireLayer delay={1} height="25vh" opacity={0.7} />
      <FireLayer delay={1.5} height="20vh" opacity={0.6} />
      
      {/* Embers floating up */}
      {embers.map((ember) => (
        <Ember
          key={ember.id}
          size={ember.size}
          left={ember.left}
          delay={ember.delay}
          duration={ember.duration}
        />
      ))}
      
      {/* Glow effect at the bottom */}
      <FireGlow />
    </FireContainer>
  );
};

export default FireBackground; 