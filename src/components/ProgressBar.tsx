import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CircularTrack = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  transform: 'rotate(-90deg)',
  filter: 'drop-shadow(0 0 8px rgba(155, 75, 255, 0.3))',
});

const TimeDisplay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '15%',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.875rem',
  zIndex: 2,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(10px)',
}));

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (value: number) => void;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, duration, onSeek }) => {
  const radius = 145;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / duration) * circumference;
  const gradientId = React.useId();
  const glowId = React.useId();

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    let degrees = (angle * 180 / Math.PI + 90) % 360;
    if (degrees < 0) degrees += 360;
    
    const percentage = degrees / 360;
    onSeek(percentage * duration);
  };

  return (
    <ProgressContainer>
      <CircularTrack
        viewBox="0 0 300 300"
        onClick={handleClick}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="50%" stopColor="#9b4bff" />
            <stop offset="100%" stopColor="#4b9eff" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
        />

        {/* Glow effect */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          opacity="0.5"
        />

        {/* Progress circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />

        {/* Progress indicator dot */}
        <circle
          cx="150"
          cy={150 - radius}
          r="6"
          fill="white"
          style={{
            transform: `rotate(${(progress / duration) * 360}deg)`,
            transformOrigin: '150px 150px',
            transition: 'transform 0.3s ease',
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
          }}
        />
      </CircularTrack>
      
      <TimeDisplay>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {formatTime(progress)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>/</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {formatTime(duration)}
        </Typography>
      </TimeDisplay>
    </ProgressContainer>
  );
};

export default ProgressBar; 