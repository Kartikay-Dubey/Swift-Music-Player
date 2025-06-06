import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Grid,
  Typography,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { GraphicEq } from '@mui/icons-material';

interface EqualizerProps {
  open: boolean;
  onClose: () => void;
  onApply: (bands: number[]) => void;
}

// Simplified to 5 frequency bands
const frequencyBands = [
  { freq: '60Hz', label: 'Bass' },
  { freq: '250Hz', label: 'Mid-Low' },
  { freq: '1kHz', label: 'Mid' },
  { freq: '4kHz', label: 'Mid-High' },
  { freq: '12kHz', label: 'Treble' }
];

const Equalizer: React.FC<EqualizerProps> = ({ open, onClose, onApply }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [bands, setBands] = useState<number[]>(Array(5).fill(0));
  
  const handleChange = (index: number) => (event: Event, newValue: number | number[]) => {
    const newBands = [...bands];
    newBands[index] = newValue as number;
    setBands(newBands);
  };
  
  const handleReset = () => {
    setBands(Array(5).fill(0));
  };
  
  const handleApply = () => {
    onApply(bands);
    onClose();
  };
  
  const presets = {
    'Flat': Array(5).fill(0),
    'Bass Boost': [8, 4, 0, 0, 0],
    'Treble Boost': [0, 0, 0, 4, 8],
    'Vocal Boost': [0, 2, 6, 2, 0],
    'Electronic': [4, -2, -2, 2, 4]
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? "xs" : "sm"}
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#1a1a1a',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: isMobile ? 2 : 3
      }}>
        <GraphicEq fontSize="small" /> Equalizer
      </DialogTitle>
      <DialogContent sx={{ padding: isMobile ? 2 : 3 }}>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Presets
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(presets).map(([name, values]) => (
              <Button 
                key={name}
                variant="outlined"
                size="small"
                onClick={() => setBands([...values])}
                sx={{ 
                  borderColor: 'rgba(255, 140, 0, 0.5)',
                  color: '#FF8C00',
                  '&:hover': {
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)'
                  },
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  padding: isMobile ? '4px 8px' : '6px 16px'
                }}
              >
                {name}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Grid container spacing={isMobile ? 1 : 2} sx={{ mt: 1 }}>
          {frequencyBands.map((band, index) => (
            <Grid item xs={isMobile ? 6 : 2.4} key={band.freq}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: 'rgba(0,0,0,0.2)',
                p: isMobile ? 1 : 2,
                borderRadius: 2
              }}>
                <Typography variant={isMobile ? "caption" : "body2"} gutterBottom>
                  {band.freq}
                </Typography>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {band.label}
                </Typography>
                <Slider
                  orientation="vertical"
                  value={bands[index]}
                  onChange={handleChange(index)}
                  min={-12}
                  max={12}
                  step={1}
                  marks={[
                    { value: 12, label: '+12' },
                    { value: 0, label: '0' },
                    { value: -12, label: '-12' }
                  ]}
                  sx={{ 
                    height: isMobile ? 150 : 200,
                    color: '#FF8C00',
                    '& .MuiSlider-thumb': {
                      width: isMobile ? 12 : 16,
                      height: isMobile ? 12 : 16,
                      backgroundColor: '#FF8C00',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#FF8C00',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      height: 8,
                      width: 1,
                      marginLeft: -1,
                    },
                    '& .MuiSlider-markLabel': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: isMobile ? '0.6rem' : '0.7rem',
                    }
                  }}
                />
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: 1 }}>
                  {bands[index] > 0 ? `+${bands[index]}` : bands[index]}dB
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: isMobile ? 1.5 : 2 }}>
        <Button 
          onClick={handleReset} 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            },
            fontSize: isMobile ? '0.8rem' : '0.875rem'
          }}
        >
          Reset
        </Button>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            },
            fontSize: isMobile ? '0.8rem' : '0.875rem'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleApply} 
          variant="contained"
          sx={{ 
            bgcolor: '#FF8C00',
            '&:hover': {
              bgcolor: '#e67e00'
            },
            fontSize: isMobile ? '0.8rem' : '0.875rem'
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Equalizer; 