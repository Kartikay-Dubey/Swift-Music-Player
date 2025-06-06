import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea
} from '@mui/material';
import { 
  Palette, 
  Fireplace, 
  Waves, 
  Stars,
  Check,
  Opacity
} from '@mui/icons-material';
import { ThemeType } from '../context/ThemeContext';

interface ThemesDialogProps {
  open: boolean;
  onClose: () => void;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

interface ThemeOption {
  value: ThemeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  previewColor: string;
}

const ThemesDialog: React.FC<ThemesDialogProps> = ({ 
  open, 
  onClose, 
  currentTheme,
  onThemeChange
}) => {
  const themeOptions: ThemeOption[] = [
    {
      value: 'stars',
      label: 'Stars',
      description: 'A beautiful night sky with twinkling stars',
      icon: <Stars />,
      previewColor: '#0a1929'
    },
    {
      value: 'fire',
      label: 'Fire',
      description: 'Dynamic fire animations with warm colors',
      icon: <Fireplace />,
      previewColor: '#4a1500'
    },
    {
      value: 'ocean',
      label: 'Ocean',
      description: 'Calming ocean waves with blue hues',
      icon: <Waves />,
      previewColor: '#003366'
    },
    {
      value: 'rain',
      label: 'Rain',
      description: 'Realistic rain animation with droplets and lightning',
      icon: <Opacity />,
      previewColor: '#2c3e50'
    }
  ];
  
  const handleThemeSelect = (theme: ThemeType) => {
    onThemeChange(theme);
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        <Palette fontSize="small" /> Choose Theme
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 3 }}>
          <Typography variant="body1" paragraph>
            Select a theme to change the background animation of your music player.
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {themeOptions.map((theme) => (
              <Grid item xs={12} sm={6} md={4} key={theme.value}>
                <Card 
                  sx={{ 
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    border: theme.value === currentTheme 
                      ? '2px solid #FF8C00' 
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleThemeSelect(theme.value)}
                    sx={{ height: '100%' }}
                  >
                    <CardMedia
                      sx={{ 
                        height: 140, 
                        bgcolor: theme.previewColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ 
                        fontSize: 60, 
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {theme.icon}
                      </Box>
                      
                      {theme.value === currentTheme && (
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          bgcolor: '#FF8C00',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check />
                        </Box>
                      )}
                    </CardMedia>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {theme.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {theme.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            bgcolor: '#FF8C00',
            '&:hover': {
              bgcolor: '#e67e00'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemesDialog; 