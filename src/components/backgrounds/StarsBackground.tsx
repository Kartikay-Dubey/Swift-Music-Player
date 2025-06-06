import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ParticlesContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 0,
  '& .particle': {
    position: 'absolute',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2))',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '50%',
      filter: 'blur(10px)',
      background: 'inherit',
    }
  }
});

const StarsBackground: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    size: number; 
    left: number;
    top: number;
    delay: number;
    duration: number;
    direction: string;
  }>>([]);

  useEffect(() => {
    // Create particles distributed across the screen
    const particlesArray = Array.from({ length: 70 }, (_, i) => {
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      return {
        id: i,
        size: Math.random() * 15 + 5, // Larger particles
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 15,
        direction
      };
    });
    setParticles(particlesArray);
  }, []);

  return (
    <ParticlesContainer>
      {particles.map((particle) => (
        <Box
          key={particle.id}
          className="particle"
          sx={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: Math.random() * 0.5 + 0.3,
            animation: `moveParticle${particle.direction === 'left' ? 'Left' : 'Right'} ${particle.duration}s infinite ease-in-out`,
            animationDelay: `${particle.delay}s`,
            '@keyframes moveParticleLeft': {
              '0%': {
                transform: 'translateX(20vw) translateY(0)',
                opacity: 0,
              },
              '50%': {
                transform: 'translateX(0vw) translateY(-20px)',
                opacity: 0.8,
              },
              '100%': {
                transform: 'translateX(-20vw) translateY(0)',
                opacity: 0,
              }
            },
            '@keyframes moveParticleRight': {
              '0%': {
                transform: 'translateX(-20vw) translateY(0)',
                opacity: 0,
              },
              '50%': {
                transform: 'translateX(0vw) translateY(-20px)',
                opacity: 0.8,
              },
              '100%': {
                transform: 'translateX(20vw) translateY(0)',
                opacity: 0,
              }
            }
          }}
        />
      ))}
    </ParticlesContainer>
  );
};

export default StarsBackground; 