import React, { useState } from 'react';
import { Box, Slider, IconButton } from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
}) => {
  const [previousVolume, setPreviousVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newValue: number) => {
    if (newValue > 0 && isMuted) {
      setIsMuted(false);
    }
    onVolumeChange(newValue);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%', 
        maxWidth: 200, 
        gap: 2,
        opacity: 0.8,
        transition: 'opacity 0.3s ease',
        '&:hover': {
          opacity: 1,
        },
      }}
    >
      <IconButton 
        onClick={handleMuteToggle} 
        size="small" 
        sx={{
          color: '#fff',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#1ed760',
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
      <Slider
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={(_, value) => handleVolumeChange(value as number)}
        sx={{
          color: '#fff',
          height: 4,
          '& .MuiSlider-rail': {
            opacity: 0.3,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
          '& .MuiSlider-track': {
            border: 'none',
            background: 'linear-gradient(to right, #1ed760, #1db954)',
            transition: 'all 0.3s ease',
          },
          '& .MuiSlider-thumb': {
            width: 0,
            height: 0,
            backgroundColor: '#fff',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
            transition: 'all 0.3s ease-in-out',
            '&:hover, &.Mui-focusVisible': {
              width: 12,
              height: 12,
              boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
            },
            '&.Mui-active': {
              width: 14,
              height: 14,
            },
          },
          '&:hover': {
            '& .MuiSlider-thumb': {
              width: 10,
              height: 10,
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(to right, #1ed760, #1db954)',
            },
          },
        }}
      />
    </Box>
  );
};

export default VolumeControl; 