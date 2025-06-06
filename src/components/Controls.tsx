import React from 'react';
import { Box, IconButton } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#9b4bff',
  width: '64px',
  height: '64px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#8333ff',
    transform: 'scale(1.1)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '& svg': {
    fontSize: '2.5rem',
    color: 'white',
  },
}));

const SkipButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  width: '48px',
  height: '48px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '& svg': {
    fontSize: '2rem',
  },
}));

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  return (
    <ControlsContainer>
      <SkipButton onClick={onPrevious}>
        <SkipPrevious />
      </SkipButton>
      
      <PlayButton onClick={onPlayPause}>
        {isPlaying ? <Pause /> : <PlayArrow />}
      </PlayButton>
      
      <SkipButton onClick={onNext}>
        <SkipNext />
      </SkipButton>
    </ControlsContainer>
  );
};

export default Controls; 