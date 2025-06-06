import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const OceanContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 0,
  background: 'linear-gradient(to bottom, #001e3c, #003366)',
});

const OceanCanvas = styled('canvas')({
  width: '100%',
  height: '100%',
  display: 'block',
});

const OceanBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    resize();

    // Wave parameters
    const waves = [];
    const waveCount = 5;
    const waveColors = [
      'rgba(0, 119, 190, 0.3)',
      'rgba(0, 119, 190, 0.4)',
      'rgba(0, 119, 190, 0.5)',
      'rgba(0, 119, 190, 0.6)',
      'rgba(0, 119, 190, 0.7)',
    ];

    // Create waves
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        y: canvas.height * (0.5 + i * 0.1), // Starting position
        amplitude: 20 + i * 5, // Wave height
        frequency: 0.01 - i * 0.001, // Wave frequency
        speed: 0.05 + i * 0.01, // Wave speed
        phase: Math.random() * Math.PI * 2, // Random starting phase
        color: waveColors[i],
      });
    }

    // Bubbles parameters
    const bubbles = [];
    const bubbleCount = 50;

    // Create bubbles
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        radius: 1 + Math.random() * 5,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.5,
      });
    }

    // Draw wave
    const drawWave = (wave) => {
      ctx.beginPath();
      ctx.moveTo(0, wave.y);

      for (let x = 0; x < canvas.width; x++) {
        const y = wave.y + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      ctx.fillStyle = wave.color;
      ctx.fill();
    };

    // Draw bubble
    const drawBubble = (bubble) => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, bubble.radius
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    // Update bubble position
    const updateBubble = (bubble) => {
      bubble.y -= bubble.speed;
      
      // Reset bubble when it goes off screen
      if (bubble.y < -bubble.radius * 2) {
        bubble.x = Math.random() * canvas.width;
        bubble.y = canvas.height + Math.random() * 50;
        bubble.radius = 1 + Math.random() * 5;
        bubble.speed = 0.5 + Math.random() * 1.5;
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw waves
      waves.forEach(wave => {
        wave.phase += wave.speed;
        drawWave(wave);
      });
      
      // Update and draw bubbles
      bubbles.forEach(bubble => {
        updateBubble(bubble);
        drawBubble(bubble);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', resize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <OceanContainer>
      <OceanCanvas ref={canvasRef} />
    </OceanContainer>
  );
};

export default OceanBackground; 