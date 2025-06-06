import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Settings as SettingsIcon, 
  VolumeUp, 
  Speed, 
  Storage, 
  Language as LanguageIcon,
  Notifications,
  Image,
  Shuffle,
  HighQuality,
  Info,
  DarkMode
} from '@mui/icons-material';

export interface AppSettings {
  defaultVolume: number;
  playbackSpeed: number;
  darkMode: boolean;
  cacheSize: number;
  language: string;
  notifications: boolean;
  autoDownloadArtwork: boolean;
  crossfadeDuration: number;
  audioQuality: string;
}

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  initialSettings: AppSettings;
}

const Settings: React.FC<SettingsProps> = ({ 
  open, 
  onClose, 
  onSave,
  initialSettings
}) => {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  useEffect(() => {
    if (open) {
      setSettings(initialSettings);
    }
  }, [open, initialSettings]);

  const handleChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
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
        <SettingsIcon fontSize="small" /> Settings
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Playback Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#FF8C00', mb: 2 }}>
                Playback Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <VolumeUp sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Default Volume: {settings.defaultVolume * 100}%</Typography>
                    </Box>
                    <Slider
                      value={settings.defaultVolume}
                      onChange={(_, value) => handleChange('defaultVolume', value)}
                      min={0}
                      max={1}
                      step={0.01}
                      sx={{ 
                        color: '#FF8C00',
                        '& .MuiSlider-thumb': {
                          width: 16,
                          height: 16,
                          backgroundColor: '#FF8C00',
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Speed sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Default Playback Speed: {settings.playbackSpeed}x</Typography>
                    </Box>
                    <Slider
                      value={settings.playbackSpeed}
                      onChange={(_, value) => handleChange('playbackSpeed', value)}
                      min={0.5}
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
                          width: 16,
                          height: 16,
                          backgroundColor: '#FF8C00',
                        },
                        '& .MuiSlider-markLabel': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Shuffle sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Crossfade Duration: {settings.crossfadeDuration}s</Typography>
                    </Box>
                    <Slider
                      value={settings.crossfadeDuration}
                      onChange={(_, value) => handleChange('crossfadeDuration', value)}
                      min={0}
                      max={10}
                      step={0.5}
                      marks={[
                        { value: 0, label: 'Off' },
                        { value: 5, label: '5s' },
                        { value: 10, label: '10s' }
                      ]}
                      sx={{ 
                        color: '#FF8C00',
                        '& .MuiSlider-thumb': {
                          width: 16,
                          height: 16,
                          backgroundColor: '#FF8C00',
                        },
                        '& .MuiSlider-markLabel': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HighQuality sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Audio Quality</Typography>
                    </Box>
                    <Select
                      value={settings.audioQuality}
                      onChange={(e) => handleChange('audioQuality', e.target.value)}
                      sx={{ 
                        bgcolor: 'rgba(0,0,0,0.2)',
                        color: 'white',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 140, 0, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FF8C00',
                        },
                        '.MuiSvgIcon-root': {
                          color: 'white',
                        }
                      }}
                    >
                      <MenuItem value="low">Low (128 kbps)</MenuItem>
                      <MenuItem value="medium">Medium (256 kbps)</MenuItem>
                      <MenuItem value="high">High (320 kbps)</MenuItem>
                      <MenuItem value="lossless">Lossless (FLAC)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
            </Grid>
            
            {/* Appearance Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#FF8C00', mb: 2 }}>
                Appearance & Behavior
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.darkMode}
                        onChange={(e) => handleChange('darkMode', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#FF8C00',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'rgba(255, 140, 0, 0.5)',
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DarkMode sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                        <Typography variant="body2">Dark Mode</Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LanguageIcon sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Language</Typography>
                    </Box>
                    <Select
                      value={settings.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      sx={{ 
                        bgcolor: 'rgba(0,0,0,0.2)',
                        color: 'white',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 140, 0, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FF8C00',
                        },
                        '.MuiSvgIcon-root': {
                          color: 'white',
                        }
                      }}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                      <MenuItem value="de">Deutsch</MenuItem>
                      <MenuItem value="ja">日本語</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
            </Grid>
            
            {/* Advanced Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#FF8C00', mb: 2 }}>
                Advanced Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Storage sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Cache Size: {settings.cacheSize} MB</Typography>
                      <Tooltip title="Larger cache improves performance but uses more disk space">
                        <IconButton size="small" sx={{ ml: 0.5, color: 'rgba(255, 255, 255, 0.5)' }}>
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Slider
                      value={settings.cacheSize}
                      onChange={(_, value) => handleChange('cacheSize', value)}
                      min={100}
                      max={2000}
                      step={100}
                      marks={[
                        { value: 100, label: '100MB' },
                        { value: 1000, label: '1GB' },
                        { value: 2000, label: '2GB' }
                      ]}
                      sx={{ 
                        color: '#FF8C00',
                        '& .MuiSlider-thumb': {
                          width: 16,
                          height: 16,
                          backgroundColor: '#FF8C00',
                        },
                        '& .MuiSlider-markLabel': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications}
                        onChange={(e) => handleChange('notifications', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#FF8C00',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'rgba(255, 140, 0, 0.5)',
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Notifications sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                        <Typography variant="body2">Enable Notifications</Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.autoDownloadArtwork}
                        onChange={(e) => handleChange('autoDownloadArtwork', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#FF8C00',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'rgba(255, 140, 0, 0.5)',
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image sx={{ color: '#FF8C00', mr: 1 }} fontSize="small" />
                        <Typography variant="body2">Auto-download Artwork</Typography>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
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
          onClick={handleSave} 
          variant="contained"
          sx={{ 
            bgcolor: '#FF8C00',
            '&:hover': {
              bgcolor: '#e67e00'
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings; 