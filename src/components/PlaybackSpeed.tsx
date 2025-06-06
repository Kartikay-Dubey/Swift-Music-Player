import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Slider,
  Grid,
  ButtonGroup
} from '@mui/material';
import { Speed } from '@mui/icons-material';

interface PlaybackSpeedProps {
  open: boolean;
  onClose: () => void;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const PlaybackSpeed: React.FC<PlaybackSpeedProps> = ({ 
  open, 
  onClose, 
  currentSpeed,
  onSpeedChange
}) => {
  const [speed, setSpeed] = useState(currentSpeed);
  
  useEffect(() => {
    if (open) {
      setSpeed(currentSpeed);
    }
  }, [open, currentSpeed]);
  
  const handleSpeedChange = (_: Event, value: number | number[]) => {
    setSpeed(value as number);
  };
  
  const handleApply = () => {
    onSpeedChange(speed);
    onClose();
  };
  
  const presetSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        gap: 1
      }}>
        <Speed fontSize="small" /> Playback Speed
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 'bold', 
              color: '#FF8C00',
              mb: 1
            }}>
              {speed.toFixed(2)}x
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {speed < 1 ? 'Slower' : speed > 1 ? 'Faster' : 'Normal'} playback speed
            </Typography>
          </Box>
          
          <Box sx={{ px: 3, mb: 4 }}>
            <Slider
              value={speed}
              onChange={handleSpeedChange}
              min={0.25}
              max={2}
              step={0.05}
              marks={[
                { value: 0.5, label: '0.5x' },
                { value: 1, label: '1x' },
                { value: 1.5, label: '1.5x' },
                { value: 2, label: '2x' }
              ]}
              sx={{ 
                color: '#FF8C00',
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                  backgroundColor: '#FF8C00',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#FF8C00',
                  height: 6,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  height: 6,
                },
                '& .MuiSlider-mark': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  height: 8,
                  width: 2,
                  marginTop: -3,
                },
                '& .MuiSlider-markLabel': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                }
              }}
            />
          </Box>
          
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
            Preset Speeds
          </Typography>
          
          <Grid container spacing={1} justifyContent="center">
            {presetSpeeds.map((presetSpeed) => (
              <Grid item key={presetSpeed}>
                <Button 
                  variant={Math.abs(speed - presetSpeed) < 0.01 ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setSpeed(presetSpeed)}
                  sx={{ 
                    minWidth: '60px',
                    ...(Math.abs(speed - presetSpeed) < 0.01 
                      ? {
                          bgcolor: '#FF8C00',
                          '&:hover': {
                            bgcolor: '#e67e00'
                          }
                        } 
                      : {
                          color: '#FF8C00',
                          borderColor: 'rgba(255, 140, 0, 0.5)',
                          '&:hover': {
                            borderColor: '#FF8C00',
                            backgroundColor: 'rgba(255, 140, 0, 0.1)'
                          }
                        }
                    )
                  }}
                >
                  {presetSpeed.toFixed(2)}x
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
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
            }
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaybackSpeed; 